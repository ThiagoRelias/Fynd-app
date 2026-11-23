import { buscaProdutos } from "@/service/api";
import { Produto } from "@/types/produtos";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { ActivityIndicator, FlatList, Image, Pressable, StyleSheet, Text, TextInput, useWindowDimensions, View } from "react-native";


const FILTROS = ["Todos", "Aguardando dono", "Devolvidos"]

const MESES = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"]


function formatarData(data?: string) {

    if (!data) return "";
    const d = new Date(data);
    if (isNaN(d.getTime())) return "";
    const dia = String(d.getDate()).padStart(2, "0");
    return `${dia} ${MESES[d.getMonth()]} ${d.getFullYear()}`;

}

export default function Painel() {

    const [busca, setBusca] = useState("");
    const [filtro, setFiltro] = useState("Todos");

    const { width } = useWindowDimensions();
    const larguraCard = (width - 32 - 12) / 2;

    const { data, isLoading, isError } = useQuery({
        queryKey: ["produtos"],
        queryFn: buscaProdutos,
    });

    const produtos: Produto[] = Array.isArray(data) ? data : Array.isArray(data?.content) ? data.content : [];

    const total = produtos.length;
    const devolvidos = produtos.filter((p) => p.status === "DEVOLVIDO").length;
    const aguardando = total - devolvidos;

    const filtrados = produtos.filter((p) => {
        const termo = busca.toLowerCase();

        const bateBusca =
            (p.nome ?? "").toLowerCase().includes(termo) ||
            (p.local ?? "").toLowerCase().includes(termo);

        const bateFiltro =
            filtro === "Todos" ||
            (filtro === "Devolvidos" && p.status === "DEVOLVIDO") ||
            (filtro === "Aguardando dono" && p.status !== "DEVOLVIDO");

        return bateBusca && bateFiltro;

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
                ListHeaderComponent={

                    <View>

                        <Image
                            source={require("../../assets/images/logo.png")}
                            style={s.logo}
                            resizeMode="contain"
                        />

                        <Text style={s.eyebrow}>PAINEL</Text>
                        <Text style={s.titulo}>Objetos cadastrados</Text>
                        <Text style={s.resumo}> {total} no total · {aguardando} aguardando · {devolvidos} devolvido{devolvidos === 1 ? "" : "s"}
                        </Text>
                        <Pressable style={s.botaoCadastrar}>
                            <Text style={s.botaoCadastrarTexto}>+  Cadastrar objeto</Text>
                        </Pressable>

                        <TextInput
                            style={s.filtrar}
                            placeholder="Filtrar objetos..."
                            placeholderTextColor="#6b6880"
                            value={busca}
                            onChangeText={setBusca}
                        />

                        <View style={s.chips}>
                            {FILTROS.map((f) => {
                                const ativo = f === filtro;
                                return (
                                    <Pressable
                                        key={f}
                                        onPress={() => setFiltro(f)}
                                        style={[s.chip, ativo && s.chipAtivo]}
                                    >
                                        <Text style={[s.chipTexto, ativo && s.chipTextoAtivo]}>{f}</Text>
                                    </Pressable>

                                );
                            })}
                        </View>
                        {isError ? <Text style={s.erro}>Não foi possível carregar os objetos.</Text> : null}
                    </View>
                }
                ListEmptyComponent={() =>
                    isLoading ? (
                        <ActivityIndicator color="#a855f7" style={{ marginTop: 24 }} />
                    ) : isError ? null : (
                        <Text style={s.vazio}>Nenhum objeto encontrado.</Text>
                    )
                }
                renderItem={({ item }) => {

                    const devolvido = item.status === "DEVOLVIDO";

                    return (

                        <View style={[s.card, { width: larguraCard }]}>

                            {item.imagemUrl ? (
                                <Image source={{ uri: item.imagemUrl }} style={s.img} />
                            ) : (
                                <View style={[s.img, s.semImg]} />
                            )}

                            <View style={s.info}>

                                <View style={[s.badge, devolvido && s.badgeDevolvido]}>
                                    <Text style={[s.badgeTexto, devolvido && s.badgeTextoDevolvido]}>
                                        {devolvido ? "Devolvido" : "Aguardando dono"}
                                    </Text>
                                </View>

                                <Text style={s.nome} numberOfLines={2}>
                                    {item.nome}
                                </Text>

                                <Text style={s.categoriaTag}>
                                    {(item.categoria ?? "").toUpperCase()}
                                </Text>

                                <Text style={s.data}>{formatarData(item.dataEncontrado)}</Text>

                                <Text style={s.local} numberOfLines={2}>
                                    {item.local ?? ""}
                                </Text>

                                <View style={s.acoes}>

                                    <Pressable style={s.botaoEditar}>
                                        <Text style={s.botaoEditarTexto}>Editar</Text>
                                    </Pressable>

                                    <Pressable style={s.botaoDeletar}>
                                        <Text style={s.botaoDeletarTexto}>Deletar</Text>
                                    </Pressable>
                                </View>

                                <Pressable style={s.botaoStatus}>
                                    <Text style={s.botaoStatusTexto}>Alterar status</Text>
                                </Pressable>
                            </View>
                        </View>
                    );
                }}
            />
        </View>
    );
}
const s = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#42325f"
    },
    logo: {
        width: 120,
        height: 40,
        marginBottom: 16,
    },
    eyebrow: {
        color: "#9a96ad"

    },
    titulo: {

    },
    resumo: {

    },
    botaoCadastrar: {

    },
    botaoCadastrarTexto: {

    },
    filtrar: {

    },
    chips: {

    },
    chip: {

    },
    chipAtivo: {

    },
    chipTexto: {

    },
    chipTextoAtivo: {

    },
    erro: {

    },
    vazio: {

    },
    card: {

    },
    img: {

    },
    semImg: {

    },
    info: {

    },
    badge: {

    },
    badgeDevolvido: {

    },
    badgeTexto: {

    },
    badgeTextoDevolvido: {

    },
    nome: {

    },
    categoriaTag: {

    },
    data: {

    },
    local: {

    },
    acoes: {

    },
    botaoEditar: {

    },
    botaoEditarTexto: {

    },
    botaoDeletar: {

    },
    botaoDeletarTexto: {

    },
    botaoStatus: {

    },
    botaoStatusTexto: {

    }
});