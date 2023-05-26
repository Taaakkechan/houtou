interface CoreHeroStats {
    level: number
    experience: number
}

interface Circle {
    x: number
    y: number
    radius: number
}

interface Geometry extends Circle {
    // The disc this object is currently on.
    disc?: Disc
}
interface Vitals {
    life: number
    maxLife: number
    speed: number
    armor: number
    damage: number
    attacksPerSecond: number
    // Indiciates the next timestamp that an attack can be performed.
    attackCooldown: number
}

interface Hero extends CoreHeroStats, Vitals, Geometry {
    // The angle the hero is facing.
    theta: number
    damageHistory: number[]
    recentDamageTaken: number
    weapon: Weapon
    // How much the player has charged since he last attacked, which will be applied to the next weapon cycle.
    chargingLevel: number
    // How charged the player's current attacks are, which lasts for 1 full weapon cycle.
    attackChargeLevel: number
    potions: number
}
interface Enemy<EnemyParams=any> extends Vitals, Geometry {
    level: number
    definition: EnemyDefinition<EnemyParams>
    params: EnemyParams,
    // The angle the enemy is facing.
    theta: number
    minions: Enemy[]
    master?: Enemy
    // How much the enemy has charged since he last attacked, which will be applied to the next weapon cycle.
    chargingLevel: number
    // How charged the enemy's current attacks are, which lasts for 1 full weapon cycle.
    attackChargeLevel: number
    mode: string
    modeTime: number
    setMode(this: Enemy, mode: string)
    isBoss?: boolean
}
interface EnemyDefinition<EnemyParams=any> {
    name: string
    statFactors: Partial<Vitals>
    initialParams: EnemyParams
    dropChance?: number
    experienceFactor?: number
    solid?: boolean
    radius: number
    update: (state: GameState, enemy: Enemy) => void
    render: (context: CanvasRenderingContext2D, state: GameState, enemy: Enemy) => void
}

interface FieldText {
    x: number
    y: number
    vx: number
    vy: number
    expirationTime: number
    time: number
    text: string
    color?: string
    borderColor?: string
}

interface GameState {
    fieldTime: number
    hero: Hero
    heroBullets: Bullet[]
    enemies: Enemy[]
    loot: Loot[]
    activeLoot?: Loot
    portals: Portal[];
    enemyBullets: Bullet[]
    fieldText: FieldText[]
    activeDiscs: Disc[]
    visibleDiscs: Disc[]
    gameHasBeenInitialized: boolean
    paused: boolean
    keyboard: {
        gameKeyValues: number[]
        gameKeysDown: Set<number>
        gameKeysPressed: Set<number>
        // The set of most recent keys pressed, which is recalculated any time
        // a new key is pressed to be those keys pressed in that same frame.
        mostRecentKeysPressed: Set<number>
        gameKeysReleased: Set<number>
    }
}

interface Disc extends Geometry {
    links: Disc[]
    boss?: Enemy
}
