# Setting Up Supabase for EzAIBotz

This guide will help you set up your Supabase backend for the EzAIBotz application.

## 1. Create a Supabase Project

1. Go to [Supabase](https://supabase.com/) and sign up or log in.
2. Create a new project from the dashboard.
3. Choose a name for your project and set a secure database password.
4. Select the region closest to your users.
5. Wait for your project to be initialized.

## 2. Set Up Database Schema

1. In your Supabase project dashboard, navigate to the "SQL Editor" section.
2. Copy the contents of the `supabase/schema.sql` file from this repository.
3. Paste the SQL into the editor and run the query to create all necessary tables.

Alternatively, you can use the Supabase CLI:

```bash
supabase db push
```

## 3. Configure Authentication

1. Go to the "Authentication" section in your Supabase dashboard.
2. Under "Providers," enable the authentication methods you want (Email, Google, GitHub, etc.).
3. For email authentication, consider enabling "Confirm email" for added security.

## 4. Set Up Environment Variables

1. In your Supabase project, go to "Settings" > "API".
2. Copy the "Project URL" and "anon" key.
3. Create a `.env.local` file in the root of your project with the following content:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_APP_URL=http://localhost:3000
DEEPSEEK_API_KEY=your_deepseek_api_key  # Only needed if using DeepSeek AI
```

## 5. Verify Setup

To verify your Supabase setup is working correctly:

1. Start your development server: `npm run dev`
2. Visit: `http://localhost:3000/api/test-db`
3. You should see a JSON response indicating successful connection to the database.

## Database Schema Explanation

The application uses four main tables:

1. **chatbots**: Stores configuration for each chatbot created by users
2. **messages**: Stores all messages exchanged with chatbots
3. **analytics**: Stores usage and performance data
4. **feedback**: Stores user feedback on chatbot responses

## Common Issues

### Database Connection Problems

If you see errors like "relation 'public.chatbots' does not exist":

1. Verify you've run the schema.sql file correctly
2. Check that your environment variables are set correctly
3. Make sure you're using the correct Supabase URL and anon key

### Authentication Issues

If users can't log in or you see authorization errors:

1. Check if RLS (Row Level Security) policies are configured correctly
2. Verify that auth providers are enabled in Supabase dashboard
3. Make sure cookies are being correctly set and included in requests

## Need Help?

For more assistance, refer to the [Supabase documentation](https://supabase.com/docs) or open an issue in the EzAIBotz repository. 