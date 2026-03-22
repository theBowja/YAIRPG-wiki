
// We flag the modules we want to mock so the 'load' hook knows to intercept them
export async function resolve(specifier, context, nextResolve) {
    // console.log(specifier);
    // console.log(context);

    // Allow real imports
    if (specifier.includes('?real=true')) {
        return nextResolve(specifier, context);
    }

    const dataModules = ['misc.js', 'enemies.js', 'skills.js', 'activities.js', 'locations.js', 'items.js', 'crafting_recipes.js'];
    if (dataModules.some(mod => specifier.includes(mod))) {
        return nextResolve(specifier, context);
    }

    if (context.parentURL && context.parentURL.includes('yairpg/src')) {
        return {
            shortCircuit: true,
            url: `mock:${specifier}`
        };
    }
    return nextResolve(specifier, context);
}

export async function load(url, context, nextLoad) {
    if (url.startsWith('mock:')) {
        let source = '';

        if (url.includes('character.js')) {
            source = characterSource;
        } else if (url.includes('crafting_recipes.js')) {
            source = craftingRecipesSource;
        } else if (url.includes('main.js')) {
            source = mainSource;
        } else if (url.includes('display.js')) {
            source = displaySource;
        } else if (url.includes('game_time.js')) {
            source = gameTimeSource;
        } else if (url.includes('actions.js')) {
            source = actionsSource;
        } else if (url.includes('market_saturation.js')) {
            source = marketSaturationSource;
        }

        return {
            format: 'module',
            shortCircuit: true,
            source,
        };
    }
    return nextLoad(url, context);
}

const characterSource = `
export const get_total_level_bonus = () => 100;
export const get_total_skill_coefficient = () => 1.5;
export const get_total_skill_level = () => 50;
export const is_rat = () => false;
export const character = {
    inventory: {},
    equipment: {},
};
`

const craftingRecipesSource = `
export const get_crafting_quality_caps = () => ({ min: 0, max: 100 });
`

const mainSource = `
export const game_options = {
    exp_threshold: 9,
}
export const add_active_effect = () => {};
export const global_flags = {};
`

const displaySource = `
export const log_message = () => {};
`

const gameTimeSource = `
export const current_game_time = {
    hour: 12,
    minute: 0,
    day_of_week: 1,
    day: 1,
    month: 1,
    year: 1,
};
`

const actionsSource = `
export class GameAction {
    constructor() {}
}
`

const marketSaturationSource = `
export const group_key_prefix = "type_";
export const get_item_value_with_market_saturation = ({value}) => value;
export const get_total_tier_saturation = () => 0;
export const get_loot_price_multiple = ({value, how_many_to_trade}) => value * how_many_to_trade;
export const fill_market_regions = () => {};
export const market_regions = {};
`
