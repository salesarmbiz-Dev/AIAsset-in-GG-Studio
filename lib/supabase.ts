import { createClient } from '@supabase/supabase-js';

// NOTE: In a real app, these should be environment variables.
// For Lovable/Demo purposes, user needs to replace these or set them up.
// We use a fallback URL that is valid (starts with https://) to prevent "Invalid URL" errors 
// during initialization if the environment variables are not set.
// We also safely check for process.env to avoid ReferenceError in browser environments without polyfills.

const getEnv = (key: string) => {
  try {
    if (typeof process !== 'undefined' && process.env) {
      return process.env[key];
    }
  } catch (e) {
    // ignore
  }
  return undefined;
};

const SUPABASE_URL = getEnv('REACT_APP_SUPABASE_URL') || 'https://placeholder.supabase.co';
const SUPABASE_ANON_KEY = getEnv('REACT_APP_SUPABASE_ANON_KEY') || 'placeholder-key';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
