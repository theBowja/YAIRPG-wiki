// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

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
		enemySidebarItems = Object.entries(enemiesData)
			.map(([slug, enemy]) => ({
				label: enemy.name,
				link: `/enemies/${slug}`,
				rank: enemy.rank || 0,
			}))
			.sort((a, b) => a.rank - b.rank || a.label.localeCompare(b.label))
			.map(({ label, link }) => ({ label, link }));
	} catch (e) {
		console.error('Failed to parse enemies.json for sidebar:', e);
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
					label: 'Skills',
					items: skillSidebarItems,
				},
			],
		}),
	],
});
