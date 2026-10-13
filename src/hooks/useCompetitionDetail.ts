import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  createStage,
  deletePerformance,
  deleteEnrollment,
  deleteStage,
  deleteTeamPerformance,
  enroll,
  getEnrollments,
  getPerformances,
  getResults,
  getStages,
  getTeamResults,
  savePerformance,
  saveResult,
  saveTeamPerformance,
  saveTeamPercentage,
} from '@/api/competitions'
import { getErrorMessage } from '@/lib/errors'
import type {
  CompetitionEnrollmentPayload,
  CompetitionResultPayload,
  CompetitionStagePayload,
  CompetitionPerformancePayload,
  CompetitionTeamPerformancePayload,
  CompetitionTeamResultPayload,
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
      queryClient.invalidateQueries({ queryKey: ['competitions', competitionId, 'performances'] })
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

export function useResults(competitionId: number, enabled = true) {
  return useQuery({
    queryKey: ['competitions', competitionId, 'results'],
    queryFn: () => getResults(competitionId),
    enabled: !!competitionId && enabled,
  })
}

export function usePerformances(competitionId: number, enabled = true) {
  return useQuery({
    queryKey: ['competitions', competitionId, 'performances'],
    queryFn: () => getPerformances(competitionId),
    enabled: !!competitionId && enabled,
  })
}

export function useTeamResults(competitionId: number, enabled = true) {
  return useQuery({
    queryKey: ['competitions', competitionId, 'team-results'],
    queryFn: () => getTeamResults(competitionId),
    enabled: !!competitionId && enabled,
  })
}

function useInvalidateScores(competitionId: number) {
  const queryClient = useQueryClient()
  return () => {
    queryClient.invalidateQueries({ queryKey: ['competitions', competitionId, 'results'] })
    queryClient.invalidateQueries({ queryKey: ['competitions', competitionId, 'performances'] })
    queryClient.invalidateQueries({ queryKey: ['competitions', competitionId, 'team-results'] })
  }
}

export function useSaveResult(competitionId: number) {
  const invalidateScores = useInvalidateScores(competitionId)
  return useMutation({
    mutationFn: (payload: CompetitionResultPayload) => saveResult(payload),
    onSuccess: () => {
      invalidateScores()
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  })
}

export function useSavePerformance(competitionId: number) {
  const invalidateScores = useInvalidateScores(competitionId)
  return useMutation({
    mutationFn: (payload: CompetitionPerformancePayload) => savePerformance(payload),
    onSuccess: () => {
      invalidateScores()
      toast.success('Reps o tiempo guardado')
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  })
}

export function useDeletePerformance(competitionId: number) {
  const invalidateScores = useInvalidateScores(competitionId)
  return useMutation({
    mutationFn: (performanceId: number) => deletePerformance(performanceId),
    onSuccess: () => {
      invalidateScores()
      toast.success('Reps o tiempo eliminado')
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  })
}

export function useSaveTeamPercentage(competitionId: number) {
  const invalidateScores = useInvalidateScores(competitionId)
  return useMutation({
    mutationFn: (payload: CompetitionTeamResultPayload) => saveTeamPercentage(payload),
    onSuccess: () => invalidateScores(),
    onError: (error) => toast.error(getErrorMessage(error)),
  })
}

export function useSaveTeamPerformance(competitionId: number) {
  const invalidateScores = useInvalidateScores(competitionId)
  return useMutation({
    mutationFn: (payload: CompetitionTeamPerformancePayload) => saveTeamPerformance(payload),
    onSuccess: () => {
      invalidateScores()
      toast.success('Reps o tiempo guardado')
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  })
}

export function useDeleteTeamPerformance(competitionId: number) {
  const invalidateScores = useInvalidateScores(competitionId)
  return useMutation({
    mutationFn: (resultId: number) => deleteTeamPerformance(resultId),
    onSuccess: () => {
      invalidateScores()
      toast.success('Reps o tiempo eliminado')
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  })
}