# EzAIBotz - Ready-to-Use AI Chatbot Integrations

EzAIBotz provides pre-built, customizable chatbot solutions that integrate seamlessly with your existing systems. Deploy powerful AI chatbots on your website in minutes, not months.

## Features

- Multiple chatbot types (ecommerce, support, appointment, etc.)
- Fully customizable chatbot interface
- Real-time chat with DeepSeek AI integration
- User authentication system
- Comprehensive analytics dashboard
- Embed options for any website

## Tech Stack

- **Frontend**: Next.js, React, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **AI**: DeepSeek API integration
- **Deployment**: GitHub Pages

## Getting Started

### Prerequisites

- Node.js 18.x or later
- npm or yarn
- Supabase account

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/YOUR-USERNAME/REPOSITORY-NAME.git
   cd REPOSITORY-NAME
   ```

2. Install dependencies
   ```bash
   npm install
   # or
   yarn install
   ```

3. Set up environment variables
   Create a `.env.local` file in the root directory with the following variables:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

4. Run the development server
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Deployment to GitHub Pages

This project is configured for automatic deployment to GitHub Pages using GitHub Actions.

1. Update the repository name in `next.config.js`:
   ```js
   basePath: process.env.NODE_ENV === 'production' ? '/YOUR-REPOSITORY-NAME' : '',
   ```

2. Add your Supabase credentials as GitHub repository secrets:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_APP_URL` (optional, will default to your GitHub Pages URL)

3. Push to the main branch or manually trigger the workflow from the Actions tab.

4. Your site will be deployed to `https://YOUR-USERNAME.github.io/REPOSITORY-NAME`

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

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [Next.js](https://nextjs.org/)
- [Supabase](https://supabase.io/)
- [Tailwind CSS](https://tailwindcss.com/)
- [React](https://reactjs.org/)

---

Built with ❤️ by Your Name #   e z b o t s - V 2 
 
 