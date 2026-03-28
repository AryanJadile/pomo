import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabaseClient'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

export default function Signup() {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSignup = async (e) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    setLoading(true)
    const { error } = await supabase.auth.signUp({ 
      email, 
      password,
      options: { data: { full_name: fullName } }
    })
    setLoading(false)

    if (error) {
      toast.error(error.message)
    } else {
      toast.success('Account created! Please login.')
      navigate('/dashboard')
    }
  }

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
      <div className="w-full max-w-md p-8 space-y-6 bg-card rounded-lg border shadow-sm">
        <div className="text-center">
          <h1 className="text-2xl font-bold tracking-tight">Create an account</h1>
          <p className="text-sm text-muted-foreground mt-2">Sign up to manage your scans and crops.</p>
        </div>
        <form onSubmit={handleSignup} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Full Name</label>
            <input 
              type="text" 
              required 
              value={fullName} 
              onChange={(e) => setFullName(e.target.value)} 
              className="w-full p-2 border rounded-md bg-background" 
            />
          </div>
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
          <div className="space-y-2">
            <label className="text-sm font-medium">Confirm Password</label>
            <input 
              type="password" 
              required 
              value={confirmPassword} 
              onChange={(e) => setConfirmPassword(e.target.value)} 
              className="w-full p-2 border rounded-md bg-background" 
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Signing up...' : 'Sign up'}
          </Button>
        </form>
        <div className="text-center text-sm">
          Already have an account? <Link to="/login" className="text-primary hover:underline">Login</Link>
        </div>
      </div>
    </div>
  )
}
