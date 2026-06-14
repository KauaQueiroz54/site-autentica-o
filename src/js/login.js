import "./config.js";

const createAccountBtn = document.querySelector(".create-account-button");
if (createAccountBtn) {
    createAccountBtn.addEventListener("click", () => {
        window.location.href = "cadastro.html";
    });
}

const loginForm = document.getElementById("loginForm");
if (loginForm) {
    loginForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        if (!window.supabaseClient) {
            alert("Supabase não carregou. Verifique a conexão com a internet e as chaves do projeto.");
            return;
        }

        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        try {
            const { data, error } = await window.supabaseClient.auth.signInWithPassword({
                email,
                password
            });

            if (error) {
                console.error("Erro retornado pelo Supabase:", error.message);
                alert("Erro no login: " + error.message);
                return;
            }

            console.log("Login efetuado com sucesso!", data);
            window.location.href = "dashboard.html";
        } catch (error) {
            console.error("Erro crítico no fluxo de login:", error);
            alert("Ocorreu um erro ao tentar fazer login. Verifique o console.");
        }
    });
}

const googleLoginBtn = document.getElementById("googleLogin");
if (googleLoginBtn) {
    googleLoginBtn.addEventListener("click", async () => {
        if (!window.supabaseClient) {
            alert("Supabase não carregou. Verifique a conexão com a internet e as chaves do projeto.");
            return;
        }

        try {
            const redirectTo = `${window.location.origin}/bemvindo.html`;
            console.log("Redirect OAuth Google:", redirectTo);

            const { error } = await window.supabaseClient.auth.signInWithOAuth({
                provider: "google",
                options: {
                    redirectTo
                }
            });

            if (error) {
                console.error("Erro retornado pelo Google OAuth:", error.message);
                alert("Erro Google Auth: " + error.message);
            }
        } catch (error) {
            console.error("Erro crítico no fluxo do Google:", error);
            alert("Não foi possível conectar com o Google. Verifique suas configurações.");
        }
    });
}
