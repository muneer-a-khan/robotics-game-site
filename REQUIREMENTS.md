# Snap Circuit Challenge - Complete Requirements Document

## 1. Executive Summary

### 1.1 Product Overview
An interactive web-based educational game that simulates building electronic circuits using Snap Circuits components. Players must complete 3 circuit challenges within time constraints, with difficulty levels and real-time performance tracking.

### 1.2 Target Audience
- Students learning electronics and circuits
- Educators teaching basic circuit principles
- Hobbyists interested in electronics
- Anyone wanting to practice circuit building skills

### 1.3 Core Value Proposition
- Hands-on circuit building experience without physical components
- Immediate validation and feedback
- Competitive leaderboard system
- Real-time action tracking for learning analytics
- Safe environment to experiment with circuits

---

## 2. Functional Requirements

### 2.1 User Interface Requirements

#### 2.1.1 Home Page (Landing Page)
**FR-UI-001**: Display game title "Snap Circuit Challenge"
**FR-UI-002**: Show brief "How to Play" instructions with 6 numbered steps
**FR-UI-003**: Provide "Start Game" button as primary call-to-action
**FR-UI-004**: Include secondary navigation buttons:
- Instructions (detailed gameplay guide)
- Leaderboard (performance rankings)

**FR-UI-005**: Display informational footer text:
- "Battery is pre-placed on the board"
- "Track your progress and compete with others!"

**FR-UI-006**: Use responsive design supporting desktop and tablet viewports

#### 2.1.2 Game Board Interface
**FR-UI-007**: Display 10×7 grid system with visible grid lines
- 10 columns labeled 1-10 (top)
- 7 rows labeled A-G (left side)
- Grid line spacing: 80 pixels
- Grid lines: brown/amber color at 50% opacity

**FR-UI-008**: Show grid board with following visual properties:
- Background: Amber gradient (from-amber-50 to-amber-100)
- Border: 4px solid amber-800
- Rounded corners
- Total size: 800px × 560px

**FR-UI-009**: Display battery holder pre-placed at position (0, 2) - left side, Row C

**FR-UI-010**: Render all placed components with:
- Actual component images (from /public/photos/components/)
- Fallback to colored rectangles if image unavailable
- Component name overlaid on colored fallback
- Drop shadow for depth
- Hover effect: scale 105%
- Selection ring: 4px blue ring when selected

**FR-UI-011**: Display connection points on all components:
- White circles with gray borders
- 6px diameter (24px total with padding)
- Positioned at exact grid line intersections
- Hover effect: scale 150%
- Selected state: yellow/green highlight

**FR-UI-012**: Render wire connections as:
- Blue straight lines (6px width)
- Black shadow/outline (8px width, 30% opacity)
- Rounded line caps
- Connecting two connection points
- Hover effect: change to red
- Click to remove functionality

#### 2.1.3 Component Toolbox
**FR-UI-013**: Display toolbox panel on right side containing:
- Grid layout (2 columns)
- 13 available component types
- Each component card showing:
  - Component name
  - Color coding
  - Usage counter (e.g., "0/2")
  - MAX indicator when limit reached

**FR-UI-014**: Component cards visual states:
- Available: Full color, cursor grab, hover shadow/scale
- Maxed out: Gray/disabled, cursor not-allowed, opacity 50%

**FR-UI-015**: Toolbox controls section showing:
- Drag to grid instruction
- Double-click to rotate instruction
- Right-click to remove instruction
- Max limit notification (2 per type)

#### 2.1.4 Game Header
**FR-UI-016**: Display header bar with:
- Circuit progress indicator: "X/3" where X is current circuit
- Difficulty badge: 
  - Easy: Green background
  - Hard: Red background
- Countdown timer showing MM:SS format
- Timer color coding:
  - Green: > 60 seconds
  - Yellow: 31-60 seconds
  - Red: ≤ 30 seconds
- "Done" button (green, prominent)

#### 2.1.5 Actions Panel
**FR-UI-017**: Display actions sidebar with:
- "Rotate Selected" button (purple, only when component selected)
- "Align Components" toggle button:
  - Inactive state: Orange "🔗 Align Components"
  - Active state: Green "✅ Overlap Mode ON" with ring
- Connection instructions card (blue background)
- Quick guide card (amber background)
- Mode indicator when overlap mode is active

#### 2.1.6 Difficulty Selector Modal
**FR-UI-018**: Show modal overlay at start of each circuit with:
- Semi-transparent black backdrop
- Centered white card with:
  - Circuit number title
  - "Choose your difficulty level" subtitle
  - Two large gradient buttons:
    - Easy: Green gradient, "🟢 Easy", subtitle
    - Hard: Red gradient, "🔴 Hard", subtitle
  - Hover effects: scale and shadow enhancement

#### 2.1.7 Leaderboard Page
**FR-UI-019**: Display leaderboard table with columns:
- Rank (with 🥇🥈🥉 medals for top 3)
- Circuit number
- Difficulty badge
- Time taken (MM:SS format)
- Status (✓ Correct / ✗ Incorrect)
- Date completed

**FR-UI-020**: Show loading spinner while fetching data

**FR-UI-021**: Display empty state when no games played:
- Message: "No games played yet!"
- Call-to-action: "Start Playing" button

**FR-UI-022**: Show error state if database connection fails

**FR-UI-023**: Include "Play Game" button at bottom

#### 2.1.8 Instructions Page
**FR-UI-024**: Display comprehensive instructions including:
- Objective section
- How to Play (numbered steps 1-5)
- Available Components grid (9 components with descriptions)
- Tips & Tricks (5 tips as bullet list)
- Important Notes (3 warnings in yellow alert box)
- "Start Playing" call-to-action button

