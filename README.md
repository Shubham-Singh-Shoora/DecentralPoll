# Voting Dapp

A decentralized polling/voting application built on the [Internet Computer](https://internetcomputer.org/).  
This project features a Rust-based backend canister and a modern React frontend, allowing users to create polls, vote, and view results in real time.

---

## 🚀 Features

- Create new polls with custom options
- Vote on any available poll
- View live poll results
- Real-time updates (no refresh needed)
- Fully decentralized: data stored on-chain
- Responsive, modern UI

---

## 🛠️ Tech Stack

- **Backend:** Rust (IC Motoko or Rust canister)
- **Frontend:** React + Vite + TypeScript
- **Agent:** [@dfinity/agent](https://www.npmjs.com/package/@dfinity/agent)
- **Deployed on:** Internet Computer (IC)

---

## 📦 Project Structure

```
voting_dapp/
├── src/
│   ├── voting_dapp_backend/   # Rust canister code
│   └── voting_dapp_frontend/  # React frontend code
├── dfx.json                   # IC canister definitions
├── package.json               # Project scripts
└── README.md
```

---

## ⚡ Getting Started

### 1. Prerequisites

- [Node.js](https://nodejs.org/) >= 16
- [DFX SDK](https://internetcomputer.org/docs/current/developer-docs/quickstart/dfx-quickstart) (for local development)
- Rust toolchain (for building backend canister)

### 2. Clone the project

```sh
git clone https://github.com/<your-username>/voting_dapp.git
cd voting_dapp
```

### 3. Install dependencies

```sh
cd src/voting_dapp_frontend
npm install
cd ../..
```

### 4. Start the local IC replica and deploy canisters

```sh
dfx start --clean
dfx deploy
```

### 5. Run the frontend locally

```sh
cd src/voting_dapp_frontend
npm run dev
```
Visit [http://localhost:5173](http://localhost:5173) (or the port shown in your terminal).

---

## 🏗️ Build & Deploy (Frontend)

To build and deploy your frontend as a canister:

```sh
dfx deploy voting_dapp_frontend
```

On successful deployment, DFX will print a URL for your canister-based frontend.

---

## ⚙️ Environment Variables

- `VITE_VOTING_DAPP_BACKEND_CANISTER_ID` (required): Set to your backend canister ID.
- Make sure to configure this in your frontend’s `.env` or via the DFX-generated `.env` file.

---

## 🧪 Running Tests

*Coming soon!*

---

## 🙏 Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

---

## 📄 License

[MIT](./LICENSE)

---

## 👤 Author

- [Shubham Shoora](https://github.com/Shubham-Singh-Shoora)

---

## 📝 Notes

- Make sure to keep your canister IDs updated in `.env` when deploying to different networks.
- If you encounter issues with polling or voting, check that your DFX local replica is running and the backend canister is properly deployed.
