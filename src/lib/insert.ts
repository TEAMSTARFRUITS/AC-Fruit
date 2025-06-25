import { supabase } from './supabaseClient';

export async function insertData(table: string, data: any) {
  const { error } = await supabase.from(table).insert(data);
  if (error) {
    console.error('Erreur Supabase :', error.message);
    throw new Error(error.message);
  }
}