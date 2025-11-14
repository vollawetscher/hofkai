# HofKAI - Legal Consultation Platform

A modern legal consultation platform powered by AI, featuring intelligent chat assistance, document management, and ELO integration for legal professionals.

## 🚀 Features

- **AI-Powered Legal Chat**: Intelligent consultation assistance using advanced AI models
- **Document Management**: Secure upload, storage, and analysis of legal documents
- **ELO Integration**: Seamless integration with existing legal systems
- **Modern UI/UX**: Beautiful, responsive interface built with Next.js and Tailwind CSS
- **Real-time Collaboration**: Multi-user support with real-time updates
- **Secure Authentication**: Robust user management with Supabase Auth

## 🛠 Tech Stack

- **Frontend**: Next.js 16.0.0, React 19.2.0, TypeScript
- **Styling**: Tailwind CSS 4.1.9, Radix UI Components
- **Backend**: Supabase (Database, Auth, Storage)
- **AI Integration**: Groq AI SDK
- **State Management**: React Hook Form, Zustand
- **Charts & Analytics**: Recharts
- **Development**: ESLint, TypeScript, PostCSS

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18.0.0 or higher)
- **npm** or **yarn** package manager
- **Git** for version control
- **Supabase Account** for backend services

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd hofkai
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Environment Setup

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

**To get your Supabase credentials:**

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Create a new project or select existing one
3. Navigate to Settings → API
4. Copy the Project URL and anon/public key

### 4. Database Setup

The project uses Supabase for database management. Database migrations and schema will be handled automatically.

### 5. Start Development Server

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## 📁 Project Structure

```
hofkai/
├── app/                    # Next.js App Router
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # Reusable UI components
│   └── ui/               # Shadcn/ui components
├── lib/                  # Utility functions and configurations
│   ├── supabase/         # Supabase client configurations
│   └── utils.ts          # General utilities
├── public/               # Static assets
├── .env.local           # Environment variables (create this)
├── next.config.mjs      # Next.js configuration
├── tailwind.config.ts   # Tailwind CSS configuration
└── package.json         # Dependencies and scripts
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 🎨 UI Components

The project uses a comprehensive set of UI components built on top of Radix UI:

- **Navigation**: Menus, breadcrumbs, tabs
- **Forms**: Inputs, selects, checkboxes, radio buttons
- **Feedback**: Alerts, toasts, progress indicators
- **Overlays**: Modals, popovers, tooltips
- **Data Display**: Tables, cards, avatars

## 🔐 Authentication

Authentication is handled by Supabase Auth with support for:

- Email/password authentication
- Session management
- Protected routes
- User profiles

## 📊 Database Schema

The application uses PostgreSQL through Supabase with the following main entities:

- **Users**: User profiles and authentication
- **Documents**: Legal document storage and metadata
- **Consultations**: AI chat sessions and history
- **Cases**: Legal case management

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically on push

### Manual Deployment

```bash
npm run build
npm run start
```

## 🔒 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key | Yes |

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 Development Guidelines

- Follow TypeScript best practices
- Use ESLint configuration provided
- Implement responsive design principles
- Write meaningful commit messages
- Test thoroughly before submitting PRs

## 🐛 Troubleshooting

### Common Issues

**1. Supabase Connection Issues**
- Verify environment variables are correctly set
- Check Supabase project status
- Ensure API keys are valid

**2. Build Errors**
- Clear `.next` folder and rebuild
- Check for TypeScript errors
- Verify all dependencies are installed

**3. Styling Issues**
- Ensure Tailwind CSS is properly configured
- Check for conflicting CSS classes
- Verify PostCSS configuration

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:

- Create an issue in the repository
- Check existing documentation
- Review troubleshooting section

## 🔄 Version History

- **v0.1.0** - Initial project setup with Next.js 16 and React 19
- Modern UI components with Radix UI
- Supabase integration for backend services
- AI chat functionality foundation

---

**Built with ❤️ for the legal community**
