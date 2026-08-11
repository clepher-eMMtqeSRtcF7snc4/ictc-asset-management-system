import { z } from 'zod';

export const locationStatusSchema = z.enum(['active', 'inactive']);

const locationFieldsSchema = z.object({
  name: z.string().trim().min(1, 'This field is required').max(150),
  code: z
    .string()
    .trim()
    .min(1, 'This field is required')
    .max(50)
    .regex(/^[A-Za-z0-9_-]+$/, 'Use only letters, numbers, hyphens, or underscores'),
  type: z.string().trim().min(1, 'This field is required').max(100),
});

export const locationSchema = locationFieldsSchema.extend({
  id: z.number().int().positive(),
  status: locationStatusSchema,
});

export const locationListInputSchema = z
  .object({
    search: z.string().trim().min(1).max(100).optional(),
    status: locationStatusSchema.optional(),
    type: z.string().trim().min(1).max(100).optional(),
  })
  .default({});

export const locationListOutputSchema = z.array(locationSchema);

export const createLocationInputSchema = locationFieldsSchema;

export const updateLocationInputSchema = locationFieldsSchema
  .partial()
  .extend({
    id: z.number().int().positive(),
  })
  .refine(
    ({ name, code, type }) =>
      name !== undefined || code !== undefined || type !== undefined,
    { message: 'Provide at least one field to update' },
  );

export const setLocationStatusInputSchema = z.object({
  id: z.number().int().positive(),
  status: locationStatusSchema,
});

export type Location = z.infer<typeof locationSchema>;
export type LocationListInput = z.infer<typeof locationListInputSchema>;
export type LocationListOutput = z.infer<typeof locationListOutputSchema>;
export type CreateLocationInput = z.infer<typeof createLocationInputSchema>;
export type UpdateLocationInput = z.infer<typeof updateLocationInputSchema>;
export type SetLocationStatusInput = z.infer<
  typeof setLocationStatusInputSchema
>;
