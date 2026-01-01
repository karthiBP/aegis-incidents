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

        // TODO: Get user session and verify ownership
        // TODO: Update incident status to FINAL in database

        // For now, return mock success
        const finalizedIncident = {
            id: incidentId,
            status: 'FINAL',
            finalized_at: new Date().toISOString(),
        };

        return NextResponse.json({
            success: true,
            data: finalizedIncident,
        });

    } catch (error) {
        console.error('Error finalizing incident:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to finalize incident' },
            { status: 500 }
        );
    }
}
