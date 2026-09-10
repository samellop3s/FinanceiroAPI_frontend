const URL_API = "https://financeiro-api-lopes-h7hcgub8f3aggmdn.centralus-01.azurewebsites.net/api/Pagamentos";

function obterIdDaUrl() {
    const parametros = new URLSearchParams(window.location.search);
    return parametros.get("id");
}

async function carregarDadosParaEdicao() {
    const id = obterIdDaUrl();

    if (!id) {
        alert("Nenhum pagamento selecionado para edição.");
        window.location.href = "listagem.html";
        return;
    }

    try {
        const resposta = await fetch(`${URL_API}/${id}`);

        if (!resposta.ok) {
            alert("Pagamento não encontrado.");
            window.location.href = "listagem.html";
            return;
        }

        const pagamento = await resposta.json();

        document.getElementById("razaoSocialPagador").value = pagamento.razaoSocialPagador;
        document.getElementById("cnpjPagador").value = pagamento.cnpjPagador;
        document.getElementById("fornecedor").value = pagamento.fornecedor;
        document.getElementById("cnpjFornecedor").value = pagamento.cnpjFornecedor;
        document.getElementById("valorTotal").value = pagamento.valorTotal.toString().replace(".", ",");
        document.getElementById("observacoes").value = pagamento.observacoes;

        const dataFormatada = pagamento.dataVencimento.split("T")[0];
        document.getElementById("dataVencimento").value = dataFormatada;

    } catch (erro) {
        alert("Não foi possível carregar os dados do pagamento.");
        console.error(erro);
    }
}

async function atualizarPagamento() {
    const id = obterIdDaUrl();
    const formData = new FormData();

    formData.append("razaoSocialPagador", document.getElementById("razaoSocialPagador").value);
    formData.append("cnpjPagador", document.getElementById("cnpjPagador").value);
    formData.append("fornecedor", document.getElementById("fornecedor").value);
    formData.append("cnpjFornecedor", document.getElementById("cnpjFornecedor").value);
    formData.append("valorTotal", document.getElementById("valorTotal").value);
    formData.append("dataVencimento", document.getElementById("dataVencimento").value);
    formData.append("observacoes", document.getElementById("observacoes").value);

    const arquivoInput = document.getElementById("anexo");
    if (arquivoInput.files.length > 0) {
        formData.append("anexo", arquivoInput.files[0]);
    }

    try {
        const resposta = await fetch(`${URL_API}/${id}`, {
            method: "PUT",
            body: formData
        });

        if (resposta.ok) {
            const dados = await resposta.json();
            alert(dados.mensagem);
            window.location.href = "listagem.html";
        } else {
            const erro = await resposta.text();
            alert("Erro ao atualizar: " + erro);
        }
    } catch (erro) {
        alert("Não foi possível conectar à API.");
        console.error(erro);
    }
}

carregarDadosParaEdicao();