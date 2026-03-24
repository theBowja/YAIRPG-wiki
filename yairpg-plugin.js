// vite-plugin-yairpg-mock.js

const MOCK_SOURCES = {
  'character.js': `
    export const get_total_level_bonus = () => 100;
    export const get_total_skill_coefficient = () => 1.5;
    export const get_total_skill_level = (skill_id) => {
      // Check if the Astro page provided a custom override
      if (window.__YAIRPG_OVERRIDES__?.get_total_skill_level) {
        return window.__YAIRPG_OVERRIDES__.get_total_skill_level(skill_id);
      }
      return 20;
    };
    export const is_rat = () => false;
    export const character = { inventory: {}, equipment: {} };
  `,
  'crafting_recipes.js': `export const get_crafting_quality_caps = () => ({ min: 0, max: 100 });`,
  'main.js': `
    export const game_options = { exp_threshold: 9 };
    export const add_active_effect = () => {};
    export const global_flags = {};
  `,
  'display.js': `export const log_message = () => {};`,
  'game_time.js': `
    export const current_game_time = { hour: 12, minute: 0, day_of_week: 1, day: 1, month: 1, year: 1 };
  `,
  'actions.js': `export class GameAction { constructor() {} }`,
  'market_saturation.js': `
    export const group_key_prefix = "type_";
    export const get_item_value_with_market_saturation = ({value}) => value;
    export const get_total_tier_saturation = () => 0;
    export const get_loot_price_multiple = ({value, how_many_to_trade}) => value * how_many_to_trade;
    export const fill_market_regions = () => {};
    export const market_regions = {};
  `
};

export default function yairpgPlugin() {
  const dataModules = ['misc.js', 'enemies.js', 'skills.js', 'activities.js', 'locations.js', 'items.js', 'crafting_recipes.js'];

  return {
    name: 'yairpg-plugin',
    enforce: 'pre',
    resolveId(source, importer) {
      // 1. Allow real imports via query param
      if (source.includes('?real=true')) return null;

      // 2. Allow specific data modules to load normally
      if (dataModules.some(mod => source.includes(mod))) return null;

      // 3. Match your loader's directory filter
      if (importer && importer.includes('yairpg/src')) {
        const match = Object.keys(MOCK_SOURCES).find(key => source.includes(key));
        if (match) {
          // Virtual module prefix \0 prevents other plugins from messing with it
          return `\0mock:${match}`;
        }
      }
      return null;
    },

    load(id) {
      if (id.startsWith('\0mock:')) {
        const key = id.replace('\0mock:', '');
        return MOCK_SOURCES[key];
      }
      return null;
    }
  };
}