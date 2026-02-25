import type { APIRoute } from 'astro';
import { supabase, type Cliente } from '../../../lib/supabase';

export const POST: APIRoute = async ({ request }) => {
  try {
    const clienteData = await request.json() as Partial<Cliente>;

    const cuposMaximos = Number(
      process.env.PUBLIC_CUPOS_MAX || import.meta.env.PUBLIC_CUPOS_MAX || 20
    );

    // Validar cupos disponibles antes de crear
    const { count: cuposOcupados, error: countError } = await supabase
      .from('clientes')
      .select('*', { count: 'exact', head: true })
      .eq('estado', 'pagado');

    if (countError) {
      console.error('Error contando cupos:', countError);
      return new Response(
        JSON.stringify({ success: false, error: 'Error al validar cupos' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if ((cuposOcupados || 0) >= cuposMaximos) {
      return new Response(
        JSON.stringify({ success: false, error: 'Cupos completos' }),
        { status: 409, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Validar datos requeridos
    if (!clienteData.nombre || !clienteData.email || !clienteData.telefono) {
      return new Response(
        JSON.stringify({ success: false, error: 'Faltan campos requeridos' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Insertar en base de datos
    const { data, error } = await supabase
      .from('clientes')
      .insert([{
        nombre: clienteData.nombre,
        apellidos: clienteData.apellidos || '',
        email: clienteData.email,
        telefono: clienteData.telefono,
        pais: clienteData.pais || 'Chile',
        region: clienteData.region || '',
        ciudad: clienteData.ciudad || '',
        direccion: clienteData.direccion || '',
        notas: clienteData.notas || '',
        clase_seleccionada: clienteData.clase_seleccionada || 'reformer',
        monto: clienteData.monto || 369990,
        estado: 'pendiente',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select();

    if (error) {
      console.error('Error al guardar cliente:', error);
      return new Response(
        JSON.stringify({ success: false, error: error.message }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        clienteId: data?.[0]?.id,
        message: 'Cliente registrado exitosamente'
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error en endpoint de cliente:', error);
    return new Response(
      JSON.stringify({ success: false, error: 'Error interno del servidor' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
