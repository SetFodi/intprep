import mongoose from 'mongoose';
import User from '../models/User';

const MONGODB_URI = 'mongodb+srv://lukapartenadze:kakilo123@social.kqukv9l.mongodb.net/interviewprep?retryWrites=true&w=majority&appName=social';

async function createTestUser() {
  try {
    console.log('Connecting to database...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected successfully');
    
    const testUser = {
      email: 'test@example.com',
      password: 'password123',
      name: 'Test User'
    };

    console.log('Checking for existing user...');
    const existingUser = await User.findOne({ email: testUser.email });
    if (existingUser) {
      console.log('Test user already exists:', existingUser.email);
      return;
    }

    console.log('Creating new test user...');
    const user = await User.create(testUser);
    console.log('Test user created successfully:', user.email);
  } catch (error) {
    console.error('Error creating test user:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Database connection closed');
    process.exit(0);
  }
}

createTestUser().catch(console.error); 