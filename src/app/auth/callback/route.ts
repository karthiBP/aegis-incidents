import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
    const requestUrl = new URL(request.url);
    const code = requestUrl.searchParams.get('code');
    const token_hash = requestUrl.searchParams.get('token_hash');
    const type = requestUrl.searchParams.get('type');
    const next = requestUrl.searchParams.get('next') || '/dashboard';
    const origin = requestUrl.origin;

    // Also check for token in hash fragment (some email clients redirect differently)
    const supabase = await createClient();

    // Method 1: Handle PKCE code exchange (standard OAuth flow)
    if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (!error) {
            console.log('Successfully exchanged code for session');
            return NextResponse.redirect(`${origin}${next}`);
        }
        console.error('Code exchange error:', error);
    }

    // Method 2: Handle token hash (for email OTP/magic link)
    if (token_hash && type) {
        const { error } = await supabase.auth.verifyOtp({
            token_hash,
            type: type as 'email' | 'signup' | 'magiclink' | 'recovery',
        });
        if (!error) {
            console.log('Successfully verified OTP');
            return NextResponse.redirect(`${origin}${next}`);
        }
        console.error('Token verification error:', error);
    }

    // Method 3: Check if user is already authenticated (session cookie exists)
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
        console.log('User already authenticated, redirecting');
        return NextResponse.redirect(`${origin}${next}`);
    }

    // Redirect to login with error if all methods fail
    return NextResponse.redirect(`${origin}/login?error=auth_failed`);
}
