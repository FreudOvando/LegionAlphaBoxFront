import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { createStage, deletePerformance, deleteEnrollment, deleteStage, deleteTeamPerformance, enroll, getEnrollments, getPerformances, getResults, getStages, getTeamResults, savePerformance, saveResult, saveTeamPerformance, saveTeamPercentage, } from '@/api/competitions';
import { getErrorMessage } from '@/lib/errors';
export function useStages(competitionId) {
    return useQuery({
        queryKey: ['competitions', competitionId, 'stages'],
        queryFn: () => getStages(competitionId),
        enabled: !!competitionId,
    });
}
export function useCreateStage(competitionId) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload) => createStage(competitionId, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['competitions', competitionId, 'stages'] });
            toast.success('WOD agregado a la competencia');
        },
        onError: (error) => toast.error(getErrorMessage(error)),
    });
}
export function useDeleteEnrollment(competitionId) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (enrollmentId) => deleteEnrollment(enrollmentId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['competitions', competitionId, 'enrollments'] });
            queryClient.invalidateQueries({ queryKey: ['competitions', competitionId, 'results'] });
            queryClient.invalidateQueries({ queryKey: ['competitions', competitionId, 'performances'] });
            toast.success('Atleta eliminado de la competencia');
        },
        onError: (error) => toast.error(getErrorMessage(error)),
    });
}
export function useDeleteStage(competitionId) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (stageId) => deleteStage(stageId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['competitions', competitionId, 'stages'] });
            queryClient.invalidateQueries({ queryKey: ['competitions', competitionId, 'results'] });
            toast.success('WOD eliminado de la competencia');
        },
        onError: (error) => toast.error(getErrorMessage(error)),
    });
}
export function useEnrollments(competitionId) {
    return useQuery({
        queryKey: ['competitions', competitionId, 'enrollments'],
        queryFn: () => getEnrollments(competitionId),
        enabled: !!competitionId,
    });
}
export function useEnroll(competitionId) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload) => enroll(competitionId, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['competitions', competitionId, 'enrollments'] });
            toast.success('Te inscribiste correctamente');
        },
        onError: (error) => toast.error(getErrorMessage(error)),
    });
}
export function useResults(competitionId, enabled = true) {
    return useQuery({
        queryKey: ['competitions', competitionId, 'results'],
        queryFn: () => getResults(competitionId),
        enabled: !!competitionId && enabled,
    });
}
export function usePerformances(competitionId, enabled = true) {
    return useQuery({
        queryKey: ['competitions', competitionId, 'performances'],
        queryFn: () => getPerformances(competitionId),
        enabled: !!competitionId && enabled,
    });
}
export function useTeamResults(competitionId, enabled = true) {
    return useQuery({
        queryKey: ['competitions', competitionId, 'team-results'],
        queryFn: () => getTeamResults(competitionId),
        enabled: !!competitionId && enabled,
    });
}
function useInvalidateScores(competitionId) {
    const queryClient = useQueryClient();
    return () => {
        queryClient.invalidateQueries({ queryKey: ['competitions', competitionId, 'results'] });
        queryClient.invalidateQueries({ queryKey: ['competitions', competitionId, 'performances'] });
        queryClient.invalidateQueries({ queryKey: ['competitions', competitionId, 'team-results'] });
    };
}
export function useSaveResult(competitionId) {
    const invalidateScores = useInvalidateScores(competitionId);
    return useMutation({
        mutationFn: (payload) => saveResult(payload),
        onSuccess: () => {
            invalidateScores();
        },
        onError: (error) => toast.error(getErrorMessage(error)),
    });
}
export function useSavePerformance(competitionId) {
    const invalidateScores = useInvalidateScores(competitionId);
    return useMutation({
        mutationFn: (payload) => savePerformance(payload),
        onSuccess: () => {
            invalidateScores();
            toast.success('Reps o tiempo guardado');
        },
        onError: (error) => toast.error(getErrorMessage(error)),
    });
}
export function useDeletePerformance(competitionId) {
    const invalidateScores = useInvalidateScores(competitionId);
    return useMutation({
        mutationFn: (performanceId) => deletePerformance(performanceId),
        onSuccess: () => {
            invalidateScores();
            toast.success('Reps o tiempo eliminado');
        },
        onError: (error) => toast.error(getErrorMessage(error)),
    });
}
export function useSaveTeamPercentage(competitionId) {
    const invalidateScores = useInvalidateScores(competitionId);
    return useMutation({
        mutationFn: (payload) => saveTeamPercentage(payload),
        onSuccess: () => invalidateScores(),
        onError: (error) => toast.error(getErrorMessage(error)),
    });
}
export function useSaveTeamPerformance(competitionId) {
    const invalidateScores = useInvalidateScores(competitionId);
    return useMutation({
        mutationFn: (payload) => saveTeamPerformance(payload),
        onSuccess: () => {
            invalidateScores();
            toast.success('Reps o tiempo guardado');
        },
        onError: (error) => toast.error(getErrorMessage(error)),
    });
}
export function useDeleteTeamPerformance(competitionId) {
    const invalidateScores = useInvalidateScores(competitionId);
    return useMutation({
        mutationFn: (resultId) => deleteTeamPerformance(resultId),
        onSuccess: () => {
            invalidateScores();
            toast.success('Reps o tiempo eliminado');
        },
        onError: (error) => toast.error(getErrorMessage(error)),
    });
}
