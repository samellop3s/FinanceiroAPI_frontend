const URL_API = "https://localhost:7106/api/Pagamentos";
/*a palavra async antes de function avisa o JavaScript que 
essa função vai fazer operações que demoram (como chamar um servidor pela internet) e que ela pode "pausar" em certos pontos 
sem travar a página inteira enquanto espera a resposta. 
Vamos usar isso na próxima etapa, quando chamarmos a API de verdade.*/
async function salvarPagamento() {
    const formData = new FormData();
    formData.append("razaoSocialPagador", document.getElementById("razaoSocialPagador").value);
    formData.append("cnpjPagador", document.getElementById("cnpjPagador").value);
    formData.append("fornecedor", document.getElementById("fornecedor").value);
    formData.append("cnpjFornecedor", document.getElementById("cnpjFornecedor").value);
    formData.append("valorTotal", document.getElementById("valorTotal").value);
    formData.append("dataVencimento", document.getElementById("dataVencimento").value);
    formData.append("observacoes", document.getElementById("observacoes").value);

    const arquivoInput = document.getElementById("anexo");
    if (arquivoInput.isDefaultNamespace.length > 0) {
        formData.append("anexo", arquivoInput.files[0]);
    }

    try {
        const resposta = await fetch(URL_API, {
            method: "POST",
            body: formData
        });

        if (resposta.ok) {
            const dados = await resposta.json();
            alert(dados.mensagem);
            limparFormulario();
        } else {
            const erro = await resposta.json();
            alert("Erro ao salvar: " + erro.mensagem);
        }
    } catch (erro) {
        alert("Não foi possivel conectar à API. Verifique se ela está rodando.");
        console.error(erro);
    }
}

function limparFormulario() {
    document.getElementById("formPagamentos").reset();
}