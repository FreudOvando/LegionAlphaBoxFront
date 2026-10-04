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

export async function saveResult(payload: CompetitionResultPayload): Promise<CompetitionResult> {
  const { data } = await apiClient.post<CompetitionResult>('/competitions/results', payload)
  return data
}