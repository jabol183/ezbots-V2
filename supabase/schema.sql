-- Enable necessary extensions
create extension if not exists "uuid-ossp";

-- Create tables
create table public.users (
    id uuid references auth.users on delete cascade not null primary key,
    email text not null unique,
    full_name text,
    company text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table public.chatbots (
    id uuid default uuid_generate_v4() primary key,
    name text not null,
    description text not null,
    type text not null check (type in ('ecommerce', 'support', 'appointment', 'financial', 'education', 'realestate')),
    config jsonb not null default '{"model": "deepseek-chat", "temperature": 0.7, "max_tokens": 1000}'::jsonb,
    user_id uuid references public.users on delete cascade not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table public.conversations (
    id uuid default uuid_generate_v4() primary key,
    chatbot_id uuid references public.chatbots on delete cascade not null,
    status text not null check (status in ('active', 'completed', 'archived')) default 'active',
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table public.messages (
    id uuid default uuid_generate_v4() primary key,
    conversation_id uuid references public.conversations on delete cascade not null,
    role text not null check (role in ('user', 'assistant')),
    content text not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create indexes
create index chatbots_user_id_idx on public.chatbots(user_id);
create index conversations_chatbot_id_idx on public.conversations(chatbot_id);
create index messages_conversation_id_idx on public.messages(conversation_id);

-- Set up Row Level Security (RLS)
alter table public.users enable row level security;
alter table public.chatbots enable row level security;
alter table public.conversations enable row level security;
alter table public.messages enable row level security;

-- Create policies
create policy "Users can view their own data"
    on public.users for select
    using (auth.uid() = id);

create policy "Users can update their own data"
    on public.users for update
    using (auth.uid() = id);

create policy "Users can view their own chatbots"
    on public.chatbots for select
    using (auth.uid() = user_id);

create policy "Users can create their own chatbots"
    on public.chatbots for insert
    with check (auth.uid() = user_id);

create policy "Users can update their own chatbots"
    on public.chatbots for update
    using (auth.uid() = user_id);

create policy "Users can delete their own chatbots"
    on public.chatbots for delete
    using (auth.uid() = user_id);

create policy "Users can view conversations for their chatbots"
    on public.conversations for select
    using (
        exists (
            select 1 from public.chatbots
            where chatbots.id = conversations.chatbot_id
            and chatbots.user_id = auth.uid()
        )
    );

create policy "Users can create conversations for their chatbots"
    on public.conversations for insert
    with check (
        exists (
            select 1 from public.chatbots
            where chatbots.id = conversations.chatbot_id
            and chatbots.user_id = auth.uid()
        )
    );

create policy "Users can update conversations for their chatbots"
    on public.conversations for update
    using (
        exists (
            select 1 from public.chatbots
            where chatbots.id = conversations.chatbot_id
            and chatbots.user_id = auth.uid()
        )
    );

create policy "Users can delete conversations for their chatbots"
    on public.conversations for delete
    using (
        exists (
            select 1 from public.chatbots
            where chatbots.id = conversations.chatbot_id
            and chatbots.user_id = auth.uid()
        )
    );

create policy "Users can view messages for their conversations"
    on public.messages for select
    using (
        exists (
            select 1 from public.conversations
            join public.chatbots on chatbots.id = conversations.chatbot_id
            where conversations.id = messages.conversation_id
            and chatbots.user_id = auth.uid()
        )
    );

create policy "Users can create messages for their conversations"
    on public.messages for insert
    with check (
        exists (
            select 1 from public.conversations
            join public.chatbots on chatbots.id = conversations.chatbot_id
            where conversations.id = messages.conversation_id
            and chatbots.user_id = auth.uid()
        )
    );

-- Create functions
create or replace function public.handle_new_user()
returns trigger as $$
begin
    insert into public.users (id, email)
    values (new.id, new.email);
    return new;
end;
$$ language plpgsql security definer;

-- Create triggers
create trigger on_auth_user_created
    after insert on auth.users
    for each row execute procedure public.handle_new_user(); 