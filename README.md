# 🚀 InterviewAI - AI-Powered Interview Preparation Platform

<div align="center">

![InterviewAI Logo](https://img.shields.io/badge/InterviewAI-AI%20Powered-blue?style=for-the-badge&logo=brain&logoColor=white)

**Master Your Next Interview with Advanced AI Technology**

[![Next.js](https://img.shields.io/badge/Next.js-15.3.3-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green?style=flat-square&logo=mongodb)](https://www.mongodb.com/)
[![NextAuth.js](https://img.shields.io/badge/NextAuth.js-Authentication-purple?style=flat-square&logo=auth0)](https://next-auth.js.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)

[🌟 Live Demo](http://localhost:3000) • [📖 Documentation](#features) • [🚀 Quick Start](#quick-start) • [🤝 Contributing](#contributing)

</div>

---

## ✨ Features

### 🤖 **AI-Powered Mock Interviews**
- **Intelligent Conversation**: Advanced AI interviewer that adapts to your responses
- **Real-time Feedback**: Instant analysis and improvement suggestions
- **Persistent Sessions**: Continue interviews exactly where you left off
- **Usage Tracking**: Monitor your daily interview practice with smart limits

### 💻 **Interactive Coding Challenges**
- **6 Curated Problems**: From easy to medium difficulty levels
- **Real-time Code Execution**: Test your solutions instantly
- **Intuitive Solutions**: Simple, practical approaches over complex algorithms
- **Progress Tracking**: Submit challenges and track your coding journey

### 📊 **Comprehensive Dashboard**
- **Activity Analytics**: Track interviews, coding challenges, and messages sent
- **Progress Visualization**: See your improvement over time
- **Streak Tracking**: Maintain your practice consistency
- **Performance Metrics**: Average scores and time spent practicing

### 🎨 **Modern User Experience**
- **Dark/Light Theme**: Seamless theme switching with persistent preferences
- **Responsive Design**: Perfect experience across all devices
- **Clean Interface**: Minimalistic, professional design
- **Smooth Animations**: Polished interactions and transitions

---

## 🛠️ Tech Stack

<table>
<tr>
<td align="center"><strong>Frontend</strong></td>
<td align="center"><strong>Backend</strong></td>
<td align="center"><strong>Database</strong></td>
<td align="center"><strong>Authentication</strong></td>
</tr>
<tr>
<td align="center">
<img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" alt="Next.js"/><br/>
<img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript"/><br/>
<img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind"/>
</td>
<td align="center">
<img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js"/><br/>
<img src="https://img.shields.io/badge/API_Routes-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" alt="API Routes"/><br/>
<img src="https://img.shields.io/badge/Monaco_Editor-007ACC?style=for-the-badge&logo=visual-studio-code&logoColor=white" alt="Monaco"/>
</td>
<td align="center">
<img src="https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB"/><br/>
<img src="https://img.shields.io/badge/Mongoose-880000?style=for-the-badge&logo=mongoose&logoColor=white" alt="Mongoose"/>
</td>
<td align="center">
<img src="https://img.shields.io/badge/NextAuth.js-000000?style=for-the-badge&logo=auth0&logoColor=white" alt="NextAuth"/><br/>
<img src="https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=JSON%20web%20tokens&logoColor=white" alt="JWT"/>
</td>
</tr>
</table>

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18.0 or higher
- **npm** or **yarn**
- **MongoDB Atlas** account (or local MongoDB)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/interviewai.git
   cd interviewai
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Environment Setup**
   
   Create a `.env.local` file in the root directory:
   ```env
   # Database
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/interviewprep
   
   # NextAuth.js
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-secret-key-here
   
   # AI Service (Optional - for enhanced AI responses)
   OPENAI_API_KEY=your-openai-api-key
   ```

4. **Database Setup**
   ```bash
   # Seed the database with sample challenges
   npm run seed
   ```

5. **Start Development Server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

---

## 📱 Screenshots

<div align="center">

### 🏠 **Dashboard Overview**
![Dashboard](https://via.placeholder.com/800x400/1e293b/ffffff?text=Dashboard+Screenshot)

### 🤖 **AI Interview Session**
![AI Interview](https://via.placeholder.com/800x400/3b82f6/ffffff?text=AI+Interview+Screenshot)

### 💻 **Coding Challenge**
![Coding Challenge](https://via.placeholder.com/800x400/059669/ffffff?text=Coding+Challenge+Screenshot)

</div>

---

## 🎯 Usage Guide

### **Starting an AI Interview**

1. Navigate to the **AI Interview** section
2. Click **"Start Interview"** 
3. Answer the AI's questions naturally
4. Receive real-time feedback and follow-up questions
5. Use **"End Interview"** when finished

### **Solving Coding Challenges**

1. Go to **Coding Practice**
2. Select a challenge from the sidebar
3. Write your solution in the Monaco editor
4. Click **"Run Code"** to test against test cases
5. Click **"Submit Challenge"** when all tests pass

### **Tracking Progress**

- View your **Dashboard** for comprehensive analytics
- Monitor daily interview usage and coding progress
- Track your improvement streaks and average scores

---

## 🏗️ Project Structure

```
interviewai/
├── 📁 src/
│   ├── 📁 app/                    # Next.js 13+ App Router
│   │   ├── 📁 api/               # API Routes
│   │   │   ├── 📁 auth/          # Authentication endpoints
│   │   │   ├── 📁 user/          # User data & statistics
│   │   │   └── 📁 seed/          # Database seeding
│   │   ├── 📁 auth/              # Authentication pages
│   │   ├── 📁 ai-interview/      # AI interview interface
│   │   ├── 📁 coding/            # Coding challenges
│   │   ├── 📁 dashboard/         # User dashboard
│   │   └── 📄 layout.tsx         # Root layout
│   ├── 📁 components/            # Reusable UI components
│   │   ├── 📄 Navigation.tsx     # Sidebar navigation
│   │   └── 📄 ThemeToggle.tsx    # Dark/light theme switch
│   ├── 📁 lib/                   # Utility libraries
│   │   ├── 📄 mongodb.ts         # Database connection
│   │   └── 📄 auth.ts            # NextAuth configuration
│   ├── 📁 models/                # MongoDB schemas
│   │   ├── 📄 User.ts            # User model
│   │   ├── 📄 UserActivity.ts    # Activity tracking
│   │   └── 📄 CodingChallenge.ts # Challenge model
│   ├── 📁 utils/                 # Helper functions
│   │   ├── 📄 codeExecution.ts   # Code runner & challenges
│   │   └── 📄 aiResponses.ts     # AI response generation
│   └── 📁 types/                 # TypeScript definitions
├── 📄 tailwind.config.js         # Tailwind CSS configuration
├── 📄 next.config.js             # Next.js configuration
└── 📄 package.json               # Dependencies & scripts
```

---

## 🔧 Configuration

### **Environment Variables**

| Variable | Description | Required |
|----------|-------------|----------|
| `MONGODB_URI` | MongoDB connection string | ✅ |
| `NEXTAUTH_URL` | Application URL | ✅ |
| `NEXTAUTH_SECRET` | NextAuth.js secret key | ✅ |
| `OPENAI_API_KEY` | OpenAI API key (optional) | ❌ |

### **Database Models**

- **User**: Authentication and profile data
- **UserActivity**: Interview and coding session tracking
- **CodingChallenge**: Programming problems and solutions

---

## 🚀 Deployment

### **Vercel (Recommended)**

1. Push your code to GitHub
2. Connect your repository to [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy automatically on every push

### **Other Platforms**

The application can be deployed on any platform supporting Node.js:
- **Netlify**
- **Railway**
- **Heroku**
- **DigitalOcean App Platform**

---

## 🤝 Contributing

We welcome contributions! Here's how you can help:

### **Getting Started**

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### **Development Guidelines**

- Follow **TypeScript** best practices
- Use **Tailwind CSS** for styling
- Write **meaningful commit messages**
- Test your changes thoroughly
- Update documentation as needed

### **Areas for Contribution**

- 🧠 **AI Improvements**: Enhanced interview algorithms
- 💻 **New Challenges**: Additional coding problems
- 🎨 **UI/UX**: Design improvements and animations
- 📊 **Analytics**: Advanced progress tracking
- 🔧 **Performance**: Optimization and caching

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Next.js Team** for the amazing framework
- **Tailwind CSS** for the utility-first CSS framework
- **MongoDB** for the flexible database solution
- **NextAuth.js** for seamless authentication
- **Monaco Editor** for the code editing experience

---

<div align="center">

### 🌟 **Star this repository if you found it helpful!**

**Built with ❤️ by [Your Name](https://github.com/yourusername)**

[⬆ Back to Top](#-interviewai---ai-powered-interview-preparation-platform)

</div>