---

### 2.2 Game Mechanics Requirements

#### 2.2.1 Component Placement System
**FR-GAME-001**: Allow drag-and-drop of components from toolbox to board
- Pick up: Mouse down on toolbox component card
- Drag: Visual feedback showing component being dragged
- Drop: Release on board to place

**FR-GAME-002**: Snap component position to nearest grid line intersection
- Calculate nearest intersection based on mouse position
- Apply snap position immediately on drop

**FR-GAME-003**: Validate component placement:
- Must be within board boundaries (0-10 columns, 0-7 rows)
- Must not exceed maximum count (2 per component type, except battery: 1)
- Display alert if placement invalid

**FR-GAME-004**: Place battery holder automatically at game start
- Position: Grid line (0, 2)
- Cannot be moved by user
- Cannot be removed by user
- Cannot be rotated

**FR-GAME-005**: Allow moving existing components:
- Drag existing component to new position
- Re-snap to grid lines
- Validate new position
- Update all connected wires in real-time

#### 2.2.2 Component Rotation System
**FR-GAME-006**: Support component rotation via two methods:
- Method 1: Double-click component
- Method 2: Select component, click "Rotate Selected" button

**FR-GAME-007**: Rotate components in 90° increments
- Orientations: 0°, 90°, 180°, 270°
- Cycle through orientations on each rotation action

**FR-GAME-008**: Restrict rotation for battery holder
- Battery cannot be rotated

**FR-GAME-009**: Update connection point positions after rotation
- Recalculate pixel positions based on new orientation

#### 2.2.3 Component Removal System
**FR-GAME-010**: Allow component removal via right-click
- Display confirmation dialog: "Remove [Component Name]?"
- Remove component from board on confirmation
- Cannot remove battery holder

**FR-GAME-011**: Remove associated wires when component removed
- Find all wires connected to component's connection points
- Delete all associated wires automatically

#### 2.2.4 Manual Component Alignment System
**FR-GAME-012**: Enable manual alignment mode via toggle button
- Button label changes to show active state
- Connection points change selection color to green

**FR-GAME-013**: Manual alignment workflow:
1. User clicks "Align Components" button (activates mode)
2. User clicks connection point on Component A (highlights green)
3. User clicks connection point on Component B
4. System calculates pixel offset between points
5. System moves Component B to align points exactly
6. System validates new position (within bounds)
7. Mode deactivates, alignment complete

**FR-GAME-014**: Manual alignment validations:
- Cannot align component to itself
- Cannot move battery holder (move other component instead)
- Cannot align if result would be out of bounds
- Display appropriate error messages

#### 2.2.5 Wire Connection System
**FR-GAME-015**: Wire creation workflow:
1. User clicks first connection point (highlights yellow)
2. User clicks second connection point
3. System validates connection (different components)
4. System checks for duplicate wire
5. System creates wire if valid
6. Wire drawn as line between points

**FR-GAME-016**: Wire validation rules:
- Cannot connect component to itself
- Cannot create duplicate wire between same points
- Wire can connect any two different components

**FR-GAME-017**: Wire removal:
- Click directly on wire line
- Display confirmation: "Remove this wire?"
- Remove on confirmation

**FR-GAME-018**: Wire visual updates:
- Automatically update wire positions when components move
- Recalculate endpoints based on connection point positions

**FR-GAME-019**: Support unlimited wire connections
- Maximum 20 wire components placeable
- Unlimited logical connections between connection points

#### 2.2.6 Connection Points System
**FR-GAME-020**: Define connection points for each component type:
- Battery Holder: top-right, bottom-right (2 points)
- Wire: left, right (2 points)
- LEDs: left, right (2 points)
- Resistor: left, right (2 points)
- Lamp: left, right (2 points)
- Photoresistor: left, right (2 points)
- Speaker: left, right (2 points)
- Switches: left, right (2 points)
- Whistle Chip: left, right (2 points)
- Music IC: top-left, top-right, bottom-left, bottom-right, middle-right (5 points)
- Alarm IC: top-left, top-right, bottom-left, bottom-right, middle-right (5 points)
- Space War IC: top-left, top-right, bottom-left, bottom-right, middle-right (5 points)

**FR-GAME-021**: Position connection points at grid line intersections
- Calculate exact pixel position based on grid position
- Account for component size when calculating point positions

**FR-GAME-022**: Connection point interactivity:
- Clickable for wire creation and manual alignment
- Visual feedback on hover (scale up)
- Visual feedback when selected (color change)

---

### 2.3 Game Flow Requirements

#### 2.3.1 Game Session Flow
**FR-FLOW-001**: Game consists of 3 sequential circuits
- Circuit 1, Circuit 2, Circuit 3
- Each circuit is independent
- Must complete current circuit before proceeding to next

**FR-FLOW-002**: Each circuit has dedicated 3-minute timer
- Total game time: 9 minutes maximum
- Timer starts when difficulty is selected
- Timer counts down from 180 seconds to 0

**FR-FLOW-003**: Circuit completion triggers:
- Manual: User clicks "Done" button
- Automatic: Timer reaches 0 seconds

**FR-FLOW-004**: Difficulty selection workflow:
- Display difficulty selector modal at start of each circuit
- User chooses Easy or Hard
- Create database session record
- Initialize board with battery
- Start 3-minute timer

**FR-FLOW-005**: Circuit validation workflow:
1. User clicks "Done" or timer expires
2. Fetch target circuit from database
3. Validate user's circuit against target:
   - Component types match
   - Component positions match
   - Wire connections match
4. Display validation result (correct/incorrect with errors)
5. Save completion data to database

