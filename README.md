# Grid

A modern Solana collaboration platform built with Next.js 14, TypeScript, and Tailwind CSS, powered by the Solana blockchain.

## Overview

Grid is a decentralized platform designed to revolutionize developer workflows and enhance team collaboration on Solana. It provides a unified interface for managing projects, smart contracts, and on-chain interactions.

## Key Features

### Solana Integration
- Smart contract deployment and management
- SPL token integration
- Wallet connectivity
- Transaction monitoring
- Program interaction

### Developer Tools
- GitHub repository integration
- Real-time repository search
- Code collaboration tools
- Project management

### Multi-Role Support
- Solana developer workspace
- Smart contract testing tools
- DeFi creator features
- Protocol admin dashboard

### Modern Stack
- Next.js 14 with App Router
- TypeScript for type safety
- Tailwind CSS for styling
- Prisma for database
- Auth.js for authentication
- Solana Web3.js for blockchain interaction
- Anchor framework support

## Getting Started

1. Clone the repository
```bash
git clone https://github.com/Coding-With-Josh/grid.git
cd grid
```

2. Install dependencies
```bash
cd web
npm install
```

3. Configure environment variables
```bash
cp .env.example .env.local
```

4. Start development server
```bash
npm run dev
```

## Environment Setup

Required configurations:
- Solana RPC endpoint
- Program IDs
- Wallet configurations
- OAuth credentials
- Database URL

## Project Structure

```
grid/
├── web/          # Next.js frontend 
|   ├── prisma/   # Prisma database
│   ├── public/          # Static assets
│   ├── src/
│   │   ├── app/          # App router pages
│   │   ├── components/   # React components
│   │   ├── hooks/        # React hooks
│   │   ├── lib/         # Utility functions
│   │   ├── providers/    # React context providers
│   │   └── styles/      # Global styles
│   │   ├── types/        # TypeScript types
│   
└── README.md
```

## Solana Programs

The platform integrates with the following Solana programs:
- Project Management Program
- Token Management Program
- Collaboration Program
- Access Control Program

## Contributing

We welcome contributions to both the frontend application and Solana programs! Please feel free to submit pull requests.

## Security

- Secure wallet integration
- Program security audits
- Multi-sig support
- Transaction simulation before execution

## Author

**Joshua** - [Coding-With-Josh](https://github.com/Coding-With-Josh)

## License

This project is licensed under the MIT License.
