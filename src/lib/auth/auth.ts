import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "../db";
import * as schema from "../db/schema";
import { headers } from "next/headers";

export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "sqlite",
        schema: {
            user: schema.user,
            session: schema.session,
            account: schema.account,
            verification: schema.verification
        }
    }),
    secret: process.env.BETTER_AUTH_SECRET,
    session: {
        expiresIn: 60 * 60 * 24 * 30, // 30 days
        updateAge: 60 * 60 * 24, // 1 day
        cookieCache: {
            enabled: true,
            maxAge: 5 * 60 // 5 minutes
        }
    },
    socialProviders: {
        discord: {
            clientId: process.env.DISCORD_CLIENT_ID!,
            clientSecret: process.env.DISCORD_CLIENT_SECRET!,
        },
    },
});

export async function checkIsAdmin() {
    const session = await auth.api.getSession({
        headers: await headers()
    });
    if (!session) return false;

    const superUserId = process.env.SUPER_USER_ID;
    const siteOwnerId = process.env.SITE_OWNER_ID;

    const account = await db.query.account.findFirst({
        where: (acc, { eq, and }) => and(eq(acc.userId, session.user.id), eq(acc.providerId, "discord"))
    });

    return account && (account.accountId === superUserId || account.accountId === siteOwnerId);
}
