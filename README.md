# SAFEAI – Intelligent Personal Safety Companion

SAFEAI is an advanced, patented personal safety system built as a Progressive Web Application (PWA). It integrates real-time GPS tracking, active speech recognition for key emergency word triggers, geofencing, audio recording evidence collection, rule-based AI threat detection, and contact alerts.

The application has been built with full offline capability, responsive mobile-first layouts, and seamless API fallbacks. If Firebase or Google Maps credentials are not configured, SAFEAI automatically switches to mock services (utilizing browser localStorage and dynamic Leaflet/OpenStreetMap rendering) so that the application is fully demonstrable immediately.

## 🚀 Key Features

*   **PWA (Progressive Web App)**: Installable like a native app directly from the browser (Chrome/Edge/Safari), offline caching of assets, service workers, and standalone launch configuration.
*   **Hold-to-Activate SOS Button**: A prominent emergency button requiring a continuous 5-second hold with visual circular countdown to prevent accidental activation.
*   **Voice Assistant (Web Speech API)**: Listens for safety keywords (e.g., "SOS", "Help Me", "Emergency") in safety mode and automatically triggers security protocols, audio recording, and coordinates dispatching.
*   **Geofencing (Unsafe Zones)**: Create unsafe circular geofences. If the user steps inside a geofenced area, a warning triggers, and the AI threat level updates.
*   **Audio Evidence Recording (MediaRecorder API)**: Captures environmental audio during emergencies, stores metadata, and allows playback or downloads.
*   **Rule-based AI Threat Engine**: Dynamically calculates threat levels (Safe, Low, Medium, High, Critical) based on continuous variables (time, location safety, voice triggers, rapid movement).
*   **Google Maps & Leaflet Map Widget**: Interactive maps showing the user's location, nearby hospitals, police stations, and safe zones. Automatically falls back to Leaflet (OpenStreetMap) if no Google Maps API key is configured.
*   **Admin Dashboard**: Overview of system statistics (active users, recent alerts, charts representing threat distributions using Chart.js).
*   **Emergency Contact Management**: Full CRUD for contacts. Quick links to trigger (simulated) Call, SMS, and WhatsApp alerts.

---

## 🛠️ Technology Stack

*   **Frontend**: React (Vite), Tailwind CSS, React Router DOM, Context API, Chart.js, React Icons, Axios, Leaflet (Fallback Map).
*   **Backend**: Node.js, Express.js.
*   **Database/Storage/Auth**: Firebase Firestore, Storage, and Auth (with full local mock fallbacks).

---

## 📋 Folder Structure

```text
safeai/
├── client/                 # Frontend Vite React App
│   ├── public/             # PWA assets (manifest, sw.js, offline page)
│   └── src/
│       ├── assets/         # Images, logos, icons
│       ├── components/     # Reusable components (Map, SOS button, recorder)
│       ├── contexts/       # React Contexts (Auth, Emergency, Threat, Settings)
│       ├── hooks/          # Custom hooks (speech, media recorder)
│       ├── layouts/        # Shared layouts (Dashboard, main layout)
│       ├── pages/          # All frontend views
│       ├── services/       # Mock and Firebase service logic
│       ├── utils/          # Formatting and helper utilities
│       └── styles/         # Global styling and Tailwind directives
├── server/                 # Express REST API
│   ├── config/             # DB & Firebase configuration
│   ├── controllers/        # Route controllers
│   ├── middlewares/        # Express middlewares (auth, errors)
│   ├── routes/             # API routing
│   └── index.js            # Express server entry point
├── package.json            # Root workspaces manager
├── .gitignore              # Git filter file
└── .env.example            # Environment variables template
```

---

## ⚙️ Installation & Running

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed (v16.0.0 or higher recommended).

### Setup and Start in Dev Mode
At the root of the project (`safeai/`), run:

```bash
# 1. Install all dependencies for both client and server automatically
npm install

# 2. Start both the React client and Express server concurrently
npm run dev
```

The terminal will launch:
- Client (React dev server) at `http://localhost:5173`
- Server (Node/Express backend) at `http://localhost:5000`

### Optional Environment Setup
Create a `.env` file in the client and server directories if you want to connect to real Firebase and Google Maps services. Refer to the `.env.example` file for details.

---

## 📄 License
This project is prepared for educational/engineering viva presentation purposes.
Patented Personal Safety System concept.
All rights reserved.
