-- Email Survey Tool Database Schema
-- Run this in your Supabase SQL Editor

-- Create surveys table
CREATE TABLE surveys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  require_name BOOLEAN DEFAULT false,
  unique_link_id TEXT UNIQUE NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_by_email TEXT
);

-- Create indexes for surveys
CREATE INDEX idx_surveys_user_id ON surveys(user_id);
CREATE INDEX idx_surveys_unique_link_id ON surveys(unique_link_id);

-- Create responses table
CREATE TABLE responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  survey_id UUID REFERENCES surveys(id) ON DELETE CASCADE NOT NULL,
  answer_value TEXT NOT NULL,
  free_response TEXT NOT NULL,
  respondent_name TEXT,
  hash_md5 TEXT,
  ip_address TEXT,
  user_agent TEXT
);

-- Create indexes for responses
CREATE INDEX idx_responses_survey_id ON responses(survey_id);
CREATE INDEX idx_responses_hash_md5 ON responses(hash_md5) WHERE hash_md5 IS NOT NULL;
CREATE INDEX idx_responses_created_at ON responses(created_at);

-- Enable Row Level Security
ALTER TABLE surveys ENABLE ROW LEVEL SECURITY;
ALTER TABLE responses ENABLE ROW LEVEL SECURITY;

-- RLS Policies for surveys table
CREATE POLICY "Users can view their own surveys"
  ON surveys FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own surveys"
  ON surveys FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own surveys"
  ON surveys FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own surveys"
  ON surveys FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for responses table
CREATE POLICY "Anyone can submit responses"
  ON responses FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Survey owners can view responses"
  ON responses FOR SELECT
  USING (
    survey_id IN (
      SELECT id FROM surveys WHERE user_id = auth.uid()
    )
  );

-- Create a function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for surveys table
CREATE TRIGGER update_surveys_updated_at
  BEFORE UPDATE ON surveys
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
