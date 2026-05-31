import { useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { Eye, EyeOff, Mail, Lock } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useLoginMutation, useSocialLoginMutation } from '@/features/auth/services/authApi'
import { setCredentials } from '@/features/auth/store/authSlice'
import { useAppDispatch, useAppSelector } from '@/app/hooks'

const schema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().optional(),
})

type FormValues = z.infer<typeof schema>

export default function LoginPage() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const { isAuthenticated } = useAppSelector((s) => s.auth)
  const [showPassword, setShowPassword] = useState(false)
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/'

  const [login, { isLoading }] = useLoginMutation()
  const [socialLogin, { isLoading: isSocialLoading }] = useSocialLoginMutation()

  useEffect(() => {
    if (isAuthenticated) navigate(from, { replace: true })
  }, [isAuthenticated, navigate, from])

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) })

  const onSubmit = async (values: FormValues) => {
    try {
      const result = await login(values).unwrap()
      dispatch(setCredentials(result.data))
      toast.success(`Welcome back, ${result.data.user.firstName}!`)
      navigate(from, { replace: true })
    } catch (err: unknown) {
      const msg = (err as { data?: { message?: string } })?.data?.message || 'Login failed'
      toast.error(msg)
    }
  }

  const handleSocialLogin = async (provider: 'google' | 'facebook' | 'apple') => {
    toast.info(`${provider} login coming soon!`)
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Welcome back</h1>
        <p className="mt-2 text-muted-foreground">
          Sign in to your account to continue shopping
        </p>
      </div>

      {/* Social login */}
      <div className="space-y-2">
        {[
          { provider: 'google' as const, label: 'Continue with Google', emoji: '🔵' },
          { provider: 'facebook' as const, label: 'Continue with Facebook', emoji: '🔷' },
          { provider: 'apple' as const, label: 'Continue with Apple', emoji: '⚫' },
        ].map(({ provider, label, emoji }) => (
          <Button
            key={provider}
            variant="outline"
            className="w-full gap-2"
            onClick={() => handleSocialLogin(provider)}
            loading={isSocialLoading}
          >
            <span>{emoji}</span> {label}
          </Button>
        ))}
      </div>

      <div className="my-6 flex items-center gap-3">
        <div className="h-px flex-1 bg-border" />
        <span className="text-xs text-muted-foreground">or with email</span>
        <div className="h-px flex-1 bg-border" />
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium">Email address</label>
          <Input
            {...register('email')}
            type="email"
            placeholder="you@example.com"
            startIcon={<Mail className="size-4" />}
            error={errors.email?.message}
            autoComplete="email"
          />
        </div>

        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label className="text-sm font-medium">Password</label>
            <Link
              to="/auth/forgot-password"
              className="text-xs text-primary hover:underline"
            >
              Forgot password?
            </Link>
          </div>
          <Input
            {...register('password')}
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
            startIcon={<Lock className="size-4" />}
            endIcon={
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            }
            error={errors.password?.message}
            autoComplete="current-password"
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            {...register('rememberMe')}
            type="checkbox"
            id="rememberMe"
            className="size-4 rounded border-input accent-primary"
          />
          <label htmlFor="rememberMe" className="text-sm text-muted-foreground">
            Remember me for 30 days
          </label>
        </div>

        <Button type="submit" className="w-full" size="lg" loading={isLoading}>
          Sign in
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Don't have an account?{' '}
        <Link to="/auth/register" className="font-medium text-primary hover:underline">
          Create one free
        </Link>
      </p>
    </div>
  )
}
