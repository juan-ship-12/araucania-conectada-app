// src/supabaseClient.js

import { createClient } from '@supabase/supabase-js'

// Lee las "variables de entorno" secretas
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL
const supabaseKey = process.env.REACT_APP_SUPABASE_KEY

export const supabase = createClient(supabaseUrl, supabaseKey)