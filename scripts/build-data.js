import fs from 'node:fs';
import { skills } from '../yairpg/src/skills.js?real=true';
import { activities } from '../yairpg/src/activities.js?real=true';
import { enemy_templates } from '../yairpg/src/enemies.js?real=true';
import { locations } from '../yairpg/src/locations.js?real=true';
import { item_templates } from '../yairpg/src/items.js?real=true';
import { recipes, get_recipe_xp_value } from '../yairpg/src/crafting_recipes.js?real=true';

function slugify(text) {
    return text.toString().toLowerCase()
        .replace(/\s+/g, '-')           // Replace spaces with -
        .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
        .replace(/\-\-+/g, '-')         // Replace multiple - with single -
        .replace(/^-+/, '')             // Trim - from start of text
        .replace(/-+$/, '');            // Trim - from end of text
}

const skillsOutput = {};
for (const [id, skill] of Object.entries(skills)) {
    const slug = slugify(id);
    // Use the first name from the names map
    const name = skill.names[Object.keys(skill.names)[0]];
    skillsOutput[slug] = {
        id: id,
        name: name,
        description: skill.description,
        max_level: skill.max_level,
        category: skill.category,
        base_xp_cost: skill.base_xp_cost,
        xp_scaling: skill.xp_scaling
    };
}

function capitalize(text) {
    return text.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
}

const activitiesOutput = {};
for (const [id, activity] of Object.entries(activities)) {
    const slug = slugify(id);
    activitiesOutput[slug] = {
        id: id,
        name: capitalize(activity.name),
        description: activity.description,
        action_text: activity.action_text,
        base_skills_names: activity.base_skills_names,
        type: capitalize(activity.type),
        required_tool_type: activity.required_tool_type,
        payment_type: activity.payment_type
    };
}

// Ensure data directory exists
if (!fs.existsSync('./src/data')) {
    fs.mkdirSync('./src/data', { recursive: true });
}

const enemiesOutput = {};
for (const [id, enemy] of Object.entries(enemy_templates)) {
    const slug = slugify(id);
    enemiesOutput[slug] = {
        id: id,
        name: enemy.name,
        description: enemy.description,
        rank: enemy.rank,
        xp_value: enemy.xp_value,
        size: enemy.size,
        add_to_bestiary: enemy.add_to_bestiary,
        stats: enemy.stats,
        tags: Object.keys(enemy.tags),
        loot_list: enemy.loot_list.map(loot => ({
            item_name: loot.item_name,
            chance: loot.chance
        }))
    };
}

const locationsOutput = {};
for (const [id, loc] of Object.entries(locations)) {
    const slug = slugify(id);
    const locationData = {
        id: id,
        name: loc.name,
        description: loc.getDescription(),
        connected_locations: (loc.connected_locations || []).map(conn => ({
            name: conn.location.name,
            travel_time: conn.travel_time,
            custom_text: conn.custom_text
        })),
        is_combat_zone: !!loc.enemies_list || !!loc.enemy_groups_list,
        tags: Object.keys(loc.tags),
        traders: loc.traders || [],
        dialogues: loc.dialogues || [],
        activities: Object.keys(loc.activities || {}),
        actions: Object.keys(loc.actions || {}),
        parent_location: loc.parent_location ? {
            id: loc.parent_location.id,
            name: loc.parent_location.name,
            travel_time: (loc.parent_location.connected_locations || []).find(conn => conn.location === loc)?.travel_time || 0
        } : null,
        leave_text: loc.leave_text || null
    };

    if (locationData.is_combat_zone) {
        locationData.enemies_list = loc.enemies_list || [];
        locationData.enemy_count = loc.enemy_count;
        locationData.repeatable_reward = loc.repeatable_reward;
    }

    locationsOutput[slug] = locationData;
}

const itemsOutput = {};
for (const [id, item] of Object.entries(item_templates)) {
    const slug = slugify(id);
    const itemData = {
        id: id,
        name: item.getName ? item.getName() : item.name,
        description: item.getDescription ? item.getDescription() : item.description,
        value: item.getBaseValue ? item.getBaseValue() : item.value,
        item_type: formatType(item.item_type || 'OTHER'),
        tags: Object.keys(item.tags || {}),
    };

    if (item.equip_slot) {
        itemData.equip_slot = item.equip_slot;
    }

    if (item.getStats) {
        itemData.stats = item.getStats();
    }

    if (item.getBonusSkillLevels) {
        itemData.bonus_skill_levels = item.getBonusSkillLevels();
    }

    if (item.getRarity) {
        itemData.rarity = item.getRarity();
    }

    itemsOutput[slug] = itemData;
}

const recipesOutput = {};
for (const [category, subcategories] of Object.entries(recipes)) {
    for (const [subcategory, recipeList] of Object.entries(subcategories)) {
        for (const [id, recipe] of Object.entries(recipeList)) {
            const slug = slugify(`${category}-${subcategory}-${id}`);
            const recipeData = {
                id: id,
                name: recipe.name,
                category,
                subcategory,
                recipe_skill: recipe.recipe_skill,
                recipe_level: recipe.recipe_level,
                recipe_type: recipe.recipe_type,
            };

            if (recipe.materials) {
                recipeData.materials = recipe.materials.map(m => ({
                    id: m.material_id,
                    type: m.material_type,
                    count: m.count,
                    result_id: m.result_id
                }));
            }

            if (recipe.result) {
                recipeData.result = {
                    id: recipe.result.result_id || recipe.result.id,
                    count: recipe.result.count
                };
            }

            if (recipe.components) {
                recipeData.components = recipe.components;
            }

            if (recipe.item_type) {
                recipeData.item_type = recipe.item_type;
            }

            // Calculate a base XP value for display (assuming tier 1/station 1 if needed)
            try {
                recipeData.xp_value = get_recipe_xp_value({
                    category,
                    subcategory,
                    recipe_id: id,
                    material_count: recipe.materials ? recipe.materials[0]?.count : 1,
                    result_tier: 1, // Default to tier 1
                    rarity_multiplier: 1,
                    selected_components: [{component_tier: 1}, {component_tier: 1}] // For equipment
                });
            } catch (e) {
                recipeData.xp_value = 'Dynamic';
            }

            recipesOutput[slug] = recipeData;
        }
    }
}


fs.writeFileSync('./src/data/skills.json', JSON.stringify(skillsOutput, null, 2));
fs.writeFileSync('./src/data/activities.json', JSON.stringify(activitiesOutput, null, 2));
fs.writeFileSync('./src/data/enemies.json', JSON.stringify(enemiesOutput, null, 2));
fs.writeFileSync('./src/data/locations.json', JSON.stringify(locationsOutput, null, 2));
fs.writeFileSync('./src/data/items.json', JSON.stringify(itemsOutput, null, 2));
fs.writeFileSync('./src/data/recipes.json', JSON.stringify(recipesOutput, null, 2));

console.log('skills.json, activities.json, enemies.json, locations.json, items.json and recipes.json generated.');
function formatType(type) {
    if (!type) return 'Other';
    return type.toLowerCase().split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}
