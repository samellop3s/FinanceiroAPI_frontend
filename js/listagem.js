const URL_API = "https://financeiro-api-lopes-h7hcgub8f3aggmdn.centralus-01.azurewebsites.net/api/Pagamentos"; // Proxy endpoint

async function carregarPagamentos() {
    const corpoTabela = document.getElementById("corpoTabela");

    try {
        const resposta = await fetch(API_ENDPOINT);

        if (!resposta.ok) {
            corpoTabela.innerHTML = "<tr><td colspan='9'>Erro ao carregar os pagamentos.</td></tr>";
            return;
        }

        const pagamentos = await resposta.json();

        if (pagamentos.length === 0) {
            corpoTabela.innerHTML = "<tr><td colspan='9'>Nenhum pagamento cadastrado ainda.</td></tr>";
            return;
        }

        corpoTabela.innerHTML = "";

        pagamentos.forEach(pagamento => {
            const linha = document.createElement("tr");

            linha.innerHTML = `
                <td>${pagamento.razaoSocialPagador}</td>
                <td>${formatarCnpj(pagamento.cnpjPagador)}</td>
                <td>${pagamento.fornecedor}</td>
                <td>${formatarCnpj(pagamento.cnpjFornecedor)}</td>
                <td>${formatarValor(pagamento.valorTotal)}</td>
                <td>${formatarData(pagamento.dataVencimento)}</td>
                <td>${pagamento.observacoes}</td>
                <td>${gerarLinkAnexo(pagamento.caminhoArquivoAnexo)}</td>
                <td>
                    <button onclick="editarPagamento(${pagamento.id})">Editar</button>
                    <button onclick="excluirPagamento(${pagamento.id})">Excluir</button>
                </td>
            `;

            corpoTabela.appendChild(linha);
        });

    } catch (erro) {
        corpoTabela.innerHTML = "<tr><td colspan='9'>Não foi possível conectar à API.</td></tr>";
        console.error(erro);
    }
}

function formatarCnpj(cnpj) {
    if (!cnpj || cnpj.length !== 14) return cnpj;
    return cnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5");
}

function formatarValor(valor) {
    return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function formatarData(data) {
    const dataObj = new Date(data);
    return dataObj.toLocaleDateString("pt-BR", { timeZone: "UTC" });
}

function gerarLinkAnexo(caminhoCompleto) {
    if (!caminhoCompleto) return "Sem anexo";

    const nomeArquivo = caminhoCompleto.split(/[\\/]/).pop();
    const urlDownload = `${API_ENDPOINT}/anexo/${encodeURIComponent(nomeArquivo)}`;

    return `<a href="${urlDownload}" target="_blank">Baixar anexo</a>`;
}

function editarPagamento(id) {
    window.location.href = `editar.html?id=${id}`;
}

async function excluirPagamento(id) {
    const confirmacao = confirm("Tem certeza que deseja excluir este pagamento?");
    if (!confirmacao) return;

    try {
        const resposta = await fetch(`${API_ENDPOINT}/${id}`, { method: "DELETE" });

        if (resposta.ok) {
            alert("Pagamento excluído com sucesso!");
            carregarPagamentos();
        } else {
            const erro = await resposta.text();
            alert(`Erro ao excluir o pagamento: ${erro}`);
        }
    } catch (erro) {
        alert(`Erro ao conectar à API: ${erro.message}`);
        console.error(erro);
    }
}

carregarPagamentos();