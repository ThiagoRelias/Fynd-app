export interface Produto {
    id: number;
    nome: string;
    quantidade: string;
    descricao?: string;
    categoria?: string;
    imagemUrl: string
    local: string;
}       

export interface Stats {
    total: number
    devolvidos: number
    tempoMedioDias: number
}