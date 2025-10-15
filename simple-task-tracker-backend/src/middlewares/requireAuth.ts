import { Request, Response, NextFunction } from 'express'
import { supabase } from '../utils/supabaseClient'
import * as userService from '../services/userService'
import { extractToken } from '../utils/tokenHelper'

export const requireAuth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const token = extractToken(req)

    if (!token) {
      res.status(401).json({ error: 'No token provided' })
      return
    }

    // Verify the JWT token with Supabase
    const { data: { user }, error } = await supabase.auth.getUser(token)

    if (error || !user) {
      res.status(401).json({ error: 'Invalid or expired token' })
      return
    }

    // Fallback: Ensure user exists in local database (idempotent upsert)
    // This handles cases where user has a valid token but wasn't synced via /auth/sync
    try {
      await userService.syncUser(user.id, user.email || '', user.user_metadata?.name)
    } catch (syncError) {
      console.error('Failed to sync user in requireAuth:', syncError)
      // Continue even if sync fails - user might already exist
    }

    req.userId = user.id
    next()
  } catch (error) {
    console.error('Auth middleware error:', error)
    res.status(401).json({ error: 'Authentication failed' })
  }
}