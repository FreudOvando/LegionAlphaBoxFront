import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { createStage, deleteEnrollment, deleteStage, enroll, getEnrollments, getResults, getStages, saveResult, } from '@/api/competitions';
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
export function useResults(competitionId) {
    return useQuery({
        queryKey: ['competitions', competitionId, 'results'],
        queryFn: () => getResults(competitionId),
        enabled: !!competitionId,
    });
}
export function useSaveResult(competitionId) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload) => saveResult(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['competitions', competitionId, 'results'] });
        },
        onError: (error) => toast.error(getErrorMessage(error)),
    });
}
