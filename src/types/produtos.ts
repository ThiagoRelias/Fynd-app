export interface Produto {
    id: number;
    nome: string;
    quantidade: string;
    descricao?: string;
    categoria?: string;
    imagem: string
    preco: number;
}