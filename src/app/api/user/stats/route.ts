import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { connectToDatabase } from '@/lib/mongodb';
import { UserActivity } from '@/models/UserActivity';
import { authOptions } from '@/lib/auth';

export async function GET() {
  try {
    console.log('[API] /api/user/stats - Start');
    const session = await getServerSession(authOptions);
    if (!session) {
      console.log('[API] No session found');
      return NextResponse.json({ error: 'Unauthorized: No session' }, { status: 401 });
    }
    if (!session.user || !session.user.id) {
      console.log('[API] No user or user.id in session', session.user);
      return NextResponse.json({ error: 'Unauthorized: No user id' }, { status: 401 });
    }

    await connectToDatabase();
    console.log('[API] Connected to database');

    // Get recent activities
    const recentActivity = await UserActivity.find({ userId: session.user.id })
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();
    console.log('[API] Recent activity:', recentActivity.length);

    // Calculate stats
    const [stats] = await UserActivity.aggregate([
      { $match: { userId: session.user.id } },
      {
        $group: {
          _id: null,
          totalInterviews: {
            $sum: { $cond: [{ $eq: ['$type', 'ai_interview'] }, 1, 0] }
          },
          totalPracticeSessions: {
            $sum: { $cond: [{ $eq: ['$type', 'practice_session'] }, 1, 0] }
          },
          totalCodingChallenges: {
            $sum: { $cond: [{ $eq: ['$type', 'coding_challenge'] }, 1, 0] }
          },
          totalMessages: {
            $sum: { $cond: [{ $eq: ['$type', 'ai_interview'] }, '$messageCount', 0] }
          },
          totalTimeSpent: { $sum: '$duration' },
          averageScore: { $avg: '$score' }
        }
      }
    ]);
    console.log('[API] Stats:', stats);

    // Calculate current streak
    const lastWeek = new Date();
    lastWeek.setDate(lastWeek.getDate() - 7);
    const activityDates = await UserActivity.distinct('createdAt', {
      userId: session.user.id,
      createdAt: { $gte: lastWeek }
    });
    const currentStreak = activityDates.length;
    console.log('[API] Current streak:', currentStreak);

    return NextResponse.json({
      stats: {
        totalInterviews: stats?.totalInterviews || 0,
        totalPracticeSessions: stats?.totalPracticeSessions || 0,
        totalCodingChallenges: stats?.totalCodingChallenges || 0,
        totalMessages: stats?.totalMessages || 0,
        totalTimeSpent: stats?.totalTimeSpent || 0,
        averageScore: stats?.averageScore || 0,
        currentStreak
      },
      recentActivity
    });
  } catch (error) {
    console.error('[API] Error fetching user stats:', error);
    let details = '';
    if (error instanceof Error) {
      details = error.message;
    } else {
      details = String(error);
    }
    return NextResponse.json(
      { error: 'Internal server error', details },
      { status: 500 }
    );
  }
} 