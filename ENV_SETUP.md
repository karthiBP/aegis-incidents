# Environment Variables Setup

Create a `.env.local` file in the root with these variables:

```
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# OpenAI Configuration  
OPENAI_API_KEY=your_openai_api_key

# App URL (for magic link redirects)
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Getting Your Keys

### Supabase
1. Go to https://supabase.com and create a new project
2. Go to Settings → API
3. Copy the URL and anon/public key

### OpenAI
1. Go to https://platform.openai.com/api-keys
2. Create a new API key
