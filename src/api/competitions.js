import { apiClient } from './client';
export async function getCompetitions() {
    const { data } = await apiClient.get('/competitions');
    return data;
}
export async function deleteEnrollment(enrollmentId) {
    await apiClient.delete(`/competitions/enrollments/${enrollmentId}`);
}
export async function getCompetition(id) {
    const { data } = await apiClient.get(`/competitions/${id}`);
    return data;
}
export async function createCompetition(payload) {
    const { data } = await apiClient.post('/competitions', payload);
    return data;
}
export async function updateCompetition(id, payload) {
    const { data } = await apiClient.put(`/competitions/${id}`, payload);
    return data;
}
export async function deleteCompetition(id) {
    await apiClient.delete(`/competitions/${id}`);
}
export async function getStages(competitionId) {
    const { data } = await apiClient.get(`/competitions/${competitionId}/stages`);
    return data;
}
export async function createStage(competitionId, payload) {
    const { data } = await apiClient.post(`/competitions/${competitionId}/stages`, payload);
    return data;
}
export async function updateStage(stageId, payload) {
    const { data } = await apiClient.put(`/competitions/stages/${stageId}`, payload);
    return data;
}
export async function deleteStage(stageId) {
    await apiClient.delete(`/competitions/stages/${stageId}`);
}
export async function getEnrollments(competitionId) {
    const { data } = await apiClient.get(`/competitions/${competitionId}/enrollments`);
    return data;
}
export async function enroll(competitionId, payload) {
    const { data } = await apiClient.post(`/competitions/${competitionId}/enroll`, payload);
    return data;
}
export async function getResults(competitionId) {
    const { data } = await apiClient.get(`/competitions/${competitionId}/results`);
    return data;
}
export async function saveResult(payload) {
    const { data } = await apiClient.post('/competitions/results', payload);
    return data;
}
