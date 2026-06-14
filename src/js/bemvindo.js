import "./config.js";

const statusMessage = document.getElementById("welcomeStatus");
const dashboardLink = document.getElementById("goDashboard");

async function finalizarLoginGoogle() {
    if (!window.supabaseClient) {
        if (statusMessage) {
            statusMessage.textContent = "Supabase não carregou. Confira as chaves do projeto.";
        }
        return;
    }

    const { data, error } = await window.supabaseClient.auth.getSession();

    if (error) {
        console.error("Erro ao finalizar login com Google:", error.message);
        if (statusMessage) {
            statusMessage.textContent = "Não foi possível confirmar o login. Tente entrar novamente.";
        }
        return;
    }

    if (!data.session) {
        if (statusMessage) {
            statusMessage.textContent = "Sessão não encontrada. Voltando para o login...";
        }

        setTimeout(() => {
            window.location.href = "index.html";
        }, 1400);
        return;
    }

    if (statusMessage) {
        statusMessage.textContent = "Login confirmado. Você já pode acessar o painel.";
    }

    if (dashboardLink) {
        dashboardLink.removeAttribute("aria-disabled");
    }
}

finalizarLoginGoogle();
