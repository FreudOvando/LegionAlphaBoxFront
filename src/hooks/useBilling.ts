import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { createPayment, getAllPayments, getUserPayments } from '@/api/payments'
import { getErrorMessage } from '@/lib/errors'
import type { PaymentPayload } from '@/types/payment'
import { deleteUser, getMe, getUsers, updateUserFee } from '@/api/users'

export function useUserPayments(userId: number) {
  return useQuery({
    queryKey: ['payments', 'user', userId],
    queryFn: () => getUserPayments(userId),
    enabled: !!userId,
  })
}

export function useAllPayments() {
  return useQuery({
    queryKey: ['payments', 'all'],
    queryFn: getAllPayments,
  })
}

export function useCreatePayment(userId: number) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: PaymentPayload) => createPayment(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments', 'user', userId] })
      queryClient.invalidateQueries({ queryKey: ['payments', 'all'] })
      toast.success('Pago registrado correctamente')
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  })
}

export function useMe() {
  return useQuery({
    queryKey: ['users', 'me'],
    queryFn: getMe,
  })
}

export function useUsers() {
  return useQuery({
    queryKey: ['users', 'all'],
    queryFn: getUsers,
  })
}

export function useDeleteUser() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users', 'all'] })
      queryClient.invalidateQueries({ queryKey: ['payments', 'all'] })
      toast.success('Miembro eliminado')
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  })
}

export function useUpdateFee() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, monthlyFee }: { id: number; monthlyFee: number }) => updateUserFee(id, monthlyFee),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users', 'all'] })
      queryClient.invalidateQueries({ queryKey: ['users', 'me'] })
      toast.success('Mensualidad actualizada')
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  })
}