import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { LogOut, Save, Moon, Sun } from 'lucide-react'
import PageHeader from '@/components/common/PageHeader'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { useAuth } from '@/context/AuthContext'
import { useTheme } from '@/context/ThemeContext'
import { supabase } from '@/lib/supabaseClient'
import { initials, titleCase } from '@/lib/utils'

export default function MyAccount() {
  const { user, profile, refreshProfile, signOut } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()

  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || '')
      setPhone(profile.phone || '')
    }
  }, [profile])

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    const { error } = await supabase.from('profiles').update({ full_name: fullName, phone }).eq('id', user.id)
    setSaving(false)
    if (error) {
      toast.error(error.message)
      return
    }
    await refreshProfile()
    toast.success('Profile updated')
  }

  const handleSignOut = async () => {
    await signOut()
    navigate('/login', { replace: true })
  }

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader title="My account" description="Manage your profile and preferences." />

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6 flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarFallback className="bg-primary text-lg font-semibold text-primary-foreground">
                {initials(profile?.full_name)}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold text-foreground">{profile?.full_name}</p>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
              <p className="text-xs font-medium uppercase tracking-wide text-primary">{titleCase(profile?.role)}</p>
            </div>
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="fullName">Full name</Label>
              <Input id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>Email</Label>
              <Input value={user?.email || ''} disabled />
            </div>
            <div className="flex justify-end">
              <Button type="submit" disabled={saving}>
                <Save className="mr-1.5 h-4 w-4" />
                {saving ? 'Saving…' : 'Save changes'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-base">Preferences</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              {theme === 'dark' ? <Moon className="h-4 w-4 text-muted-foreground" /> : <Sun className="h-4 w-4 text-muted-foreground" />}
              <div>
                <p className="text-sm font-medium">Dark mode</p>
                <p className="text-xs text-muted-foreground">Switch between light and dark themes.</p>
              </div>
            </div>
            <Switch checked={theme === 'dark'} onCheckedChange={toggleTheme} />
          </div>
        </CardContent>
      </Card>

      <Separator className="my-6" />

      <Button variant="outline" className="text-destructive hover:text-destructive" onClick={handleSignOut}>
        <LogOut className="mr-1.5 h-4 w-4" />
        Sign out
      </Button>
    </div>
  )
}
