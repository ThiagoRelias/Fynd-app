import { Produto } from "@/types/produtos";
import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Image, RefreshControl, StyleSheet, Text, TextInput, View } from "react-native";
import { buscaProdutos } from "../service/api";



export default function Produtos() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [busca, setBusca] = useState("");
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [atualizando, setAtualizando] = useState(false);

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

  const filtrados = produtos.filter((p) => (p.nome ?? "").toLowerCase().includes(busca.toLowerCase()));

  return (
    <View style={s.container}>
      <Image
        source={require("../../assets/images/logo.png")}
        style={s.logo}
        resizeMode="contain"
      />
      <Text style={s.titulo}>Produtos</Text>

      <TextInput
        style={s.input}
        placeholder="Buscar por nome..."
        placeholderTextColor="#6b6880"
        value={busca}
        onChangeText={setBusca}
      />

      {carregando ? (
        <ActivityIndicator color="#a855f7" style={{ marginTop: 40 }} />
      ) : erro ? (
        <Text style={s.erro}>{erro}</Text>
      ) : (
        <FlatList
          data={filtrados}
          keyExtractor={(p) => String(p.id)}
          contentContainerStyle={{ gap: 12, paddingBottom: 24 }}
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
          ListEmptyComponent={
            <Text style={s.vazio}>Nenhum produto encontrado.</Text>
          }
          renderItem={({ item }) => (
            <View style={s.card}>
              {item.imagem ? (
                <Image source={{ uri: item.imagem }} style={s.img} />
              ) : (
                <View style={[s.img, s.semImg]} />
              )}

              <View style={s.info}>
                <Text style={s.nome} numberOfLines={2}>
                  {item.nome}
                </Text>
                <Text style={s.preco}>
                  {Number(item.preco).toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </Text>
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0b0813",
    padding: 16,
  },
  titulo: {
    color: "#fff",
    fontSize: 28,
    fontFamily: "Inter_800ExtraBold",
    marginBottom: 16,
  },
  input: {
    backgroundColor: "#14111f",
    borderColor: "#241f33",
    borderWidth: 1,
    borderRadius: 10,
    color: "#fff",
    padding: 12,
    marginBottom: 16,
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#14111f",
    borderColor: "#241f33",
    borderWidth: 1,
    borderRadius: 12,
    overflow: "hidden"
  },
  img: {
    width: 100,
    height: 100
  },
  preco: {

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
    flex: 1,
    padding: 12,
    justifyContent: "center",
    gap: 6
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
    marginBottom: 16,
  },
});