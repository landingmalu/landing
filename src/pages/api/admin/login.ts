import type { APIRoute } from 'astro';
import crypto from 'crypto';

// Credenciales del admin (en producción deberías usar variables de entorno)
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || import.meta.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || import.meta.env.ADMIN_PASSWORD || 'maluperez2024';

// Generar un token simple (en producción usa JWT)
function generateToken(username: string): string {
  const timestamp = Date.now();
  const data = `${username}:${timestamp}`;
  return Buffer.from(data).toString('base64');
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const { username, password } = await request.json();

    // Validar credenciales
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      const token = generateToken(username);
      
      return new Response(
        JSON.stringify({
          success: true,
          token,
          message: 'Login exitoso'
        }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    } else {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Credenciales inválidas'
        }),
        {
          status: 401,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
  } catch (error) {
    console.error('Error en login:', error);
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
