# Snap Circuit Challenge

A Next.js-based interactive circuit board game where players complete 3 circuits in 9 minutes.

## Features

- 🎮 3 circuits with 3 minutes each (all tracked in one session)
- 🎯 Easy and Hard difficulty levels
- 📐 7x5 grid-based component placement system
- 🔌 Drag-and-drop multi-cell components (3x1, 3x2, 3x3)
- 🔄 Component rotation
- 🔗 Wire connection system between connection points
- ⏱️ Real-time timer with auto-complete
- 💾 Prisma ORM + Supabase PostgreSQL database
- 📊 Leaderboard system
- ✅ Exact circuit validation (components, positions, and wires)
- 🎯 Real-time action tracking (every place/remove/connect/disconnect)

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up your environment variables in `.env`:
   ```
   DATABASE_URL="postgresql://postgres.[project-ref]:[YOUR-PASSWORD]@aws-0-[region].pooler.supabase.com:5432/postgres"
   ```
   Get this from: Supabase Dashboard → Settings → Database → Connection String → URI

4. Generate Prisma Client and push schema to database:
   ```bash
   npm run db:generate
   npm run db:push
   ```

5. Seed the database with sample circuit challenges:
   ```bash
   npm run db:seed
   ```

6. Run the development server:
   ```bash
   npm run dev
   ```

7. Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
├── app/                     # Next.js app directory
│   ├── game/               # Game page
│   ├── api/                # API routes
│   ├── instructions/       # Instructions page
│   ├── leaderboard/        # Leaderboard page
│   └── page.tsx            # Home page
├── components/             # React components
│   ├── Grid-CircuitBoard.tsx  # Main 7x5 grid board
│   ├── Toolbox.tsx         # Component toolbox
│   ├── GameHeader.tsx      # Game header with timer
│   └── DifficultySelector.tsx
├── lib/                    # Library code
│   └── prisma.ts           # Prisma client
├── prisma/                 # Prisma configuration
│   └── schema.prisma       # Database schema
├── scripts/                # Utility scripts
│   └── seed-circuits.ts    # Seed sample circuits
├── types/                  # TypeScript types
│   └── index.ts
├── utils/                  # Utility functions
│   ├── validation.ts       # Circuit validation & grid helpers
│   └── database.ts         # Database operations
└── public/
    └── photos/             # Place circuit and component images here
```

## Photos Folder

Place your circuit board and component images in the `public/photos/` directory. The images will be accessible at `/photos/...` in the application.

## Deployment

Deploy to Vercel:

```bash
vercel
```

Make sure to add your environment variables in the Vercel dashboard.

## Technologies

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS 4** - Styling
- **Prisma ORM** - Database toolkit
- **Supabase (PostgreSQL)** - Database hosting
- **React 19** - UI library

## Sample Circuit Challenges

The seed script creates these sample circuits:

1. **Circuit 1 (Easy)**: Build a circuit that lights up with the switch
   - Battery → Switch → Yellow LED → Battery

2. **Circuit 1 (Hard)**: Build a circuit that emits red light with the resistor
   - Battery → Resistor → Red LED → Battery

3. **Circuit 2 (Hard)**: Make a circuit that plays music on speaker
   - Battery → Music IC → Speaker → Battery

## License

MIT
