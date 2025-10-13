import { Request, Response } from 'express';
import * as userService from '../services/userService';

// GET /api/users/me 
export async function getUser(req: Request & { userId?: string }, res: Response) {
  try {
    const userId = req.userId!; // from requireAuth middleware
    const user = await userService.getUserById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.json(user);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch user' });
  }
}

// PUT /api/users/me
export async function updateUser(req: Request & { userId?: string }, res: Response) {
  try {
    const userId = req.userId!;
    const { name, email } = req.body;

    const updatedUser = await userService.updateUser(userId, { name, email });
    return res.json(updatedUser);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to update user' });
  }
}

// DELETE /api/users/me
export async function deleteUser(req: Request & { userId?: string }, res: Response) {
  try {
    const userId = req.userId!;
    await userService.deleteUser(userId);
    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({ error: 'Failed to delete user' });
  }
}
