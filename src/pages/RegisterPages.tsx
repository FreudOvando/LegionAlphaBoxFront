import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate } from 'react-router-dom'
import { Loader2, UserPlus } from 'lucide-react'
import { toast } from 'sonner'
import { register as registerRequest } from '@/api/Auth'
import { useAuth } from '@/hooks/useAuth'
import { getErrorMessage } from '@/lib/errors'
import { registerSchema, type RegisterFormValues } from '@/lib/authSchema'

const inputStyles =
  'w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500'
const labelStyles = 'mb-1.5 block text-sm font-medium text-zinc-300'
const errorStyles = 'mt-1 text-sm text-red-400'

export function RegisterPage() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({ resolver: zodResolver(registerSchema) })

  async function onSubmit(values: RegisterFormValues) {
    try {
      const response = await registerRequest({
        ...values,
        photoUrl: values.photoUrl?.trim() ? values.photoUrl.trim() : null,
      })
      login(response)
      toast.success(`¡Bienvenido, ${response.user.firstName}!`)
      navigate('/')
    } catch (error) {
      toast.error(getErrorMessage(error))
    }
  }

  return (
    <section className="mx-auto max-w-md">
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-widest text-red-500">WorkoutMe</p>
        <h1 className="mt-2 text-3xl font-black text-zinc-50">Crear cuenta</h1>
        <p className="mt-2 text-sm text-zinc-400">Únete a tu comunidad de entrenamiento.</p>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-5 rounded-xl border border-zinc-800 bg-zinc-900/60 p-6"
      >
        <div>
          <label className={labelStyles} htmlFor="firstName">Nombre</label>
          <input id="firstName" autoComplete="given-name" className={inputStyles} {...register('firstName')} />
          {errors.firstName && <p className={errorStyles}>{errors.firstName.message}</p>}
        </div>

        <div>
          <label className={labelStyles} htmlFor="lastName">Apellido</label>
          <input id="lastName" autoComplete="family-name" className={inputStyles} {...register('lastName')} />
          {errors.lastName && <p className={errorStyles}>{errors.lastName.message}</p>}
        </div>

        <div>
        <label className={labelStyles} htmlFor="birthDate">Fecha de nacimiento</label>
        <input id="birthDate" type="date" className={inputStyles} {...register('birthDate')} />
        {errors.birthDate && <p className={errorStyles}>{errors.birthDate.message}</p>}
        </div>

        <div>
          <label className={labelStyles} htmlFor="email">Correo electrónico</label>
          <input id="email" type="email" autoComplete="email" className={inputStyles} {...register('email')} />
          {errors.email && <p className={errorStyles}>{errors.email.message}</p>}
        </div>

        <div>
          <label className={labelStyles} htmlFor="password">Contraseña</label>
          <input id="password" type="password" autoComplete="new-password" className={inputStyles} {...register('password')} />
          {errors.password && <p className={errorStyles}>{errors.password.message}</p>}
        </div>

        <div>
          <label className={labelStyles} htmlFor="photoUrl">URL de foto <span className="text-zinc-500">(opcional)</span></label>
          <input id="photoUrl" type="url" placeholder="https://..." className={inputStyles} {...register('photoUrl')} />
          {errors.photoUrl && <p className={errorStyles}>{errors.photoUrl.message}</p>}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="flex items-center justify-center gap-2 rounded-lg bg-red-500 px-4 py-2.5 text-sm font-bold text-zinc-950 transition hover:bg-orange-400 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <UserPlus size={16} />}
          Crear cuenta
        </button>

        <p className="text-center text-sm text-zinc-400">
          ¿Ya tienes una cuenta?{' '}
          <Link to="/login" className="font-semibold text-orange-400 hover:text-orange-300">Inicia sesión</Link>
        </p>
      </form>
    </section>
  )
}