const URL_API = "https://financeiro-api-lopes-h7hcgub8f3aggmdn.centralus-01.azurewebsites.net/api/Auth";

// Usuário/senha temporários, só pra testar enquanto a API está indisponível.
// IMPORTANTE: remover isso quando a API voltar a funcionar de forma estável.
const MODO_TEMPORARIO_ATIVO = true;
const USUARIO_TEMPORARIO = "admin";
const SENHA_TEMPORARIA = "teste123";

async function fazerLogin() {
    const nomeUsuario = document.getElementById("nomeUsuario").value;
    const senha = document.getElementById("senha").value;
    const botao = document.querySelector(".btn");

    esconderErro();

    if (!nomeUsuario || !senha) {
        mostrarErro("Preencha usuário e senha.");
        return;
    }

    botao.disabled = true;
    const textoOriginalBotao = botao.innerHTML;
    botao.innerHTML = "Entrando...";

    try {
        const resposta = await fetch(`${URL_API}/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nomeUsuario: nomeUsuario, senha: senha })
        });

        if (!resposta.ok) {
            mostrarErro("Usuário ou senha inválidos.");
            return;
        }

        const dados = await resposta.json();
        sessionStorage.setItem("tokenAcesso", dados.token);
        sessionStorage.setItem("nomeUsuario", dados.nomeUsuario);
        window.location.href = "cadastro.html";

    } catch (erro) {
        // Se a API estiver fora do ar e o modo temporário estiver ativo, permite entrar mesmo assim.
        if (MODO_TEMPORARIO_ATIVO && nomeUsuario === USUARIO_TEMPORARIO && senha === SENHA_TEMPORARIA) {
            sessionStorage.setItem("tokenAcesso", "token-temporario-sem-api");
            sessionStorage.setItem("nomeUsuario", nomeUsuario);
            window.location.href = "cadastro.html";
            return;
        }

        mostrarErro("Não foi possível conectar à API.");
        console.error(erro);
    } finally {
        botao.disabled = false;
        botao.innerHTML = textoOriginalBotao;
    }
}

function mostrarErro(texto) {
    const mensagemErro = document.getElementById("mensagemErro");
    mensagemErro.textContent = texto;
    mensagemErro.classList.add("visivel");
}

function esconderErro() {
    const mensagemErro = document.getElementById("mensagemErro");
    mensagemErro.textContent = "";
    mensagemErro.classList.remove("visivel");
}

function alternarVisibilidadeSenha() {
    const campoSenha = document.getElementById("senha");
    campoSenha.type = campoSenha.type === "password" ? "text" : "password";
}

document.getElementById("formLogin").addEventListener("keydown", function (evento) {
    if (evento.key === "Enter") {
        evento.preventDefault();
        fazerLogin();
    }
});