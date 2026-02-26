import type { APIRoute } from 'astro';
import { supabase } from '../../../lib/supabase';

export const POST: APIRoute = async ({ request, redirect, url }) => {
  try {
    console.log('[CONFIRM] Iniciando confirmación POST');
    
    // Importar Transbank SDK
    const transbankModule = await import('transbank-sdk');
    const { WebpayPlus, Options, Environment } = transbankModule.default || transbankModule;
    
    // Configurar Transbank con variables de entorno
    const apiKey = process.env.TBK_API_KEY_ID || import.meta.env.TBK_API_KEY_ID;
    const apiSecret = process.env.TBK_API_KEY_SECRET || import.meta.env.TBK_API_KEY_SECRET;
    const environment = process.env.TBK_ENVIRONMENT || import.meta.env.TBK_ENVIRONMENT || 'INTEGRATION';

    console.log('[CONFIRM] Environment:', environment);

    // Validar que existan las credenciales
    if (!apiKey || !apiSecret) {
      console.error('[CONFIRM] Credenciales de Transbank no configuradas');
      return redirect('/pago-error?error=config_error');
    }
    

    // Crear instancia de Transaction con las opciones correctas
    const tx = new WebpayPlus.Transaction(
      new Options(apiKey, apiSecret, environment === 'PRODUCTION' ? Environment.Production : Environment.Integration)
    );

    // Obtener el token desde el formulario
    const formData = await request.formData();
    const token = formData.get('token_ws') as string;

    console.log('[CONFIRM] Token recibido:', token ? 'SÍ' : 'NO');

    if (!token) {
      console.error('[CONFIRM] Token no encontrado en el formulario');
      return redirect('/pago-error?error=token_missing');
    }

    // Confirmar la transacción
    console.log('[CONFIRM] Llamando a tx.commit...');
    const response = await tx.commit(token);
    console.log('[CONFIRM] Respuesta de Transbank:', JSON.stringify(response));

    // Verificar si la transacción fue aprobada
    if (response.response_code === 0) {
      console.log('[CONFIRM] Transacción APROBADA');
      
      // Actualizar estado en la BD usando session_id que contiene el UUID completo
      const clienteId = response.session_id;
      if (clienteId) {
        const { error: updateError } = await supabase
          .from('clientes')
          .update({
            estado: 'pagado',
            buy_order: response.buy_order,
            auth_code: response.authorization_code,
            updated_at: new Date().toISOString()
          })
          .eq('id', clienteId);

        if (updateError) {
          console.error('[CONFIRM] Error al actualizar cliente:', updateError);
        } else {
          console.log('[CONFIRM] Cliente actualizado a "pagado"');
        }
      }
      
      // Transacción exitosa
      return redirect(
        `/pago-exitoso?` +
        `amount=${response.amount}` +
        `&buyOrder=${response.buy_order}` +
        `&authCode=${response.authorization_code}`
      );
    } else {
      console.log('[CONFIRM] Transacción RECHAZADA, código:', response.response_code);
      
      // Actualizar estado a cancelado en la BD usando session_id
      const clienteId = response.session_id;
      if (clienteId) {
        const { error: updateError } = await supabase
          .from('clientes')
          .update({
            estado: 'cancelado',
            updated_at: new Date().toISOString()
          })
          .eq('id', clienteId);

        if (updateError) {
          console.error('[CONFIRM] Error al actualizar cliente:', updateError);
        }
      }
      
      // Transacción rechazada
      return redirect(
        `/pago-error?` +
        `code=${response.response_code}` +
        `&buyOrder=${response.buy_order}`
      );
    }
  } catch (error) {
    console.error('[CONFIRM] Error al confirmar transacción:', error);
    return redirect('/pago-error?error=server_error');
  }
};

// Manejar GET para casos donde Transbank envía el token por URL
export const GET: APIRoute = async ({ redirect, url }) => {
  try {
    console.log('[CONFIRM] GET recibido');
    console.log('[CONFIRM] Query params:', url.search);
    
    // Obtener token de los query params
    const token = url.searchParams.get('token_ws');
    
    if (!token) {
      console.log('[CONFIRM] No hay token - usuario canceló');
      return redirect('/pago-error?error=cancelled');
    }

    console.log('[CONFIRM] Token encontrado en GET, procesando...');

    // Importar Transbank SDK
    const transbankModule = await import('transbank-sdk');
    const { WebpayPlus, Options, Environment } = transbankModule.default || transbankModule;
    
    // Configurar Transbank con variables de entorno
    const apiKey = process.env.TBK_API_KEY_ID || import.meta.env.TBK_API_KEY_ID;
    const apiSecret = process.env.TBK_API_KEY_SECRET || import.meta.env.TBK_API_KEY_SECRET;
    const environment = process.env.TBK_ENVIRONMENT || import.meta.env.TBK_ENVIRONMENT || 'INTEGRATION';

    console.log('[CONFIRM] Environment:', environment);

    if (!apiKey || !apiSecret) {
      console.error('[CONFIRM] Credenciales no configuradas');
      return redirect('/pago-error?error=config_error');
    }

    // Crear instancia de Transaction
    const tx = new WebpayPlus.Transaction(
      new Options(apiKey, apiSecret, environment === 'PRODUCTION' ? Environment.Production : Environment.Integration)
    );

    // Confirmar la transacción
    console.log('[CONFIRM] Llamando a tx.commit con token de GET...');
    const response = await tx.commit(token);
    console.log('[CONFIRM] Respuesta de Transbank:', JSON.stringify(response));

    // Verificar si la transacción fue aprobada
    if (response.response_code === 0) {
      console.log('[CONFIRM] Transacción APROBADA');
      
      // Actualizar estado en la BD usando session_id
      const clienteId = response.session_id;
      if (clienteId) {
        const { error: updateError } = await supabase
          .from('clientes')
          .update({
            estado: 'pagado',
            buy_order: response.buy_order,
            auth_code: response.authorization_code,
            updated_at: new Date().toISOString()
          })
          .eq('id', clienteId);

        if (updateError) {
          console.error('[CONFIRM] Error al actualizar cliente:', updateError);
        } else {
          console.log('[CONFIRM] Cliente actualizado a "pagado"');
        }
      }
      
      return redirect(
        `/pago-exitoso?` +
        `amount=${response.amount}` +
        `&buyOrder=${response.buy_order}` +
        `&authCode=${response.authorization_code}`
      );
    } else {
      console.log('[CONFIRM] Transacción RECHAZADA, código:', response.response_code);
      
      // Actualizar estado a cancelado en la BD usando session_id
      const clienteId = response.session_id;
      if (clienteId) {
        const { error: updateError } = await supabase
          .from('clientes')
          .update({
            estado: 'cancelado',
            updated_at: new Date().toISOString()
          })
          .eq('id', clienteId);

        if (updateError) {
          console.error('[CONFIRM] Error al actualizar cliente:', updateError);
        }
      }
      
      return redirect(
        `/pago-error?` +
        `code=${response.response_code}` +
        `&buyOrder=${response.buy_order}`
      );
    }
  } catch (error) {
    console.error('[CONFIRM] Error en GET:', error);
    return redirect('/pago-error?error=server_error');
  }
};