**FR-FLOW-006**: Progression between circuits:
- After Circuit 1: Show Circuit 2 difficulty selector
- After Circuit 2: Show Circuit 3 difficulty selector
- After Circuit 3: Show completion message, redirect to home

**FR-FLOW-007**: Game completion:
- Display success message: "🎉 All circuits complete!"
- Prompt to check leaderboard
- Redirect to home page

#### 2.3.2 Timer System
**FR-FLOW-008**: Countdown timer implementation:
- Start at 180 seconds (3:00)
- Decrement by 1 every second
- Stop at 0 seconds

**FR-FLOW-009**: Timer display format:
- Minutes:Seconds (M:SS)
- Examples: 3:00, 2:45, 0:30, 0:05

**FR-FLOW-010**: Timer visual states:
- Green: > 60 seconds remaining
- Yellow: 31-60 seconds remaining
- Red: ≤ 30 seconds remaining (urgency indicator)

**FR-FLOW-011**: Auto-complete on timer expiration:
- When timer reaches 0, trigger circuit completion
- Stop timer
- Validate circuit
- Proceed to next circuit or game end

---

### 2.4 Data Management Requirements

#### 2.4.1 Database Schema
**FR-DATA-001**: Circuits table structure:
```typescript
{
  id: number (auto-increment primary key)
  circuitNumber: number (1-3)
  difficulty: string ("easy" or "hard")
  description: string (optional)
  targetComponents: JSON (array of Component objects)
  targetConnections: JSON (array of Wire objects)
  timeLimit: number (default: 180 seconds)
  createdAt: timestamp
}
```

**FR-DATA-002**: GameSessions table structure:
```typescript
{
  id: UUID (primary key)
  userId: string (optional, for future multi-user)
  circuitNumber: number (1-3)
  difficulty: string ("easy" or "hard")
  completed: boolean (default: false)
  timeTaken: number (seconds, nullable)
  isCorrect: boolean (nullable)
  createdAt: timestamp
  completedAt: timestamp (nullable)
}
```

**FR-DATA-003**: GameActions table structure:
```typescript
{
  id: UUID (primary key)
  sessionId: UUID (foreign key to GameSessions)
  actionType: string ("place_component", "remove_component", "add_wire", "remove_wire")
  componentType: string (optional)
  componentId: string (optional)
  gridPosition: JSON (optional, {x, y})
  orientation: number (optional, 0-270)
  wireData: JSON (optional, {fromId, toId})
  timestamp: timestamp
}
```

**FR-DATA-004**: Define data relationships:
- GameSessions has many GameActions (one-to-many)
- GameActions belong to GameSessions (many-to-one)
- Cascade delete: Deleting session deletes all actions

#### 2.4.2 Session Management
**FR-DATA-005**: Create new game session when:
- User selects difficulty for a circuit
- Generate UUID for session ID
- Store circuit number and difficulty
- Mark as not completed initially

**FR-DATA-006**: Update session on completion:
- Set completed = true
- Record timeTaken (seconds elapsed)
- Record isCorrect (validation result)
- Set completedAt timestamp

**FR-DATA-007**: Support session querying:
- Get sessions by circuit number
- Get sessions by difficulty
- Get sessions ordered by completion time
- Get sessions filtered by correctness

#### 2.4.3 Real-Time Action Tracking
**FR-DATA-008**: Track every user action:
- Component placement: type, ID, position, orientation
- Component removal: component ID
- Component movement: treated as remove + place
- Component rotation: treated as remove + place with new orientation
- Wire creation: from/to connection point IDs
- Wire removal: connection point IDs

**FR-DATA-009**: Implement batched action saving:
- Queue actions in memory
- Process queue every 1 second
- Batch up to 10 actions per database transaction
- Continue processing until queue empty

**FR-DATA-010**: Action tracking specifications:
- Every action has sessionId foreign key
- Every action has accurate timestamp
- Actions stored in chronological order
- Actions can be replayed to reconstruct game state

#### 2.4.4 Circuit Validation
**FR-DATA-011**: Validate component types:
- Extract component types from user's circuit
- Extract component types from target circuit
- Compare sorted arrays (excluding battery)
- Return error if types don't match

**FR-DATA-012**: Validate component positions:
- For each target component, find matching user component
- Check if grid positions match exactly
- Return error if any position mismatch

**FR-DATA-013**: Validate wire connections:
- Normalize wire connections (sort endpoints)
- Create set of target wires
- Create set of user wires
- Check all target wires exist in user wires
- Check no extra wires in user circuit
- Return error if connection mismatch

**FR-DATA-014**: Validation result format:
```typescript
{
  isValid: boolean
  errors: string[] // Array of human-readable error messages
}
```

---

### 2.5 Component System Requirements

#### 2.5.1 Component Types
**FR-COMP-001**: Support 14 distinct component types:
1. Battery Holder (power source)
2. Wire (conductor)
3. LED Yellow (light emitter)
4. LED Red (light emitter)
5. Resistor (current limiter)
6. Lamp (light bulb)
7. Photoresistor (light sensor)
8. Music IC / U1 (sound generator)
9. Alarm IC / U2 (alarm generator)
10. Space War IC / U3 (game sound generator)
11. Speaker (audio output)
12. Slide Switch (on/off control)
13. Press Switch (momentary control)
14. Whistle Chip (sound effect)

#### 2.5.2 Component Sizes (Grid Spaces)
**FR-COMP-002**: Define component sizes:
- Battery Holder: 2×2 (extends left off board)
- Wire: 3×1
- Music IC: 3×2
- Alarm IC: 3×2
- Space War IC: 3×2
- All other standard components: 3×1

