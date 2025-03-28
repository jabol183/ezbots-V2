# Setup Guide for EzAIBotz

This guide will help you set up your development environment and database for the EzAIBotz application.

## Prerequisites

- Node.js 18+ and npm
- Supabase account (for authentication and database)
- DeepSeek AI API key (optional)

## Steps to Set Up

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/ezbots-V2.git
cd ezbots-V2
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

You already have a `.env.local` file with the following content:

```
NEXT_PUBLIC_SUPABASE_URL=https://mdovvsmmpivfcccbpjdd.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1kb3Z2c21tcGl2ZmNjY2JwamRkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMxODgyMDgsImV4cCI6MjA1ODc2NDIwOH0.1IJyYeYfDl8XklITm_pJW1Sqrx6e8A96tmYwP_XaUes
NEXT_PUBLIC_APP_URL=http://localhost:3000
DEEPSEEK_API_KEY=sk-bd9ddcc3023d4a8584c50d1b5249ed07
```

### 4. Set Up Supabase Database

1. Log in to your Supabase account at https://app.supabase.com/
2. Access your project (the one with the URL: `mdovvsmmpivfcccbpjdd`)
3. Navigate to "SQL Editor" in the left sidebar
4. Copy the contents of `supabase/schema.sql` from this repository
5. Paste it into the SQL Editor and click "Run"
6. The database tables and policies will be created automatically

### 5. Seed the Database with Test Data

```bash
npm run seed
```

This will:
- Create a test user (or use an existing one) with the credentials:
  - Email: test@example.com
  - Password: password123
- Create sample chatbots
- Create sample messages
- Create sample analytics data

### 6. Start the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

### 7. Log In

Use the test credentials to log in:
- Email: test@example.com
- Password: password123

## Troubleshooting

### Tables Already Exist

If you encounter errors about tables already existing when running the schema SQL:

1. Go to the "Table Editor" in Supabase
2. Delete the existing tables (if possible)
3. Run the schema SQL again

### Authentication Issues

If you're having trouble logging in:

1. Go to "Authentication" > "Users" in Supabase
2. Check if the test user exists
3. You can create a new user or reset the password if needed

### API Route Errors

If you encounter errors with API routes:

1. Make sure your Supabase credentials are correct
2. Check that the tables exist with the correct structure
3. Verify that Row Level Security policies are set up correctly

## Next Steps

After setting up, you can:

1. Create new chatbots in the dashboard
2. Customize their appearance and behavior
3. View analytics data for your chatbots
4. Get the embed code to add a chatbot to your website

For deployment instructions, see [DEPLOY-INSTRUCTIONS.md](DEPLOY-INSTRUCTIONS.md). 