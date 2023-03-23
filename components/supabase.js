import "react-native-url-polyfill/auto";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://nsdqdfdhbzhmfxqiqdoq.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5zZHFkZmRoYnpobWZ4cWlxZG9xIiwicm9sZSI6ImFub24iLCJpYXQiOjE2Nzk1NzU0OTMsImV4cCI6MTk5NTE1MTQ5M30.ijukxlVJWyaaxNBd686-seEScVtzVpJeg4HJ1FEMB5Y'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {

        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
    },
});
