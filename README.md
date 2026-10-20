# CampusMart

CampusMart is a campus-first mobile marketplace enabling college students and staff to buy, sell, and discover pre-owned textbooks, electronics, dorm essentials, and more within verified university communities.

## Repository Structure

```
CampusMart/
├── Frontend/             # Expo / React Native mobile application
│   ├── src/              # Source code (screens, components, navigation, context, etc.)
│   ├── assets/           # App icons, splash screens, images
│   ├── App.tsx           # Application entry component
│   ├── index.ts          # Expo entry point
│   ├── app.json          # Expo configuration
│   ├── package.json      # Frontend dependencies & scripts
│   └── tsconfig.json     # TypeScript configuration
├── Backend/              # Planned Java + Spring Boot backend
│   └── README.md         # Backend architecture & roadmap
├── AGENTS.md             # Developer guidelines & Expo rules
├── LICENSE               # License
└── package.json          # Root scripts delegating to Frontend
```

## Getting Started

### Prerequisites

- Node.js (v18+)
- npm or bun
- iOS Simulator (Mac / Xcode) or Android Emulator / Expo Go

### Running the App from Root

You can run the frontend directly from the repository root:

```bash
# Install dependencies in Frontend
cd Frontend && npm install && cd ..

# Start Expo dev server
npm start

# Run on iOS Simulator
npm run ios

# Run on Android Emulator
npm run android

# Run on Web
npm run web

# Typecheck TypeScript
npm run typecheck
```

### Running from Frontend Directory

You can also run commands inside the `Frontend` directory directly:

```bash
cd Frontend
npm start
npm run ios
npm run typecheck
```

## Features

- **3D Welcome Screen**: Interactive animated onboarding scene
- **Role & Institution Selection**: Student, Faculty, Staff role flows
- **Campus Marketplace**: Browse, search, filter categories
- **Sell & Listings**: Image picker, listing creation, and management
- **Orders & Tracking**: Pickup verification, status badges, order history
- **In-App Messaging**: Buyer-seller chats and notifications
- **Safety & Reporting**: Trust-focused community guidelines and reporting
