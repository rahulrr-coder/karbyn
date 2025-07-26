# 🌱 Karbyn - Carbon Offset Platform

**Democratizing carbon offset verification through blockchain technology**

Karbyn is a decentralized platform built on the Internet Computer that allows individuals, farmers, and NGOs to track, verify, and monetize their eco-friendly activities through carbon credits and NFTs.

## 🌍 The Problem We're Solving

**Climate action spans individuals to organizations, but verification is broken:**
- Personal carbon-positive activities go unrecognized and unrewarded
- Farmers lack access to carbon credit markets despite sustainable practices
- NGOs struggle to monetize their environmental projects effectively
- Traditional carbon offset markets are expensive and inaccessible
- No standardized way to track and verify environmental impact across stakeholders
- Lack of incentives for everyday eco-friendly behaviors and sustainable farming

## 💡 Our Solution

Karbyn creates a **transparent, accessible, and rewarding** ecosystem where:
- **Track** your eco-activities (recycling, sustainable farming, renewable energy, conservation projects)
- **Verify** activities through smart contracts and community validation
- **Earn** carbon credit NFTs that represent real environmental impact
- **Trade** your carbon credits in a decentralized marketplace
- **Scale** from individual actions to large-scale agricultural and NGO projects

## ✨ Key Features

### 🔐 **Multi-Wallet Authentication**
- Internet Identity integration for seamless Web3 access
- Plug Wallet support for advanced users
- Secure, passwordless authentication

### 📊 **Activity Tracking & Verification**
- Submit eco-activities with proof (photos, receipts, location data, field reports)
- Smart contract-based carbon offset calculations
- Real-time dashboard showing your environmental impact
- Categories: Recycling, Transport, Energy, Agriculture, Conservation, Reforestation

### 🏆 **NFT Carbon Credits**
- Earn unique NFTs representing verified carbon offsets
- Each NFT contains immutable proof of environmental impact
- Tradeable on the integrated marketplace

### 🛒 **Decentralized Marketplace**
- Buy and sell carbon credit NFTs
- Transparent pricing and impact metrics
- Community-driven verification system

### 📈 **Impact Dashboard**
- Real-time carbon offset tracking (rounded to 2 decimal places)
- Activity history and verification status
- Personal environmental impact statistics
- Weekly streaks and achievement system

## 🚀 Getting Started

### Prerequisites
- [DFX SDK](https://internetcomputer.org/docs/current/developer-docs/setup/install) installed
- Node.js 16+ and npm
- Git

### Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd karbyn
   ```

2. **Start the local Internet Computer replica**
   ```bash
   dfx start --background
   ```

3. **Deploy the canisters**
   ```bash
   dfx deploy --network local
   ```

4. **Start the development server**
   ```bash
   npm start
   ```

5. **Open your browser**
   - Frontend: `http://localhost:4943/?canisterId={frontend_canister_id}`
   - Backend Candid UI: Check terminal output for the backend URL

### Development Commands

```bash
# Generate Candid interfaces
npm run generate

# Build the project
npm run build

# Deploy to local network
dfx deploy --network local

# Deploy to IC mainnet
dfx deploy --network ic
```

## 🏗️ Technical Architecture

- **Frontend**: React.js with Vite, TailwindCSS, and Framer Motion
- **Backend**: Rust canisters on Internet Computer
- **Authentication**: Internet Identity + Plug Wallet integration
- **Storage**: Decentralized storage on IC
- **Smart Contracts**: Candid interface for type-safe interactions

## 🌟 Use Cases

### 👤 Individual Users
- Track daily eco-activities (cycling to work, recycling, solar energy use)
- Earn carbon credits for verified activities
- Build a verifiable record of environmental impact
- Trade carbon credits for value

### 🌾 Farmers & Agricultural Communities
- Monetize sustainable farming practices (crop rotation, organic farming, soil carbon sequestration)
- Earn credits for reforestation and afforestation projects
- Access global carbon markets with transparent pricing
- Verify and trade agricultural carbon offsets

### 🏢 NGOs & Environmental Organizations
- List large-scale environmental projects on the marketplace
- Raise funds through pre-verified carbon credit sales
- Provide transparent impact reporting to donors
- Scale conservation efforts with decentralized funding

### 🏢 Businesses & Organizations
- Purchase verified carbon credits from individuals, farmers, and NGOs
- Support community-driven environmental initiatives
- Demonstrate corporate social responsibility with transparent offsets
- Access real-time environmental impact data across all stakeholder types

## 🔧 Project Structure

```
karbyn/
├── src/
│   ├── karbyn_backend/          # Rust backend canister
│   └── karbyn_frontend/         # React frontend
│       ├── src/
│       │   ├── components/      # Reusable UI components
│       │   ├── contexts/        # React contexts (Auth, Activity)
│       │   ├── pages/          # Application pages
│       │   ├── services/       # Backend integration services
│       │   └── styles/         # CSS and styling
│       └── public/             # Static assets
├── dfx.json                    # DFX configuration
└── README.md                   # This file
```

## 🤝 Contributing

We welcome contributions! Please feel free to:
- Report bugs and suggest features
- Submit pull requests
- Improve documentation
- Share feedback and ideas

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🌱 Our Mission

**Making carbon offset accessible, transparent, and rewarding for everyone - from individual actions to large-scale agricultural and conservation projects.**

Join us in building a sustainable future where every eco-friendly action counts and gets rewarded, whether you're an individual recycling at home, a farmer implementing sustainable practices, or an NGO leading conservation efforts!

---

**Built with ❤️ on the Internet Computer**
