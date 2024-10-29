# Nomi-Nomi: One Piece Card Recognition 📱

Yo! 👋 Welcome to Nomi-Nomi, a React Native app built with Expo and TypeScript that helps you quickly identify and learn about One Piece cards. Just snap a pic, and Nomi-Nomi will do the rest!

## ✨ Features:

- **Camera-powered Card Recognition:** Point your phone's camera at a One Piece card, and bam!  Nomi-Nomi analyzes it in a flash.
- **Detailed Card Info:** Get the full rundown on each card: name, type, rarity, power, cost, effects, and more. No more flipping through rulebooks! 
- **Illustration Gallery:**  Browse through different card illustrations (because who doesn't love those awesome One Piece artworks?).
- **"Add to Wallet" (Coming Soon):**  Keep track of your favorite cards and build your virtual collection (feature in development).
- **Connection Check:** Make sure you're online and connected to the card recognition server.

## 🚀 Getting Started:

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/GomuGomuu/nomi-nomi.git
   ```

2. **Set Up Your Environment:**
    - Install Node.js and npm (or yarn) if you don't have them: [https://nodejs.org/](https://nodejs.org/)
    - Install Expo CLI globally: `npm install -g expo-cli`
    - Install dependencies:  `npm install` inside the project directory.

3. **Configure Your `.env` File:**
   - Create a `.env` file in the project's root directory.
   - Add the following lines, replacing placeholders with your actual API URL and key:
     ```
     MERRY_API_URL=http://your-api-url-here
     MERRY_API_KEY=your-api-key-here 
     ```

4. **Start the App:**
   ```bash
   npx expo start
   ```

   This will open Expo's development tools in your browser. You can then run the app in:
    - An iOS simulator or Android emulator
    - Your physical device using the Expo Go app

## 🧰 Project Structure:

- **`app/`**:  The heart of Nomi-Nomi, containing navigation logic and main screens.
    - **`(tabs)/`**:  Code for the app's tabbed navigation.
    - **`+html.tsx`, `+not-found.tsx`**:  Expo Router files for web handling.
- **`assets/`**: Images, fonts, and other visual goodies.
- **`components/`**: Reusable UI elements that make up the app's interface.
- **`constants/`**:  Important values and configuration settings.
- **`hooks/`**: Custom React hooks for managing state and side effects.

## 📚 Technologies:

Nomi-Nomi is powered by a treasure chest full of awesome tech:

- **Expo:**  For streamlined React Native development and deployment.
- **Expo Camera:** To harness the power of your device's camera.
- **Expo Router:**  For managing navigation within the app.
- **Axios:**  To make API requests and communicate with the card recognition server.
- **React Native Reanimated:**  For super smooth animations.
- **React Native Gesture Handler:** For responsive touch interactions.

## ⚓ Future Adventures:

- **"Add to Wallet" Implementation:**   We're working hard to bring you a fully functional card collection feature soon!
- **Enhanced Card Search:**  Find cards quickly and easily with improved filtering and search options.
- **Deck Building (Maybe?):**   Help fellow pirates (or fight against them) with tools to create powerful One Piece card decks.

## 🙏 Acknowledgements:

- Huge shoutout to the creators of the One Piece Card Game for the amazing game!
- Thanks to the open-source community for providing incredible tools and libraries. 

Let us know what you think of Nomi-Nomi!  We're always open to feedback and contributions. Happy card hunting! 🏴‍☠️
