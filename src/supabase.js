import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://bwfsdaecgvknwugafbve.supabase.co";
const supabasePublishableKey = "sb_publishable_82aT0gqyIF16-ZqaNMCRAg_UJA3_eg7";

export const supabase = createClient(supabaseUrl, supabasePublishableKey)