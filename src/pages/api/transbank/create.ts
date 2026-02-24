import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request }) => {
  try {
    // Importar Transbank SDK
    const transbankModule = await import('transbank-sdk');
    const { WebpayPlus, Options, Environment } = transbankModule.default || transbankModule;
    
    // Configurar Transbank con variables de entorno
    const apiKey = process.env.TBK_API_KEY_ID || import.meta.env.TBK_API_KEY_ID;
    const apiSecret = process.env.TBK_API_KEY_SECRET || import.meta.env.TBK_API_KEY_SECRET;
    const environment = process.env.TBK_ENVIRONMENT || import.meta.env.TBK_ENVIRONMENT || 'INTEGRATION';
    const baseUrl = import.meta.env.PUBLIC_BASE_URL || 'http://localhost:4321';

    // Validar que existan las credenciales
    if (!apiKey || !apiSecret) {
      console.error('Credenciales no encontradas:', { apiKey: !!apiKey, apiSecret: !!apiSecret });
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Credenciales de Transbank no configuradas'
        }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Crear instancia de Transaction con las opciones correctas
    const tx = new WebpayPlus.Transaction(
      new Options(apiKey, apiSecret, environment === 'PRODUCTION' ? Environment.Production : Environment.Integration)
    );

    const body = await request.json();
    const { amount, orderId, clienteId } = body;

    // Generar orden de compra única (máximo 26 caracteres permitido por Transbank)
    const timestamp = Date.now().toString().slice(-10); // Últimos 10 dígitos
    // Si clienteId es UUID, tomar solo los últimos 22 caracteres + prefijo
    const shortId = clienteId ? clienteId.replace(/-/g, '').slice(-22) : timestamp;
    const buyOrder = `ORD${shortId}`.slice(0, 26); // Máximo 26 caracteres
    const sessionId = clienteId || `S${timestamp}`;
    
    // URLs de retorno
    const returnUrl = `${baseUrl}/api/transbank/confirm`;

    // Crear transacción usando la instancia configurada
    const response = await tx.create(
      buyOrder,
      sessionId,
      amount,
      returnUrl
    );

    return new Response(
      JSON.stringify({
        success: true,
        url: response.url,
        token: response.token
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  } catch (error) {
    console.error('Error al crear transacción:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido'
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  }
};
