import { apiClient } from './client';
export async function updateProfilePhoto(photoUrl) {
    await apiClient.patch('/users/me/photo', { photoUrl });
}
export async function getUsers() {
    const { data } = await apiClient.get('/users');
    return data;
}
export async function updateProfileNotes(notes) {
    await apiClient.patch('/users/me/notes', { notes });
}
export async function getMe() {
    const { data } = await apiClient.get('/users/me');
    return data;
}
export async function updateUserFee(id, monthlyFee) {
    const { data } = await apiClient.patch(`/users/${id}/fee`, { monthlyFee });
    return data;
}