**FR-COMP-003**: Component actual pixel dimensions:
- 3×1 components: 240px × 80px
- 3×2 components: 240px × 160px
- 2×2 components: 160px × 160px

#### 2.5.3 Component Limits
**FR-COMP-004**: Enforce maximum component counts per circuit:
- Battery Holder: 1 (pre-placed, cannot add more)
- Wire: 20
- All other components: 2 each

**FR-COMP-005**: Display component usage in toolbox:
- Show current count / maximum count
- Example: "1/2" means 1 placed, 2 maximum
- Disable drag when maximum reached

#### 2.5.4 Component Images
**FR-COMP-006**: Load component images from public folder:
- Path: /public/photos/components/[component_name].png
- Image files:
  - battery_holder.png
  - wire.png
  - yellow_LED.png
  - red_LED.png
  - resistor.png
  - lamp.png
  - photoresistor.png
  - U1 Music.png
  - U2 Alarm.png
  - U3 Space War.png
  - speaker.png
  - slide_switch.png
  - press_switch.png
  - whistle_chip.png (missing - shows fallback)

**FR-COMP-007**: Image display properties:
- Object-fit: contain
- Pointer events: none (prevent drag interference)
- Draggable: false

**FR-COMP-008**: Fallback rendering when image missing:
- Display colored rectangle with component name
- Use predefined color for each component type

#### 2.5.5 Component Metadata
**FR-COMP-009**: Define metadata for each component:
- Type identifier
- Display name
- Maximum count allowed
- Connection point definitions
- Image path
- Fallback color

