# Quick Start Guide

Get your Snap Circuit Challenge running in 5 minutes!

## 1. Set Up Database (2 mins)

### Create Supabase Project
1. Go to [supabase.com](https://supabase.com) and create a free account
2. Click "New Project"
3. Set project name and password (save password!)
4. Wait for project to be ready (~2 minutes)

### Get Connection String
1. Go to **Settings** → **Database**
2. Find **Connection String** section
3. Select **URI** tab
4. Copy the string and replace `[YOUR-PASSWORD]` with your actual password

### Create `.env` File
Create a file named `.env` in the project root:
```
DATABASE_URL="your-connection-string-here"
```

## 2. Install & Setup (2 mins)

```bash
# Install dependencies
npm install

# Generate Prisma Client
npm run db:generate

# Push database schema
npm run db:push

# Seed sample circuits
npm run db:seed
```

## 3. Run the App (1 min)

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and start playing!

## 4. Add Your Photos (Optional)

Place component images in `public/photos/components/`:
- battery_holder.png
- led_yellow.png
- led_red.png
- resistor.png
- lamp.png
- photoresistor.png
- music_ic.png
- alarm_ic.png
- space_war_ic.png
- speaker.png
- slide_switch.png
- press_switch.png
- whistle_chip.png

## 5. Deploy to Vercel (Optional)

```bash
# Push to GitHub first
git add .
git commit -m "Initial commit"
git push

# Deploy to Vercel
# 1. Go to vercel.com
# 2. Import your GitHub repo
# 3. Add DATABASE_URL environment variable
# 4. Deploy!
```

## Troubleshooting

### "Can't reach database server"
- Check your DATABASE_URL in `.env`
- Make sure your Supabase project is running
- Try the connection string from Supabase again

### "Prisma Client not found"
```bash
npm run db:generate
```

### Need to reset database?
```bash
npm run db:push
npm run db:seed
```

### View database data
```bash
npm run db:studio
```
Opens at [http://localhost:5555](http://localhost:5555)

## How to Play

1. **Start Game** - Click "Start Game" on homepage
2. **Choose Difficulty** - Select Easy or Hard for each circuit
3. **Build Circuit**:
   - Drag components from toolbox to the 7×5 grid
   - Components snap to grid positions
   - Double-click to rotate (or use Rotate button)
   - Right-click to remove components
4. **Connect Wires**:
   - Click "Connect Components" to enter wire mode
   - Click two white connection points to connect them
   - Click wires to remove them
5. **Complete** - Click "Done" button or wait for 3 minutes to auto-complete
6. **Validation** - System checks if your circuit matches the target
7. **Next Circuit** - Repeat for circuits 2 and 3

## Game Rules

- **3 circuits** in **9 minutes** (3 minutes each)
- **Battery holder** is pre-placed (cannot move or remove)
- Each component type can be used **maximum 2 times**
- **One wire per connection point**
- All actions are tracked in real-time
- Exact validation: components, positions, and connections must match

## Database Tables

- **circuits** - Pre-configured challenges
- **game_sessions** - Each circuit attempt
- **game_actions** - Every action (place/remove/connect/disconnect)

## Need Help?

See [SETUP.md](./SETUP.md) for detailed instructions or [README.md](./README.md) for full documentation.

