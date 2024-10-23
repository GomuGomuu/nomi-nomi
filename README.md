## Nomi-Nomi: Card Recognition App

This repository contains the source code for a React Native application called Nomi-Nomi. This app uses Expo and focuses on card recognition functionality.

**Features:**

- **Camera-based Card Recognition:** The app captures images of cards using the device camera and sends them to a server for recognition.
- **Card Details Display:** After recognition, the app displays detailed information about the recognized cards, including name, type, rarity, power, cost, and effects.
- **Wallet Integration (Placeholder):** The app has a placeholder feature for adding illustrations to a user's wallet, allowing them to save their favorites.
- **Connection Checking:** The app allows users to test their connection to the recognition server.

**Getting Started:**

1. **Clone the repository:**

   ```bash
   git clone https://github.com/GomuGomuu/nomi-nomi.git
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Start the app:**
   ```bash
   npx expo start
   ```

**Development:**

- The main application logic is located in the `app` directory.
- Components are organized within the `components` folder.
- Constants and hooks are defined in `constants` and `hooks` respectively.

**Running the App:**

You can run the app on a development build, Android emulator, iOS simulator, or Expo Go. Refer to the [Expo documentation](https://docs.expo.dev/) for more details on these options.

**Dependencies:**

- Expo
- Expo Camera
- Expo Router
- Axios
- Expo Font
- Expo Image Manipulator
- React Native Reanimated
- React Native Gesture Handler

**Additional Information:**

- The app relies on a server-side card recognition API, which is not included in this repository.
- The "Add to Wallet" feature is a placeholder and requires further implementation.
