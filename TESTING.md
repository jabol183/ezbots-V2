# Testing the EzAIBotz Chatbot Functionality

This guide will help you test the chatbot functionality in the EzAIBotz application.

## Prerequisites

1. Make sure you've set up your development environment as described in `SETUP.md`
2. Ensure your `.env.local` file has the correct Supabase credentials
3. Make sure you've set up the database schema by running the SQL in `supabase/schema.sql`
4. Run the seed script to populate test data: `npm run seed`

## Testing Workflow

### 1. Login to the Application

1. Start the development server:
   ```bash
   npm run dev
   ```
2. Open http://localhost:3000 in your browser
3. Click on "Get Started" or navigate to http://localhost:3000/login
4. Log in using the test credentials:
   - Email: `test@example.com`
   - Password: `password123`

### 2. Create a Chatbot (if you don't already have one)

1. From the dashboard, click on "New Chatbot"
2. Fill in the chatbot details:
   - Name: Give your chatbot a name
   - Description: Provide a brief description
   - Type: Select a chatbot type (Support, E-commerce, etc.)
3. Click "Create Chatbot"

### 3. Test the Chatbot

There are multiple ways to test your chatbot:

#### Method 1: Using the Test Chat Page

1. Navigate to http://localhost:3000/test-chat
2. Select your chatbot from the dropdown menu
3. Click on the chat bubble icon in the bottom-right corner
4. Type a message and press Enter or click the send button
5. You should see a response from the chatbot

#### Method 2: Testing in the Chatbot Detail Page

1. From the dashboard, click on a chatbot to open its detail page
2. In the right panel, you'll see a chat interface
3. Type a message and press Enter
4. You should see a response from the chatbot

#### Method 3: Testing the Embed Functionality

1. From the dashboard, click on a chatbot to open its detail page
2. Click on the "Embed" tab or button
3. You will see two embedding options:
   - **Floating Chat Widget**: Adds a chat bubble to the bottom-right of your website
   - **Inline Chat Widget**: Embeds the chat directly within your page using an iframe
4. Test the inline embed preview directly on the page
5. Copy the embed code for future use

### 4. Check the Database for Messages

After testing, you can verify that messages are being stored in the database:

1. Go to your Supabase project (https://app.supabase.com/)
2. Navigate to the Table Editor
3. Look at the `messages` table
4. You should see entries with your messages and the AI responses

## Embedding Your Chatbot

### Embedding on External Websites

1. **Floating Widget**: Add the provided script just before the closing `</body>` tag on your website
2. **Inline Widget**: Add the iframe code anywhere in your HTML where you want the chat to appear
3. Customize the iframe dimensions to fit your website's design

### Testing Embedded Chatbots

To test how your chatbot works when embedded:

1. Create a simple HTML file with the embed code
   ```html
   <!DOCTYPE html>
   <html>
   <head>
     <title>Chatbot Test</title>
   </head>
   <body>
     <h1>My Website with Embedded Chatbot</h1>
     
     <!-- Paste your embed code here -->
     
   </body>
   </html>
   ```
2. Open the HTML file in your browser
3. Interact with the chatbot to ensure it works correctly in an embedded context

### Troubleshooting Embed Issues

- **CORS Errors**: If you see CORS errors in the console, make sure the domain you're testing from is allowed in your API
- **Styling Issues**: If the embedded chat doesn't look right, try adjusting the iframe dimensions or styling
- **Connection Issues**: Make sure the API URL in the embed code points to your server

## Troubleshooting

### If the Chatbot Doesn't Respond

1. **Check the console for errors**: Open your browser's developer tools and look for errors in the console
2. **Verify your DeepSeek API Key**: Make sure the `DEEPSEEK_API_KEY` in your `.env.local` file is correct
3. **Check the Network Tab**: Look at the API calls to `/api/chat` to see what's happening

### If Creation Fails

1. **Check Database Permissions**: Ensure your RLS policies are correctly set up
2. **Verify User Authentication**: Make sure you're properly authenticated
3. **Check Field Validation**: Make sure all required fields are filled in correctly

### Common API Errors

- **400 Bad Request**: Check the request payload format
- **401 Unauthorized**: Make sure you're logged in
- **404 Not Found**: The chatbot ID might be incorrect or the chatbot doesn't exist
- **500 Internal Server Error**: Check server logs for details

## Advanced Testing

### Testing with Different Message Types

Try different types of messages to test the chatbot's capabilities:

- **Greetings**: "Hello", "Hi there"
- **Questions**: "What services do you offer?", "How can I contact support?"
- **Commands**: "Show me pricing", "I need help with my account"

### Testing Response Handling

- Try sending a very long message
- Test how the chatbot handles special characters or emojis
- Test with different languages

## Next Steps

After testing the chatbot functionality, you may want to:

1. Customize the chatbot's appearance and behavior in the settings
2. Analyze the chatbot's performance in the analytics dashboard
3. Deploy your chatbot to production and embed it on your live website

If you encounter any issues not covered in this guide, please refer to the API documentation or create an issue in the repository. 