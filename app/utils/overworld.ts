import { CELL_SIZE } from 'app/constants';
import { bat } from 'app/enemies/bat';
import { chaser } from 'app/enemies/chaser';
import { chest } from 'app/enemies/chest';
import { clam } from 'app/enemies/clam';
import { crab } from 'app/enemies/crab';
import { lord } from 'app/enemies/lord';
import { slime } from 'app/enemies/slime';
import { squid} from 'app/enemies/squid';
import { turret } from 'app/enemies/turret';
import { urchin } from 'app/enemies/urchin';
import { createDisc, linkDiscs, projectDiscToClosestDisc } from 'app/utils/disc';
import { createEnemy } from 'app/utils/enemy';
import { getTargetVector } from 'app/utils/geometry';
import { refillAllPotions } from 'app/utils/hero';
import { saveGame } from 'app/saveGame'

import SRandom from 'app/utils/SRandom';

export function returnToOverworld(state: GameState): void {
    delete state.dungeon;
    // If the player happens to leave during a boss fight, we have to clear the
    // boss in order to automatically assign them to a different disc.
    if (state.hero.disc?.boss) {
        delete state.hero.disc.boss;
    }
    state.hero.x = state.hero.overworldX;
    state.hero.y = state.hero.overworldY;
    clearNearbyEnemies(state);
    refillAllPotions(state);
    saveGame(state);
}

export function addOverworldPortalToDisc({x, y}: Point, disc: Disc): Portal {
    const portal = {
        x, y, radius: 40,
        disc,
        name: 'Overworld',
        activate(state: GameState) {
            returnToOverworld(state);
        },
    };
    disc.portals.push(portal);
    return portal;
}


export function getCellCoordinates(state: GameState, x = state.hero.x, y = state.hero.y): Point {
    return {
        x: Math.floor(x / CELL_SIZE),
        y: Math.floor(-y / CELL_SIZE),
    }
}

export function clearNearbyEnemies(state: GameState): void {
    updateActiveCells(state);
    for (const enemy of state.enemies) {
        if (getTargetVector(state.hero, enemy).distance2 <= 1000 ** 2) {
            // This will cause the enemy to be cleaned up when `updateActiveCells` is called again.
            enemy.life = 0;
        }
    }
    updateActiveCells(state);
}


export function updateActiveCells(state: GameState) {
    // Cells only apply when on the overworld.
    if (!state.dungeon) {
        state.activeDiscs = [];
        state.activeCells = [];
        const {x: minX, y: minY} = getCellCoordinates(state, state.hero.x - 3750, state.hero.y + 3750);
        const {x: maxX, y: maxY} = getCellCoordinates(state, state.hero.x + 3750, state.hero.y - 3750);
        for (let cellY = Math.max(0, minY); cellY <= maxY; cellY++) {
            for (let cellX = minX; cellX <= maxX; cellX++) {
                const cellKey = `${cellX}x${cellY}`;
                const cell = state.cellMap.get(cellKey) || createWorldCell(state.worldSeed, {x: cellX, y: cellY});
                addCellTohistory(state, cell);
                state.cellMap.set(cellKey, cell);
                state.activeCells.push(cell);
                state.activeDiscs = [...state.activeDiscs, ...cell.discs];
            }
        }
        state.visibleDiscs = state.activeDiscs;
    }
    state.enemies = [];
    state.loot = [];
    state.portals = [];
    for (const disc of state.activeDiscs) {
        disc.enemies = disc.enemies.filter(e => e.life > 0);
        state.enemies = [
            ...state.enemies,
            ...disc.enemies,
        ];
        state.loot = [
            ...state.loot,
            ...disc.loot,
        ];
        state.portals = [
            ...state.portals,
            ...disc.portals,
        ];
    }
}

function addCellTohistory(state: GameState, cell: WorldCell): void {
    const index = state.recentCells.indexOf(cell);
    if (index) {
        state.recentCells.splice(index, 1);
    }
    state.recentCells.unshift(cell);

    // Forget about cells that have not been active recently.
    if (state.recentCells.length > 100) {
        const ancientCell = state.recentCells.pop()!;
        state.cellMap.delete(`${ancientCell.x}x${ancientCell.y}`);
    }
}


