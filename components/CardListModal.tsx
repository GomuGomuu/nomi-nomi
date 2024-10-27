import React, { useState } from "react";
import {
  View,
  Text,
  Modal,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import CardDetailScreen from "./CardDetailScreen";
import { MerryEndpoints } from "@constants/Merry";

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

interface CardListModalProps {
  visible: boolean;
  onClose: () => void;
  data: Card[];
}

const CardListModal: React.FC<CardListModalProps> = ({
  visible,
  onClose,
  data,
}) => {
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [showDetailScreen, setShowDetailScreen] = useState<boolean>(false);
  const [selectedIllustrationId, setSelectedIllustrationId] = useState<
    string | null
  >(null);

  const handleIllustrationPress = (illustration: Illustration) => {
    setSelectedIllustrationId(illustration.code);
    setShowDetailScreen(true);
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalContainer}>
        {!showDetailScreen ? (
          !selectedCard ? (
            <ScrollView contentContainerStyle={styles.cardList}>
              {data.map((recognitionItem, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() =>
                    setSelectedCard(
                      data.find((card) => card.slug === recognitionItem.slug) ||
                        null
                    )
                  }
                  style={styles.cardItem}
                >
                  <Text style={{ color: "white" }}>{recognitionItem.slug}</Text>
                  <Image
                    source={{
                      uri: `${MerryEndpoints.BASE_URL}${recognitionItem.illustrations[0].data.src}`,
                    }}
                    style={styles.cardImage}
                  />
                  <Text style={styles.confidence}>
                    Similarity: {recognitionItem.similarity.toFixed(2)}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          ) : (
            <View style={styles.cardDetail}>
              <Text style={styles.cardName}>{selectedCard.data.name}</Text>
              <ScrollView contentContainerStyle={styles.scrollContainer}>
                {data
                  .find(
                    (recognitionItem) =>
                      recognitionItem.slug === selectedCard.slug
                  )
                  ?.illustrations.map((illustration, index) => (
                    <TouchableOpacity
                      key={index}
                      onPress={() => handleIllustrationPress(illustration)}
                      style={styles.touchable}
                    >
                      <Text style={{ color: "white", textAlign: "center" }}>
                        {illustration.code}
                      </Text>
                      <Image
                        source={{
                          uri: `${MerryEndpoints.BASE_URL}${illustration.data.src}`,
                        }}
                        style={styles.detailImage}
                      />
                      <Text style={styles.similarityText}>
                        Similarity: {illustration.similarity.toFixed(2)}
                      </Text>
                    </TouchableOpacity>
                  ))}
              </ScrollView>
              <TouchableOpacity
                onPress={() => setSelectedCard(null)}
                style={styles.closeButton}
              >
                <Text style={styles.closeButtonText}>Back to List</Text>
              </TouchableOpacity>
            </View>
          )
        ) : (
          selectedCard && (
            <CardDetailScreen
              cardDetail={selectedCard}
              apiBaseUrl="http://localhost:8000"
              selectedIllustrationId={selectedIllustrationId!}
              onClose={() => {
                setShowDetailScreen(false);
                setSelectedCard(null);
                setSelectedIllustrationId(null);
              }}
            />
          )
        )}
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Text style={styles.closeButtonText}>Close</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    padding: 20,
  },
  cardList: {
    alignItems: "center",
    paddingBottom: 20,
  },
  cardItem: {
    alignItems: "center",
    marginBottom: 15,
  },
  cardImage: {
    width: 100,
    height: 140,
    borderRadius: 10,
  },
  cardName: {
    color: "white",
    marginTop: 5,
    fontWeight: "bold",
  },
  confidence: {
    color: "white",
  },
  cardDetail: {
    flex: 1,
    padding: 20,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
  },
  detailImage: {
    width: 150,
    height: 200,
    margin: 10,
    borderRadius: 10,
  },
  closeButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#ff4444",
    borderRadius: 5,
  },
  closeButtonText: {
    color: "white",
    textAlign: "center",
  },
  scrollContainer: {
    alignItems: "center",
    paddingVertical: 20,
  },
  touchable: {
    marginBottom: 15,
  },
  similarityText: {
    color: "white",
    marginTop: 5,
  },
});

export default CardListModal;
