import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { connectToDatabase } from '@/lib/mongodb';
import { UserActivity } from '@/models/UserActivity';
import { authOptions } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();

    // Get recent activities
    const recentActivity = await UserActivity.find({ userId: session.user.id })
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

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
          totalTimeSpent: { $sum: '$duration' },
          averageScore: { $avg: '$score' }
        }
      }
    ]);

    // Calculate current streak
    const lastWeek = new Date();
    lastWeek.setDate(lastWeek.getDate() - 7);
    
    const activityDates = await UserActivity.distinct('createdAt', {
      userId: session.user.id,
      createdAt: { $gte: lastWeek }
    });

    const currentStreak = activityDates.length;

    return NextResponse.json({
      stats: {
        totalInterviews: stats?.totalInterviews || 0,
        totalPracticeSessions: stats?.totalPracticeSessions || 0,
        totalTimeSpent: stats?.totalTimeSpent || 0,
        averageScore: stats?.averageScore || 0,
        currentStreak
      },
      recentActivity
    });
  } catch (error) {
    console.error('Error fetching user stats:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 