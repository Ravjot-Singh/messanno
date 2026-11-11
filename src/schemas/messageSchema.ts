import { z } from "zod";

export const MESSAGE_MIN_LENGTH = 10;
export const MESSAGE_MAX_LENGTH = 500;

export const messageSchema = z.object({
    content: z
        .string()
        .trim()
        .min(MESSAGE_MIN_LENGTH, { error: `Content must be at least ${MESSAGE_MIN_LENGTH} characters long` })
        .max(MESSAGE_MAX_LENGTH, { error: `Content must be less than ${MESSAGE_MAX_LENGTH} characters long` }),
});


export const messagechema = messageSchema;
