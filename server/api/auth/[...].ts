import GithubProvider from 'next-auth/providers/github'
import {NuxtAuthHandler} from '#auth'
import {alreadyRegistered, createGitHubUser} from "~/server/actions/user.action";

export default NuxtAuthHandler({
    secret: process.env.AUTH_SECRET || 'my-auth-secret',
    providers: [
        // .default exists on the SSR side.
        (GithubProvider as any).default({
            clientId: process.env.GITHUB_CLIENT_ID || 'enter-your-client-id-here',
            clientSecret: process.env.GITHUB_CLIENT_SECRET || 'enter-your-client-secret-here',
            profile(profile: { id: any; email: any; avatar_url: any; login: any; name: any; }) {
                return {
                    id: profile.id,
                    email: profile.email,
                    image: profile.avatar_url,
                    username: profile.login,
                    name: profile.name || profile.login // Use login as fallback for name
                }
            }
        }),
    ],
    callbacks: {
        async signIn({user}) {
            const allowedUsers = useAppConfig().app?.allowedUsers || [];

            const userEmail = user?.email || '';

            if (await alreadyRegistered(userEmail)) {
                return true;
            } else {
                if (!allowedUsers.includes(userEmail)) {
                    return false;
                }

                await createGitHubUser(user as any);
                return true;
            }
        }
    }
})