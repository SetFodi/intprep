import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { getServerSession } from 'next-auth';
import { connectToDatabase } from '@/lib/mongodb';
import { authOptions } from '@/lib/auth';

// Simple in-memory storage for demo (in production, use database)
const dailyUsage = new Map<string, { date: string; count: number }>();

const DAILY_LIMIT = 10; // Free tier limit for AI interviews per day

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const today = new Date().toDateString();
    const userUsage = dailyUsage.get(session.user.id);
    
    const usageCount = userUsage?.date === today ? userUsage.count : 0;
    const remainingUses = Math.max(0, DAILY_LIMIT - usageCount);

    return NextResponse.json({
      dailyLimit: DAILY_LIMIT,
      usedToday: usageCount,
      remainingToday: remainingUses,
      canUseAI: remainingUses > 0,
      daily_interviews: usageCount, // For backward compatibility
      last_interview_date: userUsage?.date === today ? today : null
    });
  } catch (error) {
    console.error('Error fetching usage:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const today = new Date().toDateString();
    const userUsage = dailyUsage.get(session.user.id);
    
    const currentCount = userUsage?.date === today ? userUsage.count : 0;
    
    if (currentCount >= DAILY_LIMIT) {
      return NextResponse.json({ 
        error: 'Daily AI interview limit reached',
        remainingUses: 0,
        canUseAI: false
      }, { status: 429 });
    }

    // Increment usage
    dailyUsage.set(session.user.id, {
      date: today,
      count: currentCount + 1
    });

    const remainingUses = Math.max(0, DAILY_LIMIT - (currentCount + 1));

    return NextResponse.json({
      success: true,
      usedToday: currentCount + 1,
      remainingToday: remainingUses,
      canUseAI: remainingUses > 0
    });
  } catch (error) {
    console.error('Error updating usage:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 