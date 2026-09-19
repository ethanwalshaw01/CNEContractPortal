import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Send, CheckCircle2 } from 'lucide-react'
import { toast } from 'sonner'
import AuthLayout from '@/components/AuthLayout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/context/AuthContext'

export default function ForgotPassword() {
  const { resetPassword } = useAuth()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    const { error } = await resetPassword(email)
    setLoading(false)
    if (error) {
      toast.error(error.message)
      return
    }
    setSent(true)
  }

  if (sent) {
    return (
      <AuthLayout title="Check your email" subtitle="We've sent password reset instructions.">
        <div className="flex flex-col items-center gap-3 rounded-xl border border-border bg-muted/40 p-6 text-center">
          <CheckCircle2 className="h-8 w-8 text-success" />
          <p className="text-sm text-muted-foreground">
            If an account exists for <span className="font-medium text-foreground">{email}</span>, a reset link is on
            its way.
          </p>
        </div>
        <p className="mt-6 text-center text-sm">
          <Link to="/login" className="font-medium text-primary hover:underline">
            Back to sign in
          </Link>
        </p>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout title="Reset your password" subtitle="Enter your email and we'll send you a reset link.">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@company.com"
          />
        </div>
        <Button type="submit" className="w-full" disabled={loading}>
          <Send className="mr-1.5 h-4 w-4" />
          {loading ? 'Sending…' : 'Send reset link'}
        </Button>
      </form>
      <p className="mt-6 text-center text-sm text-muted-foreground">
        <Link to="/login" className="font-medium text-primary hover:underline">
          Back to sign in
        </Link>
      </p>
    </AuthLayout>
  )
}
