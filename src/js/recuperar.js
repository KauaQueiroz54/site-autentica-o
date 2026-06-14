import "./config.js";

// Detecta se o usuário voltou pelo link do e-mail
window.addEventListener("load", () => {
    const hash   = window.location.hash;
    const search = window.location.search;

    if (
        (hash.includes("access_token") && hash.includes("type=recovery")) ||
        search.includes("type=recovery")
    ) {
        document.getElementById("requestFlow").style.display = "none";
        document.getElementById("updateFlow").style.display = "block";
    }
});

// Fluxo 1: Pedir o link de recuperação
document.getElementById('requestForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const msgElemento = document.getElementById('mensagemSucesso');

    try {
        const email = document.getElementById('resetEmail').value;

        const { error } = await window.supabaseClient.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/recuperar.html`,
        });

        if (error) {
            console.error("Erro retornado pelo Supabase:", error.message);
            alert("Erro do Supabase: " + error.message);
        } else {
            msgElemento.innerText = "Link enviado! Verifique sua caixa de entrada.";
            msgElemento.style.display = "block";
            document.getElementById('resetEmail').value = "";
        }
    } catch (err) {
        console.error("Erro geral no código do Fluxo 1:", err);
    }
});

// Fluxo 2: Definir a nova senha (quando o usuário volta pelo e-mail)
document.getElementById('updateForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    try {
        const password = document.getElementById('newPassword').value;

        const { error } = await window.supabaseClient.auth.updateUser({ password });

        if (error) {
            console.error("Erro ao atualizar senha:", error.message);
            alert("Erro ao atualizar: " + error.message);
        } else {
            alert("Senha atualizada com sucesso! Faça login.");
            window.location.href = "/index.html";
        }
    } catch (err) {
        console.error("Erro geral no código do Fluxo 2:", err);
    }
});

// Voltar ao login
document.querySelectorAll(".back-btn").forEach(btn => {
    btn.addEventListener("click", () => window.location.href = "/index.html");
});
