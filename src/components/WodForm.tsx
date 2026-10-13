import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { wodSchema, type WodFormValues } from '@/lib/WodSquema'
import { WOD_TYPES } from '@/types/wods'
import { WOD_TYPE_LABELS } from '@/lib/wodType'

interface WodFormProps {
  defaultValues?: Partial<WodFormValues>
  onSubmit: (values: WodFormValues) => void
  isSubmitting: boolean
  submitLabel: string
}

const inputStyles =
  'w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500'

const labelStyles = 'mb-1.5 block text-sm font-medium text-zinc-300'
const errorStyles = 'mt-1 text-sm text-red-400'

function toLocalDateInputValue(date: Date) {
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${date.getFullYear()}-${month}-${day}`
}

export function WodForm({ defaultValues, onSubmit, isSubmitting, submitLabel }: WodFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<WodFormValues>({
    resolver: zodResolver(wodSchema),
    defaultValues: {
      name: '',
      publicationDate: toLocalDateInputValue(new Date()),
      coachName: '',
      type: undefined,
      description: '',
      ...defaultValues,
    },
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
      <div>
        <label className={labelStyles} htmlFor="name">
          Nombre del WOD <span className="text-zinc-600">(opcional)</span>
        </label>
        <input
          id="name"
          type="text"
          placeholder='Ej. "Fran", "Helen"...'
          className={inputStyles}
          {...register('name')}
        />
        {errors.name && <p className={errorStyles}>{errors.name.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelStyles} htmlFor="publicationDate">
            Fecha de publicación
          </label>
          <input
            id="publicationDate"
            type="date"
            className={inputStyles}
            {...register('publicationDate')}
          />
          {errors.publicationDate && (
            <p className={errorStyles}>{errors.publicationDate.message}</p>
          )}
        </div>

        <div>
          <label className={labelStyles} htmlFor="type">
            Tipo de WOD
          </label>
          <select id="type" className={inputStyles} {...register('type')}>
            <option value="">Selecciona…</option>
            {WOD_TYPES.map((type) => (
              <option key={type} value={type}>
                {WOD_TYPE_LABELS[type]}
              </option>
            ))}
          </select>
          {errors.type && <p className={errorStyles}>{errors.type.message}</p>}
        </div>
      </div>

      <div>
        <label className={labelStyles} htmlFor="coachName">
          Coach
        </label>
        <input
          id="coachName"
          type="text"
          placeholder="Nombre del coach"
          className={inputStyles}
          {...register('coachName')}
        />
        {errors.coachName && <p className={errorStyles}>{errors.coachName.message}</p>}
      </div>

      <div>
        <label className={labelStyles} htmlFor="description">
          Descripción de los ejercicios
        </label>
        <textarea
          id="description"
          rows={6}
          placeholder={'21-15-9\nThrusters (43 kg)\nPull-ups'}
          className={`${inputStyles} resize-y font-mono`}
          {...register('description')}
        />
        {errors.description && <p className={errorStyles}>{errors.description.message}</p>}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="flex items-center justify-center gap-2 rounded-lg bg-red-500 px-4 py-2.5 text-sm font-bold text-zinc-950 transition hover:bg-orange-400 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting && <Loader2 size={16} className="animate-spin" />}
        {submitLabel}
      </button>
    </form>
  )
}