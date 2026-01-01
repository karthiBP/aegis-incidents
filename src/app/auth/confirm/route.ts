import { type EmailOtpType } from '@supabase/supabase-js';
import { type NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// This route handles email confirmation links from Supabase
// The URL format is: /auth/confirm?token_hash=xxx&type=email
export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const token_hash = searchParams.get('token_hash');
    const type = searchParams.get('type') as EmailOtpType | null;
    const next = searchParams.get('next') ?? '/dashboard';
    const origin = new URL(request.url).origin;

    if (token_hash && type) {
        const supabase = await createClient();

        const { error } = await supabase.auth.verifyOtp({
            type,
            token_hash,
        });

        if (!error) {
            // Successful verification - redirect to dashboard
            return NextResponse.redirect(`${origin}${next}`);
        }

        console.error('Email confirmation error:', error);
    }

    // Return error page
    return NextResponse.redirect(`${origin}/login?error=confirmation_failed`);
}
