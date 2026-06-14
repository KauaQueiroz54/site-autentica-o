const SUPABASE_URL =
    import.meta.env?.VITE_SUPABASE_URL ||
    "https://jzlcxefoscrgwuytpvkz.supabase.co";

const SUPABASE_ANON_KEY =
    import.meta.env?.VITE_SUPABASE_ANON_KEY ||
    "sb_publishable_8f47-xPwnQF7dk4iY6rCsg_y7zleaJO";

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.error("Configure VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY no arquivo .env.");
} else if (!window.supabase) {
    console.error("A biblioteca do Supabase não foi carregada.");
} else {
    window.supabaseClient = window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_ANON_KEY
    );
}
