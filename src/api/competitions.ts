import { apiClient } from './client'
import type {
  Competition,
  CompetitionPayload,
  CompetitionStage,
  CompetitionStagePayload,
  CompetitionEnrollment,
  CompetitionEnrollmentPayload,
  CompetitionResult,
  CompetitionResultPayload,
  CompetitionTeam,
  CompetitionTeamPayload,
  CompetitionPerformance,
  CompetitionPerformancePayload,
  CompetitionTeamResult,
  CompetitionTeamResultPayload,
  CompetitionTeamPerformancePayload,
} from '@/types/competition'

export async function getCompetitions(): Promise<Competition[]> {
  const { data } = await apiClient.get<Competition[]>('/competitions')
  return data
}

export async function deleteEnrollment(enrollmentId: number): Promise<void> {
  await apiClient.delete(`/competitions/enrollments/${enrollmentId}`)
}

export async function getCompetition(id: number): Promise<Competition> {
  const { data } = await apiClient.get<Competition>(`/competitions/${id}`)
  return data
}

export async function createCompetition(payload: CompetitionPayload): Promise<Competition> {
  const { data } = await apiClient.post<Competition>('/competitions', payload)
  return data
}

export async function updateCompetition(id: number, payload: CompetitionPayload): Promise<Competition> {
  const { data } = await apiClient.put<Competition>(`/competitions/${id}`, payload)
  return data
}

export async function deleteCompetition(id: number): Promise<void> {
  await apiClient.delete(`/competitions/${id}`)
}

export async function getCompetitionTeams(competitionId: number): Promise<CompetitionTeam[]> {
  const { data } = await apiClient.get<CompetitionTeam[]>(`/competitions/${competitionId}/teams`)
  return data
}

export async function createCompetitionTeam(
  competitionId: number,
  payload: CompetitionTeamPayload,
): Promise<CompetitionTeam> {
  const { data } = await apiClient.post<CompetitionTeam>(`/competitions/${competitionId}/teams`, payload)
  return data
}

export async function updateCompetitionTeam(
  teamId: number,
  payload: CompetitionTeamPayload,
): Promise<CompetitionTeam> {
  const { data } = await apiClient.put<CompetitionTeam>(`/competitions/teams/${teamId}`, payload)
  return data
}

export async function deleteCompetitionTeam(teamId: number): Promise<void> {
  await apiClient.delete(`/competitions/teams/${teamId}`)
}

export async function getStages(competitionId: number): Promise<CompetitionStage[]> {
  const { data } = await apiClient.get<CompetitionStage[]>(`/competitions/${competitionId}/stages`)
  return data
}

export async function createStage(competitionId: number, payload: CompetitionStagePayload): Promise<CompetitionStage> {
  const { data } = await apiClient.post<CompetitionStage>(`/competitions/${competitionId}/stages`, payload)
  return data
}

export async function updateStage(stageId: number, payload: CompetitionStagePayload): Promise<CompetitionStage> {
  const { data } = await apiClient.put<CompetitionStage>(`/competitions/stages/${stageId}`, payload)
  return data
}

export async function deleteStage(stageId: number): Promise<void> {
  await apiClient.delete(`/competitions/stages/${stageId}`)
}

export async function getEnrollments(competitionId: number): Promise<CompetitionEnrollment[]> {
  const { data } = await apiClient.get<CompetitionEnrollment[]>(`/competitions/${competitionId}/enrollments`)
  return data
}

export async function enroll(competitionId: number, payload: CompetitionEnrollmentPayload): Promise<CompetitionEnrollment> {
  const { data } = await apiClient.post<CompetitionEnrollment>(`/competitions/${competitionId}/enroll`, payload)
  return data
}

export async function getResults(competitionId: number): Promise<CompetitionResult[]> {
  const { data } = await apiClient.get<CompetitionResult[]>(`/competitions/${competitionId}/results`)
  return data
}

export async function getPerformances(competitionId: number): Promise<CompetitionPerformance[]> {
  const { data } = await apiClient.get<CompetitionPerformance[]>(`/competitions/${competitionId}/performances`)
  return data
}

export async function savePerformance(payload: CompetitionPerformancePayload): Promise<CompetitionPerformance> {
  const { data } = await apiClient.post<CompetitionPerformance>('/competitions/results/performances', payload)
  return data
}

export async function deletePerformance(performanceId: number): Promise<void> {
  await apiClient.delete(`/competitions/results/performances/${performanceId}`)
}

export async function getTeamResults(competitionId: number): Promise<CompetitionTeamResult[]> {
  const { data } = await apiClient.get<CompetitionTeamResult[]>(`/competitions/${competitionId}/team-results`)
  return data
}

export async function saveTeamPercentage(payload: CompetitionTeamResultPayload): Promise<CompetitionTeamResult> {
  const { data } = await apiClient.post<CompetitionTeamResult>('/competitions/team-results/percentage', payload)
  return data
}

export async function saveTeamPerformance(payload: CompetitionTeamPerformancePayload): Promise<CompetitionTeamResult> {
  const { data } = await apiClient.post<CompetitionTeamResult>('/competitions/team-results/performance', payload)
  return data
}

export async function deleteTeamPerformance(resultId: number): Promise<void> {
  await apiClient.delete(`/competitions/team-results/${resultId}/performance`)
}

export async function saveResult(payload: CompetitionResultPayload): Promise<CompetitionResult> {
  const { data } = await apiClient.post<CompetitionResult>('/competitions/results', payload)
  return data
}