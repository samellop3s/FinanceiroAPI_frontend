const URL_API = "https://financeiro-api-lopes-h7hcgub8f3aggmdn.centralus-01.azurewebsites.net/api/Pagamentos";

async function carregarPagamentos() {
    const corpoTabela = document.getElementById("corpoTabela");

    try {
        const resposta = await fetch(URL_API);

        if (!resposta.ok) {
            corpoTabela.innerHTML = "<tr><td colspan='8'>Erro ao carregar os pagamentos.</td></tr>";
            return;
        }

        const pagamentos = await resposta.json();

        if (pagamentos.length === 0) {
            corpoTabela.innerHTML = "<tr><td colspan='8'>Nenhum pagamento cadastrado ainda.</td></tr>";
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
            `;

            corpoTabela.appendChild(linha);
        });

    } catch (erro) {
        corpoTabela.innerHTML = "<tr><td colspan='8'>Não foi possível conectar à API.</td></tr>";
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
    const urlDownload = `https://financeiro-api-lopes-h7hcgub8f3aggmdn.centralus-01.azurewebsites.net/api/Pagamentos/anexo/${encodeURIComponent(nomeArquivo)}`;

    return `<a href="${urlDownload}" target="_blank">Baixar anexo</a>`;
}

carregarPagamentos();