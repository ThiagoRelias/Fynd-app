export type StatusObjeto = "AGUARDANDO_DONO" | "DEVOLVIDO";

export interface Produto {
    id: number;
    nome: string;
    quantidade: string;
    descricao?: string;
    categoria?: string;
    imagemUrl: string;
    local: string;
    status?: "AGUARDANDO_DONO" | "DEVOLVIDO";
    dataEncontrado?: string;
}

export interface ProdutoResponse {
    nome: string;
    descricao: string;
    quantidade: string;
    categoria: string;
    local: string;
    status: StatusObjeto;
    dataEncontrado: string;
    imagemUrl: string;
}

export interface Stats {
    total: number
    devolvidos: number
    tempoMedioDias: number
}