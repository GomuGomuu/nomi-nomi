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

interface Illustration {
  src: string;
  code: string;
}

interface Card {
  id: number;
  name: string;
  confidence: number;
  illustrations: Illustration[];
  api_url: string;
}

interface CardListModalProps {
  visible: boolean;
  cards: Card[];
  onClose: () => void;
}

const CardListModal: React.FC<CardListModalProps> = ({
  visible,
  cards,
  onClose,
}) => {
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [showDetailScreen, setShowDetailScreen] = useState<boolean>(false);
  const [selectedIllustrationId, setSelectedIllustrationId] = useState<
    string | null
  >(null);

  const sortedCards = cards.sort((a, b) => b.confidence - a.confidence);

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
              {sortedCards.map((card, index) => {
                const thumbnail =
                  card.illustrations[card.illustrations.length - 1];
                return (
                  <TouchableOpacity
                    key={index}
                    onPress={() => setSelectedCard(card)}
                    style={styles.cardItem}
                  >
                    <Image
                      source={{ uri: thumbnail.src }}
                      style={styles.cardImage}
                    />
                    <Text style={styles.cardName}>{card.name}</Text>
                    <Text style={styles.confidence}>
                      Confidence: {card.confidence.toFixed(2)}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          ) : (
            <View style={styles.cardDetail}>
              <Text style={styles.cardName}>{selectedCard.name}</Text>
              <ScrollView contentContainerStyle={styles.scrollContainer}>
                {selectedCard.illustrations.map((illustration, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => handleIllustrationPress(illustration)}
                    style={styles.touchable}
                  >
                    <Image
                      source={{ uri: illustration.src }}
                      style={styles.detailImage}
                    />
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
              apiUrl={selectedCard.api_url}
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
  ilustations: {
    alignContent: "center",
  },
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
});

export default CardListModal;
