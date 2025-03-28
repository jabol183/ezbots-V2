// Data seeding script for EzAIBotz
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function seedDatabase() {
  console.log('Starting database seeding...');

  try {
    // Create a test user if not already signed up
    const testEmail = 'test@example.com';
    const testPassword = 'password123';

    console.log(`Checking if test user ${testEmail} exists...`);
    
    // Check if user exists first by trying to sign in
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: testEmail,
      password: testPassword,
    });

    let userId;

    if (signInError) {
      console.log('Test user does not exist, creating...');
      // Create a new user
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: testEmail,
        password: testPassword,
        options: {
          data: {
            full_name: 'Test User',
            company: 'Test Company'
          }
        }
      });

      if (signUpError) {
        throw new Error(`Error creating test user: ${signUpError.message}`);
      }

      userId = signUpData.user.id;
      console.log(`Created test user with ID: ${userId}`);
    } else {
      console.log('Test user already exists, fetching user ID...');
      const { data: userData } = await supabase.auth.getUser();
      userId = userData.user.id;
      console.log(`Using existing user with ID: ${userId}`);
    }

    // Create test chatbots
    const chatbots = [
      {
        name: 'Customer Support Bot',
        description: 'A helpful customer support assistant',
        welcome_message: 'Hello! How can I assist you today?',
        primary_color: '#4F46E5',
        user_id: userId,
        is_active: true,
        model_configuration: { model: 'deepseek-chat', temperature: 0.7 }
      },
      {
        name: 'Sales Assistant',
        description: 'A bot to help with sales inquiries',
        welcome_message: 'Welcome! Looking for product information?',
        primary_color: '#10B981',
        user_id: userId,
        is_active: true,
        model_configuration: { model: 'deepseek-chat', temperature: 0.5 }
      }
    ];

    console.log('Creating test chatbots...');
    
    for (const chatbot of chatbots) {
      // Check if chatbot already exists
      const { data: existingChatbots } = await supabase
        .from('chatbots')
        .select('id')
        .eq('name', chatbot.name)
        .eq('user_id', userId);

      if (existingChatbots && existingChatbots.length > 0) {
        console.log(`Chatbot "${chatbot.name}" already exists, skipping...`);
        continue;
      }

      const { data: newChatbot, error: chatbotError } = await supabase
        .from('chatbots')
        .insert(chatbot)
        .select();

      if (chatbotError) {
        throw new Error(`Error creating chatbot ${chatbot.name}: ${chatbotError.message}`);
      }

      console.log(`Created chatbot: ${chatbot.name} with ID: ${newChatbot[0].id}`);

      // Create some test messages for this chatbot
      const sessionId = `test-session-${Date.now()}`;
      const messages = [
        {
          chatbot_id: newChatbot[0].id,
          session_id: sessionId,
          user_message: 'Hello, I need some help',
          ai_response: 'Hi there! I\'d be happy to help. What can I assist you with today?',
          metadata: { ip: '127.0.0.1', timestamp: new Date().toISOString() }
        },
        {
          chatbot_id: newChatbot[0].id,
          session_id: sessionId,
          user_message: 'How do I reset my password?',
          ai_response: 'To reset your password, please go to the login page and click on "Forgot Password". You\'ll receive an email with instructions to create a new password.',
          metadata: { ip: '127.0.0.1', timestamp: new Date().toISOString() }
        }
      ];

      console.log(`Creating test messages for chatbot: ${chatbot.name}...`);
      
      for (const message of messages) {
        const { error: messageError } = await supabase
          .from('messages')
          .insert(message);

        if (messageError) {
          throw new Error(`Error creating message: ${messageError.message}`);
        }
      }

      console.log(`Created ${messages.length} test messages for chatbot: ${chatbot.name}`);

      // Create sample analytics data
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      
      const twoDaysAgo = new Date(today);
      twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

      const conversationsByDay = {};
      conversationsByDay[today.toISOString().split('T')[0]] = 3;
      conversationsByDay[yesterday.toISOString().split('T')[0]] = 5;
      conversationsByDay[twoDaysAgo.toISOString().split('T')[0]] = 2;

      const analytics = {
        chatbot_id: newChatbot[0].id,
        conversation_count: 10,
        message_count: 25,
        average_response_time: 1.5,
        user_satisfaction: 4.2,
        popular_topics: [
          { topic: 'Password Reset', count: 8 },
          { topic: 'Account Issues', count: 6 },
          { topic: 'Billing Questions', count: 4 },
          { topic: 'Product Information', count: 3 },
          { topic: 'Technical Support', count: 2 }
        ],
        conversations_by_day: conversationsByDay
      };

      console.log(`Creating analytics data for chatbot: ${chatbot.name}...`);
      
      const { error: analyticsError } = await supabase
        .from('analytics')
        .insert(analytics);

      if (analyticsError) {
        throw new Error(`Error creating analytics: ${analyticsError.message}`);
      }

      console.log(`Created analytics data for chatbot: ${chatbot.name}`);
    }

    console.log('Database seeding completed successfully!');
    console.log('\nTest user credentials:');
    console.log('Email: test@example.com');
    console.log('Password: password123');

  } catch (error) {
    console.error('Error seeding database:', error);
  }
}

// Run the seeding function
seedDatabase(); 