import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { incidentId } = body;

        if (!incidentId) {
            return NextResponse.json(
                { success: false, error: 'Incident ID is required' },
                { status: 400 }
            );
        }

        // TODO: Verify user owns this incident
        // TODO: Update incident status to allow public sharing
        // TODO: Generate share token if needed

        // Generate public share URL
        const shareUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/public/incident/${incidentId}`;

        // TODO: Increment shared_count in database
        // const { error } = await supabase
        //   .from('incidents')
        //   .update({ shared_count: supabase.raw('shared_count + 1') })
        //   .eq('id', incidentId);

        return NextResponse.json({
            success: true,
            data: {
                shareUrl,
                incidentId,
            },
        });

    } catch (error) {
        console.error('Error sharing incident:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to generate share link' },
            { status: 500 }
        );
    }
}
