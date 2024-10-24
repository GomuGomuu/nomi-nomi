## Nomi-Nomi: Card Recognition App (TypeScript)

This repository houses the source code for Nomi-Nomi, a React Native application built with Expo and TypeScript. It focuses on providing a user-friendly experience for recognizing cards from the One Piece Card Game.

**Key Features:**

- **Camera-based Card Recognition:** Capture images of cards using the device camera and send them to a server for recognition.
- **Detailed Card Information Display:** After successful recognition, the app displays comprehensive card details, including name, type, rarity, power, cost, effects, and more.
- **Wallet Integration (Placeholder):** A placeholder feature to add illustrations to a user's wallet, allowing them to save their favorite cards.
- **Connection Checking:** Users can test their connection to the recognition server.

**Getting Started:**

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/GomuGomuu/nomi-nomi.git
   ```

2. **Install Dependencies:**
   ```bash
   npm install
   ```

3. **Start the App:**
   ```bash
   npx expo start
   ```

**Development:**

- The core application logic resides in the `app` directory.
- Components are organized within the `components` folder.
- Constants and hooks are defined in `constants` and `hooks` respectively.

**Running the App:**

Nomi-Nomi can be run on a development build, Android emulator, iOS simulator, or directly with Expo Go. Consult the [Expo documentation](https://docs.expo.dev/) for further information on these options.

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
- The "Add to Wallet" feature is a placeholder and requires further development.
