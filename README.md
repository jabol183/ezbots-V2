# EzAIBotz

A modern AI chatbot platform that allows you to create and deploy custom AI chatbots for your website.

## Features

- Create and manage multiple chatbots
- Customize appearance and behavior
- Analytics dashboard to track usage and performance
- Embed chatbots on any website with multiple options:
  - Floating chat widget
  - Inline iframe embedding
- User authentication with Supabase
- Responsive design

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Supabase (Auth & Database)
- DeepSeek AI (or other AI provider)

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Supabase account (for authentication and database)
- DeepSeek AI API key (optional, if using DeepSeek AI for chat responses)

### Development Setup

1. **Clone the repository**

```bash
git clone https://github.com/yourusername/ezbots-V2.git
cd ezbots-V2
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables**

Create a `.env.local` file in the root directory with the following variables:

```
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Application URL
NEXT_PUBLIC_APP_URL=http://localhost:3000

# DeepSeek AI API Key (if using)
DEEPSEEK_API_KEY=your_deepseek_api_key
```

You can get your Supabase URL and Anon Key from your Supabase project dashboard under Project Settings > API.

4. **Run the development server**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

### Database Setup

The application uses Supabase as the database. You need to set up the following tables in your Supabase project:

1. **chatbots** - Stores information about created chatbots
2. **messages** - Stores chat messages
3. **analytics** - Stores usage analytics data

You can find the SQL schema in the `supabase/schema.sql` file.

## Deployment

See the [deployment instructions](DEPLOY-INSTRUCTIONS.md) for details on deploying to GitHub Pages or other platforms.

## Embedding Your Chatbot

EzAIBotz offers multiple ways to embed your chatbots on any website:

### Floating Chat Widget

Add a chat bubble to the bottom corner of your website that opens a chat window when clicked:

```html
<!-- EzAIBotz Chat Widget -->
<script 
  src="https://your-domain.com/widget.js" 
  data-chatbot-id="your-chatbot-id"
  data-primary-color="#4F46E5" 
  data-api-url="https://your-domain.com/api/chat"
  data-welcome-message="Hello! How can I help you today?">
</script>
```

### Inline Chat Widget

Embed the chat directly within your page using an iframe:

```html
<iframe
  src="https://your-domain.com/embed/your-chatbot-id"
  width="400"
  height="600"
  frameBorder="0"
  title="Chat with your chatbot name"
  style="border: 1px solid #e5e7eb; border-radius: 0.5rem;"
></iframe>
```

### Testing Embed Options

You can test how your chatbot looks when embedded using the test page at:
```
/test-embed.html
```

This page lets you see and test both embedding options with your actual chatbot.

## Troubleshooting Common Issues

### Middleware Error in Development

If you encounter errors related to middleware in development mode, ensure your environment variables are set correctly in `.env.local`.

### Authentication Issues

If you experience authentication issues:

1. Check that your Supabase URL and Anon Key are correct
2. Ensure your Supabase project has Email authentication enabled in Authentication > Providers
3. Verify that your database schema is set up correctly with the required tables and permissions

### Static Export Issues

When deploying with `output: 'export'` (static export):

1. Remember that API routes and middleware won't work in the exported site
2. Ensure all dynamic functionality uses client-side API calls
3. Configure your `next.config.js` with the correct `basePath` and `assetPrefix`

### Embedding Issues

If you encounter issues with embedding your chatbot:

1. Check CORS settings if embedding on a different domain
2. Ensure your chatbot ID is correct
3. Verify that your API URL is accessible from the embedding website
4. Test the embed functionality using the provided test page

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Acknowledgements

- [Next.js](https://nextjs.org/)
- [Supabase](https://supabase.io/)
- [Tailwind CSS](https://tailwindcss.com/)
- [React](https://reactjs.org/)

---

Built with ❤️ by Your Name #   e z b o t s - V 2 
 
 