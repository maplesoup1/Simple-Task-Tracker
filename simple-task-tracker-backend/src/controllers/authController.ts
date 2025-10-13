import { Request, Response } from 'express';
import * as authService from '../services/authService';

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
