import type { APIRoute } from 'astro';
import { supabase } from '../../../lib/supabase';

// Validar token (simple validación, en producción usa JWT)
function validateToken(token: string): boolean {
  if (!token) return false;
  try {
    const decoded = Buffer.from(token, 'base64').toString('utf-8');
    // Verificar que el token no sea muy antiguo (24 horas)
    const parts = decoded.split(':');
    if (parts.length !== 2) return false;
    
    const timestamp = parseInt(parts[1]);
    const now = Date.now();
    const hoursDiff = (now - timestamp) / (1000 * 60 * 60);
    
    return hoursDiff < 24;
  } catch {
    return false;
  }
}

export const GET: APIRoute = async ({ request }) => {
  try {
    // Verificar autorización
    const authHeader = request.headers.get('Authorization');
    const token = authHeader?.replace('Bearer ', '');

    if (!token || !validateToken(token)) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'No autorizado'
        }),
        {
          status: 401,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Obtener todos los clientes ordenados por fecha (más recientes primero)
    const { data: clientes, error } = await supabase
      .from('clientes')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error al obtener clientes:', error);
      return new Response(
        JSON.stringify({
          success: false,
          error: error.message
        }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        clientes: clientes || []
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    console.error('Error en endpoint de clientes:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Error interno del servidor'
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
};
