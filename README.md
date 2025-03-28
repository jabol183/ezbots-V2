# EzAIBotz - Ready-to-Use AI Chatbot Integrations

EzAIBotz is a full-stack application that enables users to create, customize, and embed AI-powered chatbots on their websites with just a few lines of code. This platform leverages modern AI technologies to provide intelligent customer support and engagement solutions.

## Features

- **User Authentication**: Secure login and registration using Supabase Auth
- **Chatbot Creation**: Build custom chatbots with different AI models
- **Customization Options**: Configure your chatbot's appearance and behavior
- **Simple Embedding**: Add your chatbot to any website with a simple script tag
- **Analytics Dashboard**: Track chatbot usage and performance metrics
- **Multi-Platform Support**: Works on any website or web application

## Tech Stack

- **Frontend**: Next.js 14, React 18, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Styling**: Tailwind CSS
- **TypeScript**: Type-safe codebase

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/ezbotz.git
   cd ezbotz
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Create a `.env.local` file in the root directory with the following variables:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   NEXT_PUBLIC_APP_URL=http://localhost:3000 # or your production URL
   ```

4. Set up your Supabase database with the following tables:
   - `users`: User accounts
   - `chatbots`: Chatbot configurations
   - `conversations`: Chat conversations
   - `messages`: Individual messages within conversations

5. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

6. Visit `http://localhost:3000` to view the application.

## Project Structure

```
ezbotz/
├── public/            # Static assets
│   └── chatbot-widget.js  # Embeddable widget script
├── src/
│   ├── app/           # Next.js app router
│   │   ├── api/       # API routes
│   │   ├── auth/      # Authentication pages
│   │   └── dashboard/ # Dashboard pages
│   ├── components/    # React components
│   ├── types/         # TypeScript types
│   └── utils/         # Utility functions
├── .env.local         # Environment variables
└── package.json       # Project dependencies
```

## Embedding Your Chatbot

After creating a chatbot in the dashboard, you'll get an embed code that looks like this:

```html
<script 
  src="https://yourdomain.com/chatbot-widget.js" 
  data-chatbot-id="your-chatbot-id"
  data-api-endpoint="https://yourdomain.com/api/chat">
</script>
```

Add this code to your website before the closing `</body>` tag.

## Customization Options

You can customize your chatbot by adding attributes to the script tag:

- `data-theme-color`: Change the primary color (default: #4F46E5)
- `data-bubble-text`: Set a custom welcome message

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [Next.js](https://nextjs.org/)
- [Supabase](https://supabase.io/)
- [Tailwind CSS](https://tailwindcss.com/)
- [React](https://reactjs.org/)

---

Built with ❤️ by Your Name #   e z b o t s - V 2  
 