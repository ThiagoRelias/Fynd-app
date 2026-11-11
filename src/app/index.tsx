import { produto } from "@/types/produtos";
import { useEffect, useState } from "react";
import { buscaProdutos } from "./service/api";


const CATEGORIAS = ["Todos", "Eletrônicos","Documentos","Roupas", "Acessórios","Chaves","Bolsas e mochilas","Outros",] ;

export default function Index() {
    const [produtos, setProdutos] = useState<produto[]>([]);
    const [busca, setBusca] = useState("");
    const [categoriaSelecionada, setCategoriaSelecionada] = useState("Todos");
    const [carregando, setCarregando] = useState(true);
    const [erro,setErro] = useState("");
    const [atualizando, setAtualizando] = useState(false);

    async function carregandoProduto (){
      try{
        setErro("");

        const resposta : any = await buscaProdutos();

        const lista = Array.isArray(resposta)? resposta:Array.isArray(resposta.contentent) ?resposta.content :[];
        setProdutos(lista);
    } catch (error) {
        setErro("Não foi possivel carregar os produtos.")
    }finally {
      setCarregando(false);
      setAtualizando(false);
    }
  }

  useEffect (() => {
    carregandoProduto();
  }, []);

  function AtualizarLista(){
    setAtualizando(true);
    carregandoProduto();
  }

  const produtosfiltrados = produtos.filter((produto) => {
    const nome = produto.nome?.toLowerCase() || "";
    const categoria = produto.categoria || "";

    const correspondeBusca = nome.includes(busca.toLocaleLowerCase());

  } )
  {

  }
 return (
    <div>
      <h1>Lista de Produtos</h1>

      {carregando && <p>Carregando produtos...</p>}
      {erro && <p>{erro}</p>}

      <button onClick={AtualizarLista} disabled={atualizando}>
        {atualizando ? "Atualizando..." : "Atualizar"}
      </button>

      <ul>
        {produtos.map((item, index) => (
          <li key={index}>{JSON.stringify(item)}</li>
        ))}
      </ul>
    </div>
  );
}