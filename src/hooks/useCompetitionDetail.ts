import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  createStage,
  deleteEnrollment,
  deleteStage,
  enroll,
  getEnrollments,
  getResults,
  getStages,
  saveResult,
} from '@/api/competitions'
import { getErrorMessage } from '@/lib/errors'
import type {
  CompetitionEnrollmentPayload,
  CompetitionResultPayload,
  CompetitionStagePayload,
} from '@/types/competition'

export function useStages(competitionId: number) {
  return useQuery({
    queryKey: ['competitions', competitionId, 'stages'],
    queryFn: () => getStages(competitionId),
    enabled: !!competitionId,
  })
}

export function useCreateStage(competitionId: number) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: CompetitionStagePayload) => createStage(competitionId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['competitions', competitionId, 'stages'] })
      toast.success('WOD agregado a la competencia')
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  })
}

export function useDeleteEnrollment(competitionId: number) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (enrollmentId: number) => deleteEnrollment(enrollmentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['competitions', competitionId, 'enrollments'] })
      queryClient.invalidateQueries({ queryKey: ['competitions', competitionId, 'results'] })
      toast.success('Atleta eliminado de la competencia')
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  })
}

export function useDeleteStage(competitionId: number) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (stageId: number) => deleteStage(stageId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['competitions', competitionId, 'stages'] })
      queryClient.invalidateQueries({ queryKey: ['competitions', competitionId, 'results'] })
      toast.success('WOD eliminado de la competencia')
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  })
}

export function useEnrollments(competitionId: number) {
  return useQuery({
    queryKey: ['competitions', competitionId, 'enrollments'],
    queryFn: () => getEnrollments(competitionId),
    enabled: !!competitionId,
  })
}

export function useEnroll(competitionId: number) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: CompetitionEnrollmentPayload) => enroll(competitionId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['competitions', competitionId, 'enrollments'] })
      toast.success('Te inscribiste correctamente')
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  })
}

export function useResults(competitionId: number) {
  return useQuery({
    queryKey: ['competitions', competitionId, 'results'],
    queryFn: () => getResults(competitionId),
    enabled: !!competitionId,
  })
}

export function useSaveResult(competitionId: number) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: CompetitionResultPayload) => saveResult(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['competitions', competitionId, 'results'] })
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  })
}