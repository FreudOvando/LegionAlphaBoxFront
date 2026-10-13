import { z } from 'zod';
export const competitionSchema = z.object({
    name: z.string().min(1, 'El nombre es obligatorio').max(150, 'Máximo 150 caracteres'),
    competitionDate: z.string().min(1, 'La fecha es obligatoria'),
    type: z.enum(['INDIVIDUAL', 'TEAM']),
});