**FR-COMP-010**: Color coding for components (fallback):
- Battery: Red (#DC2626)
- Wire: Blue (#2563EB)
- LED Yellow: Yellow (#FBBF24)
- LED Red: Red (#EF4444)
- Resistor: Orange (#F59E0B)
- Lamp: Amber (#FCD34D)
- Photoresistor: Purple (#A78BFA)
- Music IC: Blue (#3B82F6)
- Alarm IC: Red (#EF4444)
- Space War IC: Green (#10B981)
- Speaker: Gray (#6B7280)
- Slide Switch: Violet (#8B5CF6)
- Press Switch: Cyan (#06B6D4)
- Whistle Chip: Pink (#EC4899)

---

### 2.6 Grid System Requirements

#### 2.6.1 Grid Structure
**FR-GRID-001**: Implement 10×7 grid line system:
- 10 vertical lines (columns 1-10)
- 7 horizontal lines (rows A-G)
- Grid spacing: 80 pixels between lines

**FR-GRID-002**: Grid coordinate system:
- Origin (0,0) at top-left
- X-axis increases rightward (0-10)
- Y-axis increases downward (0-7)
- Coordinates represent grid line intersections, not cells

**FR-GRID-003**: Display grid labels:
- Column labels above grid: 1, 2, 3, 4, 5, 6, 7, 8, 9, 10
- Row labels to left of grid: A, B, C, D, E, F, G
- Labels in amber/brown color
- Bold font weight

#### 2.6.2 Grid Snapping
**FR-GRID-004**: Snap-to-grid algorithm:
- Calculate: x = Math.round(mouseX / 80)
- Calculate: y = Math.round(mouseY / 80)
- Clamp x to range [0, 10]
- Clamp y to range [0, 7]
- Return grid position {x, y}

**FR-GRID-005**: Auto-snap on component placement:
- Apply snap when dropping component from toolbox
- Apply snap when moving existing component
- Immediate visual feedback on snap

**FR-GRID-006**: Auto-snap to connection points (optional):
- When component dropped near another component
- If connection points within 60px (0.5 grid spaces)
- Calculate offset to align connection points
- Snap to aligned position if within bounds

#### 2.6.3 Grid Validation
**FR-GRID-007**: Validate component fits within grid:
- Check: gridX + componentWidth ≤ 10
- Check: gridY + componentHeight ≤ 7
- Display error if out of bounds

**FR-GRID-008**: Allow component overlaps at connection points:
- Components can share grid line positions
- Connection points can overlap (for alignment)
- No collision detection between components

---

## 3. Non-Functional Requirements

### 3.1 Performance Requirements

**NFR-PERF-001**: Page load time < 2 seconds on broadband connection

**NFR-PERF-002**: Component drag response time < 50ms

**NFR-PERF-003**: Timer updates with ±100ms accuracy

**NFR-PERF-004**: Database queries return in < 500ms

**NFR-PERF-005**: Batched action saves execute in < 200ms per batch

**NFR-PERF-006**: Circuit validation completes in < 1 second

**NFR-PERF-007**: Support 100+ database actions per game session without performance degradation

### 3.2 Scalability Requirements

**NFR-SCALE-001**: Support up to 100 concurrent users

**NFR-SCALE-002**: Database can store 10,000+ game sessions

**NFR-SCALE-003**: Leaderboard can display 1,000+ entries efficiently

**NFR-SCALE-004**: Action tracking can handle 1,000+ actions per session

### 3.3 Reliability Requirements

**NFR-REL-001**: System uptime: 99% availability

**NFR-REL-002**: No data loss on database connection interruption (queue persists)

**NFR-REL-003**: Graceful degradation if image loading fails (show fallback)

**NFR-REL-004**: Error handling for all API calls with user-friendly messages

### 3.4 Usability Requirements

**NFR-USE-001**: Responsive design supporting viewports 768px - 1920px width

**NFR-USE-002**: Clear visual feedback for all interactive elements:
- Hover states
- Active states
- Disabled states
- Loading states

**NFR-USE-003**: Accessible color contrast ratios meeting WCAG 2.1 AA standards

**NFR-USE-004**: Intuitive drag-and-drop with visual cues

**NFR-USE-005**: Confirmation dialogs for destructive actions (remove component/wire)

**NFR-USE-006**: Helpful error messages with clear actionable guidance

### 3.5 Browser Compatibility Requirements

**NFR-COMPAT-001**: Support modern browsers:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

**NFR-COMPAT-002**: JavaScript ES2020+ features supported

**NFR-COMPAT-003**: CSS Grid and Flexbox support required

### 3.6 Security Requirements

**NFR-SEC-001**: Database connection via secure environment variables

**NFR-SEC-002**: Input validation on all API endpoints

**NFR-SEC-003**: SQL injection prevention via Prisma ORM

**NFR-SEC-004**: XSS prevention via React's built-in escaping

**NFR-SEC-005**: HTTPS required for production deployment

### 3.7 Data Integrity Requirements

**NFR-DATA-001**: All database timestamps in UTC timezone

**NFR-DATA-002**: Foreign key constraints enforced (session → actions)

**NFR-DATA-003**: JSON validation for stored objects (components, wires)

**NFR-DATA-004**: Unique constraint on (circuitNumber, difficulty) in Circuits table

---

## 4. API Requirements

### 4.1 Sessions API

#### POST /api/sessions
**Purpose**: Create new game session

**Request Body**:
```json
{
  "circuitNumber": 1,
  "difficulty": "easy"
}
```

**Response**: 
```json
{
  "id": "uuid-here",
  "circuitNumber": 1,
  "difficulty": "easy",
  "completed": false,
  "createdAt": "2024-01-01T00:00:00Z"
}
```

**Status Codes**:
- 200: Success
- 400: Invalid request body
- 500: Server error

#### POST /api/sessions/complete
**Purpose**: Mark session as complete and record results

**Request Body**:
```json
{
  "sessionId": "uuid-here",
  "timeTaken": 145,
  "isCorrect": true
}
```

**Response**:
```json
{
  "id": "uuid-here",
  "completed": true,
  "timeTaken": 145,
  "isCorrect": true,
  "completedAt": "2024-01-01T00:02:25Z"
}
```

**Status Codes**:
- 200: Success
- 404: Session not found
- 500: Server error

### 4.2 Actions API

#### POST /api/actions
**Purpose**: Record user action

**Request Body**:
```json
{
  "sessionId": "uuid-here",
  "actionType": "place_component",
  "data": {
    "componentType": "led_yellow",
    "componentId": "led_yellow-123456",
    "gridPosition": {"x": 3, "y": 2},
    "orientation": 0
  }
}
```

**Response**:
```json
{
  "success": true
}
```

**Status Codes**:
- 200: Success
- 400: Invalid action data
- 500: Server error

### 4.3 Circuits API

#### GET /api/circuits
**Purpose**: Fetch target circuit configuration

**Query Parameters**:
- circuitNumber: number (1-3)
- difficulty: string ("easy" or "hard")

**Response**:
```json
{
  "id": 1,
  "circuitNumber": 1,
  "difficulty": "easy",
  "description": "Build a circuit that lights up with the switch",
  "targetComponents": [...],
  "targetConnections": [...],
  "timeLimit": 180
}
```

**Status Codes**:
- 200: Success
- 404: Circuit not found
- 500: Server error

### 4.4 Leaderboard API

#### GET /api/leaderboard
**Purpose**: Fetch recent completed game sessions

**Query Parameters** (all optional):
- limit: number (default: 100)
- offset: number (default: 0)
- difficulty: string ("easy" or "hard")
- circuitNumber: number (1-3)

**Response**:
```json
[
  {
    "id": "uuid-here",
    "circuitNumber": 1,
    "difficulty": "easy",
    "timeTaken": 145,
    "isCorrect": true,
    "createdAt": "2024-01-01T00:00:00Z"
  }
]
```

**Status Codes**:
- 200: Success
- 500: Server error

---

## 5. Technical Architecture

### 5.1 Technology Stack

**Frontend**:
- Framework: Next.js 15 (App Router)
- UI Library: React 19
- Language: TypeScript 5.x
- Styling: Tailwind CSS 4.x
- State Management: React useState/useEffect hooks

**Backend**:
- API: Next.js API Routes (serverless functions)
- ORM: Prisma 6.x
- Database: PostgreSQL (Supabase hosted)

**Development Tools**:
- Package Manager: npm
- Linter: ESLint
- Formatter: Prettier (implicit)
- Database GUI: Prisma Studio

### 5.2 Project Structure

```
robotics-game-site/
├── app/                          # Next.js App Router
│   ├── page.tsx                  # Home page
│   ├── layout.tsx                # Root layout
│   ├── globals.css               # Global styles
│   ├── game/
│   │   └── page.tsx              # Game page
│   ├── instructions/
│   │   └── page.tsx              # Instructions page
│   ├── leaderboard/
│   │   └── page.tsx              # Leaderboard page
│   └── api/                      # API routes
│       ├── sessions/
│       │   ├── route.ts          # Create session
│       │   └── complete/
│       │       └── route.ts      # Complete session
│       ├── actions/
│       │   └── route.ts          # Record action
│       ├── circuits/
│       │   └── route.ts          # Get circuit
│       └── leaderboard/
│           └── route.ts          # Get leaderboard
├── components/                   # React components
│   ├── Grid-CircuitBoard.tsx     # Main game board
│   ├── Toolbox.tsx               # Component toolbox
│   ├── GameHeader.tsx            # Timer & controls
│   └── DifficultySelector.tsx    # Difficulty modal
├── lib/
│   └── prisma.ts                 # Prisma client singleton
├── prisma/
│   └── schema.prisma             # Database schema
├── scripts/
│   └── seed-circuits.ts          # Database seeding
├── types/
│   └── index.ts                  # TypeScript types
├── utils/
│   ├── database.ts               # DB operations
│   └── validation.ts             # Validation logic
├── public/
│   └── photos/
│       └── components/           # Component images
├── .env                          # Environment variables (gitignored)
├── .env.example                  # Environment template
├── package.json                  # Dependencies
├── tsconfig.json                 # TypeScript config
├── tailwind.config.ts            # Tailwind config
├── next.config.ts                # Next.js config
└── README.md                     # Documentation
```

### 5.3 Data Flow

**Component Placement Flow**:
1. User drags component from toolbox
2. Mouse position tracked during drag
3. On drop, position converted to grid coordinates
4. Grid position validated (bounds check)
5. Component limit validated (max count check)
6. Component added to local state
7. Action queued for database save
8. UI updates to show placed component

**Wire Creation Flow**:
1. User clicks first connection point
2. Connection point stored in local state
3. UI highlights selected point (yellow)
4. User clicks second connection point
5. Validation: different components, no duplicate
6. Wire created in local state
7. Action queued for database save
8. UI renders wire line between points

**Circuit Validation Flow**:
1. User clicks "Done" or timer expires
2. Fetch target circuit from database via API
3. Extract user's components and wires from state
4. Call validation function with user and target data
5. Validation checks:
   - Component types match
   - Component positions match
   - Wire connections match
6. Return validation result with errors
7. Display result to user (alert or modal)
8. Update session in database with results

**Database Save Flow**:
1. User performs action (place, remove, connect)
2. Action added to in-memory queue
3. Every 1 second, queue processor runs
4. Batch up to 10 queued actions
5. Send batch to API endpoint
6. API inserts actions into database
7. Queue updated to remove saved actions
8. Process repeats until queue empty

### 5.4 State Management

**Game State** (in game/page.tsx):
```typescript
{
  sessionId: string | null
  currentCircuit: number (1-3)
  difficulty: "easy" | "hard"
  components: Component[]
  wires: Wire[]
  timeRemaining: number (seconds)
  isPlaying: boolean
  startTime: number | null
}
```

**Grid Component State**:
```typescript
{
  draggedComponent: Component | null
  selectedConnectionPoint: ConnectionPoint | null
  overlapConnectionPoint1: ConnectionPoint | null
}
```

**Action Queue State**:
```typescript
actionQueue: Array<() => Promise<void>>
processingQueue: boolean (ref)
```

---

## 6. User Workflows

### 6.1 First-Time User Workflow
1. Land on home page
2. Read "How to Play" summary
3. Click "Instructions" to learn details
4. Read through all instructions
5. Click "Start Playing"
6. See difficulty selector for Circuit 1
7. Choose difficulty (Easy or Hard)
8. Board loads with battery pre-placed
9. Timer starts (3:00)
10. Drag components from toolbox
11. Place components on grid
12. Connect components with wires
13. Click "Done" or wait for timer
14. See validation result
15. Proceed to Circuit 2
16. Repeat for Circuits 2 and 3
17. See completion message
18. Check leaderboard
19. Return to home

### 6.2 Returning User Workflow
1. Land on home page
2. Click "Start Game" immediately
3. Choose difficulty for Circuit 1
4. Build circuit quickly
5. Click "Done"
6. Repeat for remaining circuits
7. Check leaderboard ranking
8. Play again to improve time

### 6.3 Component Placement Workflow
1. Identify needed component in toolbox
2. Check current count vs. maximum (e.g., 0/2)
3. Click and hold component card
4. Drag to desired grid position
5. See component preview while dragging
6. Release mouse to drop
7. Component snaps to nearest grid line
8. Component appears on board
9. Count updates in toolbox (e.g., 1/2)

### 6.4 Manual Alignment Workflow
1. Place two components on board
2. Click "🔗 Align Components" button
3. Button turns green: "✅ Overlap Mode ON"
4. Click connection point on first component
5. Point highlights green
6. Click connection point on second component
7. Second component moves to align points
8. Mode deactivates automatically
9. Points are now perfectly aligned

### 6.5 Wire Connection Workflow
1. Ensure components are placed
2. Click connection point on first component
3. Point highlights yellow
4. Click connection point on second component
5. Blue wire line appears connecting points
6. Both connection points return to white

### 6.6 Error Recovery Workflow
1. User places component incorrectly
2. Right-click component
3. Confirm removal
4. Component and wires removed
5. Count decrements in toolbox
6. Drag correct component or placement

---

## 7. Sample Circuit Challenges

### 7.1 Circuit 1 - Easy
**Title**: "Build a circuit that lights up with the switch"

**Required Components**:
- Battery Holder (pre-placed)
- Slide Switch
- LED (Yellow)

**Target Connections**:
1. Battery (top-right) → Switch (left)
2. Switch (right) → LED (left)
3. LED (right) → Battery (bottom-right)

**Learning Objective**: Basic series circuit with switch control

### 7.2 Circuit 1 - Hard
**Title**: "Build a circuit that emits red light with the resistor"

**Required Components**:
- Battery Holder (pre-placed)
- Resistor
- LED (Red)

**Target Connections**:
1. Battery (top-right) → Resistor (left)
2. Resistor (right) → LED (left)
3. LED (right) → Battery (bottom-right)

**Learning Objective**: Current limiting with resistors

### 7.3 Circuit 2 - Hard
**Title**: "Make a circuit that plays music on speaker"

**Required Components**:
- Battery Holder (pre-placed)
- Music IC (U1)
- Speaker

**Target Connections**:
1. Battery (top-right) → Music IC (top-left)
2. Music IC (bottom-right) → Speaker (left)
3. Speaker (right) → Battery (bottom-right)
4. (Additional IC connections as needed)

**Learning Objective**: Integrated circuits and audio output

### 7.4 Extensibility for More Circuits
**Circuit Templates** can be added via:
1. Define JSON objects with targetComponents and targetConnections
2. Add to `scripts/seed-circuits.ts`
3. Run `npm run db:seed`
4. Circuits automatically available in game

**Circuit Parameters**:
- Circuit number (1-3, can extend to more)
- Difficulty (easy/hard, can add medium)
- Description text
- Component list with exact positions
- Wire list with connection point IDs
- Time limit (default 180s, can customize)

---

## 8. Validation Rules

### 8.1 Input Validation

**Component Type Validation**:
- Must be one of 14 defined types
- Case-sensitive string matching
- Type determines size, connection points, limits

**Grid Position Validation**:
- X coordinate: 0 ≤ x ≤ 10
- Y coordinate: 0 ≤ y ≤ 7
- Position + component size ≤ grid bounds

**Orientation Validation**:
- Must be one of: 0, 90, 180, 270
- Numeric value (degrees)

**Connection Point Validation**:
- Must reference valid component ID
- Component must exist on board
- Connection point must exist for that component type

### 8.2 Business Logic Validation

**Component Count Validation**:
- Battery: maximum 1, pre-placed
- Wire: maximum 20
- All others: maximum 2 each
- Prevent placement if max exceeded

**Wire Validation**:
- From and to connection points must be different
- From and to components must be different
- No duplicate wires between same endpoints
- Both connection points must exist

**Circuit Completion Validation**:
- All required components present
- All components in correct positions
- All required wires present
- No extra components
- No extra wires

---

## 9. Error Handling

### 9.1 User-Facing Errors

**Error Messages**:
- "Component doesn't fit within the board!"
- "Maximum [count] [component name] allowed per circuit"
- "Cannot connect a component to itself"
- "Wire connection already exists"
- "Cannot align a component to itself. Please select connection points from different components."
- "Cannot align: Component would be outside the board boundaries."
- "Circuit incorrect!\n\nErrors:\n[error list]"

**Error Display Methods**:
- Alert dialogs for immediate feedback
- Inline validation messages
- Color-coded status indicators
- Error details in leaderboard page

### 9.2 System Errors

**Database Connection Failures**:
- Display: "Failed to load leaderboard. Make sure your Supabase connection is configured correctly."
- Graceful degradation: show empty state
- Log error to console

**API Failures**:
- Display: "Failed to [action]. Please try again."
- Retry logic for critical operations
- Log error details

**Image Loading Failures**:
- Fallback to colored rectangle
- Display component name text
- No error message to user (seamless fallback)

---

## 10. Future Enhancements (Out of Scope)

### 10.1 Authentication & User Accounts
- User registration and login
- Profile pages with stats
- Personal game history
- Username displayed on leaderboard
- Password reset functionality

### 10.2 Advanced Features
- Circuit builder/editor for creating custom challenges
- Hint system with progressive disclosure
- Tutorial mode with step-by-step guidance
- Achievement system with badges
- Difficulty level: Medium
- More than 3 circuits per game
- Custom time limits per circuit
- Save/resume game sessions

### 10.3 Social Features
- Multi-player competitive mode
- Team challenges
- Share circuits with friends
- Social media integration
- Comments on leaderboard entries

### 10.4 Gamification
- Points and scoring system
- Levels and progression
- Daily challenges
- Streaks and consistency rewards
- Power-ups or special abilities

### 10.5 Accessibility
- Keyboard-only navigation
- Screen reader support
- High contrast mode
- Adjustable text size
- Color-blind friendly palette

### 10.6 Mobile Optimization
- Touch gesture support
- Mobile-responsive layouts
- Native mobile app (React Native)
- Offline mode
- Progressive Web App (PWA)

### 10.7 Analytics
- Player behavior tracking
- Heatmaps of component placements
- Time-to-complete analytics
- Error pattern analysis
- A/B testing framework

### 10.8 Content
- Sound effects for actions
- Background music
- Animation effects (confetti on completion)
- Component hover previews
- Realistic component visuals (shadows, 3D)
- Video tutorials

---

## 11. Testing Requirements

### 11.1 Unit Testing
- Test component placement validation
- Test wire connection validation
- Test circuit validation logic
- Test grid snapping algorithms
- Test batched action saving

### 11.2 Integration Testing
- Test API endpoints with Prisma
- Test database operations
- Test session lifecycle (create → actions → complete)
- Test leaderboard queries

### 11.3 End-to-End Testing
- Test complete game flow (3 circuits)
- Test difficulty selection
- Test component dragging and dropping
- Test wire creation and removal
- Test timer countdown and auto-complete
- Test leaderboard display

### 11.4 Performance Testing
- Load test with 100 concurrent users
- Stress test action tracking (1000+ actions)
- Database query performance
- Frontend rendering performance

### 11.5 Browser Testing
- Test on Chrome, Firefox, Safari, Edge
- Test on different screen sizes
- Test on different network speeds

---

## 12. Deployment Requirements

### 12.1 Environment Configuration
**Required Environment Variables**:
```env
DATABASE_URL="postgresql://user:password@host:5432/database"
DIRECT_URL="postgresql://user:password@host:5432/database"
```

### 12.2 Deployment Steps
1. Push code to GitHub repository
2. Connect repository to Vercel
3. Configure environment variables in Vercel dashboard
4. Trigger deployment
5. Run database migrations (automatic with Prisma)
6. Run seed script (manual, one-time)
7. Verify deployment at production URL

### 12.3 Production Requirements
- HTTPS enforced
- Supabase PostgreSQL in production mode
- CDN for static assets
- Error monitoring (optional: Sentry)
- Uptime monitoring (optional: UptimeRobot)

---

## 13. Success Metrics

### 13.1 User Engagement
- Games started per day
- Games completed per day
- Average completion rate (% finishing all 3 circuits)
- Average time per circuit
- Return user rate

### 13.2 Performance Metrics
- Page load time
- API response times
- Database query times
- Error rate (% of failed operations)

### 13.3 Educational Metrics
- Circuit accuracy rate (% correct submissions)
- Most common errors
- Average attempts per circuit
- Improvement over time (per user)

---

## 14. Maintenance & Support

### 14.1 Regular Maintenance
- Database backups (daily automated via Supabase)
- Performance monitoring
- Security updates for dependencies
- Database optimization (indexes, queries)

### 14.2 Content Updates
- Add new circuit challenges
- Update component images
- Refresh instructional content
- Update leaderboard displays

### 14.3 Bug Fixes
- Monitor error logs
- Triage and prioritize issues
- Test fixes in development
- Deploy fixes to production

---

## 15. Documentation Requirements

### 15.1 User Documentation
- ✅ Home page instructions
- ✅ Detailed instructions page
- ✅ Component descriptions
- ✅ Tips and tricks
- README.md with setup guide
- QUICKSTART.md for rapid setup

### 15.2 Developer Documentation
- ✅ PROJECT_SUMMARY.md (architecture overview)
- ✅ SETUP.md (detailed setup instructions)
- ✅ GRID_LINE_SYSTEM_UPDATE.md (recent changes)
- ✅ Code comments in complex functions
- ✅ TypeScript types documentation
- API endpoint documentation (inline)
- Database schema documentation (Prisma comments)

### 15.3 Operational Documentation
- Deployment guide
- Environment variable reference
- Troubleshooting guide
- Database seeding instructions

---

## Appendix A: TypeScript Type Definitions

### Core Types
```typescript
type ComponentType = 
  | 'battery_holder'
  | 'wire'
  | 'led_yellow'
  | 'led_red'
  | 'resistor'
  | 'lamp'
  | 'photoresistor'
  | 'music_ic'
  | 'alarm_ic'
  | 'space_war_ic'
  | 'speaker'
  | 'slide_switch'
  | 'press_switch'
  | 'whistle_chip';

type Orientation = 0 | 90 | 180 | 270;

type Difficulty = 'easy' | 'hard';

type ActionType = 
  | 'place_component'
  | 'remove_component'
  | 'add_wire'
  | 'remove_wire';

interface GridPosition {
  x: number; // 0-10
  y: number; // 0-7
}

interface ConnectionPoint {
  id: string;
  componentId: string;
  position: 'top' | 'bottom' | 'left' | 'right' | 
           'top-left' | 'top-right' | 'bottom-left' | 
           'bottom-right' | 'middle-right';
  gridOffset?: { x: number; y: number };
}

interface Component {
  id: string;
  type: ComponentType;
  gridPosition: GridPosition;
  orientation: Orientation;
  connectionPoints: ConnectionPoint[];
}

interface Wire {
  id: string;
  fromConnectionPointId: string;
  toConnectionPointId: string;
}

interface Circuit {
  id: number;
  circuitNumber: number;
  difficulty: Difficulty;
  description?: string;
  targetComponents: Component[];
  targetWires: Wire[];
  timeLimit: number;
}

interface GameState {
  sessionId: string | null;
  currentCircuit: number;
  difficulty: Difficulty;
  components: Component[];
  wires: Wire[];
  timeRemaining: number;
  isPlaying: boolean;
  startTime: number | null;
}

interface ComponentSize {
  width: number;  // grid spaces
  height: number; // grid spaces
}

interface ComponentMetadata {
  type: ComponentType;
  displayName: string;
  maxCount: number;
  connectionPoints: Array<{
    position: ConnectionPoint['position'];
    gridOffset?: { x: number; y: number };
  }>;
  imagePath?: string;
  color: string;
}
```

---

## Appendix B: Database Queries

### Common Queries

**Get Target Circuit**:
```typescript
const circuit = await prisma.circuit.findUnique({
  where: {
    circuitNumber_difficulty: {
      circuitNumber: 1,
      difficulty: 'easy'
    }
  }
});
```

**Create Session**:
```typescript
const session = await prisma.gameSession.create({
  data: {
    circuitNumber: 1,
    difficulty: 'easy'
  }
});
```

**Record Action**:
```typescript
await prisma.gameAction.create({
  data: {
    sessionId: 'uuid',
    actionType: 'place_component',
    componentType: 'led_yellow',
    componentId: 'led_yellow-123',
    gridPosition: { x: 3, y: 2 },
    orientation: 0
  }
});
```

**Complete Session**:
```typescript
await prisma.gameSession.update({
  where: { id: 'uuid' },
  data: {
    completed: true,
    timeTaken: 145,
    isCorrect: true,
    completedAt: new Date()
  }
});
```

**Get Leaderboard**:
```typescript
const sessions = await prisma.gameSession.findMany({
  where: {
    completed: true,
    isCorrect: true
  },
  orderBy: {
    timeTaken: 'asc'
  },
  take: 100
});
```

---

## Document Version
- **Version**: 1.0
- **Last Updated**: Based on current codebase state
- **Status**: Complete and current
- **Maintained By**: Development team

---

**END OF REQUIREMENTS DOCUMENT**

