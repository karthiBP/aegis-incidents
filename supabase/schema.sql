-- AEGIS INCIDENTS Database Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Organizations table
CREATE TABLE IF NOT EXISTS organizations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  name TEXT NOT NULL,
  plan TEXT NOT NULL DEFAULT 'FREE' CHECK (plan IN ('FREE', 'PAY_PER_USE', 'SUBSCRIPTION')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Incidents table
CREATE TABLE IF NOT EXISTS incidents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  incident_type TEXT NOT NULL CHECK (incident_type IN ('OUTAGE', 'SECURITY', 'DEPLOYMENT', 'DATA', 'OTHER')),
  severity TEXT NOT NULL CHECK (severity IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')),
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE,
  timeline JSONB DEFAULT '[]'::jsonb,
  root_cause TEXT DEFAULT '',
  impact TEXT DEFAULT '',
  resolution TEXT DEFAULT '',
  action_items JSONB DEFAULT '[]'::jsonb,
  report_markdown TEXT DEFAULT '',
  status TEXT NOT NULL DEFAULT 'DRAFT' CHECK (status IN ('DRAFT', 'GENERATED', 'FINAL')),
  finalized_at TIMESTAMP WITH TIME ZONE,
  shared_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_incidents_organization ON incidents(organization_id);
CREATE INDEX IF NOT EXISTS idx_incidents_status ON incidents(status);
CREATE INDEX IF NOT EXISTS idx_incidents_created ON incidents(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_organizations_user ON organizations(user_id);

-- Row Level Security (RLS)
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE incidents ENABLE ROW LEVEL SECURITY;

-- Policies for organizations
CREATE POLICY "Users can view own organization" ON organizations
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own organization" ON organizations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own organization" ON organizations
  FOR UPDATE USING (auth.uid() = user_id);

-- Policies for incidents
CREATE POLICY "Users can view own incidents" ON incidents
  FOR SELECT USING (
    organization_id IN (
      SELECT id FROM organizations WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own incidents" ON incidents
  FOR INSERT WITH CHECK (
    organization_id IN (
      SELECT id FROM organizations WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own incidents" ON incidents
  FOR UPDATE USING (
    organization_id IN (
      SELECT id FROM organizations WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own incidents" ON incidents
  FOR DELETE USING (
    organization_id IN (
      SELECT id FROM organizations WHERE user_id = auth.uid()
    )
  );

-- Allow public read for shared incidents (status = FINAL)
CREATE POLICY "Anyone can view finalized shared incidents" ON incidents
  FOR SELECT USING (status = 'FINAL');

-- Function to auto-create organization on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.organizations (user_id, name, plan)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'org_name', 'My Organization'),
    'FREE'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create org on signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to increment share count
CREATE OR REPLACE FUNCTION increment_share_count(incident_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE incidents
  SET shared_count = shared_count + 1
  WHERE id = incident_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
