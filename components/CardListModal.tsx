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

  const handleCardPress = (card: Card) => {
    setSelectedCard(card);
    setShowDetailScreen(false);
  };

  const handleBackPress = () => {
    if (showDetailScreen) {
      setShowDetailScreen(false);
      setSelectedIllustrationId(null);
    } else if (selectedCard) {
      setSelectedCard(null);
    } else {
      onClose();
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalContainer}>
        {!showDetailScreen ? (
          !selectedCard ? (
            <ScrollView contentContainerStyle={styles.cardList}>
              {data.length > 0 && (
                <TouchableOpacity
                  onPress={() => handleCardPress(data[0])}
                  style={styles.bigCardItem}
                >
                  <Image
                    source={{
                      uri: `${MerryEndpoints.BASE_URL}${data[0].illustrations[0].data.src}`,
                    }}
                    style={styles.bigCardImage}
                  />
                  <Text style={styles.cardName}>{data[0].data.name}</Text>
                  <Text style={styles.confidence}>
                    Similarity: {data[0].similarity.toFixed(2)}
                  </Text>
                </TouchableOpacity>
              )}
              <View style={styles.gallery}>
                {data.slice(1).map((recognitionItem, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => handleCardPress(recognitionItem)}
                    style={styles.cardItem}
                  >
                    <Image
                      source={{
                        uri: `${MerryEndpoints.BASE_URL}${recognitionItem.illustrations[0].data.src}`,
                      }}
                      style={styles.cardImage}
                    />
                    <Text style={styles.cardName}>
                      {recognitionItem.data.name}
                    </Text>
                    <Text style={styles.confidence}>
                      Similarity: {recognitionItem.similarity.toFixed(2)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          ) : (
            <View style={styles.cardDetailContainer}>
              <ScrollView style={styles.cardDetailContainer}>
                <TouchableOpacity
                  onPress={() => {
                    setSelectedIllustrationId(
                      selectedCard.illustrations[0].code
                    );
                    setShowDetailScreen(true);
                  }}
                  style={styles.cardDetailTouchable}
                >
                  <Text style={styles.cardDetailName}>
                    {selectedCard.data.name}
                  </Text>
                  <Image
                    source={{
                      uri: `${MerryEndpoints.BASE_URL}${selectedCard.illustrations[0].data.src}`,
                    }}
                    style={styles.cardDetailImage}
                  />
                  <Text style={styles.cardDescription}>
                    {selectedCard.data.slug}
                    {"\n"}
                    Similarity: {selectedCard.similarity.toFixed(2)}
                  </Text>
                </TouchableOpacity>
                <ScrollView contentContainerStyle={styles.scrollContainer}>
                  {selectedCard.illustrations
                    .slice(1)
                    .map((illustration, index) => (
                      <TouchableOpacity
                        key={index}
                        onPress={() => handleIllustrationPress(illustration)}
                        style={styles.touchable}
                      >
                        <Image
                          source={{
                            uri: `${MerryEndpoints.BASE_URL}${illustration.data.src}`,
                          }}
                          style={styles.detailImage}
                        />
                        <Text style={styles.illustrationCode}>
                          {illustration.code}
                        </Text>
                        <Text style={styles.similarityText}>
                          Similarity: {illustration.similarity.toFixed(2)}
                        </Text>
                      </TouchableOpacity>
                    ))}
                </ScrollView>
              </ScrollView>
            </View>
          )
        ) : (
          selectedCard && (
            <CardDetailScreen
              cardDetail={selectedCard}
              selectedIllustrationId={selectedIllustrationId!}
              onClose={() => {
                setShowDetailScreen(false);
                setSelectedCard(null);
                setSelectedIllustrationId(null);
              }}
            />
          )
        )}
        <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
          <Text style={styles.backButtonText}>
            {showDetailScreen || selectedCard ? "Back" : "Close"}
          </Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.9)",
    padding: 20,
  },
  cardList: {
    alignItems: "center",
    paddingBottom: 20,
  },
  bigCardItem: {
    width: "70%",
    backgroundColor: "#333",
    borderRadius: 10,
    marginBottom: 20,
    padding: 15,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  bigCardImage: {
    width: "80%",
    height: 250,
    borderRadius: 10,
  },
  gallery: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    width: "100%",
  },
  cardItem: {
    width: "48%",
    backgroundColor: "#222",
    borderRadius: 10,
    marginBottom: 15,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
    alignItems: "center",
  },
  cardImage: {
    width: "50%",
    height: 110,
    borderRadius: 5,
  },
  cardName: {
    color: "white",
    marginTop: 5,
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 14,
    marginBottom: 5,
  },
  confidence: {
    color: "white",
    fontSize: 12,
  },
  cardDetailContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.9)",
    borderRadius: 10,
  },
  cardDetailTouchable: {
    width: "100%",
    alignItems: "center",
  },
  cardDetailImage: {
    width: "77%",
    height: 400,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.5,
    shadowRadius: 3,
    elevation: 5,
  },
  cardDetailName: {
    color: "white",
    fontSize: 35,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
  },
  backButton: {
    marginTop: 20,
    backgroundColor: "#444",
    borderRadius: 5,
    padding: 10,
    alignItems: "center",
  },
  backButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  touchable: {
    alignItems: "center",
    margin: 5,
  },
  detailImage: {
    width: "39%",
    height: 200,
    margin: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.5,
    shadowRadius: 3,
    elevation: 5,
  },
  cardDescription: {
    color: "white",
    fontSize: 20,
    textAlign: "center",
  },
  effect: {
    color: "white",
    fontSize: 12,
    textAlign: "center",
  },
  illustrationCode: {
    color: "white",
    fontSize: 12,
    textAlign: "center",
  },
  similarityText: {
    color: "white",
    fontSize: 12,
    textAlign: "center",
  },
});

export default CardListModal;
