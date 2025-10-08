// Battery Position Configuration
// Edit the values below to set where you want the battery holder

export interface BatteryPosition {
  anchorRow: number;
  anchorCol: number;
  terminal1Row: number;
  terminal1Col: number;
  terminal2Row: number;
  terminal2Col: number;
}

// 🔧 EDIT THESE VALUES TO POSITION YOUR BATTERY HOLDER
// Grid is 5 rows (A-E) × 7 columns (1-7)
export const BATTERY_POSITION: BatteryPosition = {
  // Where the battery holder starts (top-left corner) - B1
  anchorRow: 1,    // Row B (1)
  anchorCol: 0,    // Column 1 (0) - left edge of board
  
  // First connection point - B2 (right side of battery)
  terminal1Row: 1, // Row B (1)
  terminal1Col: 1, // Column 2 (1)
  
  // Second connection point - D2 (bottom-right of battery)
  terminal2Row: 3, // Row D (3)
  terminal2Col: 1, // Column 2 (1)
};

// 📋 GRID REFERENCE:
// Rows: A=0, B=1, C=2, D=3, E=4
// Columns: 1=0, 2=1, 3=2, 4=3, 5=4, 6=5, 7=6
//
// Example positions:
// A-1 = anchorRow: 0, anchorCol: 0
// A-3 = terminal1Row: 0, terminal1Col: 2  
// B-3 = terminal2Row: 1, terminal2Col: 2
//
// The battery will span 3 columns wide and 2 rows high from the anchor point
