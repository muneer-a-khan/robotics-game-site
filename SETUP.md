# Snap Circuit Challenge - Setup Guide

This guide will help you set up and deploy the Snap Circuit Challenge game.

## Prerequisites

- Node.js 18+ installed
- A Supabase account (free tier works)
- Git (for version control)

## Step 1: Database Setup with Supabase

### 1.1 Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click "New Project"
3. Fill in your project details:
   - Project name: `snap-circuit-game` (or your choice)
   - Database password: Create a strong password (save this!)
   - Region: Choose closest to your users
4. Click "Create new project"

### 1.2 Get Your Database Connection String

1. In your Supabase project dashboard, go to **Settings** (gear icon) → **Database**
2. Scroll down to **Connection String** section
3. Select the **URI** tab
4. Copy the connection string (it should look like):
   ```
   postgresql://postgres.[project-ref]:[YOUR-PASSWORD]@aws-0-[region].pooler.supabase.com:5432/postgres
   ```
5. Replace `[YOUR-PASSWORD]` with your actual database password

### 1.3 Configure Environment Variables

Create a `.env` file in the project root:

```bash
DATABASE_URL="your-connection-string-here"
```

**Important:** Never commit this `.env` file to git! It's already in `.gitignore`.

## Step 2: Install Dependencies & Generate Prisma Client

```bash
npm install
npx prisma generate
```

## Step 3: Run Database Migrations

This will create all the necessary tables in your Supabase database:

```bash
npx prisma db push
```

You should see output confirming the tables were created:
- `circuits` - Stores pre-configured circuit challenges
- `game_sessions` - Stores game sessions
- `game_actions` - Stores real-time tracking of every action

## Step 4: Add Photos

Place your circuit board and component images in the `public/photos/` directory. The structure should be:

```
public/photos/
├── components/
│   ├── battery_holder.png
│   ├── led_yellow.png
│   ├── led_red.png
│   ├── resistor.png
│   ├── lamp.png
│   ├── photoresistor.png
│   ├── music_ic.png
│   ├── alarm_ic.png
│   ├── space_war_ic.png
│   ├── speaker.png
│   ├── slide_switch.png
│   ├── press_switch.png
│   └── whistle_chip.png
└── board/
    └── circuit_board.png
```

## Step 5: Create Circuit Challenges (Optional)

You can add pre-configured circuit challenges through Prisma Studio or programmatically.

### Using Prisma Studio (Visual Editor)

```bash
npx prisma studio
```

This opens a web interface at `http://localhost:5555` where you can:
1. Click on the `Circuit` model
2. Click "Add record"
3. Fill in the circuit data (components and wire configurations)

### Programmatically

You can use the `saveCircuitChallenge` function from `utils/database.ts` to create challenges programmatically.

## Step 6: Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Step 7: Deploy to Vercel

### 7.1 Push to GitHub

```bash
git add .
git commit -m "Initial commit"
git remote add origin your-github-repo-url
git push -u origin main
```

### 7.2 Deploy on Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Configure the project:
   - Framework Preset: **Next.js**
   - Root Directory: `./`
   - Build Command: `npm run build`
   - Output Directory: `.next`
5. Add Environment Variables:
   - Key: `DATABASE_URL`
   - Value: Your Supabase connection string
6. Click "Deploy"

### 7.3 After Deployment

After your first deployment:
1. Vercel will provide you with a URL (e.g., `your-app.vercel.app`)
2. Go to your Supabase project → Settings → API
3. Add your Vercel URL to the allowed URLs if you implement authentication later

## Database Schema Overview

### `circuits` Table
Stores pre-configured circuit challenges:
- `id` - Auto-incrementing ID
- `circuit_number` - Which circuit (1, 2, or 3)
- `difficulty` - 'easy' or 'hard'
- `description` - Optional description
- `target_components` - JSON array of components with positions
- `target_connections` - JSON array of wire connections
- `time_limit` - Time limit in seconds (default 180)

### `game_sessions` Table
Tracks each game session:
- `id` - UUID
- `user_id` - Optional user ID (for future auth)
- `circuit_number` - Which circuit (1, 2, or 3)
- `difficulty` - 'easy' or 'hard'
- `completed` - Boolean
- `time_taken` - Time in seconds
- `is_correct` - Whether circuit was correct
- `created_at` - When session started
- `completed_at` - When session ended

### `game_actions` Table
Real-time tracking of every action:
- `id` - UUID
- `session_id` - References game_sessions
- `action_type` - 'place_component', 'remove_component', 'add_wire', 'remove_wire'
- `component_type` - Type of component
- `component_id` - Component instance ID
- `grid_position` - JSON {x, y} grid position
- `orientation` - Component rotation (0, 90, 180, 270)
- `wire_data` - JSON wire connection data
- `timestamp` - When action occurred

## Component Types

The game supports these exact components:
1. **Battery Holder** - Pre-placed, powers the circuit
2. **LED_1 (Yellow)** - Yellow LED
3. **LED_2 (Red)** - Red LED
4. **Resistor** - Current limiter
5. **Lamp** - Light bulb
6. **Photoresistor** - Light-sensitive resistor
7. **U_1 (Blue Music IC)** - Music circuit
8. **U_2 (Red Alarm IC)** - Alarm circuit
9. **U_3 (Green Space War IC)** - Space war circuit
10. **Speaker** - Audio output
11. **Slide Switch** - Toggle switch
12. **Press Switch** - Push button
13. **Whistle Chip** - Sound effect chip

Each component (except battery) can be used max 2 times per circuit.

## Grid System

- **7 columns (x: 0-6) × 5 rows (y: 0-4)**
- Components snap to grid positions
- Each grid cell can hold one component

## Connection System

- Components have connection points on specific sides
- Standard components: connection points on left and right
- Battery holder: two connection points on one end
- IC circuits (music, alarm, space war): connection points on all four corners + one in middle-right
- Users drag wires between connection points
- Multiple wires can connect to the same connection point

## Troubleshooting

### "Can't reach database server"
- Check your DATABASE_URL in `.env`
- Ensure your Supabase project is running
- Check if your IP is allowed in Supabase (Settings → Database → Connection pooling)

### Prisma Client errors
- Run `npx prisma generate` to regenerate the client
- Make sure all dependencies are installed

### Build errors on Vercel
- Ensure DATABASE_URL is set in Vercel environment variables
- Check build logs for specific errors
- Make sure `prisma generate` runs during build (it should automatically)

## Development Commands

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Generate Prisma Client
npx prisma generate

# Push schema changes to database
npx prisma db push

# Open Prisma Studio (database GUI)
npx prisma studio

# Build for production
npm run build

# Start production server
npm start
```

## Next Steps

1. **Add circuit challenges** to the database
2. **Upload component photos** to `/public/photos/`
3. **Test the game** with real circuit challenges
4. **Analyze game data** through Prisma Studio
5. **Optional:** Add user authentication
6. **Optional:** Add analytics and reporting

## Support

For issues or questions, refer to:
- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

