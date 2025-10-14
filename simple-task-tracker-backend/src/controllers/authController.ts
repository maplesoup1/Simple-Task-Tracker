import { Request, Response } from 'express';
import * as authService from '../services/authService';
import * as userService from '../services/userService';
import { supabase } from '../utils/supabaseClient';

// POST /auth/signup
export async function signup(req: Request, res: Response): Promise<void> {
  try {
    const { email, password, name } = req.body;
    const result = await authService.signup(email, password, name);
    res.status(201).json(result);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
      return;
    }
    res.status(500).json({ error: 'Failed to sign up' });
  }
}

// POST /auth/sync - Idempotent user sync
export async function syncUser(req: Request, res: Response): Promise<void> {
  try {
    const auth = req.headers.authorization || '';
    const token = auth.startsWith('Bearer ') ? auth.slice(7) : '';

    if (!token) {
      res.status(401).json({ error: 'No token provided' });
      return;
    }

    // Verify JWT and get user info from Supabase
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      res.status(401).json({ error: 'Invalid or expired token' });
      return;
    }

    // Upsert user to local database
    const syncedUser = await userService.syncUser(
      user.id,
      user.email || '',
      user.user_metadata?.name
    );

    res.json(syncedUser);
  } catch (error) {
    console.error('Sync user error:', error);
    res.status(500).json({ error: 'Failed to sync user' });
  }
}

// POST /auth/login
export async function login(req: Request, res: Response): Promise<void> {
  try {
    const { email, password } = req.body;
    const result = await authService.login(email, password);
    res.json(result);
  } catch (error) {
    if (error instanceof Error) {
      res.status(401).json({ error: error.message });
      return;
    }
    res.status(500).json({ error: 'Failed to log in' });
  }
}

// POST /auth/logout
export async function logout(req: Request, res: Response): Promise<void> {
  try {
    const auth = req.headers.authorization || '';
    const token = auth.startsWith('Bearer ') ? auth.slice(7) : '';
    await authService.logout(token);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to log out' });
  }
}
