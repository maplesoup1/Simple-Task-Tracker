import { Request, Response, NextFunction } from 'express'
import { supabase } from '../utils/supabaseClient'

export const requireAuth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const auth = req.headers.authorization || ''
    const token = auth.startsWith('Bearer ') ? auth.slice(7) : ''

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

    req.userId = user.id
    next()
  } catch (error) {
    res.status(401).json({ error: 'Authentication failed' })
  }
}