// --- 1. PROTEÇÃO DE ROTA (SEGURANÇA) ---
// Esta função roda assim que a página carrega para garantir que o usuário está logado
import "./config.js";

async function verificarUsuario() {
    // Pega os dados do usuário atual direto da sessão do Supabase
    const { data: { user }, error } = await window.supabaseClient.auth.getUser();

    // Se não houver usuário logado ou der erro, expulsa de volta para o login
    if (error || !user) {
        window.location.href = "/index.html";
        return null;
    }
    
    return user;
}

// --- 2. OPERAÇÃO READ (LER DADOS) ---
// Busca as tarefas salvas no banco de dados e mostra na tela
async function listarTarefas() {
    const user = await verificarUsuario();
    if (!user) return;

    // Busca na tabela 'tarefas' apenas as linhas onde o id_usuario é igual ao ID de quem está logado
    const { data: tarefas, error } = await window.supabaseClient
        .from('tarefas')
        .select('*')
        .eq('id_usuario', user.id)
        .order('created_at', { ascending: false }); // Mostra as mais novas primeiro

    if (error) {
        console.error("Erro ao buscar tarefas:", error.message);
        return;
    }

    // Pega a lista (ul) lá do HTML e limpa o conteúdo antigo
    const taskList = document.getElementById('taskList');
    taskList.innerHTML = "";

    // Adiciona cada tarefa vinda do banco dentro da lista no HTML
    if (tarefas && tarefas.length > 0) {
        tarefas.forEach(tarefa => {
            taskList.innerHTML += `
                <li>
                    <span>${tarefa.nome}</span>
                    <button class="delete-item" onclick="deletarTarefa(${tarefa.id})">❌</button>
                </li>
            `;
        });
    } else {
        taskList.innerHTML = "<li style='color: #888; justify-content: center;'>Nenhuma tarefa cadastrada ainda.</li>";
    }
}

// --- 3. OPERAÇÃO CREATE (CRIAR DADOS) ---
// Pega o texto digitado no input e salva no Supabase
document.getElementById('addTaskBtn').addEventListener('click', async () => {
    const user = await verificarUsuario();
    if (!user) return;

    const taskInput = document.getElementById('taskInput');
    const nomeTarefa = taskInput.value.trim();

    // Valida se o usuário não tentou enviar um campo vazio
    if (nomeTarefa === "") {
        alert("Por favor, digite o nome de uma tarefa.");
        return;
    }

    // Insere uma nova linha na tabela do Supabase
    const { error } = await window.supabaseClient
        .from('tarefas')
        .insert([
            { nome: nomeTarefa, id_usuario: user.id }
        ]);

    if (error) {
        alert("Erro ao adicionar tarefa: " + error.message);
    } else {
        taskInput.value = ""; // Limpa o campo de texto
        listarTarefas();     // Atualiza a lista na tela para mostrar a nova tarefa
    }
});

// --- 4. OPERAÇÃO DELETE (DELETAR DADOS) ---
// Apaga a tarefa usando o ID dela como referência
window.deletarTarefa = async (idTarefa) => {
    const user = await verificarUsuario();
    if (!user) return;

    // Confirma se o usuário quer mesmo deletar
    if (!confirm("Tem certeza que deseja excluir esta tarefa?")) return;

    // Deleta do banco onde o ID bate com a tarefa clicada
    const { error } = await window.supabaseClient
        .from('tarefas')
        .delete()
        .eq('id', idTarefa);

    if (error) {
        alert("Erro ao deletar: " + error.message);
    } else {
        listarTarefas(); // Atualiza a lista na tela para sumir com o item deletado
    }
};

// --- 5. LOGOUT (SAIR DO SISTEMA) ---
document.getElementById('logoutBtn').addEventListener('click', async () => {
    // Encerra a sessão no Supabase de verdade
    const { error } = await window.supabaseClient.auth.signOut();
    
    if (error) {
        alert("Erro ao sair: " + error.message);
    } else {
        // Redireciona o usuário para a tela de login
        window.location.href = "/index.html";
    }
});

// --- 6. INICIALIZAÇÃO ---
// Executa automaticamente a listagem assim que a página abre
listarTarefas();
