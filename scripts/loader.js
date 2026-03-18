
// We flag the modules we want to mock so the 'load' hook knows to intercept them
export async function resolve(specifier, context, nextResolve) {
    // console.log(specifier);
    // console.log(context);

    // Allow real imports
    if (specifier.includes('?real=true')) {
        return nextResolve(specifier, context);
    }

    // Allow misc.js to be imported
    if (specifier.includes('misc.js')) {
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
`

const craftingRecipesSource = `
export const get_crafting_quality_caps = () => ({ min: 0, max: 100 });
`

const mainSource = `
export const game_options = {
    exp_threshold: 9,
}
`