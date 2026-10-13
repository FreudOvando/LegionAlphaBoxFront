import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { createCompetition, createCompetitionTeam, deleteCompetition, deleteCompetitionTeam, getCompetition, getCompetitionTeams, getCompetitions, updateCompetition, updateCompetitionTeam, } from '@/api/competitions';
import { getErrorMessage } from '@/lib/errors';
const COMPETITIONS_KEY = ['competitions'];
export function useCompetitions() {
    return useQuery({
        queryKey: COMPETITIONS_KEY,
        queryFn: getCompetitions,
    });
}
export function useCompetition(id) {
    return useQuery({
        queryKey: [...COMPETITIONS_KEY, id],
        queryFn: () => getCompetition(id),
        enabled: !!id,
    });
}
export function useCreateCompetition() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload) => createCompetition(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: COMPETITIONS_KEY });
            toast.success('Competencia creada correctamente');
        },
        onError: (error) => toast.error(getErrorMessage(error)),
    });
}
export function useUpdateCompetition(id) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload) => updateCompetition(id, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: COMPETITIONS_KEY });
            toast.success('Competencia actualizada correctamente');
        },
        onError: (error) => toast.error(getErrorMessage(error)),
    });
}
export function useDeleteCompetition() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id) => deleteCompetition(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: COMPETITIONS_KEY });
            toast.success('Competencia eliminada');
        },
        onError: (error) => toast.error(getErrorMessage(error)),
    });
}
export function useCompetitionTeams(competitionId) {
    return useQuery({
        queryKey: [...COMPETITIONS_KEY, competitionId, 'teams'],
        queryFn: () => getCompetitionTeams(competitionId),
        enabled: !!competitionId,
    });
}
export function useCreateCompetitionTeam(competitionId) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload) => createCompetitionTeam(competitionId, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [...COMPETITIONS_KEY, competitionId, 'teams'] });
            toast.success('Equipo creado correctamente');
        },
        onError: (error) => toast.error(getErrorMessage(error)),
    });
}
export function useUpdateCompetitionTeam(competitionId) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ teamId, payload }) => updateCompetitionTeam(teamId, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [...COMPETITIONS_KEY, competitionId, 'teams'] });
            toast.success('Equipo actualizado correctamente');
        },
        onError: (error) => toast.error(getErrorMessage(error)),
    });
}
export function useDeleteCompetitionTeam(competitionId) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (teamId) => deleteCompetitionTeam(teamId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [...COMPETITIONS_KEY, competitionId, 'teams'] });
            toast.success('Equipo eliminado; las inscripciones de sus atletas se conservaron');
        },
        onError: (error) => toast.error(getErrorMessage(error)),
    });
}
