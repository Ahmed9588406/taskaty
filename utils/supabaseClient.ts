import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY as string;

function createClerkSupabaseClient() {
    return createClient(supabaseUrl, supabaseAnonKey, {
        global: {
            fetch: async (url, options = {}) => {
                // Use the extended `Clerk` property safely
                const clerkToken = await window.Clerk?.session?.getToken({
                    template: 'supabase',
                });

                const headers = new Headers(options?.headers);
                if (clerkToken) {
                    headers.set('Authorization', `Bearer ${clerkToken}`);
                }

                return fetch(url, {
                    ...options,
                    headers,
                });
            },
        },
    });
}

export const client = createClerkSupabaseClient();
