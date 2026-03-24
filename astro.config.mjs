// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import yairpgPlugin from './yairpg-plugin';

import fs from 'node:fs';

const skillsDataPath = './src/data/skills.json';
/** @type {any[]} */
let skillSidebarItems = [];
if (fs.existsSync(skillsDataPath)) {
	try {
		const skillsData = JSON.parse(fs.readFileSync(skillsDataPath, 'utf-8'));

		// Group by category
		/** @type {Object.<string, any[]>} */
		const categories = {};
		for (const [slug, skill] of Object.entries(skillsData)) {
			const category = skill.category || 'Miscellaneous';
			if (!categories[category]) categories[category] = [];
			categories[category].push({
				label: skill.name,
				link: `/skills/${slug}`,
			});
		}

		// Sort skills within categories and build sidebar items
		skillSidebarItems = Object.entries(categories)
			.sort(([a], [b]) => a.localeCompare(b))
			.map(([category, items]) => ({
				label: category,
				collapsed: true,
				items: items.sort((a, b) => a.label.localeCompare(b.label)),
			}));

	} catch (e) {
		console.error('Failed to parse skills.json for sidebar:', e);
	}
}

const activitiesDataPath = './src/data/activities.json';
/** @type {any[]} */
let activitySidebarItems = [];
if (fs.existsSync(activitiesDataPath)) {
	try {
		const activitiesData = JSON.parse(fs.readFileSync(activitiesDataPath, 'utf-8'));

		// Group by type
		/** @type {Object.<string, any[]>} */
		const types = {};
		for (const [slug, activity] of Object.entries(activitiesData)) {
			const type = activity.type || 'Miscellaneous';
			if (!types[type]) types[type] = [];
			types[type].push({
				label: activity.name,
				link: `/activities/${slug}`,
			});
		}

		// Sort activities within types and build sidebar items
		activitySidebarItems = Object.entries(types)
			.sort(([a], [b]) => a.localeCompare(b))
			.map(([type, items]) => ({
				label: type,
				collapsed: true,
				items: items.sort((a, b) => a.label.localeCompare(b.label)),
			}));

	} catch (e) {
		console.error('Failed to parse activities.json for sidebar:', e);
	}
}

const enemiesDataPath = './src/data/enemies.json';
/** @type {any[]} */
let enemySidebarItems = [];
if (fs.existsSync(enemiesDataPath)) {
	try {
		const enemiesData = JSON.parse(fs.readFileSync(enemiesDataPath, 'utf-8'));
		enemySidebarItems = [
			{ label: 'All Enemies', link: '/enemies' },
			...Object.entries(enemiesData)
				.map(([slug, enemy]) => ({
					label: enemy.name,
					link: `/enemies/${slug}`,
					rank: enemy.rank || 0,
				}))
				.sort((a, b) => a.rank - b.rank || a.label.localeCompare(b.label))
				.map(({ label, link }) => ({ label, link }))
		];
	} catch (e) {
		console.error('Failed to parse enemies.json for sidebar:', e);
	}
}

const locationsDataPath = './src/data/locations.json';
/** @type {any[]} */
let locationSidebarItems = [];
if (fs.existsSync(locationsDataPath)) {
	try {
		const locationsData = JSON.parse(fs.readFileSync(locationsDataPath, 'utf-8'));

		// Group by type (Safe Zone / Combat Zone)
		/** @type {Object.<string, any[]>} */
		const types = {
			'Safe Zones': [],
			'Combat Zones': [],
		};

		for (const [slug, location] of Object.entries(locationsData)) {
			const type = location.is_combat_zone ? 'Combat Zones' : 'Safe Zones';
			types[type].push({
				label: location.name,
				link: `/locations/${slug}`,
			});
		}

		locationSidebarItems = Object.entries(types)
			.map(([type, items]) => ({
				label: type,
				collapsed: true,
				items: items.sort((a, b) => a.label.localeCompare(b.label)),
			}));

	} catch (e) {
		console.error('Failed to parse locations.json for sidebar:', e);
	}
}

const itemsDataPath = './src/data/items.json';
/** @type {any[]} */
let itemSidebarItems = [];
if (fs.existsSync(itemsDataPath)) {
	try {
		const itemsData = JSON.parse(fs.readFileSync(itemsDataPath, 'utf-8'));

		// Group by type
		/** @type {Object.<string, any[]>} */
		const types = {};
		for (const [slug, item] of Object.entries(itemsData)) {
			const type = item.item_type || 'Miscellaneous';
			if (!types[type]) types[type] = [];
			types[type].push({
				label: item.name,
				link: `/items/${slug}`,
			});
		}

		// Sort items within types and build sidebar items
		itemSidebarItems = [
			{ label: 'All Items', link: '/items' },
			...Object.entries(types)
				.sort(([a], [b]) => a.localeCompare(b))
				.map(([type, items]) => ({
					label: type,
					collapsed: true,
					items: items.sort((a, b) => a.label.localeCompare(b.label)),
				}))
		];

	} catch (e) {
		console.error('Failed to parse items.json for sidebar:', e);
	}
}

const recipesDataPath = './src/data/recipes.json';
/** @type {any[]} */
let recipeSidebarItems = [];
if (fs.existsSync(recipesDataPath)) {
	try {
		const recipesData = JSON.parse(fs.readFileSync(recipesDataPath, 'utf-8'));

		/** @type {Object.<string, any[]>} */
		const skills = {};
		for (const [slug, recipe] of Object.entries(recipesData)) {
			let skill = recipe.recipe_skill || 'Miscellaneous';
			if (skill === 'Crafting') skill = 'Tinkering';

			if (!skills[skill]) skills[skill] = [];
			skills[skill].push({
				label: recipe.name,
				link: `/recipes/${slug}`,
			});
		}

		const order = ['Tinkering', 'Butchering', 'Cooking', 'Woodworking', 'Smelting', 'Forging', 'Alchemy'];
		const otherSkills = Object.keys(skills).filter(s => !order.includes(s));

		recipeSidebarItems = [
			{ label: 'Tinkering Calculator', link: '/recipes/tinkering-calculator' },
			{ label: 'All Recipes', link: '/recipes' },
			...[...order, ...otherSkills].filter(skill => skills[skill]).map(skill => ({
				label: skill,
				collapsed: true,
				items: skills[skill],
			}))
		];
	} catch (e) {
		console.error('Failed to parse recipes.json for sidebar:', e);
	}
}

// https://astro.build/config
export default defineConfig({
	site: 'https://thebowja.github.io',
	base: '/YAIRPG-wiki',
	integrations: [
		starlight({
			title: 'YAIRPG Wiki',
			social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/withastro/starlight' }],
			components: {
				TableOfContents: './src/components/TableOfContents.astro',
			},
			sidebar: [
				{
					label: 'Activities',
					items: activitySidebarItems,
				},
				{
					label: 'Enemies',
					items: enemySidebarItems,
				},
				{
					label: 'Locations',
					items: locationSidebarItems,
				},
				{
					label: 'Items',
					items: itemSidebarItems,
				},
				{
					label: 'Skills',
					items: skillSidebarItems,
				},
				{
					label: 'Recipes',
					items: recipeSidebarItems,
				},
			],
			pagination: false
		}),
	],

	vite: {
		plugins: [yairpgPlugin()]
	}
});
