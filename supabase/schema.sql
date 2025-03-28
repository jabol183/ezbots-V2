-- Schema for EzAIBotz Supabase Database

-- Enable Row Level Security (RLS)
ALTER DATABASE postgres SET auth.strict_mode = on;

-- Create tables with proper relations and security policies

-- Chatbots Table
CREATE TABLE IF NOT EXISTS public.chatbots (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  welcome_message TEXT DEFAULT 'How can I help you today?',
  primary_color TEXT DEFAULT '#4F46E5',
  is_active BOOLEAN DEFAULT TRUE,
  api_key UUID DEFAULT uuid_generate_v4() NOT NULL,
  model_configuration JSONB DEFAULT '{}'::JSONB
);

-- Messages Table
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  chatbot_id UUID NOT NULL REFERENCES public.chatbots(id) ON DELETE CASCADE,
  session_id TEXT NOT NULL,
  user_message TEXT NOT NULL,
  ai_response TEXT NOT NULL,
  metadata JSONB DEFAULT '{}'::JSONB
);

-- Analytics Table
CREATE TABLE IF NOT EXISTS public.analytics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  chatbot_id UUID NOT NULL REFERENCES public.chatbots(id) ON DELETE CASCADE,
  conversation_count INTEGER DEFAULT 0,
  message_count INTEGER DEFAULT 0,
  average_response_time FLOAT DEFAULT 0,
  user_satisfaction FLOAT DEFAULT 0,
  popular_topics JSONB DEFAULT '[]'::JSONB,
  conversations_by_day JSONB DEFAULT '{}'::JSONB
);

-- Feedback Table
CREATE TABLE IF NOT EXISTS public.feedback (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  message_id UUID NOT NULL REFERENCES public.messages(id) ON DELETE CASCADE,
  rating INTEGER,
  comment TEXT,
  source TEXT
);

-- Set up Row Level Security Policies

-- Chatbots policies
ALTER TABLE public.chatbots ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can create their own chatbots"
  ON public.chatbots
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own chatbots"
  ON public.chatbots
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own chatbots"
  ON public.chatbots
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own chatbots"
  ON public.chatbots
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Messages policies
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view messages for their chatbots"
  ON public.messages
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.chatbots
      WHERE id = messages.chatbot_id
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Public can insert messages into active chatbots"
  ON public.messages
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM public.chatbots
      WHERE id = chatbot_id
      AND is_active = TRUE
    )
  );

-- Analytics policies
ALTER TABLE public.analytics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view analytics for their chatbots"
  ON public.analytics
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.chatbots
      WHERE id = analytics.chatbot_id
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Service role can manage analytics"
  ON public.analytics
  FOR ALL
  TO service_role
  USING (TRUE)
  WITH CHECK (TRUE);

-- Feedback policies
ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert feedback"
  ON public.feedback
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (TRUE);

CREATE POLICY "Users can view feedback for their chatbots"
  ON public.feedback
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.messages m
      JOIN public.chatbots c ON m.chatbot_id = c.id
      WHERE m.id = feedback.message_id
      AND c.user_id = auth.uid()
    )
  );

-- Create functions and triggers

-- Update updated_at timestamp function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add trigger to chatbots table
CREATE TRIGGER update_chatbots_updated_at
BEFORE UPDATE ON public.chatbots
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Function to update analytics when a new message is added
CREATE OR REPLACE FUNCTION update_analytics_on_message()
RETURNS TRIGGER AS $$
BEGIN
  -- Update message count
  INSERT INTO public.analytics (chatbot_id, message_count, conversation_count)
  VALUES (NEW.chatbot_id, 1, 0)
  ON CONFLICT (chatbot_id) 
  DO UPDATE SET 
    message_count = public.analytics.message_count + 1,
    updated_at = now();
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for updating analytics
CREATE TRIGGER update_analytics_trigger
AFTER INSERT ON public.messages
FOR EACH ROW
EXECUTE FUNCTION update_analytics_on_message();

-- Create indexes for performance
CREATE INDEX idx_messages_chatbot_id ON public.messages(chatbot_id);
CREATE INDEX idx_messages_session_id ON public.messages(session_id);
CREATE INDEX idx_analytics_chatbot_id ON public.analytics(chatbot_id);
CREATE INDEX idx_feedback_message_id ON public.feedback(message_id); 