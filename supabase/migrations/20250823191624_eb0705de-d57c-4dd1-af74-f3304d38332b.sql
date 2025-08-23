-- Create languages table
CREATE TABLE public.languages (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

-- Create topics table
CREATE TABLE public.topics (
    id SERIAL PRIMARY KEY,
    language_id INTEGER REFERENCES languages(id),
    name VARCHAR(100) NOT NULL,
    documentation TEXT
);

-- Create questions table
CREATE TABLE public.questions (
    id SERIAL PRIMARY KEY,
    topic_id INTEGER REFERENCES topics(id),
    question TEXT,
    hint TEXT,
    solution TEXT
);

-- Enable Row Level Security
ALTER TABLE public.languages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access (learning platform content)
CREATE POLICY "Allow public read access to languages" ON public.languages FOR SELECT USING (true);
CREATE POLICY "Allow public read access to topics" ON public.topics FOR SELECT USING (true);
CREATE POLICY "Allow public read access to questions" ON public.questions FOR SELECT USING (true);