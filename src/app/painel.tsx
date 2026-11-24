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
        backgroundColor: "#0b0813"
    },
    logo: {
        width: 120,
        height: 40,
        marginBottom: 16,
    },
    eyebrow: {
        color: "#281b66",
        fontSize: 11,
        letterSpacing: 2,
        fontFamily: "Inter_600SemiBold",
        marginTop: 8,
        marginBottom: 8,

    },
    titulo: {
        color: "#fff",
        fontSize: 30,
        lineHeight: 36,
        fontFamily: "Inter_800ExtraBold",
    },
    resumo: {
        color: "#fff",
        fontSize: 13,
        fontFamily: "Inter_400Regular",
        marginTop: 6,
        marginBottom: 16,
    },
    botaoCadastrar: {
        backgroundColor: "#7c3aed",
        borderRadius: 14,
        paddingVertical: 16,
        alignItems: "center"
    },
    botaoCadastrarTexto: {
        color: "#fff",
        fontSize: 15,
        fontFamily: "Inter_600SemiBold",
    },
    filtrar: {
        backgroundColor: "#14111f",
        borderColor: "#241f33",
        borderWidth: 1,
        borderRadius: 12,
        color: "#fff",
        fontSize: 14,
        fontFamily: "Inter_400Regular",
        paddingHorizontal: 14,
        paddingVertical: 14,
        marginBottom: 16,

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
        borderRadius: 99,
        backgroundColor: "#14111f",
        borderWidth: 1,
        borderColor: "#262136",
    },
    chipAtivo: {
        backgroundColor: "#7C14F5",
        fontSize: 13,
        fontFamily: "Inter_400Regular",
    },
    chipTexto: {
        color: "#9C94AE",
        fontSize: 13,
        fontFamily: "Inter_600SemiBold",
    },
    chipTextoAtivo: {
        color: "#fff",
        fontFamily: "Inter_600SemiBold",
    },
    erro: {
        color: "#e4c3c3",
        textAlign: "center",
        marginBottom: 16,
    },
    vazio: {
        color: "#9a96ad",
        textAlign: "center",
        marginTop: 40,
    },
    card: {
        backgroundColor: "#14111f",
        borderColor: "#2A2338",
        borderWidth: 1,
        borderRadius: 16,
        overflow: "hidden",
    },
    img: {
        width: "100%",
        height: 110,
    },
    semImg: {
        backgroundColor: "#1b1729",
    },
    info: {
        padding: 12,
        gap: 8
    },
    badge: {
        alignSelf: "stretch",
        alignItems: "center",
        borderRadius: 99,
        borderColor: "#7c3aed",
        borderWidth: 1,
        backgroundColor: "#1d1432",
        paddingVertical: 4,
        marginBottom: 4,
    },
    badgeDevolvido: {
        borderColor: "#3eb86b",
        backgroundColor: "#0f2a1a",
    },
    badgeTexto: {
        color: "#fff",
        fontSize: 11,
        fontFamily: "Inter_600SemiBold",
    },
    badgeTextoDevolvido: {
        color: "#37794f"
    },
    nome: {
        color: "#fff",
        fontSize: 15,
        fontFamily: "Inter_600SemiBold"
    },
    categoriaTag: {
        color: "#7c3aed",
        fontSize: 9,
        letterSpacing: 1,
        fontFamily: "Inter_600SemiBold"
    },
    data: {
        color: "#9a96ad",
        fontSize: 12,
        fontFamily: "Inter_400Regular"
    },
    local: {
        color: "#9a96ad",
        fontSize: 12,
        fontFamily: "Inter_400Regular",
        minHeight: 32,
    },
    acoes: {
        flexDirection: "row",
        gap: 8,
        marginTop: 6,
    },
    botaoEditar: {
        flex: 1,
        alignItems: "center",
        paddingVertical: 10,
    },
    botaoEditarTexto: {
        color: "#fff",
        fontSize: 12,
        fontFamily: "Inter_600SemiBold",
    },
    botaoDeletar: {
        flex: 1,
        alignItems: "center",
        borderRadius: 999,
        backgroundColor: "#c05151",
        paddingVertical: 10,
    },
    botaoDeletarTexto: {
        color: "#fff",
        fontSize: 12,
        fontFamily: "Arial",
    },
    botaoStatus: {
        alignItems: "center",
        borderRadius: 999,
        backgroundColor: "#7c3aed",
        paddingVertical: 11,
    },
    botaoStatusTexto: {
        color: "#fff",
        fontSize: 12,
        fontFamily: "Inter_600SemiBold",
    },
});