# 🧠 InterviewPrep - AI-Powered Interview Practice App

A full-stack web application designed to help developers and job seekers prepare for technical interviews. Practice coding challenges, behavioral interview questions, and get AI-powered feedback to simulate a real interview experience.

## ✨ Features

### 🔧 Coding Challenge Module
- Interactive code editor using Monaco Editor
- Real interview-style coding problems
- Instant feedback and test case validation
- Timer functionality to simulate interview pressure
- Multiple difficulty levels (Easy, Medium, Hard)
- Categories: Arrays, Strings, Dynamic Programming, etc.

### 👥 Behavioral Interview Practice
- Curated behavioral interview questions
- STAR method guidance and tips
- AI-powered response analysis
- Feedback on communication structure and content
- Category-based questions (Leadership, Teamwork, Problem Solving, etc.)

### 📊 Progress Tracking
- Performance analytics and scoring
- Time tracking for each challenge
- Streak tracking and achievement system
- Detailed feedback history

### 🤖 AI-Mimic Feedback Engine
- Intelligent response analysis
- STAR method detection
- Length and structure evaluation
- Personalized improvement suggestions

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: MongoDB with Mongoose
- **Code Editor**: Monaco Editor
- **Icons**: Lucide React
- **Charts**: Recharts
- **Authentication**: NextAuth.js (ready for implementation)
- **Deployment**: Vercel

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd intprep
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.local.example .env.local
   ```

   Update `.env.local` with your MongoDB connection string:
   ```env
   MONGODB_URI=mongodb://localhost:27017/interviewprep
   # or for MongoDB Atlas:
   # MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/interviewprep

   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-secret-key-here
   JWT_SECRET=your-jwt-secret-here
   ```

4. **Start MongoDB** (if using local MongoDB)
   ```bash
   mongod
   ```

5. **Seed the database** (optional)
   ```bash
   npm run dev
   ```
   Then visit: `http://localhost:3000/api/seed` (POST request)

6. **Run the development server**
   ```bash
   npm run dev
   ```

7. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── behavioral/        # Behavioral questions page
│   ├── coding/           # Coding challenges page
│   ├── dashboard/        # User dashboard
│   └── page.tsx          # Landing page
├── components/           # Reusable UI components
├── lib/                 # Database connection and utilities
├── models/              # MongoDB/Mongoose models
├── types/               # TypeScript type definitions
└── utils/               # Utility functions (AI feedback, code execution)
```

## 🎯 Usage

### For Coding Practice
1. Navigate to the Coding section
2. Select a challenge from the sidebar
3. Write your solution in the Monaco editor
4. Click "Run Code" to test against test cases
5. Get instant feedback and scoring

### For Behavioral Practice
1. Go to the Behavioral section
2. Choose a question category
3. Read the question and tips
4. Write your response using the STAR method
5. Submit for AI-powered feedback

### Dashboard
- View your progress and statistics
- Track completed challenges and scores
- Monitor your improvement over time

## 🔧 Customization

### Adding New Coding Challenges
Edit `src/utils/codeExecution.ts` to add new challenges to the `sampleChallenges` array.

### Adding New Behavioral Questions
Use the seed API or directly add to the database via the MongoDB interface.

### Modifying AI Feedback
Customize the feedback logic in `src/utils/aiFeedback.ts`.

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically

### Other Platforms
The app can be deployed on any platform that supports Next.js:
- Netlify
- Railway
- Heroku
- AWS
- Google Cloud Platform

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Monaco Editor for the excellent code editing experience
- Tailwind CSS for the beautiful UI components
- Next.js team for the amazing framework
- MongoDB for the flexible database solution

## 📞 Support

If you have any questions or need help, please open an issue on GitHub or contact the maintainers.

---

**Built with ❤️ to help developers ace their interviews!**
