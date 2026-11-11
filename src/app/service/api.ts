const APi_URL ="esperar pedro terminar a api";

export async function buscaProdutos () {
    try{
        const resposta = await fetch(`${APi_URL}/api/produtos`);

        if (!resposta.ok) {
            throw new Error("Erro ao buscar produtos.");
        }

        return await resposta.json();
    }catch(erro) {
        console.error("Erro na API:", erro);
        throw erro;
    }
}

export { APi_URL };

