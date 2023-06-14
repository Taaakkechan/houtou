import { guardian } from 'app/bosses/guardian';
import { spider } from 'app/bosses/spider';
import { giantClam } from 'app/enemies/clam';
import { megaSlime } from 'app/enemies/slime';
import { BASE_MAX_POTIONS, BASE_XP } from 'app/constants';
import { applyEnchantmentsToStats } from 'app/enchantments';
import { playSound } from 'app/utils/audio';
import { addDamageNumber, applyArmorToDamage } from 'app/utils/combat';

export const weaponMasteryMap: {[key in string]: WeaponType} = {
    [guardian.name]: 'dagger',
    [spider.name]: 'katana',
    [giantClam.name]: 'sword',
    [megaSlime.name]: 'bow',
};


export function gainExperience(state: GameState, experience: number): void {
    const requiredExperience = getExperienceForNextLevel(state.hero.level);
    // You cannot gain more than 100% of the experience for the next level at once.
    state.hero.experience += Math.min(experience, requiredExperience);
    if (state.hero.experience >= requiredExperience) {
        state.hero.level++;
        state.hero.experience -= requiredExperience;
        setDerivedHeroStats(state);
        refillAllPotions(state);
    }
}

export function gainWeaponExperience(state: GameState, weaponType: WeaponType, sourceLevel: number, experience: number): void {
    const weaponProficiency = getWeaponProficiency(state, weaponType);
    const weaponXpPenalty = Math.min(1, Math.max(0, (weaponProficiency.level - sourceLevel) * 0.1));
    const requiredExperience = getExperienceForNextWeaponLevel(weaponProficiency.level);
    // You cannot gain more than 25% of the experience for the next weapon level at once.
    weaponProficiency.experience += Math.min(Math.ceil(experience * (1 - weaponXpPenalty)), requiredExperience / 4);
    if (weaponProficiency.experience >= requiredExperience) {
        weaponProficiency.level++;
        weaponProficiency.experience -= requiredExperience;
        setDerivedHeroStats(state);
    }
}

export function getWeaponProficiency(state: GameState, weaponType = state.hero.equipment.weapon.weaponType): WeaponProficiency {
    return state.hero.weaponProficiency[weaponType] = state.hero.weaponProficiency[weaponType] || {level: 0, experience: 0};
}

export function getWeaponMastery(state: GameState, weaponType = state.hero.equipment.weapon.weaponType): number {
    return state.hero.weaponMastery[weaponType] = state.hero.weaponMastery[weaponType] || 0;
}

export function getTotalWeaponProficiency(state: GameState, weaponType = state.hero.equipment.weapon.weaponType): number {
    return getWeaponProficiency(state, weaponType).level + getWeaponMastery(state, weaponType);
}

export function gainItemExperience(state: GameState, item: Item): void {
    const experiencePenalty = Math.min(1, Math.max(0, (state.hero.level - item.level) * 0.1));
    const experience = BASE_XP * Math.pow(1.2, item.level) * 1.5;
    gainExperience(state, Math.ceil(experience * (1 - experiencePenalty)));
    if (item.type === 'weapon') {
        gainWeaponExperience(state, item.weaponType, item.level, 2 * experience);
    }
}

