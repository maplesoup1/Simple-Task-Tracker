import { Request, Response, NextFunction } from 'express'
import { supabase } from '../utils/supabaseClient'

export async function requireAuth(req: Request & { userId?: string }, res: Response, next: NextFunction) {
  const auth = req.headers.authorization || ''
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : ''
  if (!token) return res.status(401).json({ error: 'No token' })

  const { data, error } = await supabase.auth.getUser(token)
  if (error || !data.user) return res.status(401).json({ error: 'Invalid token' })

  req.userId = data.user.id
  next()
}