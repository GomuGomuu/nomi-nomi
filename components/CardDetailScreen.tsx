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
import { MaterialIcons } from "@expo/vector-icons";
import { postCardCollection } from "@services/api";

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
    price: number;
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
  onClose: () => void;
}

const CardDetailScreen: React.FC<CardDetailScreenProps> = ({
  cardDetail,
  selectedIllustrationId,
  onClose,
}) => {
  const [loading, setLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#ffffff" />
      </View>
    );
  }

  if (!cardDetail) {
    return null;
  }

  const selectedIllustration = cardDetail.illustrations.find(
    (illustration) => illustration.code === selectedIllustrationId
  );

  const imageUrl = selectedIllustration
    ? `${MerryEndpoints.BASE_URL}${selectedIllustration.data.src}`
    : null;

  const handleIncreaseQuantity = async (illustration_slug: string) => {
    try {
      await postCardCollection(illustration_slug);
      alert(`Illustration ${illustration_slug} added to wallet!`);
    } catch (error) {
      console.error("Error increasing quantity:", error);
    }
  };


  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          <View style={styles.imageContainer}>
            <Image
              source={
                imageUrl
                  ? { uri: imageUrl }
                  : require("@assets/images/card-frame.png")
              }
              style={styles.bigIllustration}
              onError={() => setImageError(true)}
            />
          </View>

          <Text style={styles.title}>{cardDetail.data.name}</Text>

          <View style={styles.detailsContainer}>
            {renderDetailRow("Price", `R$ ${selectedIllustration?.data.price}`)}
            {renderDetailRow("Type", cardDetail.data.type)}
            {renderDetailRow("Rarity", cardDetail.data.rare)}
            {renderDetailRow("Power", cardDetail.data.power.toString())}
            {renderDetailRow("Cost", cardDetail.data.cost.toString())}
            {renderDetailRow(
              "Counter Value",
              cardDetail.data.counter_value.toString()
            )}
            {renderDetailRow("Attribute", cardDetail.data.attribute || "N/A")}
            {renderDetailRow("Is DOM", cardDetail.data.is_dom ? "Yes" : "No")}
            {renderDetailRow("Trigger", cardDetail.data.trigger || "None")}
            <Text style={styles.effect}>
              <Text style={styles.subtitle}>Effect:</Text>
              {"\n"}
              {cardDetail.data.effect}
            </Text>
          </View>

          <View style={styles.infoContainer}>
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
          </View>
        </View>
      </ScrollView>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={() => {
            if (selectedIllustration?.code) {
              handleIncreaseQuantity(selectedIllustration.code);
            }
          }}
          style={styles.addButton}
        >
          <MaterialIcons name="wallet" size={24} color="white" />
          <Text style={styles.addButtonText}> Add to Wallet</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const renderDetailRow = (label: string, value: string) => (
  <View style={styles.detailRow}>
    <Text style={styles.detailLabel}>{label}:</Text>
    <Text style={styles.detailValue}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
  },
  scrollContent: {
    alignItems: "flex-start",
    paddingBottom: 80,
  },
  card: {
    width: "100%",
    backgroundColor: "#222",
    borderRadius: 10,
    padding: 20,
    marginVertical: 10,
    alignSelf: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
  },
  imageContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  bigIllustration: {
    width: "75%",
    height: 350,
    borderRadius: 0,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ffffff",
    textAlign: "center",
    marginVertical: 10,
  },
  detailsContainer: {
    width: "100%",
    marginBottom: 20,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 5,
  },
  detailLabel: {
    fontSize: 16,
    color: "#ffffff",
    fontWeight: "bold",
  },
  detailValue: {
    fontSize: 16,
    color: "#cccccc",
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ffffff",
  },
  effect: {
    color: "#ffffff",
    marginVertical: 5,
  },
  listItem: {
    color: "#cccccc",
    marginLeft: 10,
  },
  infoContainer: {},
  buttonContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    paddingVertical: 10,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#28a745",
    borderRadius: 5,
  },
  addButtonText: {
    color: "white",
    textAlign: "center",
    marginLeft: 5,
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.9)",
  },
});

export default CardDetailScreen;
