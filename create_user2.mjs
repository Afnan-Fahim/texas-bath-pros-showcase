import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://xbfbqbytfzwjqpovuiff.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_NafpHAALfNplcbWHms2lUw_JghKe3w7";

const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

async function createUser() {
  const { data, error } = await supabase.auth.signUp({
    email: 'Admin_Rugsafari@gmail.com',
    password: 'Rugs2016!',
  });

  if (error) {
    console.error("Error creating user:", error.message);
  } else {
    console.log("User created successfully!");
  }
}

createUser();
