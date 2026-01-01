# AEGIS INCIDENTS

AI-Powered Incident Postmortem & Incident Intelligence Platform

> Generate professional incident postmortems in 10 minutes, not 10 hours.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- Supabase account
- OpenAI API key

### Setup

1. **Clone and install dependencies**
   ```bash
   cd aegis-incidents
   npm install
   ```

2. **Configure environment variables**
   
   Create a `.env.local` file:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   OPENAI_API_KEY=your_openai_api_key
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

3. **Set up Supabase database**
   
   Run the SQL in `supabase/schema.sql` in your Supabase SQL Editor.

4. **Start development server**
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000)

## ✨ Features

- **5-Step Incident Wizard** - Guided flow to capture incident details
- **AI-Powered Generation** - Creates professional postmortems using OpenAI
- **Timeline Builder** - Easy-to-use timeline creation with drag support
- **Action Items** - AI-generated specific, actionable improvements
- **Export Options** - Download as Markdown, copy to clipboard
- **Public Sharing** - Generate shareable links for stakeholders
- **Magic Link Auth** - Passwordless authentication via Supabase

## 📁 Project Structure

```
src/
├── app/
│   ├── (marketing)/      # Landing page
│   ├── dashboard/        # Protected dashboard
│   ├── login/            # Auth pages
│   ├── settings/         # User settings
│   ├── public/           # Public shared incidents
│   └── api/              # API routes
├── components/
│   ├── ui/               # Shadcn components
│   ├── layout/           # Layout components
│   ├── wizard/           # Incident wizard steps
│   └── postmortem/       # Report components
├── lib/                  # Utilities
├── stores/               # Zustand stores
└── types/                # TypeScript types
```

## 🎨 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Shadcn/UI
- **Animation**: Framer Motion
- **State**: Zustand
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth (Magic Link)
- **AI**: OpenAI API

## 💰 Pricing

| Plan | Price | Features |
|------|-------|----------|
| Free Trial | $0 | 1 demo incident |
| Pay Per Incident | $49/incident | Full features |
| Unlimited | $199/month | Unlimited incidents |

## 📄 License

MIT License - see LICENSE file for details.

---

Built with ❤️ using AEGIS INCIDENTS
