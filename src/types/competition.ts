export const COMPETITION_CATEGORIES = ['PRINCIPIANTE', 'INTERMEDIO', 'MASTER', 'AVANZADO', 'RX'] as const
export type CompetitionCategory = (typeof COMPETITION_CATEGORIES)[number]
export type CompetitionType = 'INDIVIDUAL' | 'TEAM'

export interface Competition {
  id: number
  name: string
  competitionDate: string
  type: CompetitionType
  createdAt: string
  updatedAt: string
}

export interface CompetitionPayload {
  name: string
  competitionDate: string
  type: CompetitionType
}

export interface CompetitionTeamMember {
  enrollmentId: number
  userId: number
  userFullName: string
  category: CompetitionCategory
}

export interface CompetitionTeam {
  id: number
  competitionId: number
  name: string
  members: CompetitionTeamMember[]
}

export interface CompetitionTeamPayload {
  name: string
  memberEnrollmentIds: number[]
}

export interface CompetitionStage {
  id: number
  competitionId: number
  name: string
  stageOrder: number
}

export interface CompetitionStagePayload {
  name: string
  stageOrder: number
}

export interface CompetitionEnrollment {
  id: number
  competitionId: number
  userId: number
  userFullName: string
  category: CompetitionCategory
  enrolledAt: string
}

export interface CompetitionEnrollmentPayload {
  userId: number
  category: CompetitionCategory
}

export interface CompetitionResult {
  id: number
  stageId: number
  stageName: string
  enrollmentId: number
  userId: number
  userFullName: string
  percentage: number
  createdAt: string
  updatedAt: string
}

export interface CompetitionResultPayload {
  stageId: number
  enrollmentId: number
  percentage: number
}

export interface CompetitionPerformance {
  id: number
  stageId: number
  enrollmentId: number
  repsOrTime: string
}

export interface CompetitionPerformancePayload {
  stageId: number
  enrollmentId: number
  repsOrTime: string
}

export interface CompetitionTeamResult {
  id: number
  stageId: number
  teamId: number
  teamName: string
  percentage: number | null
  repsOrTime: string | null
  createdAt: string
  updatedAt: string
}

export interface CompetitionTeamResultPayload {
  stageId: number
  teamId: number
  percentage: number
}

export interface CompetitionTeamPerformancePayload {
  stageId: number
  teamId: number
  repsOrTime: string
}