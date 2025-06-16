import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(request: Request) {
  console.log('Registration request received');
  
  try {
    const body = await request.json();
    console.log('Request body:', { ...body, password: '[REDACTED]' });

    const { email, password, name } = body;

    if (!email || !password || !name) {
      console.log('Missing fields:', { email: !!email, password: !!password, name: !!name });
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    console.log('Connecting to database...');
    await connectToDatabase();
    console.log('Connected to database');

    // Check if user already exists
    console.log('Checking for existing user...');
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('User already exists:', email);
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 }
      );
    }

    // Create new user
    console.log('Creating new user...');
    const user = await User.create({
      email,
      password,
      name,
    });
    console.log('User created successfully:', { id: user._id, email: user.email });

    return NextResponse.json({
      message: 'User created successfully',
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Error creating user', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 