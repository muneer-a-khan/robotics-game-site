# Setup Checklist ✅

Follow this checklist to get your Snap Circuit Challenge up and running!

## Pre-Setup ☑️

- [x] Next.js project created
- [x] Prisma ORM installed
- [x] TypeScript configured
- [x] Tailwind CSS configured
- [x] All components created
- [x] Database schema defined
- [x] Sample circuits prepared

## Your Setup Tasks

### 1. Database Setup (Required)

- [ ] Create a Supabase account at [supabase.com](https://supabase.com)
- [ ] Create a new Supabase project
- [ ] Save your database password
- [ ] Get your connection string from Settings → Database
- [ ] Create `.env` file in project root
- [ ] Add `DATABASE_URL="your-connection-string"` to `.env`

### 2. Install Dependencies (Required)

```bash
- [ ] npm install
- [ ] npm run db:generate
- [ ] npm run db:push
- [ ] npm run db:seed
```

### 3. Test Locally (Required)

```bash
- [ ] npm run dev
- [ ] Open http://localhost:3000
- [ ] Click "Start Game"
- [ ] Select difficulty
- [ ] Try placing components
- [ ] Try connecting wires
- [ ] Click "Done" to validate
```

### 4. Add Photos (Optional but Recommended)

Place images in `public/photos/components/`:

- [ ] battery_holder.png
- [ ] led_yellow.png
- [ ] led_red.png
- [ ] resistor.png
- [ ] lamp.png
- [ ] photoresistor.png
- [ ] music_ic.png
- [ ] alarm_ic.png
- [ ] space_war_ic.png
- [ ] speaker.png
- [ ] slide_switch.png
- [ ] press_switch.png
- [ ] whistle_chip.png

**Note**: The game works with colored boxes if no images are provided.

### 5. Customize (Optional)

- [ ] Update component colors in `types/index.ts`
- [ ] Add more circuit challenges in `scripts/seed-circuits.ts`
- [ ] Modify time limits (default: 180 seconds)
- [ ] Customize styling in components

### 6. Deploy to Vercel (Optional)

- [ ] Create GitHub repository
- [ ] Push code to GitHub
- [ ] Sign up for Vercel account
- [ ] Import GitHub repository to Vercel
- [ ] Add `DATABASE_URL` environment variable in Vercel
- [ ] Deploy!

## Verification Checklist

### Game Features Working:
- [ ] Home page loads correctly
- [ ] Instructions page accessible
- [ ] Leaderboard page accessible
- [ ] Game starts when clicking "Start Game"
- [ ] Difficulty selector appears
- [ ] Battery holder pre-placed on board
- [ ] Components draggable from toolbox
- [ ] Components snap to grid
- [ ] Component count limits enforced (max 2 each)
- [ ] Double-click rotates components
- [ ] Right-click removes components
- [ ] Wire mode activates
- [ ] Connection points clickable
- [ ] Wires appear between connection points
- [ ] Wire limit enforced (1 per connection point)
- [ ] Timer counts down
- [ ] "Done" button validates circuit
- [ ] Validation shows correct/incorrect
- [ ] Progresses to next circuit
- [ ] Completes after 3 circuits
- [ ] Leaderboard shows results

### Database Working:
- [ ] Prisma Client generated
- [ ] Schema pushed to Supabase
- [ ] Sample circuits seeded
- [ ] Game sessions created in database
- [ ] Actions tracked in database
- [ ] Leaderboard queries working
- [ ] Can view data in Prisma Studio

## Troubleshooting

### Database Connection Issues
```bash
# Reset and try again
npm run db:generate
npm run db:push
```

### Missing Prisma Client
```bash
npm run db:generate
```

### Port Already in Use
```bash
# Kill process on port 3000
killall node
# Or use different port
PORT=3001 npm run dev
```

### View Database Contents
```bash
npm run db:studio
# Opens at http://localhost:5555
```

## Quick Commands Reference

```bash
# Development
npm run dev              # Start dev server
npm run build           # Build for production
npm start               # Start production server

# Database
npm run db:generate     # Generate Prisma Client
npm run db:push         # Push schema changes
npm run db:studio       # Open database GUI
npm run db:seed         # Seed sample data
```

## Files You May Want to Edit

1. **Circuit Challenges**: `scripts/seed-circuits.ts`
2. **Component Metadata**: `types/index.ts`
3. **Styling**: Component files in `components/`
4. **Game Rules**: `app/game/page.tsx`
5. **Instructions**: `app/instructions/page.tsx`

## Need Help?

- 📘 **Quick Start**: See `QUICKSTART.md`
- 📗 **Detailed Setup**: See `SETUP.md`
- 📙 **Full Documentation**: See `README.md`
- 📕 **Project Overview**: See `PROJECT_SUMMARY.md`

---

**Ready to play?** Run `npm run dev` and visit http://localhost:3000! 🎮

