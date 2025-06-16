import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { connectToDatabase } from '@/lib/mongodb';
import { UserActivity } from '@/models/UserActivity';
import { authOptions } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { type, category, sessionId, details, messageCount, score, duration } = body;

    if (!type) {
      return NextResponse.json({ error: 'Activity type is required' }, { status: 400 });
    }

    await connectToDatabase();

    // For AI interviews, we might want to update existing activity for the session
    // rather than create a new one for each message
    if (type === 'ai_interview' && sessionId) {
      const existingActivity = await UserActivity.findOne({
        userId: session.user.id,
        sessionId,
        type: 'ai_interview'
      });

      if (existingActivity) {
        // Update existing activity
        existingActivity.messageCount = messageCount || existingActivity.messageCount;
        existingActivity.details = details || existingActivity.details;
        existingActivity.updatedAt = new Date();
        await existingActivity.save();

        return NextResponse.json({ 
          success: true, 
          activityId: existingActivity._id,
          updated: true 
        });
      }
    }

    // Create new activity
    const activity = new UserActivity({
      userId: session.user.id,
      type,
      category,
      sessionId,
      details,
      messageCount,
      score,
      duration,
    });

    await activity.save();

    return NextResponse.json({ 
      success: true, 
      activityId: activity._id,
      created: true 
    });
  } catch (error) {
    console.error('Error tracking activity:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 