function getCellLevel(randomizer: typeof SRandom, cellY: number): number {
    if (cellY === 0) {
        return 1;
    }
    if (cellY === 1) {
        return randomizer.range(2, 3);
    }
    if (cellY <= 3) {
        return randomizer.range(5, 8);
    }
    const baseLevel = Math.min(90, 10 * (Math.floor(cellY / 2) - 1));
    if (cellY % 2 === 0) {
        // 10/11/12
        return randomizer.range(baseLevel, baseLevel + 2);
    }
    // 13/14/15
    return randomizer.range(baseLevel + 3, baseLevel + 5);
}

function getBiome(cellY: number) {
    if (cellY === 0) return 'Beach';
    if (cellY === 1) return 'Desert';
    if (cellY <= 3) {
        return 'Field';
    }
    if (cellY <= 5) { // Level 10
        return 'Forest';
    }
    if (cellY <= 7) {
        return 'Swamp';
    }
    if (cellY <= 9) { // Level 30
        return 'Foothills';
    }
    if (cellY <= 11) {
        return 'Mountains';
    }
    if (cellY <= 13) { // Level 50
        return 'Frozen Peaks';
    }
    if (cellY <= 15) { // Level 60
        return 'Descent';
    }
    if (cellY <= 17) { // Level 70
        return 'Badlands';
    }
    if (cellY <= 19) { // Level 80
        return 'Inferno';
    }
    // Level 90
    return 'Abyss'
}


function addOverworldEnemiesToDisc(randomizer: typeof SRandom, disc: Disc): void {
    if (disc.level === 1) {
        if (randomizer.generateAndMutate() < 0.3) {
            createEnemy(disc.x, disc.y, clam, disc.level, disc);
        } else if (randomizer.generateAndMutate() < 0.3) {
            createEnemy(disc.x, disc.y, urchin, disc.level, disc);
        }
        if (randomizer.generateAndMutate() < 0.4) {
            createEnemy(disc.x, disc.y - 100, crab, disc.level, disc);
            if (randomizer.generateAndMutate() < 0.2) {
                createEnemy(disc.x, disc.y + 100, crab, disc.level, disc);
            }
        }
        if (randomizer.generateAndMutate() < 0.4) {
            createEnemy(disc.x + 100, disc.y, squid, disc.level, disc);
            if (randomizer.generateAndMutate() < 0.2) {
                createEnemy(disc.x, disc.y - 100, squid, disc.level, disc);
            }
        }
    } else if (disc.level === 2) {
        if (randomizer.generateAndMutate() < 0.3) {
            createEnemy(disc.x, disc.y, turret, disc.level, disc);
        } else if (randomizer.generateAndMutate() < 0.1) {
            createEnemy(disc.x, disc.y, chest, disc.level + 1, disc);
        }
        if (randomizer.generateAndMutate() < 0.3) {
            createEnemy(disc.x, disc.y - 100, slime, disc.level, disc);
        }
        if (randomizer.generateAndMutate() < 0.3) {
            createEnemy(disc.x, disc.y + 100, slime, disc.level, disc);
        }
        if (randomizer.generateAndMutate() < 0.3) {
            createEnemy(disc.x + 100, disc.y, chaser, disc.level, disc);
        }
        if (randomizer.generateAndMutate() < 0.3) {
            createEnemy(disc.x - 100, disc.y, chaser, disc.level, disc);
        }
    } else if (disc.level === 3) {
        if (randomizer.generateAndMutate() < 0.3) {
            createEnemy(disc.x, disc.y, urchin, disc.level, disc);
        } else if (randomizer.generateAndMutate() < 0.1) {
            createEnemy(disc.x, disc.y, chest, disc.level + 1, disc);
        }
        if (randomizer.generateAndMutate() < 0.3) {
            createEnemy(disc.x, disc.y - 100, bat, disc.level, disc);
        }
        if (randomizer.generateAndMutate() < 0.3) {
            createEnemy(disc.x, disc.y + 100, crab, disc.level, disc);
        }
        if (randomizer.generateAndMutate() < 0.3) {
            createEnemy(disc.x + 100, disc.y, squid, disc.level, disc);
        }
        if (randomizer.generateAndMutate() < 0.3) {
            createEnemy(disc.x - 100, disc.y, chaser, disc.level, disc);
        }
    } else {
        if (randomizer.generateAndMutate() < 0.2) {
            createEnemy(disc.x, disc.y, lord, disc.level, disc);
        } else if (randomizer.generateAndMutate() < 0.2) {
            createEnemy(disc.x, disc.y, urchin, disc.level, disc);
        } else if (randomizer.generateAndMutate() < 0.2) {
            createEnemy(disc.x, disc.y, turret, disc.level, disc);
        } else if (randomizer.generateAndMutate() < 0.2) {
            createEnemy(disc.x, disc.y, chest, disc.level + 1, disc);
        }
        if (randomizer.generateAndMutate() < 0.3) {
            createEnemy(disc.x - 50, disc.y, chaser, disc.level, disc);
        }
        if (randomizer.generateAndMutate() < 0.3) {
            createEnemy(disc.x + 50, disc.y, slime, disc.level, disc);
        }
        if (randomizer.generateAndMutate() < 0.3) {
            createEnemy(disc.x, disc.y + 50, bat, disc.level, disc);
        }
        if (randomizer.generateAndMutate() < 0.3) {
            createEnemy(disc.x, disc.y - 50, crab, disc.level, disc);
        }
    }
}



