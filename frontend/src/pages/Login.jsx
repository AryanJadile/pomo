import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabaseClient'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)

    if (error) {
      toast.error(error.message)
    } else {
      toast.success('Logged in successfully!')
      navigate('/dashboard')
    }
  }

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
      <div className="w-full max-w-md p-8 space-y-6 bg-card rounded-lg border shadow-sm">
        <div className="text-center">
          <h1 className="text-2xl font-bold tracking-tight">Welcome back</h1>
          <p className="text-sm text-muted-foreground mt-2">Login to access your dashboard and history.</p>
        </div>
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Email</label>
            <input 
              type="email" 
              required 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              className="w-full p-2 border rounded-md bg-background" 
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Password</label>
            <input 
              type="password" 
              required 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              className="w-full p-2 border rounded-md bg-background" 
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </Button>
        </form>
        <div className="text-center text-sm">
          Don't have an account? <Link to="/signup" className="text-primary hover:underline">Sign up</Link>
        </div>
      </div>
    </div>
  )
}