export function setDerivedHeroStats(state: GameState): void {

    // This must be calculated before anything that uses weapon proficiency which is derived in part from these numbers.
    state.hero.weaponMastery = {};
    for (const bossName of Object.keys(state.hero.bossRecords)) {
        const weaponType = weaponMasteryMap[bossName];
        const bonus = 5 + Math.floor(state.hero.bossRecords[bossName]! / 5);
        state.hero.weaponMastery[weaponType] = (state.hero.weaponMastery[weaponType] || 0) + bonus;
    }

    const weaponLevel = state.hero.equipment.weapon.level;
    const weaponProficiency = getTotalWeaponProficiency(state);
    state.hero.damage = Math.pow(1.05, state.hero.level - 1 + weaponProficiency);
    state.hero.attacksPerSecond = 1 + 0.01 * state.hero.level + 0.01 * weaponProficiency;
    // If weapon level is higher than your proficiency, attack speed is reduced down to a minimum of 10% base attack speed.
    const proficiencyDefecit = weaponLevel - weaponProficiency;
    if (proficiencyDefecit > 0) {
        state.hero.attacksPerSecond = state.hero.attacksPerSecond * Math.max(0.1, 0.95 ** proficiencyDefecit);
    }
    const lifePercentage = state.hero.life / state.hero.maxLife;
    state.hero.maxLife = 20 * state.hero.level;
    state.hero.armor = 0;
    state.hero.speed = 100;
    state.hero.potionEffect = 1;
    state.hero.dropChance = 0;
    state.hero.dropLevel = 0;

    const armor = state.hero.equipment.armor;
    if (armor) {
        state.hero.maxLife += armor.life;
        state.hero.armor += armor.armor;
        state.hero.speed *= armor.speedFactor;
    } else {
        state.hero.speed *= 1.2;
    }


    // Bow gives 0.1% -> 10% increased crit chance
    state.hero.critChance = getTotalWeaponProficiency(state, 'bow') * 0.001;
    // Dagger gives +0.01 -> 1 increased base attacks per second
    state.hero.attacksPerSecond += getTotalWeaponProficiency(state, 'dagger') * 0.01;
    // Katana gives 1% -> 100% increased crit damage
    state.hero.critDamage = getTotalWeaponProficiency(state, 'katana') * 0.01;
    // Morning Star gives +0.01 -> 1 increased armor shred effect
    state.hero.armorShredEffect = 1 + getTotalWeaponProficiency(state, 'morningStar') * 0.01;
    // Staff gives +0.01 -> 1 increased charge damage
    state.hero.chargeDamage = getTotalWeaponProficiency(state, 'staff') * 0.01;
    // Sword gives 1% -> 100% increased damage
    state.hero.damage *= (1 + getTotalWeaponProficiency(state, 'sword') * 0.01);

    // Enchantments are applied last to stats.
    applyEnchantmentsToStats(state);

    // Make sure updating stats doesn't change the hero's life percentage beyond rounding it.
    state.hero.life = Math.round(lifePercentage * state.hero.maxLife);
}

export function getExperienceForNextLevel(currentLevel: number): number {
    // This is:
    // ~5 kills for 1 -> 2
    // ~16 kills for 10 -> 11
    // 30 kills for 20 -> 21
    // 100 kills for 50 -> 51
    // 125 kills for 60 -> 61
    // 200 kills for 75 -> 76
    // 250 kills for 80 -> 81
    // 500 kills for 90 -> 91
    // 1000 kills for 95 -> 96
    // 2500 kills for 98 -> 99
    // 5000 kills for 99 -> 100
    const averageKills = Math.min(50, 4 + currentLevel) * 100 / (100 - currentLevel);
    const xpPerKill = Math.ceil(BASE_XP * Math.pow(1.2, currentLevel - 1));
    return averageKills * xpPerKill;
}
// @ts-ignore-next-line
window['getExperienceForNextLevel'] = getExperienceForNextLevel;

export function getExperienceForNextWeaponLevel(currentLevel: number): number {
    const averageKills = Math.min(20, 5 + currentLevel) * 100 / (100 - currentLevel);
    const xpPerKill = Math.ceil(BASE_XP * Math.pow(1.2, currentLevel));
    return averageKills * xpPerKill;
}

export function refillAllPotions(state: GameState): void {
    state.hero.life = state.hero.maxLife;
    state.hero.potions = BASE_MAX_POTIONS;
}

export function damageHero(state: GameState, damage: number): void {
    damage = applyArmorToDamage(state, damage, state.hero.armor);

    // Incoming damage is limited by both the amount of the damage and the players total health.
    // Shots that deal X damage only deal damage if the player has taken less than 2X damage recently.
    // A player cannot take more than 50% of their health over their recorded damage history.
    const damageCap = Math.min(Math.floor(state.hero.maxLife / 2), 2 * damage);
    const damageTaken = Math.max(0, Math.min(damage, damageCap - state.hero.recentDamageTaken));
    if (damageTaken <= 0) {
        return;
    }
    if (damageTaken < 0.25 * state.hero.life) {
        playSound(state, 'takeDamage');
    } else {
         playSound(state, 'takeBigDamage');
    }
    state.hero.life -= damageTaken;
    if (state.hero.life < 0) {
        state.hero.life = 0;
    }
    state.hero.damageHistory[0] += damageTaken;
    state.hero.recentDamageTaken += damageTaken;
    addDamageNumber(state, state.hero, damageTaken);
}
