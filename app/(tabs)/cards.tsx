import React, { useState } from "react";
import {
  View,
  Image,
  StyleSheet,
  ActivityIndicator,
  Modal,
  Text,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  SafeAreaView,
} from "react-native";
import axios from "axios";
import { useFocusEffect } from "@react-navigation/native";

interface ImageData {
  filename: string;
  url: string;
}

const Cards = () => {
  const [images, setImages] = useState<ImageData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImageName, setSelectedImageName] = useState("");

  useFocusEffect(
    React.useCallback(() => {
      const fetchImages = async () => {
        setLoading(true);
        setError(null);
        try {
          const response = await axios.get(
            "http://10.0.0.128:5000/images/json"
          );
          setImages(response.data);
          console.log("Imagens carregadas:", response.data);
        } catch (error) {
          console.error("Erro ao buscar imagens:", error);
          setError("Erro ao carregar imagens.");
        } finally {
          setLoading(false);
        }
      };

      fetchImages();
    }, [])
  );

  const handleImagePress = (filename: string) => {
    setSelectedImageName(filename);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  const windowWidth = Dimensions.get("window").width;
  const imageSize = (windowWidth - 40) / 3;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        {images.map((image) => (
          <TouchableOpacity
            key={image.filename}
            onPress={() => handleImagePress(image.filename)}
          >
            <Image
              source={{ uri: image.url }}
              style={[styles.image, { width: imageSize, height: imageSize }]}
              accessibilityLabel={image.filename}
            />
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>{selectedImageName}</Text>
            <TouchableOpacity onPress={closeModal}>
              <Text style={styles.closeButton}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    paddingTop: 40,
  },
  scrollView: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    margin: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    alignItems: "center",
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
  },
  closeButton: {
    color: "blue",
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: "red",
    fontSize: 16,
  },
});

export default Cards;
