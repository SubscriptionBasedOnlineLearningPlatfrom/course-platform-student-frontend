# 🎓 ProLearnX Student Frontend

Student-facing web application for the ProLearnX online learning platform. Browse courses, enroll, track progress, take quizzes, and generate certificates.

## 🚀 Tech Stack

- **Framework**: React 19 + Vite 7
- **Routing**: React Router DOM v7
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI, Lucide Icons
- **HTTP Client**: Axios
- **PDF Generation**: jsPDF
- **Notifications**: React Toastify, Sonner
- **Testing**: Jest

## ✨ Key Features

- 🔐 User authentication (Register/Login)
- 📚 Browse and search courses
- 📊 Personal learning dashboard
- 📈 Progress tracking
- 🎯 Interactive quizzes
- 📄 Certificate generation (PDF)
- 💳 Stripe payment integration
- 💬 Course comments and ratings
- 👤 User profile management

## 📋 Prerequisites

- Node.js (v16+)
- Backend server running on `http://localhost:4000`

## 🛠️ Installation

```bash
# Navigate to directory
cd course-platform-student-frontend

# Install dependencies
npm install

# Create .env file
echo "VITE_BACKEND_URL=http://localhost:4000" > .env

# Start development server
npm run dev
```

App runs on `http://localhost:5173`

## 📜 Available Scripts

```bash
npm run dev      # Start dev server
npm run build    # Build for production
npm test         # Run tests
npm run lint     # Lint code
```

## 🎨 Main Routes

- `/` - Home page
- `/auth` - Login/Register
- `/dashboard` - Student dashboard
- `/courses` - Browse courses
- `/courses/:id/content` - Course content
- `/certificate/:id` - Generate certificate
- `/subscription/:id` - Payment checkout

## 🔌 API Integration

Uses Axios with Context API for state management:
- `ApiContext` - API calls and authentication
- `CourseContext` - Course state management

## 🎓 Certificate Feature

Auto-generates professional PDF certificates with:
- Company branding
- Student name (user input)
- Course title (auto-fetched)
- Issue date
- Digital signature

## 🐛 Troubleshooting

**Backend connection issues:**
```bash
# Check backend is running
cd ../course-platform-backend && npm start

# Verify .env has correct VITE_BACKEND_URL
```

**CORS errors:**
- Ensure backend allows `http://localhost:5173` in CORS config

## 📝 License

MIT

## 📞 Support

Email: parkkavisivakaran72@gmail.com

---

**ProLearnX - Learn Smart. Grow Fast** ❤️
```
