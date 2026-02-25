import type { APIRoute } from 'astro';
import { supabase } from '../../../lib/supabase';

export const GET: APIRoute = async () => {
	try {
		// Contar clientes con estado 'pagado'
		const { count, error } = await supabase
			.from('clientes')
			.select('*', { count: 'exact', head: true })
			.eq('estado', 'pagado');

		if (error) {
			console.error('Error contando clientes:', error);
			return new Response(
				JSON.stringify({ error: 'Error al contar clientes' }),
				{ status: 500, headers: { 'Content-Type': 'application/json' } }
			);
		}

		return new Response(
			JSON.stringify({ count: count || 0 }),
			{ status: 200, headers: { 'Content-Type': 'application/json' } }
		);
	} catch (error) {
		console.error('Error en count endpoint:', error);
		return new Response(
			JSON.stringify({ error: 'Error interno del servidor' }),
			{ status: 500, headers: { 'Content-Type': 'application/json' } }
		);
	}
};
