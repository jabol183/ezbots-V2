-- Schema for EzAIBotz Supabase Database

-- Enable Row Level Security (RLS)
ALTER DATABASE postgres SET auth.strict_mode = on;

-- Create tables with proper relations and security policies

-- Chatbots Table
CREATE TABLE IF NOT EXISTS public.chatbots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  welcome_message TEXT NOT NULL,
  primary_color TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  api_key UUID NOT NULL DEFAULT gen_random_uuid(),
  model_configuration JSONB NOT NULL DEFAULT '{"model": "deepseek-chat", "temperature": 0.7, "max_tokens": 1000}'::jsonb
);

-- Messages Table
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  chatbot_id UUID NOT NULL REFERENCES public.chatbots(id) ON DELETE CASCADE,
  session_id TEXT NOT NULL,
  content TEXT NOT NULL,
  role TEXT NOT NULL,
  metadata JSONB
);

-- Analytics Table
CREATE TABLE IF NOT EXISTS public.analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  chatbot_id UUID NOT NULL REFERENCES public.chatbots(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  event_data JSONB NOT NULL
);

-- Feedback Table
CREATE TABLE IF NOT EXISTS public.feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  message_id UUID NOT NULL REFERENCES public.messages(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT
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
  INSERT INTO public.analytics (chatbot_id, event_type, event_data)
  VALUES (NEW.chatbot_id, 'message_added', jsonb_build_object('message_id', NEW.id))
  ON CONFLICT (chatbot_id) 
  DO UPDATE SET 
    event_data = public.analytics.event_data || jsonb_build_object('message_id', NEW.id),
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

-- Create function to get tables
CREATE OR REPLACE FUNCTION public.get_tables()
RETURNS text[] AS $$
BEGIN
  RETURN ARRAY(
    SELECT table_name::text
    FROM information_schema.tables
    WHERE table_schema = 'public'
    AND table_type = 'BASE TABLE'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add comment for documentation
COMMENT ON TABLE public.chatbots IS 'Stores chatbot configurations';
COMMENT ON TABLE public.messages IS 'Stores chat messages between users and chatbots';
COMMENT ON TABLE public.analytics IS 'Stores analytics events for chatbots';
COMMENT ON TABLE public.feedback IS 'Stores user feedback on chatbot responses'; 