import { Router, Request, Response } from 'express'
import { supabase } from '../utils/supabaseClient'
import * as userService from '../services/userService'

const router = Router()

router.post('/signup', async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, name } = req.body

    if (!email || !password) {
      res.status(400).json({ error: 'Email and password are required' })
      return
    }

    // Create user in Supabase Auth
    const { data, error } = await supabase.auth.signUp({ email, password })

    if (error) {
      res.status(400).json({ error: error.message })
      return
    }

    if (!data.user) {
      res.status(400).json({ error: 'Failed to create user' })
      return
    }

    // Create user in our database
    const user = await userService.createUser(data.user.id, name)

    res.status(201).json({
      user,
      session: data.session
    })
  } catch (error) {
    res.status(500).json({ error: 'Failed to sign up' })
  }
})


router.post('/login', async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      res.status(400).json({ error: 'Email and password are required' })
      return
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) {
      res.status(401).json({ error: error.message })
      return
    }

    res.json({
      user: data.user,
      session: data.session
    })
  } catch (error) {
    res.status(500).json({ error: 'Failed to log in' })
  }
})

router.post('/logout', async (req: Request, res: Response): Promise<void> => {
  try {
    const auth = req.headers.authorization || ''
    const token = auth.startsWith('Bearer ') ? auth.slice(7) : ''

    if (token) {
      await supabase.auth.signOut()
    }

    res.status(204).send()
  } catch (error) {
    res.status(500).json({ error: 'Failed to log out' })
  }
})

export default router
