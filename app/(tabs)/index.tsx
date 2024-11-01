import {
  CameraView,
  CameraType,
  FlashMode,
  useCameraPermissions,
} from "expo-camera";
import { useState, useRef } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Modal,
  ActivityIndicator,
  Image,
} from "react-native";
import axios from "axios";
import * as ImageManipulator from "expo-image-manipulator";
import CardListModal from "@/components/CardListModal";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NativeModules } from "react-native";
import Reactotron from "reactotron-react-native";
import { MerryEndpoints } from "@constants/Merry";
import { MaterialIcons } from "@expo/vector-icons";

const { scriptURL } = NativeModules.SourceCode;
const scriptHostname = scriptURL.split("://")[1].split(":")[0];
if (__DEV__) {
  Reactotron.setAsyncStorageHandler(AsyncStorage)
    .configure({ host: scriptHostname })
    .useReactNative()
    .connect();
  console.tron = Reactotron;
  Reactotron.clear();
}

export default function App() {
  const [facing, setFacing] = useState<CameraType>("back");
  const [flash, setFlash] = useState<FlashMode>("off");
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView | null>(null);
  const [loading, setLoading] = useState(false);
  const [pingResponse, setPingResponse] = useState<string | null>(null);
  const [recognizedCards, setRecognizedCards] = useState<any[]>([]);
  const [showCardModal, setShowCardModal] = useState(false);

  function generatePhotoName() {
    return `photo_${new Date().toISOString().replace(/[:.]/g, "-")}.jpg`;
  }

  if (!permission) return <View />;
  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          We need your permission to show the camera
        </Text>
        <TouchableOpacity
          style={styles.permissionButton}
          onPress={requestPermission}
        >
          <Text style={styles.text}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  function toggleCameraFacing() {
    setFacing((current) => (current === "back" ? "front" : "back"));
  }

  function toggleFlash() {
    setFlash((current) => (current === "off" ? "on" : "off"));
  }

  async function takePicture() {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync();
      if (photo) {
        setLoading(true);
        await cropImage(photo.uri);
      }
    }
  }

  async function cropImage(uri: string) {
    try {
      const image = await ImageManipulator.manipulateAsync(uri, []);
      const resizedImage = await ImageManipulator.manipulateAsync(uri, [
        { resize: { width: 600, height: 600 * (image.height / image.width) } },
      ]);

      const cropHeight = resizedImage.height * 0.1;
      const croppedHeight = resizedImage.height - cropHeight * 2;

      const cropRegion = {
        originX: 0,
        originY: cropHeight,
        width: resizedImage.width,
        height: croppedHeight,
      };

      const finalImage = await ImageManipulator.manipulateAsync(
        resizedImage.uri,
        [{ crop: cropRegion }]
      );

      await uploadPhoto(finalImage.uri);
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
    } as any;
    formData.append("image", photo);

    try {
      const response = await axios.post(
        `${MerryEndpoints.RECOGNITION}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      setRecognizedCards(response.data);
      setShowCardModal(true);
    } catch (error) {
      console.error("Error uploading the image:", error);
    }
  }

  async function checkConnection() {
    try {
      const response = await axios.get(`${MerryEndpoints.PING}`);
      setPingResponse(response.data.message.toUpperCase());
      setTimeout(() => {
        setPingResponse(null);
      }, 5000);
    } catch (error) {
      setPingResponse("Error checking the connection");
    }
  }

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        facing={facing}
        ref={cameraRef}
        enableTorch={flash === "off"}
      />

      <View style={styles.overlayImageContainer}>
        <Image
          source={require("@assets/images/frame-1.png")}
          style={styles.overlayImage}
        />
      </View>

      <TouchableOpacity
        style={styles.connectionButton}
        onPress={checkConnection}
      >
        <MaterialIcons name="wifi" size={24} color="white" />
      </TouchableOpacity>

      <TouchableOpacity style={styles.flashButton} onPress={toggleFlash}>
        <MaterialIcons
          name={flash === "off" ? "flash-off" : "flash-on"}
          size={24}
          color="white"
        />
      </TouchableOpacity>

      <TouchableOpacity style={styles.flipButton} onPress={toggleCameraFacing}>
        <MaterialIcons name="flip-camera-ios" size={24} color="white" />
      </TouchableOpacity>

      <TouchableOpacity style={styles.captureButton} onPress={takePicture}>
        <MaterialIcons name="camera-alt" size={32} color="white" />
      </TouchableOpacity>

      {pingResponse && (
        <View style={styles.pingMessageContainer}>
          <Text style={styles.pingMessage}>{pingResponse}</Text>
        </View>
      )}

      <Modal visible={loading} transparent animationType="fade">
        <View style={styles.modalContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text style={styles.loadingText}>Processing image...</Text>
        </View>
      </Modal>
      <CardListModal
        visible={showCardModal}
        data={recognizedCards}
        onClose={() => setShowCardModal(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "black" },
  camera: { flex: 1 },
  overlayImageContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  overlayImage: {
    resizeMode: "contain",
    width: "90%",
  },
  connectionButton: {
    position: "absolute",
    top: 40,
    right: 20,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    padding: 10,
    borderRadius: 20,
  },
  flashButton: {
    position: "absolute",
    top: 85,
    right: 20,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    padding: 10,
    borderRadius: 20,
  },
  flipButton: {
    position: "absolute",
    bottom: 30,
    right: 20,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    padding: 10,
    borderRadius: 20,
  },
  captureButton: {
    position: "absolute",
    bottom: 20,
    alignSelf: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    padding: 20,
    borderRadius: 40,
  },
  permissionButton: {
    backgroundColor: "#007BFF",
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
  },
  message: {
    textAlign: "center",
    paddingBottom: 10,
    fontSize: 16,
    color: "white",
  },
  text: {
    color: "white",
    fontWeight: "bold",
    fontSize: 18,
  },
  pingMessage: {
    fontSize: 16,
    color: "white",
    textAlign: "center",
    width: "100%",
  },
  pingMessageContainer: {
    position: "absolute",
    top: 45,
    width: "60%",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    padding: 10,
    alignSelf: "center",
    borderRadius: 8,
    alignItems: "center",
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
});
