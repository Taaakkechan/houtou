import { armorTypes, armorsByType } from 'app/armor';
import { BASE_DROP_CHANCE } from 'app/constants';
import { gainItemExperience } from 'app/utils/hero';
import {
    renderArmorShort,
    renderArmorLong,
    renderEnchantmentLong,
    renderEnchantmentShort,
    renderWeaponShort,
    renderWeaponLong,
} from 'app/render/renderInventory';
import { weaponTypes, weaponsByType } from 'app/weapons';
import Random  from 'app/utils/Random';


export function checkToDropBasicLoot(state: GameState, source: Enemy): void {
    if (Math.random() < (source.definition.dropChance ?? BASE_DROP_CHANCE)) {
        let targetLevel = source.level;
        while (Math.random() < 0.1) {
            targetLevel = Math.min(100, targetLevel + 1);
        }
        if (Math.random() < 0.25) {
            dropArmorLoot(state, source, targetLevel);
        } else {
            dropWeaponLoot(state, source, targetLevel);
        }
    }
}

function addEnchantmentSlot(item: Armor|Weapon): void {
    item.enchantmentSlots.push({enchantmentType: 'empty', value: 0})
}
function addEnchantmentSlots(item: Armor|Weapon): void {
    item.enchantmentSlots = [];
    addEnchantmentSlot(item);
    if (item.level >= 5 && Math.random() < 0.1) {
        addEnchantmentSlot(item);
    }
    if (item.level >= 20 && Math.random() < 0.1) {
        addEnchantmentSlot(item);
    }
    if (item.level >= 50 && Math.random() < 0.1) {
        addEnchantmentSlot(item);
    }
}


export function generateArmor(armorType: ArmorType, level: number): Armor|undefined {
    const armorArray = armorsByType[armorType];
    let armorIndex = 0;
    for (;armorIndex < armorArray.length - 1; armorIndex++) {
        if (armorArray[armorIndex + 1].level > level) {
            break;
        }
    }

    const armor = {...armorArray[armorIndex]};
    for (let i = 0; i < 5 && armor.level < level; i++) {
        armor.level++;
        armor.name = armor.name + '+';
        armor.armor = Math.ceil(armor.armor * 1.1);
        armor.life = Math.ceil(armor.life * 1.1);
    }
    addEnchantmentSlots(armor);
    return armor;
}

export function dropArmorLoot(state: GameState, source: Enemy, level: number): void {
    if (!source.disc) {
        return;
    }
    const armorType = Random.element(armorTypes);
    const armor = generateArmor(armorType, level);
    if (!armor) {
        return;
    }

    source.disc.loot.push({
        type: 'armor',
        x: source.x,
        y: source.y,
        disc: source.disc,
        radius: 12,
        armor,
        activate(this: ArmorLoot, state: GameState): void {
            state.hero.armors.push(this.armor);
        },
        render(this: ArmorLoot, context: CanvasRenderingContext2D, state: GameState): void {
            if (this === state.activeLoot) {
                renderArmorLong(context, this.x, this.y, this.armor);
            } else {
                renderArmorShort(context, this.x, this.y, this.armor);
            }
        },
        sell(this: ArmorLoot): void {
            gainItemExperience(state, this.armor);
        }
    });
}

export function generateWeapon(weaponType: WeaponType, level: number): Weapon|undefined {
    const weaponArray = weaponsByType[weaponType];
    if (!weaponArray.length) {
        return;
    }
    let weaponIndex = 0;
    for (;weaponIndex < weaponArray.length - 1; weaponIndex++) {
        if (weaponArray[weaponIndex + 1].level > level) {
            break;
        }
    }

    const weapon = {...weaponArray[weaponIndex]};
    for (let i = 0; i < 5 && weapon.level < level; i++) {
        weapon.level++;
        weapon.name = weapon.name + '+';
        weapon.damage = Math.ceil(weapon.damage * 1.1);
    }
    addEnchantmentSlots(weapon);
    return weapon;
}

export function dropWeaponLoot(state: GameState, source: Enemy, level: number): void {
    if (!source.disc) {
        return;
    }
    const weaponType = Random.element(weaponTypes);
    const weapon = generateWeapon(weaponType, level);
    if (!weapon) {
        return;
    }
    source.disc.loot.push({
        type: 'weapon',
        x: source.x,
        y: source.y,
        disc: source.disc,
        radius: 12,
        weapon,
        activate(this: WeaponLoot, state: GameState): void {
            state.hero.weapons.push(this.weapon);
        },
        render(this: WeaponLoot, context: CanvasRenderingContext2D, state: GameState): void {
            if (this === state.activeLoot) {
                renderWeaponLong(context, this.x, this.y, this.weapon);
            } else {
                renderWeaponShort(context, this.x, this.y, this.weapon);
            }
        },
        sell(this: WeaponLoot): void {
            gainItemExperience(state, this.weapon);
        }
    });
}

export function dropEnchantmentLoot(state: GameState, disc: Disc, {x, y}: Point, enchantment: Enchantment): void {
    if (!disc) {
        return;
    }
    disc.loot.push({
        type: 'enchantment',
        disc,
        x,
        y,
        radius: 12,
        enchantment,
        activate(this: EnchantmentLoot, state: GameState): void {
            state.hero.enchantments.push(this.enchantment);
        },
        render(this: EnchantmentLoot, context: CanvasRenderingContext2D, state: GameState): void {
            if (this === state.activeLoot) {
                renderEnchantmentLong(context, this.x, this.y, this.enchantment);
            } else {
                renderEnchantmentShort(context, this.x, this.y, this.enchantment);
            }
        },
        sell(this: EnchantmentLoot): void {
            gainItemExperience(state, this.enchantment);
        }
    });
}