const platformSizes = [200, 350, 500];
export function createWorldCell(worldSeed: number, {x, y}: Point): WorldCell {
    const discs: Disc[] = [];
    const worldRandomizer = SRandom.seed(worldSeed);
    const hasNorthExit = worldRandomizer.addSeed((y + 1) * 1357).random() <= 0.5;
    const hasSouthExit = y > 0 && worldRandomizer.addSeed(y * 1357).random() <= 0.5;
    const cellRandomizer = worldRandomizer.addSeed(x * 37).addSeed(y * 29);
    const level = getCellLevel(cellRandomizer, y);

    const cellRadius = CELL_SIZE / 2;
    const name = getBiome(y);

    const c = {x: CELL_SIZE * (x + 0.5), y: -CELL_SIZE * (y + 0.5)};

    let discRandomizer = cellRandomizer.addSeed(79);
    discs.push(createDisc({
        level,
        name,
        x: c.x + (discRandomizer.generateAndMutate() - 0.5) * CELL_SIZE / 10,
        y: c.y + (discRandomizer.generateAndMutate() - 0.5) * CELL_SIZE / 10,
        radius: discRandomizer.element(platformSizes),
    }));

    const goalDiscs: Disc[] = [];
    let westDisc = createDisc({
        level,
        name,
        x: c.x - cellRadius,
        y: c.y,
        radius: 400,
    });
    goalDiscs.push(westDisc);
    goalDiscs.push(createDisc({
        level,
        name,
        x: CELL_SIZE,
        y: c.y,
        radius: 400,
    }));
    let northDisc: Disc|undefined;
    if (hasNorthExit) {
        goalDiscs.push(northDisc = createDisc({
            level,
            name,
            x: c.x,
            y: c.y - cellRadius,
            radius: 400,
        }));
    }
    if (hasSouthExit) {
        goalDiscs.push(createDisc({
            level,
            name,
            x: c.x,
            y: CELL_SIZE,
            radius: 400,
        }));
    }
    for (let i = 0; i < 200 && (goalDiscs.length || i < 10); i++) {
        const theta = 2 * Math.PI * discRandomizer.generateAndMutate();
        const newDisc: Disc = createDisc({
            level,
            name,
            x: c.x + cellRadius * Math.cos(theta),
            y: c.y + cellRadius * Math.sin(theta),
            radius: discRandomizer.element(platformSizes),
        });
        projectDiscToClosestDisc(discs, newDisc, discRandomizer.range(16, 128));
        if ((newDisc.x - c.x) ** 2 + (newDisc.y - c.y) ** 2 >= cellRadius * cellRadius ) {
            continue;
        }
        for (let j = 0; j < goalDiscs.length; j++) {
            const goalDisc = goalDiscs[j];
            const {distance2} = getTargetVector(goalDisc, newDisc);
            if (distance2 <= (goalDisc.radius + newDisc.radius - 16) ** 2) {
                goalDiscs.splice(j--, 1);
            }
        }
        addOverworldEnemiesToDisc(discRandomizer, newDisc);
        discs.push(newDisc);
    }
    discs.push(westDisc);
    if (northDisc) {
        discs.push(northDisc);
    }
    linkDiscs(discs);
    return {
        level,
        x, y,
        discs,
    };
}
