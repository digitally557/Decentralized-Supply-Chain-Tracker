# ChainTrack - Decentralized Supply Chain Tracker

ChainTrack is a blockchain-based supply chain tracking system built on the Stacks blockchain. It provides a secure, transparent, and immutable way to track items throughout their lifecycle, from manufacturing to final delivery.

![ChainTrack Dashboard](https://images.pexels.com/photos/8853537/pexels-photo-8853537.jpeg)

## Features

- 🔐 **Secure Authentication**: Wallet-based authentication using Hiro Wallet
- 📦 **Item Tracking**: Real-time status updates with blockchain verification
- 📱 **QR Code Integration**: Generate and scan QR codes for physical items
- 📊 **Visual Timeline**: Interactive visualization of item history
- 👥 **Role-Based Access**: Different permissions for manufacturers, shippers, retailers
- 🔍 **Advanced Search**: Find items by ID, name, or metadata
- 📱 **Responsive Design**: Optimized for both desktop and mobile devices

## Tech Stack

- React 18 with TypeScript
- Vite for fast development and building
- Tailwind CSS for styling
- Stacks.js for blockchain integration
- React Router for navigation
- Lucide React for icons
- QR Code generation with qrcode.react

## Getting Started

### Prerequisites

- Node.js 18 or later
- npm or yarn
- A Stacks wallet (like Hiro Wallet)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/digitally557/Decentralized-Supply-Chain-Tracker.git
   cd chaintrack
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:5173](http://localhost:5173) in your browser

### Environment Variables

Create a `.env` file in the root directory:

```env
VITE_STACKS_NETWORK=testnet
VITE_CONTRACT_ADDRESS=ST...
VITE_CONTRACT_NAME=supply-chain
```

## Project Structure

```
src/
├── components/         # Reusable UI components
│   ├── data/          # Data display components
│   ├── items/         # Item-related components
│   ├── layout/        # Layout components
│   ├── scan/          # QR code scanning components
│   ├── status/        # Status-related components
│   └── timeline/      # Timeline visualization
├── contexts/          # React context providers
├── pages/             # Page components
├── types/             # TypeScript type definitions
└── constants/         # Application constants
```

## User Roles

- **Manufacturer**: Create and update items during production
- **Shipper**: Update shipping and transit status
- **Retailer**: Manage inventory and sales status
- **Consumer**: View item history and verify authenticity
- **Admin**: Full system access

## Development

### Code Style

- Use TypeScript for type safety
- Follow React best practices and hooks
- Implement responsive design with Tailwind CSS
- Use meaningful component and variable names

### Testing

Run the test suite:

```bash
npm run test
```

### Building for Production

```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.

## Blockchain Integration

ChainTrack uses the Stacks blockchain for:

- Immutable event logging
- Status verification
- Role-based access control
- Transaction history

### Smart Contract Interaction

The application interacts with Clarity smart contracts for:

- Item registration
- Status updates
- Ownership transfers
- Access control

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, email support@chaintrack.com or join our [Discord community](https://discord.gg/chaintrack).

## Acknowledgments

- Stacks blockchain team
- React and Vite communities
- All contributors and testers
