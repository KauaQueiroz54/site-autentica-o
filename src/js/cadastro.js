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

        const { error } = await window.supabaseClient.auth.signUp({
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

        alert("Cadastro realizado com sucesso! Verifique seu e-mail para confirmação.");
        window.location.href = "index.html";
    });
}
