import { apiClient } from './client'
import type { User } from '@/types/user'

export async function updateProfilePhoto(photoUrl: string | null): Promise<void> {
  await apiClient.patch('/users/me/photo', { photoUrl })
}

export async function getUsers(): Promise<User[]> {
  const { data } = await apiClient.get<User[]>('/users')
  return data
}

export async function updateProfileNotes(notes: string | null): Promise<void> {
  await apiClient.patch('/users/me/notes', { notes })
}

export async function getMe(): Promise<User> {
  const { data } = await apiClient.get<User>('/users/me')
  return data
}

export async function updateUserFee(id: number, monthlyFee: number): Promise<User> {
  const { data } = await apiClient.patch<User>(`/users/${id}/fee`, { monthlyFee })
  return data
}