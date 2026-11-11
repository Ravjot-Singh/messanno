export const authSecret =
    process.env.NEXTAUTH_SECRET ??
    process.env.AUTH_SECRET ??
    process.env.NEXT_AUTH_SECRET
