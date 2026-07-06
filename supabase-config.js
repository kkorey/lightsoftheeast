// Supabase configuration and client initialization
const supabaseUrl = 'https://rxzyvfsvuyognbtxiujf.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ4enl2ZnN2dXlvZ25idHhpdWpmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODMwMDk1NDEsImV4cCI6MjA5ODU4NTU0MX0.2E_148WPwKPGlkhymIQpFIVqrQT9Lu51opsGDWV7ApI';

// Initialize the Supabase client
const supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);

// Expose the client globally
window.supabase = supabaseClient;
