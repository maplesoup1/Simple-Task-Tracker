import { Request, Response } from 'express';
import * as userService from '../services/userService';

// GET /api/users/me
export async function getUser(req: Request, res: Response): Promise<void> {
  try {
    const userId = req.userId!; // from requireAuth middleware
    const user = await userService.getUserById(userId);

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user' });
  }
}

// PUT /api/users/me
export async function updateUser(req: Request, res: Response): Promise<void> {
  try {
    const userId = req.userId!;
    const { name, email } = req.body;

    const updatedUser = await userService.updateUser(userId, { name, email });
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update user' });
  }
}

// DELETE /api/users/me
export async function deleteUser(req: Request, res: Response): Promise<void> {
  try {
    const userId = req.userId!;
    await userService.deleteUser(userId);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete user' });
  }
}
