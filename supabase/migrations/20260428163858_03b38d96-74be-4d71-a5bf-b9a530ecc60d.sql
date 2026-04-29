
CREATE TABLE public.chats (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL,
  role TEXT NOT NULL,
  content TEXT NOT NULL,
  sentiment TEXT,
  emotion TEXT,
  mask_detected BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.chats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read chats by session" ON public.chats FOR SELECT USING (true);
CREATE POLICY "Public can insert chats" ON public.chats FOR INSERT WITH CHECK (true);

CREATE INDEX idx_chats_session ON public.chats(session_id, created_at);
