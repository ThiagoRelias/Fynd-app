import type { Produto } from "../types/produtos";

const APi_URL = "https://nswmd7fm-8080.brs.devtunnels.ms";

export async function buscaProdutos() {
    try {
        const resposta = await fetch(`${APi_URL}/api/produtos`);
        if (!resposta.ok) throw new Error("Erro ao buscar Objeto.");
        return await resposta.json();
    } catch (erro) {
        console.log("Erro na API (produtos):", erro);
        throw erro;
    }
}

export async function buscaStats() {
    try {
        const resposta = await fetch(`${APi_URL}/api/stats`);
        if (!resposta.ok) throw new Error("Erro ao buscar estatísticas.");
        return await resposta.json();
    } catch (erro) {
        console.log("Erro na API (stats):", erro);
        throw erro;
    }
}

export async function criaProduto(dados: Partial<Produto>) {
    try {
        const resposta = await fetch(`${APi_URL}/api/produtos`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(dados),
        });
        if (!resposta.ok) throw new Error("Erro ao cadastrar objeto.");
        const texto = await resposta.text();
        return texto ? JSON.parse(texto) : null;
    } catch (erro) {
        console.log("Erro na API (criar):", erro);
        throw erro;
    }
}

export async function atualizaProduto(id: number, dados: Partial<Produto>) {
    try {
        const resposta = await fetch(`${APi_URL}/api/produtos/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(dados),
        });
        if (!resposta.ok) throw new Error("Erro ao atualizar objeto.");
        const texto = await resposta.text();
        return texto ? JSON.parse(texto) : null;
    } catch (erro) {
        console.log("Erro na API (atualizar):", erro);
        throw erro;
    }
}

export async function deletaProduto(id: number) {
    try {
        const resposta = await fetch(`${APi_URL}/api/produtos/${id}`, {
            method: "DELETE",
        });
        if (!resposta.ok) throw new Error("Erro ao deletar objeto.");
    } catch (erro) {
        console.log("Erro na API (deletar):", erro);
        throw erro;
    }
}

export { APi_URL };

