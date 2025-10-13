import { supabase } from '../utils/supabaseClient';
import * as userService from './userService';

export async function signup(email: string, password: string, name?: string) {
  // Create user in Supabase Auth
  const { data, error } = await supabase.auth.signUp({ email, password });

  if (error) {
    throw new Error(error.message);
  }

  if (!data.user) {
    throw new Error('Failed to create user');
  }

  // Create user in our database
  const user = await userService.createUser(data.user.id, name);

  return {
    user,
    session: data.session
  };
}

export async function login(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    throw new Error(error.message);
  }

  return {
    user: data.user,
    session: data.session
  };
}

export async function logout(token?: string) {
  if (token) {
    await supabase.auth.signOut();
  }
}
