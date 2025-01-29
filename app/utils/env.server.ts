import { z } from 'zod'

const schema = z.object({
    NODE_ENV: z.enum(['production', 'development', 'test'] as const),
    SESSION_SECRET: z.string(),
    FIREBASE_PROJECT_ID: z.string(),
    FIREBASE_CLIENT_EMAIL: z.string(),
    FIREBASE_PRIVATE_KEY: z.string(),
})

declare global {
    namespace NodeJS {
        interface ProcessEnv extends z.infer<typeof schema> { }
    }
}

export function init() {
    const parsed = schema.safeParse(process.env)

    if (parsed.success === false) {
        console.error(
            '❌ Invalid environment variables:',
            parsed.error.flatten().fieldErrors,
        )
        throw new Error('Invalid environment variables')
    }
}

/**
 * Only include env vars that should be exposed to the client
 */
export function getEnv() {
    return {
        MODE: process.env.NODE_ENV,
        ALLOW_INDEXING: process.env.ALLOW_INDEXING,
    }
}

type ENV = ReturnType<typeof getEnv>

declare global {
    var ENV: ENV
    interface Window {
        ENV: ENV
    }
}