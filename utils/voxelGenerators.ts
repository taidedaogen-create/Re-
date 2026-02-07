/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import { VoxelData } from '../types';
import { COLORS, CONFIG } from './voxelConstants';

const TARGET_COUNT = 15000;

function addVoxel(list: VoxelData[], x: number, y: number, z: number, color: number) {
    if (list.length < TARGET_COUNT) {
        list.push({ x: Math.round(x), y: Math.round(y), z: Math.round(z), color });
    }
}

export const Generators = {
    Apple: (): VoxelData[] => {
        const voxels: VoxelData[] = [];
        const floorY = CONFIG.FLOOR_Y;
        const r = 10;
        const cy = floorY + r + 2;

        // Better Apple Shape (Cardioid-ish rotation)
        for(let x=-r; x<=r; x++) {
            for(let y=-r; y<=r+2; y++) {
                for(let z=-r; z<=r; z++) {
                    const xx = x;
                    const zz = z;
                    // Deform Y to get the apple dip at top and bottom
                    const len = Math.sqrt(xx*xx + zz*zz);
                    const yy = y - 0.5 * Math.cos((len/r) * Math.PI * 0.8);

                    if (Math.sqrt(xx*xx + yy*yy + zz*zz) <= r) {
                         // Cut out stem dimple
                         if (y > r * 0.7 && len < 1.5) continue;
                         addVoxel(voxels, x, cy+y, z, COLORS.APPLE_RED);
                    }
                }
            }
        }
        
        // Stem
        for(let i=0; i<5; i++) {
            addVoxel(voxels, 0, cy + r - 1 + i, 0, COLORS.APPLE_STEM);
        }
        
        // Leaf
        const ly = cy + r + 1;
        addVoxel(voxels, 1, ly+1, 0, COLORS.APPLE_LEAF);
        addVoxel(voxels, 2, ly+2, 0, COLORS.APPLE_LEAF);
        addVoxel(voxels, 3, ly+2, 1, COLORS.APPLE_LEAF);
        addVoxel(voxels, 2, ly+1, 0, COLORS.APPLE_LEAF);

        return voxels;
    },

    Duck: (): VoxelData[] => {
        const voxels: VoxelData[] = [];
        const floorY = CONFIG.FLOOR_Y;
        
        // Body
        for(let x=-6; x<=6; x++)
            for(let y=0; y<=8; y++)
                for(let z=-9; z<=7; z++)
                    if ((x*x)/36 + (y*y)/64 + (z*z)/81 <= 1)
                        addVoxel(voxels, x, floorY+y+2, z, COLORS.DUCK_BODY);

        // Wings
        for(let z=-4; z<=2; z++) {
            for(let y=5; y<=7; y++) {
                addVoxel(voxels, 7, floorY+y, z, COLORS.DUCK_BODY);
                addVoxel(voxels, -7, floorY+y, z, COLORS.DUCK_BODY);
            }
        }

        // Tail
        for(let x=-3; x<=3; x++)
             for(let y=5; y<=9; y++)
                 for(let z=-11; z<=-8; z++)
                     if (x*x + (z+8)*(z+8) + (y-5)*(y-5) <= 9)
                         addVoxel(voxels, x, floorY+y, z, COLORS.DUCK_BODY);

        // Neck & Head
        const hy = floorY + 14;
        const hz = 6;
        
        // Neck
        for(let y=6; y<=13; y++)
             for(let x=-4; x<=4; x++)
                 for(let z=3; z<=8; z++)
                     if (x*x + (z-5)*(z-5) <= 12)
                         addVoxel(voxels, x, floorY+y, z, COLORS.DUCK_BODY);

        // Head Sphere
        for(let x=-5; x<=5; x++)
             for(let y=-5; y<=5; y++)
                 for(let z=-5; z<=5; z++)
                     if(x*x+y*y+z*z <= 18) addVoxel(voxels, x, hy+y, hz+z, COLORS.DUCK_BODY);
                     
        // Beak
        for(let z=1; z<=4; z++)
             for(let x=-3; x<=3; x++)
                 addVoxel(voxels, x, hy-2, hz+4+z, COLORS.DUCK_BEAK);
                 
        // Eyes
        addVoxel(voxels, 3, hy+1, hz+3, COLORS.BLACK);
        addVoxel(voxels, -3, hy+1, hz+3, COLORS.BLACK);
        
        return voxels;
    },

    Heart: (): VoxelData[] => {
        const voxels: VoxelData[] = [];
        const floorY = CONFIG.FLOOR_Y + 12;
        
        for (let x = -16; x <= 16; x++) {
            for (let y = -16; y <= 14; y++) {
                for (let z = -8; z <= 8; z++) {
                    const xx = x * 0.09;
                    const yy = y * 0.09; 
                    const zz = z * 0.16;
                    
                    const v = xx*xx + 2.25*zz*zz + yy*yy - 1;
                    const res = v*v*v - xx*xx*yy*yy*yy - 0.1125*zz*zz*yy*yy*yy;
                    
                    if (res <= 0) {
                        let c = COLORS.HEART_RED;
                        if (x < -4 && y > 4 && z > 3) c = COLORS.HEART_HIGHLIGHT;
                        addVoxel(voxels, x, floorY + y, z, c);
                    }
                }
            }
        }
        return voxels;
    },

    Tree: (): VoxelData[] => {
        const voxels: VoxelData[] = [];
        const floorY = CONFIG.FLOOR_Y;
        
        // Trunk
        for(let y=0; y<12; y++) {
            for(let x=-3; x<=3; x++) for(let z=-3; z<=3; z++) {
                if (x*x + z*z <= 6)
                    addVoxel(voxels, x, floorY+y, z, COLORS.TRUNK);
            }
        }
        
        // Conical Layers (Pine-like)
        const layers = [
            { y: 8,  r: 12, h: 5, c: COLORS.LEAF_DARK },
            { y: 11, r: 10, h: 5, c: COLORS.LEAF_LIGHT },
            { y: 14, r: 8,  h: 5, c: COLORS.LEAF_DARK },
            { y: 17, r: 6,  h: 5, c: COLORS.LEAF_LIGHT },
            { y: 20, r: 4,  h: 4, c: COLORS.LEAF_LIGHT }
        ];
        
        layers.forEach(l => {
             for(let y=0; y<l.h; y++) {
                 const r = l.r * (1 - y/(l.h+1));
                 for(let x=-Math.ceil(r); x<=Math.ceil(r); x++) {
                     for(let z=-Math.ceil(r); z<=Math.ceil(r); z++) {
                         if(x*x + z*z <= r*r) {
                             addVoxel(voxels, x, floorY+l.y+y, z, l.c);
                         }
                     }
                 }
             }
        });
        
        return voxels;
    },

    House: (): VoxelData[] => {
        const voxels: VoxelData[] = [];
        const floorY = CONFIG.FLOOR_Y;
        const w = 10;
        const d = 9;
        const h = 10;
        
        // Base Foundation
        for(let x=-w-1; x<=w+1; x++)
            for(let z=-d-1; z<=d+1; z++)
                addVoxel(voxels, x, floorY, z, COLORS.GREY);

        // Walls
        for(let x=-w; x<=w; x++)
            for(let z=-d; z<=d; z++)
                for(let y=1; y<h; y++) {
                    let c = COLORS.WALL;
                    
                    // Windows
                    if (Math.abs(x)===w && y>4 && y<8 && Math.abs(z)<3) {
                         if (Math.abs(z)===0 || y===6) c = COLORS.BLACK;
                         else c = COLORS.GLASS;
                    }
                    // Door
                    if (z===d && Math.abs(x)<=2 && y<7) {
                        c = COLORS.WOOD;
                        if (x===2 || x===-2 || y===6) c = COLORS.BLACK;
                        if (x===1 && y===3) c = COLORS.BLACK;
                    }
                    
                    addVoxel(voxels, x, floorY+y, z, c);
                }
                
        // Roof
        for(let y=0; y<=8; y++) {
             const rw = w + 1 - (y * (w+1)/8);
             const rd = d + 1;
             for(let x=-Math.ceil(rw); x<=Math.ceil(rw); x++)
                 for(let z=-rd; z<=rd; z++)
                     addVoxel(voxels, x, floorY+h+y, z, COLORS.ROOF_RED);
        }
        
        // Chimney
        for(let y=6; y<12; y++)
            for(let x=5; x<=7; x++)
                for(let z=1; z<=4; z++) {
                    addVoxel(voxels, x, floorY+y, z, COLORS.WOOD);
                    if (y===11) addVoxel(voxels, x, floorY+y+1, z, COLORS.WHITE); // Smoke puff
                }

        return voxels;
    },

    Car: (): VoxelData[] => {
        const voxels: VoxelData[] = [];
        const floorY = CONFIG.FLOOR_Y;
        const len = 12;
        const wid = 6;
        
        // Lower Chassis
        for(let x=-wid; x<=wid; x++)
            for(let y=2; y<6; y++)
                for(let z=-len; z<=len; z++)
                    addVoxel(voxels, x, floorY+y, z, COLORS.BODY_BLUE);

        // Wheel Arches (cut out)
        // ... (Simplified: assume wheels stick out or are just attached)

        // Upper Cabin (Rounded)
        for(let x=-wid+1; x<=wid-1; x++)
            for(let y=6; y<10; y++)
                for(let z=-7; z<=6; z++) {
                    let c = COLORS.GLASS;
                    if (x===-wid+1 || x===wid-1 || z===-7 || z===6) {
                        // Pillars
                        if (Math.abs(z) > 4 || Math.abs(x)===wid-1) c = COLORS.BODY_BLUE;
                        if (Math.abs(z) < 5 && Math.abs(x) < wid-1) c = COLORS.GLASS;
                    }
                    if (y===9) c = COLORS.BODY_BLUE; // Roof
                    addVoxel(voxels, x, floorY+y, z, c);
                }

        // Details
        for(let x=-wid; x<=wid; x++) {
             addVoxel(voxels, x, floorY+3, -len-1, COLORS.BLACK); // Bumpers
             addVoxel(voxels, x, floorY+3, len+1, COLORS.BLACK);
        }
        
        // Wheels
        [[-wid, -7], [wid, -7], [-wid, 7], [wid, 7]].forEach(([wx, wz]) => {
            const isRight = wx > 0;
            const tireX = isRight ? wx + 1 : wx - 1;
            for(let dy=-2; dy<=2; dy++)
                for(let dz=-2; dz<=2; dz++) {
                    if (dy*dy + dz*dz <= 6) {
                        addVoxel(voxels, tireX, floorY+2+dy, wz+dz, COLORS.TIRE);
                        addVoxel(voxels, isRight? tireX-1: tireX+1, floorY+2+dy, wz+dz, COLORS.TIRE);
                        if (dy*dy+dz*dz <= 2) addVoxel(voxels, isRight? tireX+1: tireX-1, floorY+2+dy, wz+dz, COLORS.RIM);
                    }
                }
        });
        
        return voxels;
    },

    Rocket: (): VoxelData[] => {
        const voxels: VoxelData[] = [];
        const floorY = CONFIG.FLOOR_Y + 4;
        
        // Fuselage
        for(let y=0; y<20; y++) {
            for(let x=-5; x<=5; x++) for(let z=-5; z<=5; z++) {
                if (x*x + z*z <= 20) {
                     let c = COLORS.ROCKET_BODY;
                     if (y > 10 && y < 15 && z > 2) c = COLORS.GLASS; // Porthole
                     if (y < 4 && (x+z)%2===0) c = COLORS.RED; // Pattern
                     addVoxel(voxels, x, floorY+6+y, z, c);
                }
            }
        }
        
        // Nose Cone
        for(let y=0; y<12; y++) {
            const r = 4.5 * (1 - y/12);
            for(let x=-Math.ceil(r); x<=Math.ceil(r); x++)
                for(let z=-Math.ceil(r); z<=Math.ceil(r); z++)
                    if (x*x + z*z <= r*r) addVoxel(voxels, x, floorY+26+y, z, COLORS.ROCKET_FIN);
        }

        // Fins (Curved)
        [[0,1], [0,-1], [1,0], [-1,0]].forEach(([dx, dz]) => {
             for(let r=5; r<12; r++) {
                 for(let y=0; y<15; y++) {
                     // Bezier-ish curve shape for fins
                     if (y < (12-r)*2) {
                         const px = dx * r;
                         const pz = dz * r;
                         addVoxel(voxels, px, floorY+6+y, pz, COLORS.ROCKET_FIN);
                         // Add thickness
                         if(dx===0) {
                             addVoxel(voxels, px+1, floorY+6+y, pz, COLORS.ROCKET_FIN);
                             addVoxel(voxels, px-1, floorY+6+y, pz, COLORS.ROCKET_FIN);
                         } else {
                             addVoxel(voxels, px, floorY+6+y, pz+1, COLORS.ROCKET_FIN);
                             addVoxel(voxels, px, floorY+6+y, pz-1, COLORS.ROCKET_FIN);
                         }
                     }
                 }
             }
        });
        
        // Flame
        for(let y=0; y<10; y++) {
             const r = 4 - y*0.4;
             for(let x=-r; x<=r; x++) for(let z=-r; z<=r; z++)
                 if(x*x+z*z<=r*r) addVoxel(voxels, x, floorY+5-y, z, y<4?COLORS.FLAME_CORE:COLORS.FLAME_OUTER);
        }

        return voxels;
    },

    Robot: (): VoxelData[] => {
        const voxels: VoxelData[] = [];
        const floorY = CONFIG.FLOOR_Y;
        
        // Legs
        for(let x of [-5, 5]) {
            // Feet
            for(let dx=-3; dx<=3; dx++) for(let dz=-4; dz<=4; dz++)
                addVoxel(voxels, x+dx, floorY, dz, COLORS.ROBOT_DARK);
            // Leg columns
            for(let y=1; y<12; y++)
                for(let dx=-2; dx<=2; dx++) for(let dz=-2; dz<=2; dz++)
                    addVoxel(voxels, x+dx, floorY+y, dz, COLORS.ROBOT_METAL);
        }
        
        // Torso
        for(let x=-9; x<=9; x++)
            for(let y=12; y<24; y++)
                for(let z=-5; z<=5; z++) {
                    let c = COLORS.ROBOT_METAL;
                    if (z===5) {
                        // Screen area
                        if (y>15 && y<21 && Math.abs(x)<6) c = COLORS.BLACK;
                        // Chest lights
                        if (y===14) {
                            if (x===-3) c = COLORS.RED;
                            if (x===0) c = COLORS.YELLOW;
                            if (x===3) c = COLORS.GREEN;
                        }
                    }
                    addVoxel(voxels, x, floorY+y, z, c);
                }
        
        // Head
        for(let x=-6; x<=6; x++)
            for(let y=24; y<32; y++)
                for(let z=-5; z<=5; z++) {
                    let c = COLORS.ROBOT_METAL;
                    if (z===5 && y===27 && Math.abs(x)===3) {
                         c = COLORS.BLACK;
                         addVoxel(voxels, x, floorY+y, z+1, COLORS.ROBOT_EYE);
                    }
                    addVoxel(voxels, x, floorY+y, z, c);
                }
        
        // Arms
        for(let y=18; y<22; y++) {
             addVoxel(voxels, 10, floorY+y, 0, COLORS.ROBOT_DARK); // Shoulder
             addVoxel(voxels, -10, floorY+y, 0, COLORS.ROBOT_DARK);
        }
        // Arm drop
        for(let y=13; y<18; y++) {
             addVoxel(voxels, 11, floorY+y, 0, COLORS.ROBOT_METAL);
             addVoxel(voxels, -11, floorY+y, 0, COLORS.ROBOT_METAL);
        }
        // Claws
        for(let i of [-1, 1]) {
            addVoxel(voxels, 11, floorY+12, i, COLORS.BLACK);
            addVoxel(voxels, -11, floorY+12, i, COLORS.BLACK);
        }
        
        // Antenna
        addVoxel(voxels, 0, floorY+32, 0, COLORS.BLACK);
        addVoxel(voxels, 0, floorY+33, 0, COLORS.BLACK);
        addVoxel(voxels, 0, floorY+34, 0, COLORS.RED);

        return voxels;
    }
};