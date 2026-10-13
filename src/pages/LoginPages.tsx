import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate } from 'react-router-dom'
import { Loader2, LogIn } from 'lucide-react'
import { toast } from 'sonner'
import { login as loginRequest } from '@/api/Auth'
import { useAuth } from '@/hooks/useAuth'
import { getErrorMessage } from '@/lib/errors'
import { loginSchema, type LoginFormValues } from '@/lib/authSchema'

const inputStyles =
  'w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500'
const labelStyles = 'mb-1.5 block text-sm font-medium text-zinc-300'
const errorStyles = 'mt-1 text-sm text-red-400'

export function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({ resolver: zodResolver(loginSchema) })

  async function onSubmit(values: LoginFormValues) {
    try {
      const response = await loginRequest(values)
      login(response)
      toast.success(`Hola de nuevo, ${response.user.firstName}`)
      navigate('/')
    } catch (error) {
      toast.error(getErrorMessage(error))
    }
  }

  return (
    <section className="mx-auto max-w-md">
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-widest text-red-500">WorkoutMe-C</p>
        <h1 className="mt-2 text-3xl font-black text-zinc-50">Iniciar sesión</h1>
        <p className="mt-2 text-sm text-zinc-400">Accede a tus entrenamientos y WODs.</p>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-5 rounded-xl border border-zinc-800 bg-zinc-900/60 p-6"
      >
        <div>
          <label className={labelStyles} htmlFor="email">Correo electrónico</label>
          <input id="email" type="email" autoComplete="email" className={inputStyles} {...register('email')} />
          {errors.email && <p className={errorStyles}>{errors.email.message}</p>}
        </div>

        <div>
          <label className={labelStyles} htmlFor="password">Contraseña</label>
          <input id="password" type="password" autoComplete="current-password" className={inputStyles} {...register('password')} />
          {errors.password && <p className={errorStyles}>{errors.password.message}</p>}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="flex items-center justify-center gap-2 rounded-lg bg-red-500 px-4 py-2.5 text-sm font-bold text-zinc-950 transition hover:bg-orange-400 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <LogIn size={16} />}
          Entrar
        </button>

        <p className="text-center text-sm text-zinc-400">
          ¿No tienes una cuenta?{' '}
          <Link to="/register" className="font-semibold text-orange-400 hover:text-orange-300">Regístrate</Link>
        </p>
      </form>
    </section>
  )
}