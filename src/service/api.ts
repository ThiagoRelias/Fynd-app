const APi_URL = "https://slmxbp9p-8080.brs.devtunnels.m";

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
export { APi_URL };

