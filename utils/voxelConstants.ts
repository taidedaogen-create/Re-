/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

export const COLORS = {
  // Monochromes
  WHITE: 0xFFFFFF,
  LIGHT_GREY: 0xE0E0E0,
  GREY: 0x9E9E9E,
  DARK_GREY: 0x616161,
  BLACK: 0x111111, // Deep Black for eyes, tires, details

  // Vivid Colors
  RED: 0xF44336,
  PINK: 0xE91E63,
  PURPLE: 0x9C27B0,
  DEEP_BLUE: 0x3F51B5,
  BLUE: 0x2196F3,
  CYAN: 0x00BCD4,
  TEAL: 0x009688,
  GREEN: 0x4CAF50,
  LIGHT_GREEN: 0x8BC34A,
  LIME: 0xCDDC39,
  YELLOW: 0xFFEB3B,
  AMBER: 0xFFC107,
  ORANGE: 0xFF9800,
  BROWN: 0x795548,

  // Specific Model Mappings
  
  // Apple
  APPLE_RED: 0xF44336,
  APPLE_STEM: 0x5D4037,
  APPLE_LEAF: 0x4CAF50,
  
  // Heart
  HEART_RED: 0xE91E63,
  HEART_HIGHLIGHT: 0xF8BBD0, 
  
  // Tree
  TRUNK: 0x5D4037,
  LEAF_DARK: 0x2E7D32,
  LEAF_LIGHT: 0x66BB6A,
  
  // House
  WALL: 0xF5F5F5,
  ROOF_RED: 0xD32F2F,
  WOOD: 0x8D6E63,
  
  // Car
  BODY_BLUE: 0x1976D2,
  GLASS: 0xB3E5FC,
  TIRE: 0x111111, // Using BLACK
  RIM: 0xBDBDBD,
  
  // Duck
  DUCK_BODY: 0xFFEB3B,
  DUCK_BEAK: 0xFF9800,
  
  // Robot
  ROBOT_METAL: 0xB0BEC5,
  ROBOT_DARK: 0x546E7A,
  ROBOT_EYE: 0x00E676,
  
  // Rocket
  ROCKET_BODY: 0xFFFFFF,
  ROCKET_FIN: 0xF44336,
  FLAME_CORE: 0xFFEB3B,
  FLAME_OUTER: 0xFF9800,

  // Legacy/Compatibility keys
  LAND: 0x66BB6A, 
  CASTLE_WOOD: 0x795548, 
  DINO_SKIN: 0x4CAF50, 
  DINO_BELLY: 0x8BC34A, 
  CASTLE_WALL: 0x9E9E9E,

  // Helper
  getRainbow: (t: number) => `hsl(${t * 360}, 90%, 60%)`
};

export const CONFIG = {
  VOXEL_SIZE: 1,
  FLOOR_Y: -15,
  BG_COLOR: 0xfdfbf7,
};