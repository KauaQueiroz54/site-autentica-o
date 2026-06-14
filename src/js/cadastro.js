import "./config.js";

const registerForm = document.getElementById("registerForm");
if (registerForm) {
    registerForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        if (!window.supabaseClient) {
            alert("Supabase não carregou. Verifique a conexão com a internet e as chaves do projeto.");
            return;
        }

        const email = document.getElementById("regEmail").value;
        const password = document.getElementById("regPassword").value;

        const { data, error } = await window.supabaseClient.auth.signUp({
            email,
            password,
            options: {
                emailRedirectTo: `${window.location.origin}/index.html`
            }
        });

        if (error) {
            alert("Erro ao cadastrar: " + error.message);
            return;
        }

        // Insere na tabela usuarios após cadastro
        if (data.user) {
            await window.supabaseClient
                .from('usuarios')
                .insert([{ id: data.user.id, email: data.user.email }]);
        }

        alert("Cadastro realizado com sucesso! Verifique seu e-mail para confirmação.");
        window.location.href = "index.html";
    });
}
