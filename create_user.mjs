import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://xbfbqbytfzwjqpovuiff.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_NafpHAALfNplcbWHms2lUw_JghKe3w7";

const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

async function createUser() {
  console.log("Attempting to sign up user...");
  const { data, error } = await supabase.auth.signUp({
    email: 'Rugsafari@gmail.com',
    password: 'Rugs2016!',
  });

  if (error) {
    if (error.message.includes("already registered")) {
      console.log("User already exists, the credentials should work if password is correct.");
    } else {
      console.error("Error creating user:", error.message);
    }
  } else {
    console.log("User created successfully!");
  }
}

createUser();
