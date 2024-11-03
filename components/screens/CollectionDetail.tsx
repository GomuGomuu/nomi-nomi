import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  RefreshControl,
} from "react-native";
import { deleteCardCollection, getCollectionDetails, postCardCollection } from "@services/api";
import { MerryEndpoints } from "@constants/Merry";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

interface Card {
  id: number;
  code: string;
  title: string;
  src: string;
  price: number;
  type: string;
  total_price_amount: number;
  quantity: number;
}

interface CollectionDetailScreenProps {
  collectionId: string;
  fetchCollection: boolean | undefined;
}

const CollectionDetailScreen: React.FC<CollectionDetailScreenProps> = ({
  collectionId,
  fetchCollection,
}) => {
  const navigation = useNavigation();
  const [collectionName, setCollectionName] = useState<string>("");
  const [totalBalance, setTotalBalance] = useState<number>(0);
  const [totalCards, setTotalCards] = useState<number>(0);
  const [illustrations, setIllustrations] = useState<Record<string, Card>>({});
  const [refreshing, setRefreshing] = useState(false);

  const fetchCollectionDetails = async () => {
    if (collectionId) {
      try {
        const response = await getCollectionDetails(Number(collectionId));
        const { collection_name, balance, cards_quantity, illustrations } = response.data;
        setCollectionName(collection_name);
        setTotalBalance(balance);
        setTotalCards(cards_quantity);
        setIllustrations(illustrations);
      } catch (error) {
        console.error("Erro on fetch collection details:", error);
      }
    }
  };

  useEffect(() => {
    if (fetchCollection) {
      fetchCollectionDetails();
    }
  }, []);

  useEffect(() => {
    fetchCollectionDetails();
  }, [collectionId]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchCollectionDetails().finally(() => setRefreshing(false));
  }, [collectionId]);

  const handleIncreaseQuantity = async (illustration_slug: string) => {
    try {
      await postCardCollection(illustration_slug);
    } catch (error) {
      console.error("Error increasing quantity:", error);
    } finally {
      fetchCollectionDetails();
    }
  };

  const handleDecreaseQuantity = async (illustration_slug: string) => {
    try {
      await deleteCardCollection(illustration_slug);
    } catch (error) {
      console.error("Error decreasing quantity:", error);
    } finally {
      fetchCollectionDetails();
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Text style={styles.backButtonText}>
              <Ionicons name="arrow-back" size={24} color="#007BFF" />
            </Text>
          </TouchableOpacity>
          <Text style={styles.collectionTitle}>
            {collectionName === "Vault" ? "All cards collection" : collectionName}
          </Text>
        </View>
        <View style={styles.totalizers}>
          <Text style={styles.totalizerText}>N° Cards: {totalCards}</Text>
          <Text style={styles.totalizerText}>Fortune: R$ {totalBalance.toFixed(2)}</Text>
        </View>
        <View style={styles.cardsContainer}>
          {Object.values(illustrations).map((card) => (
            <View key={card.id} style={styles.cardItem}>
              <Image
                source={{ uri: `${MerryEndpoints.BASE_URL}${card.src}` }}
                style={styles.cardImage}
              />
              <View style={styles.cardInfo}>
                <Text style={styles.cardTitle}>{card.title}</Text>
                <Text style={styles.cardDetails}>Code: {card.code}</Text>
                <Text style={styles.cardDetails}>Price: R$ {card.price.toFixed(2)}</Text>
                <Text style={styles.cardDetails}>Amount: {card.quantity}</Text>
                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    style={styles.quantityButton}
                    onPress={() => handleDecreaseQuantity(card.code)}
                  >
                    <Text style={styles.buttonText}>-</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.quantityButton}
                    onPress={() => handleIncreaseQuantity(card.code)}
                  >
                    <Text style={styles.buttonText}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f9f9fb",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f9f9fb",
  },
  backButton: {
    marginRight: 15,
  },
  backButtonText: {
    fontSize: 24,
    color: "#007BFF",
    position: "absolute",
    marginTop: -12,
  },
  collectionTitle: {
    flex: 1,
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
  },
  scrollContainer: {
    alignItems: "center",
    padding: 20,
  },
  totalizers: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  totalizerText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#444",
  },
  cardsContainer: {
    width: "100%",
  },
  cardItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 10,
    marginBottom: 15,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    elevation: 5,
  },
  cardImage: {
    width: 100,
    height: "100%",
    borderRadius: 8,
    marginRight: 15,
  },
  cardInfo: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  cardDetails: {
    fontSize: 14,
    color: "#666",
    marginBottom: 3,
  },
  buttonContainer: {
    flexDirection: "row",
    marginTop: 5,
  },
  quantityButton: {
    backgroundColor: "#007BFF",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    marginHorizontal: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default CollectionDetailScreen;
