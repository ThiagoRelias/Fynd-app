import type { ProdutoResponse } from "../types/produtos";


const CATEGORIAS = ["todos", "eletronicos", "documentos", "roupas", "acessórios", "chaves", "bolsas e mochilas", "outros"]

type Props = {
    visivel: boolean;
    onFechar: () => void;
    onSalvar: (dados: ProdutoResponse) => void;
    salvando: boolean;
}

function dataParaIso(texto: string) {
    const partes = texto.split("/");

    if(partes.length !== 3) return null;
    const [dia,mes, ano] = partes.map(Number);
    
    const d = new Date(ano, mes -1, dia);
    if(isNaN(d.getTime()) || d.getDate() !== dia || ano < 2000) return null;

    return `${ano}-${String(mes).padStart(2,"0")}-${String(dia).padStart(2, "0")}`;
}

export default function FormObjeto({    
})  