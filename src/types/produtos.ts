export interface Produto {
    id: number;
    nome: string;
    quantidade: string;
    descricao?: string;
    categoria?: string;
    imagemUrl: string
    local: string;
    status?: "AGUARDANDO_DONO" | "DEVOLVIDO";
    dataEncontrado: string;
}       

export interface Stats {
    total: number
    devolvidos: number
    tempoMedioDias: number
}
