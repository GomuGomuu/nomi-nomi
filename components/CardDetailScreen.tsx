import { MerryEndpoints } from "@constants/Merry";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";

interface CardData {
  id: number;
  name: string;
  slug: string;
  is_dom: boolean;
  cost: number;
  power: number;
  counter_value: number;
  effect: string;
  type: string;
  rare: string;
  trigger: string;
  op: {
    id: number;
    name: string;
    slug: string;
  };
  attribute: string | null;
  crew: Array<{
    id: number;
    name: string;
    slug: string;
  }>;
  deck_color: Array<{
    id: number;
    name: string;
  }>;
  side_effects: Array<{
    id: number;
    name: string;
    slug: string;
  }>;
}

interface Illustration {
  code: string;
  similarity: number;
  data: {
    id: number;
    src: string;
  };
}

interface Card {
  slug: string;
  similarity: number;
  illustrations: Illustration[];
  data: CardData;
}

interface CardDetailScreenProps {
  cardDetail: Card;
  selectedIllustrationId: string;
  apiBaseUrl: string;
  onClose: () => void;
}

const CardDetailScreen: React.FC<CardDetailScreenProps> = ({
  cardDetail,
  selectedIllustrationId,
  apiBaseUrl,
  onClose,
}) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulação de carregamento, você pode ajustar conforme necessário
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500); // Simula um tempo de carregamento

    return () => clearTimeout(timer); // Limpa o timer ao desmontar
  }, []);

  const getBaseUrl = (url: string) => {
    try {
      const { protocol, host } = new URL(url);
      return `${protocol}//${host}`;
    } catch (error) {
      console.error("Invalid URL:", error);
      return "";
    }
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#ffffff" />
      </View>
    );
  }

  if (!cardDetail) {
    return null; // Se não houver dados do card, não renderiza nada
  }

  // Encontrar a ilustração selecionada
  const selectedIllustration = cardDetail.illustrations.find(
    (illustration) => illustration.code === selectedIllustrationId
  );

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {selectedIllustration && (
          <Image
            source={{
              uri: `${MerryEndpoints.BASE_URL}${selectedIllustration.data.src}`,
            }}
            style={styles.illustration}
          />
        )}
        <Text style={styles.title}>{cardDetail.data.name}</Text>
        <Text style={styles.subtitle}>Type: {cardDetail.data.type}</Text>
        <Text style={styles.subtitle}>Rarity: {cardDetail.data.rare}</Text>
        <Text style={styles.subtitle}>Power: {cardDetail.data.power}</Text>
        <Text style={styles.subtitle}>Cost: {cardDetail.data.cost}</Text>
        <Text style={styles.subtitle}>
          Counter Value: {cardDetail.data.counter_value}
        </Text>
        <Text style={styles.subtitle}>
          Attribute: {cardDetail.data.attribute || "N/A"}
        </Text>
        <Text style={styles.subtitle}>
          Is DOM: {cardDetail.data.is_dom ? "Yes" : "No"}
        </Text>
        <Text style={styles.subtitle}>
          Trigger: {cardDetail.data.trigger || "None"}
        </Text>
        <Text style={styles.effect}>Effect: {cardDetail.data.effect}</Text>

        {cardDetail.data.crew?.length > 0 && (
          <View>
            <Text style={styles.subtitle}>Crew:</Text>
            {cardDetail.data.crew.map((crew) => (
              <Text key={crew.id} style={styles.listItem}>
                - {crew.name}
              </Text>
            ))}
          </View>
        )}

        {cardDetail.data.deck_color?.length > 0 && (
          <View>
            <Text style={styles.subtitle}>Deck Color:</Text>
            {cardDetail.data.deck_color.map((color) => (
              <Text key={color.id} style={styles.listItem}>
                - {color.name}
              </Text>
            ))}
          </View>
        )}

        <Text style={styles.subtitle}>Side Effects:</Text>
        {cardDetail.data.side_effects?.length > 0 ? (
          cardDetail.data.side_effects.map((effect, index) => (
            <Text key={index} style={styles.listItem}>
              - {effect.name}
            </Text>
          ))
        ) : (
          <Text style={styles.listItem}>None</Text>
        )}
      </ScrollView>

      {/* Caixa preta com os botões */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Text style={styles.closeButtonText}>Close</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => alert("Illustration added to wallet!")}
          style={styles.addButton}
        >
          <Text style={styles.addButtonText}>Add to Wallet</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "black",
    flexDirection: "row", // Organiza os botões em linha
    justifyContent: "space-between", // Espaçamento entre os botões
    paddingVertical: 10,
  },
  addButton: {
    width: "48%", // Ajusta a largura do botão para ocupar a metade
    padding: 10,
    backgroundColor: "#44ff44",
    borderRadius: 5,
    alignSelf: "center",
  },
  addButtonText: {
    color: "white",
    textAlign: "center",
  },
  container: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.9)",
    padding: 20,
  },
  scrollContent: {
    alignItems: "flex-start",
    paddingBottom: 80, // Espaço para o botão de fechar
  },
  illustration: {
    width: 300, // Ajuste o tamanho conforme necessário
    height: 400, // Ajuste o tamanho conforme necessário
    marginBottom: 20,
    alignSelf: "center",
    borderRadius: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ffffff",
  },
  subtitle: {
    fontSize: 18,
    color: "#ffffff",
    marginVertical: 5,
  },
  effect: {
    color: "#ffffff",
    marginVertical: 5,
  },
  listItem: {
    color: "#cccccc",
    marginLeft: 10,
  },
  closeButton: {
    width: "48%", // Ajusta a largura do botão para ocupar a metade
    padding: 10,
    backgroundColor: "#ff4444",
    borderRadius: 5,
    alignSelf: "center",
  },
  closeButtonText: {
    color: "white",
    textAlign: "center",
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.9)",
  },
});

export default CardDetailScreen;
