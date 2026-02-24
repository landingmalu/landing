import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.PUBLIC_SUPABASE_URL || import.meta.env.PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || import.meta.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.warn('⚠️ Variables de Supabase no configuradas');
}

export const supabase = createClient(supabaseUrl || '', supabaseKey || '');

export interface Cliente {
  id?: string;
  nombre: string;
  apellidos: string;
  email: string;
  telefono: string;
  pais: string;
  region: string;
  ciudad: string;
  direccion: string;
  notas?: string;
  clase_seleccionada: 'reformer' | 'lagree' | 'combinado';
  monto: number;
  estado: 'pendiente' | 'pagado' | 'cancelado';
  buy_order?: string;
  auth_code?: string;
  created_at?: string;
  updated_at?: string;
}
