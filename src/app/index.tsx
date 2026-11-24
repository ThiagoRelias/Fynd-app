import { Produto } from "@/types/produtos";
import { useQuery } from "@tanstack/react-query";
import { Link } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Image, Pressable, RefreshControl, StyleSheet, Text, TextInput, useWindowDimensions, View } from "react-native";
import { buscaProdutos, buscaStats } from "../service/api";



const CATEGORIAS = ["Todas", "Eletrônicos", "Documentos", "Roupas", "Acessorios", "Chaves", "mochila", "Outros"]
export default function Produtos() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [categoria, setCategoria] = useState("Todas");
  const [busca, setBusca] = useState("");
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [atualizando, setAtualizando] = useState(false);
  const { data: stats } = useQuery({ queryKey: ["stats"], queryFn: buscaStats, refetchInterval: 5 * 60 * 1000, });
  const { width } = useWindowDimensions();
  const larguraCard = (width - 32 - 12) / 2;

  async function carregandoProduto() {
    try {
      setErro("");

      const resposta: any = await buscaProdutos();
      const lista = Array.isArray(resposta) ? resposta : Array.isArray(resposta.content) ? resposta.content : [];
      setProdutos(lista);
    } catch (error) {
      setErro("Não foi possivel carregar os produtos.")
    } finally {
      setCarregando(false);
      setAtualizando(false);
    }
  }
  useEffect(() => {
    carregandoProduto();
  }, []);

  const filtrados = produtos.filter((p) => {
    const termo = busca.toLowerCase();
    const bateBusca =
      (p.nome ?? "").toLowerCase().includes(termo) ||
      (p.local ?? "").toLowerCase().includes(termo);
    const bateCategoria = categoria == "Todas" || p.categoria === categoria;

    return bateBusca && bateCategoria
  })
  return (
    <View style={s.container}>
      <FlatList
        data={filtrados}
        numColumns={2}
        columnWrapperStyle={{ gap: 12 }}
        keyExtractor={(p) => String(p.id)}
        contentContainerStyle={{ gap: 12, padding: 16, paddingTop: 56, paddingBottom: 32 }}
        keyboardShouldPersistTaps="handled"
        refreshControl={
          <RefreshControl
            refreshing={atualizando}
            tintColor="#a855f7"
            onRefresh={() => {
              setAtualizando(true);
              carregandoProduto();
            }}
          />
        }
        ListHeaderComponent={
          <View>
            <Image
              source={require("../../assets/images/logo.png")}
              style={s.logo}
              resizeMode="contain"
            />
            <Link href="/painel" asChild>
              <Pressable style={s.botaoPainel}>
                <Text style={s.botaoPainelTexto}>Painel Admin</Text>
              </Pressable>
            </Link>
            <Text style={s.eyebrow}>ACHADOS e PERDIDOS</Text>
            <Text style={s.heroTitulo}>Perdeu algo?</Text>
            <Text style={[s.heroTitulo, { color: "#7c3aed", fontSize: 45 }]}>Talvez esteja aqui.</Text>
            <Text style={s.heroSub}>
              Itens encontrados no campus ficam guardados aqui. Ache o seu, confirme que é dono e combine a retirada.
            </Text>

            <View style={s.busca}>
              <TextInput
                style={s.buscaInput}
                placeholder="Buscar por nome ou local ..."
                placeholderTextColor="#6b6880"
                value={busca}
                onChangeText={setBusca}
              />
            </View>
            <View style={s.chips}>
              {CATEGORIAS.map((c) => {
                const ativo = c === categoria;
                return (
                  <Pressable
                    key={c}
                    onPress={() => setCategoria(c)}
                    style={[s.chip, ativo && s.chipAtivo]}
                  >
                    <Text style={[s.chipTexto, ativo && s.chipTextoAtivo]}>{c}</Text>
                  </Pressable>
                );
              })}
            </View>

            <View style={s.stats}>
              <View style={s.stat}>
                <Text style={s.statValor}>{stats?.total ?? "-"}</Text>
                <Text style={s.statRotulo}>Cadastrados</Text>
              </View>
              <View style={s.stat}>
                <Text style={s.statValor}>{stats?.devolvidos ?? "-"}</Text>
                <Text style={s.statRotulo}>Devolvidos</Text>
              </View>
              <View style={s.stat}>
                <Text style={s.statValor}>
                  {stats ? `${stats.tempoMedioDias} dias` : "-"}
                </Text>
                <Text style={s.statRotulo}>tempo médio</Text>
              </View>
            </View>
            <View style={s.headerLista}>
              <Text style={s.tituloLista}>Encontrados Recentemente</Text>
            </View>
            {erro ? <Text style={s.erro}>{erro}</Text> : null}
          </View>
        }
        ListEmptyComponent={() =>
          carregando ? (
            <ActivityIndicator color="#a855f7" style={{ marginTop: 24 }} />
          ) : erro ? (
            <></>
          ) : (
            <Text style={s.vazio}>Nenhum objeto encontrado.</Text>
          )
        }
        renderItem={({ item }) => (
          <View style={[s.card, { width: larguraCard }]}>
            {item.imagemUrl ? (
              <Image source={{ uri: item.imagemUrl }} style={s.img} />
            ) : (
              <View style={[s.img, s.semImg]} />
            )}
            <View style={s.info}>
              <Text style={s.categoriaTag}>
                {(item.categoria ?? "").toUpperCase()}
              </Text>
              <Text style={s.nome} numberOfLines={2}>
                {item.nome}
              </Text>
              <Text style={s.local} numberOfLines={1}>
                {item.local ?? ""}
              </Text>
            </View>
          </View>
        )}
      />
    </View>
  );
}
const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0b0813",
  },
  eyebrow: {
    color: "#9a96ad",
    fontSize: 11,
    letterSpacing: 2,
    fontFamily: "Inter_600SemiBold",
    marginTop: 8,
    marginBottom: 8,
  },
  heroTitulo: {
    color: "#fff",
    fontSize: 34,
    lineHeight: 40,
    fontFamily: "Inter_800ExtraBold",
  },
  heroSub: {
    color: "#9a96ad",
    fontSize: 14,
    lineHeight: 21,
    fontFamily: "Inter_400Regular",
    marginTop: 12,
    marginBottom: 20,
  },
  input: {
    backgroundColor: "#14111f",
    borderColor: "#2A2338",
    borderWidth: 1,
    borderRadius: 10,
    color: "#fff",
    padding: 12,
    marginBottom: 16,
  },
  card: {
    backgroundColor: "#14111f",
    borderColor: "#2A2338",
    borderWidth: 1,
    borderRadius: 15,
    overflow: "hidden",
  },
  img: {
    width: "100",
    height: 150,
  },
  semImg: {
    backgroundColor: "#1b1729",
  },
  vazio: {
    color: "#9a96ad",
    textAlign: "center",
    marginTop: 40
  },
  info: {
    padding: 12,
    gap: 4
  },
  nome: {
    color: "#fff",
    fontSize: 15,
    fontFamily: "Inter_600SemiBold",
  },
  erro: {
    color: "#f87171",
    textAlign: "center",
    marginTop: 40
  },
  logo: {
    width: 120,
    height: 40,
    marginBottom: 10,
  },
  chips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 20,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: "#14111f",
    borderColor: "#241f33",
    borderWidth: 1,
  },
  chipAtivo: {
    backgroundColor: "#7c3aed",
  },
  chipTexto: {
    color: "#c9c6da",
    fontSize: 13,
  },
  chipTextoAtivo: {
    color: "#fff",
  },
  busca: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#14111f",
    borderColor: "#241f33",
    borderWidth: 1,
    marginBottom: 16,
    height: 48,
    width: "100%",
  },
  buscaInput: {
    flex: 1,
    height: "100%",
    paddingHorizontal: 12,
    fontSize: 14,
    color: "#fff",
  },
  stats: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 24,
  },
  stat: {
    flex: 1,
    backgroundColor: "#14111f",
    borderColor: "#241f33",
    borderWidth: 1,
    borderRadius: 15,
    padding: 14,
  },
  statRotulo: {
    color: "#9a96ad",
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    marginTop: 2,
  },
  statValor: {
    color: "#7c3aed",
    fontSize: 22,
    fontFamily: "Inter_800ExtraBold",
  },
  categoriaTag: {
    color: "#7c3aed",
    fontSize: 9,
    letterSpacing: 1,
    fontFamily: "Inter_600SemiBold",
  },
  local: {
    color: "#9a96ad",
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    marginTop: 4
  },
  headerLista: {
    marginBottom: 16
  },
  tituloLista: {
    color: "#fff",
    fontSize: 21,
    fontFamily: "Inter_800ExtraBold",
  },
  botaoPainel: {
    position: "absolute",
    top: 50,
    right: 20,
    zIndex: 10,
    backgroundColor: "#14111f",
    borderColor: "#7344c4",
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
  },
  botaoPainelTexto: {
    color: "#7c3aed",
    fontSize: 17,
    fontFamily: "Inter_600SemiBold",
  },
});