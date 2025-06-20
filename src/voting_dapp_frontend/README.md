# DecentralPoll - Decentralized Voting DApp

A beautiful, modern decentralized polling application built on the Internet Computer Protocol (ICP) using React, TypeScript, and Tailwind CSS.

## Features

- **Create Polls**: Easy-to-use form for creating polls with multiple options
- **Vote Securely**: Cast votes on the blockchain with duplicate prevention
- **Real-time Results**: View live voting results with animated progress bars
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Error Handling**: Comprehensive error handling with user-friendly notifications
- **Mock Data**: Fallback to demo data when canister is unavailable

## Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Blockchain**: Internet Computer Protocol (ICP)
- **API**: DFINITY Agent-JS for canister communication
- **Icons**: Lucide React
- **Build Tool**: Vite

## Getting Started

### Prerequisites

- Node.js 16+ and npm
- DFX CLI (for local Internet Computer development)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd decentralized-polling-dapp
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Connecting to Internet Computer

1. Start local DFX network:
```bash
dfx start --clean
```

2. Deploy your backend canister with the following interface:
```candid
service : {
  create_poll : (text, vec text) -> (nat);
  get_polls : () -> (vec record {
    id: nat;
    question: text;
    options: vec text;
    votes: vec nat;
  }) query;
  vote : (nat, nat) -> (variant { Ok : null; Err : text });
}
```

3. Update the canister ID in `src/api/icp_polling.ts`

## Project Structure

```
src/
├── components/          # React components
│   ├── Notification.tsx # Toast notifications
│   ├── PollCard.tsx     # Individual poll display
│   ├── PollForm.tsx     # Poll creation form
│   └── PollList.tsx     # List of all polls
├── api/                 # API integration
│   └── icp_polling.ts   # Internet Computer API calls
├── types/               # TypeScript type definitions
│   └── polling.ts       # Poll-related types
├── App.tsx             # Main application component
├── main.tsx            # Application entry point
└── index.css           # Global styles
```

## API Methods

The application expects the following methods from your Internet Computer canister:

- `create_poll(question: string, options: string[]): Promise<number>`
- `get_polls(): Promise<Poll[]>`
- `vote(poll_id: number, option_index: number): Promise<Result<(), string>>`

## Design Features

- **Glassmorphism Design**: Modern glass-like cards with backdrop blur
- **Gradient Backgrounds**: Beautiful color gradients throughout the interface
- **Smooth Animations**: Hover effects, transitions, and micro-interactions
- **Responsive Layout**: Mobile-first design that works on all screen sizes
- **Accessibility**: Focus states, ARIA labels, and keyboard navigation

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Environment Variables

The application automatically detects the environment and switches between local and production Internet Computer networks.

## Deployment

Build the application for production:

```bash
npm run build
```

The built files will be in the `dist` directory, ready for deployment to any static hosting service.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For questions and support, please open an issue in the repository.