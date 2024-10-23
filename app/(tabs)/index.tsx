import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import { useState, useRef } from "react";
import {
  Button,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Modal,
  ActivityIndicator,
} from "react-native";
import axios from "axios";
import * as ImageManipulator from "expo-image-manipulator";
import CardListModal from "@/components/CardListModal";

export default function App() {
  const [facing, setFacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploadCanceled, setUploadCanceled] = useState(false);
  const [pingResponse, setPingResponse] = useState<string | null>(null);
  const [recognizedCards, setRecognizedCards] = useState<any[]>([]);
  const [showCardModal, setShowCardModal] = useState(false);

  const apiEndpoint = "http://10.0.0.128:5000/card/recognize";
  const pingEndpoint = "http://10.0.0.128:5000/ping";
  const username = "admin";
  const password = "password";

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title="Grant Permission" />
      </View>
    );
  }

  function toggleCameraFacing() {
    setFacing((current) => (current === "back" ? "front" : "back"));
  }

  async function takePicture() {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync();
      if (photo) {
        setLoading(true);
        setUploadCanceled(false);
        await cropImage(photo.uri);
      }
    }
  }

  async function cropImage(uri: string) {
    try {
      const image = await ImageManipulator.manipulateAsync(uri, []);
      const originalWidth = image.width;
      const originalHeight = image.height;

      const cropWidth = originalWidth * 0.62;
      const cropHeight = originalHeight * 0.65;

      const originX = (originalWidth - cropWidth) / 2;
      const originY = (originalHeight - cropHeight) / 2;

      const result = await ImageManipulator.manipulateAsync(uri, [
        {
          crop: {
            originX: originX,
            originY: originY,
            width: cropWidth,
            height: cropHeight,
          },
        },
      ]);

      const fixedWidth = 800;
      const aspectRatio = originalHeight / originalWidth;
      const resizedHeight = fixedWidth * aspectRatio;

      const resizedImage = await ImageManipulator.manipulateAsync(result.uri, [
        {
          resize: {
            width: fixedWidth,
            height: resizedHeight,
          },
        },
      ]);

      await uploadPhoto(resizedImage.uri);
    } catch (error) {
      console.error("Error cropping the image:", error);
    } finally {
      setLoading(false);
    }
  }

  async function uploadPhoto(uri: string) {
    const formData = new FormData();
    const photo = {
      uri,
      type: "image/jpeg",
      name: generatePhotoName(),
    };
    formData.append("file", photo);

    try {
      const response = await axios.post(apiEndpoint, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Basic ${btoa(`${username}:${password}`)}`,
        },
      });

      setRecognizedCards(response.data.possible_cards);
      setShowCardModal(true);
    } catch (error) {
      console.error("Error uploading the image:", error);
    }
  }

  function cancelUpload() {
    setLoading(false);
    setUploadCanceled(true);
  }

  async function checkConnection() {
    try {
      const response = await axios.get(pingEndpoint);
      setPingResponse(response.data.message);
    } catch (error) {
      console.error("Error checking the connection:", error);
      setPingResponse("Error checking the connection");
    }
  }

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} facing={facing} ref={cameraRef}>
        <View style={styles.overlay}>
          <View style={styles.rectangle} />
        </View>
      </CameraView>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
          <Text style={styles.text}>Flip Camera</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={takePicture}>
          <Text style={styles.text}>Take Picture</Text>
        </TouchableOpacity>
        <Modal visible={loading} transparent animationType="fade">
          <View style={styles.modalContainer}>
            <ActivityIndicator size="large" color="#0000ff" />
            <Text style={styles.loadingText}>Processing image...</Text>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={cancelUpload}
            >
              <Text style={styles.cancelButtonText}>
                Cancel image recognition
              </Text>
            </TouchableOpacity>
          </View>
        </Modal>
        <CardListModal
          visible={showCardModal}
          cards={recognizedCards}
          onClose={() => setShowCardModal(false)}
        />
      </View>
      <TouchableOpacity style={styles.button} onPress={checkConnection}>
        <Text style={styles.text}>Check Connection</Text>
      </TouchableOpacity>
      {pingResponse && <Text style={styles.pingMessage}>{pingResponse}</Text>}
    </View>
  );
}

function generatePhotoName() {
  const timestamp = Date.now();
  return `photo_${timestamp}.jpg`;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  cancelButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  message: {
    textAlign: "center",
    paddingBottom: 10,
  },
  camera: {
    width: "90%",
    height: "80%",
    justifyContent: "center",
  },
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  rectangle: {
    borderWidth: 2,
    borderColor: "red",
    width: "80%",
    height: "65%",
    position: "absolute",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "transparent",
    marginTop: 15,
    marginBottom: 2,
  },
  button: {
    alignItems: "center",
    padding: 10,
    backgroundColor: "#007BFF",
    borderRadius: 5,
  },
  text: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
  pingMessage: {
    marginTop: 10,
    fontSize: 16,
    color: "green",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  loadingText: {
    marginTop: 20,
    fontSize: 18,
    color: "white",
  },
  cancelButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#ff4444",
    borderRadius: 5,
  },
  cancelText: {
    color: "white",
    fontWeight: "bold",
  },
  cancelMessage: {
    marginTop: 10,
    fontSize: 16,
    color: "red",
  },
});
