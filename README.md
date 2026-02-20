# Blockchain-Based-Voting-System

A secure, transparent, and tamper-proof voting system built using blockchain technology to ensure election integrity and voter trust. This system eliminates vote manipulation by storing votes as immutable blockchain transactions, enabling verifiable and decentralized election processes.

## BlockVote - React Frontend

A modern React frontend for the blockchain-based voting system. UI and frontend logic only—ready for blockchain integration.

### Features

**Admin Panel**
- Admin Login
- Admin Dashboard with stats
- Add/Delete candidates
- View candidate list
- View voting results (simulated)
- Start/End Election toggle

**User Panel**
- User Registration
- User Login
- User Dashboard
- View candidates
- Vote (disabled after voting once)
- Voting status (Voted / Not Voted)
- View results (visible after election ends)

**Technical**
- React 19 + Vite
- React Router v6
- Context API (Auth, Voting, Wallet)
- Tailwind CSS
- React Hot Toast
- Responsive design
- Protected routes
- Form validation

### Setup

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Project Structure

```
src/
  components/     # Reusable UI components
  pages/
    admin/        # Admin panel pages
    user/         # User panel pages
  context/        # Auth, Voting, Wallet contexts
  services/
    blockchain.js # Placeholder blockchain functions
  routes/         # App routing
  layouts/        # Main & Auth layouts
```

### Blockchain Integration

The `src/services/blockchain.js` file contains placeholder functions to replace with real Web3/ethers.js:

- `connectWallet()` - Connect MetaMask
- `registerUser(userData)` - Register voter
- `addCandidate(candidate)` - Add candidate (admin)
- `castVote(candidateId, voterAddress)` - Cast vote
- `getResults()` - Fetch results

### Demo Credentials

**Admin:** Any email + password (UI validation only)  
**User:** Only admin-approved voters can login. Admin adds voters in the Admin Dashboard under "Approved Voters".

### Deployment

**Vercel:**
```bash
npx vercel
```

**GitHub Pages:** Push to `main` — the workflow deploys automatically. Enable Pages in repo Settings → Pages → Source: GitHub Actions.

### Flow

1. Admin logs in → Adds approved voters (name, email, password) → Adds candidates → Starts election
2. Approved voters log in with their credentials → Cast one vote → View results after election ends
