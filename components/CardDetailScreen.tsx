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

// ... [suas interfaces]

const CardDetailScreen: React.FC<CardDetailScreenProps> = ({
  apiUrl,
  selectedIllustrationId,
  onClose,
}) => {
  const [cardDetail, setCardDetail] = useState<CardDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCardDetail = async () => {
      try {
        const response = await fetch(apiUrl);
        const data: CardDetail = await response.json();
        setCardDetail(data);
      } catch (error) {
        console.error("Error fetching card details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCardDetail();
  }, [apiUrl]);

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
            source={{ uri: `${getBaseUrl(apiUrl)}${selectedIllustration.src}` }}
            style={styles.illustration}
          />
        )}
        <Text style={styles.title}>{cardDetail.name}</Text>
        <Text style={styles.subtitle}>Type: {cardDetail.type}</Text>
        <Text style={styles.subtitle}>Rarity: {cardDetail.rare}</Text>
        <Text style={styles.subtitle}>Power: {cardDetail.power}</Text>
        <Text style={styles.subtitle}>Cost: {cardDetail.cost}</Text>
        <Text style={styles.subtitle}>
          Counter Value: {cardDetail.counter_value}
        </Text>
        <Text style={styles.subtitle}>
          Attribute: {cardDetail.attribute || "N/A"}
        </Text>
        <Text style={styles.subtitle}>
          Is DOM: {cardDetail.is_dom ? "Yes" : "No"}
        </Text>
        <Text style={styles.subtitle}>
          Trigger: {cardDetail.trigger || "None"}
        </Text>
        <Text style={styles.effect}>Effect: {cardDetail.effect}</Text>

        {cardDetail.crew.length > 0 && (
          <View>
            <Text style={styles.subtitle}>Crew:</Text>
            {cardDetail.crew.map((crew) => (
              <Text key={crew.id} style={styles.listItem}>
                - {crew.name}
              </Text>
            ))}
          </View>
        )}

        {cardDetail.deck_color.length > 0 && (
          <View>
            <Text style={styles.subtitle}>Deck Color:</Text>
            {cardDetail.deck_color.map((color) => (
              <Text key={color.id} style={styles.listItem}>
                - {color.name}
              </Text>
            ))}
          </View>
        )}

        <Text style={styles.subtitle}>Side Effects:</Text>
        {cardDetail.side_effects.length > 0 ? (
          cardDetail.side_effects.map((effect, index) => (
            <Text key={index} style={styles.listItem}>
              - {effect}
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
