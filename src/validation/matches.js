import { z } from 'zod';

/**
 * MATCH STATUS CONSTANT
 * Database uses lowercase values
 */
export const MATCH_STATUS = {
    SCHEDULED: 'scheduled',
    LIVE: 'live',
    FINISHED: 'finished',
};

/**
 * Utility: ISO Date String Validator
 */
const isoDateString = z
    .string()
    .refine((val) => {
        const date = new Date(val);
        return !isNaN(date.getTime()) && val === date.toISOString();
    }, {
        message: 'Invalid ISO date string',
    });

/**
 * Query Schema: List Matches
 * Optional limit (coerced) - positive integer max 100
 */
export const listMatchesQuerySchema = z.object({
    limit: z
        .coerce
        .number()
        .int()
        .positive()
        .max(100)
        .optional(),
});

/**
 * Route Param Schema: Match ID
 * Required positive integer (coerced)
 */
export const matchIdParamSchema = z.object({
    id: z
        .coerce
        .number()
        .int()
        .positive(),
});

/**
 * Create Match Schema
 */
export const createMatchSchema = z
    .object({
        sport: z.string().min(1, 'Sport is required'),
        homeTeam: z.string().min(1, 'Home team is required'),
        awayTeam: z.string().min(1, 'Away team is required'),

        startTime: isoDateString,
        endTime: isoDateString,

        homeScore: z
            .coerce
            .number()
            .int()
            .nonnegative()
            .optional(),

        awayScore: z
            .coerce
            .number()
            .int()
            .nonnegative()
            .optional(),
    })
    .superRefine((data, ctx) => {
        const start = new Date(data.startTime);
        const end = new Date(data.endTime);

        if (end <= start) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'endTime must be after startTime',
                path: ['endTime'],
            });
        }
    });

/**
 * Update Score Schema
 * Requires non-negative integers
 */
export const updateScoreSchema = z.object({
    homeScore: z
        .coerce
        .number()
        .int()
        .nonnegative(),

    awayScore: z
        .coerce
        .number()
        .int()
        .nonnegative(),
});