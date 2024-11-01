import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  SafeAreaView,
  Platform,
} from "react-native";
import { useAuth } from "@contexts/AuthContext";
import AuthModal from "@components/AuthModal";
import { StatusBar } from "react-native";
import { getCollections } from "@services/api";
import { useRouter } from "expo-router";

const ProfileScreen: React.FC = () => {
  const { isAuthenticated, logout } = useAuth();
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [collections, setCollections] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      setModalVisible(true);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const response = await getCollections();
        setCollections(response.data);
      } catch (error) {
        console.error("Erro ao buscar coleções:", error);
      }
    };

    if (isAuthenticated) {
      fetchCollections();
    }
  }, [isAuthenticated]);

  const handleCollectionPress = (collectionId: number) => {
    router.push({
      pathname: "/collection-detail",
      params: { id: collectionId },
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#f9f9fb" />
      {isAuthenticated ? (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {/* Seção de Perfil */}
          <View style={styles.profileSection}>
            <Image
              source={{ uri: "https://via.placeholder.com/100" }}
              style={styles.profileImage}
            />
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>Vitor Stahelin</Text>
              <Text style={styles.profileHandle}>@VStahelin</Text>
              <Text style={styles.stats}>
                Card Collection: {collections[0]?.cards_quantity}
              </Text>
              <Text style={styles.stats}>
                Collection Value: R${" "}
                {parseFloat(collections[0]?.balance).toFixed(2)}
              </Text>
              <TouchableOpacity style={styles.editButton}>
                <Text style={styles.editButtonText}>Update Profile Photo</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Seção de Portfólio */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Collections</Text>
            <View style={styles.collectionList}>
              {/* Coleção Principal */}
              {collections.length > 0 && (
                <TouchableOpacity
                  style={styles.collectionItem}
                  onPress={() => handleCollectionPress(collections[0].id)}
                >
                  <Text style={styles.collectionName}>Vault Collection</Text>
                  <Text style={styles.collectionDetails}>
                    Cards: {collections[0].cards_quantity} | Value: R${" "}
                    {parseFloat(collections[0].balance).toFixed(2)}
                  </Text>
                </TouchableOpacity>
              )}
              {/* Outras coleções */}
              {collections.slice(1).map((collection) => (
                <TouchableOpacity
                  key={collection.id}
                  style={styles.collectionItem}
                  onPress={() => handleCollectionPress(collection.id)}
                >
                  <Text style={styles.collectionName}>{collection.name}</Text>
                  <Text style={styles.collectionDetails}>
                    Cards: {collection.cards_quantity} | Value: R${" "}
                    {parseFloat(collection.balance).toFixed(2)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Seção de Deck Build */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Deck Build</Text>
            <TouchableOpacity style={styles.createDeckButton}>
              <Text style={styles.createDeckText}>Criate New Deck</Text>
            </TouchableOpacity>
            <View style={styles.collectionList}>
              {/* Exemplo de Deck */}
              <TouchableOpacity style={styles.collectionItem}>
                <Text style={styles.collectionName}>Deck 1</Text>
                <Text style={styles.collectionDetails}>
                  Cards: 20 | Value: R$ 1.200,00
                </Text>
              </TouchableOpacity>
              {/* Outros itens de deck podem ser listados aqui */}
            </View>
          </View>

          {/* Botão de Logout */}
          <TouchableOpacity style={styles.logoutButton} onPress={logout}>
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </ScrollView>
      ) : (
        <AuthModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f9f9fb",
    paddingTop: Platform.OS === "android" ? 25 : 0,
  },
  scrollContainer: {
    alignItems: "center",
    paddingVertical: 20,
  },
  profileSection: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    width: "90%",
    backgroundColor: "#ffffff",
    padding: 15,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    elevation: 5,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginRight: 15,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  profileHandle: {
    fontSize: 16,
    color: "#666",
  },
  stats: {
    fontSize: 14,
    color: "#444",
  },
  editButton: {
    backgroundColor: "#007BFF",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
    marginTop: 10,
    alignItems: "center",
  },
  editButtonText: {
    color: "#fff",
    fontSize: 14,
  },
  sectionContainer: {
    width: "90%",
    backgroundColor: "#ffffff",
    padding: 15,
    borderRadius: 8,
    marginVertical: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  totalizersContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  totalizer: {
    fontSize: 14,
    color: "#444",
  },
  collectionList: {},
  collectionItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  collectionName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  collectionDetails: {
    fontSize: 14,
    color: "#666",
  },
  createDeckButton: {
    backgroundColor: "#28a745",
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
    marginVertical: 15,
  },
  createDeckText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  logoutButton: {
    backgroundColor: "#ff5757",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    width: "90%",
    marginTop: 20,
  },
  logoutText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default ProfileScreen;
