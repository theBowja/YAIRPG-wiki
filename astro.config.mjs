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
		skillSidebarItems = Object.entries(skillsData).map(([slug, skill]) => ({
			label: skill.name,
			link: `/skills/${slug}`,
		}));
	} catch (e) {
		console.error('Failed to parse skills.json for sidebar:', e);
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
					label: 'Guides',
					items: [
						// Each item here is one entry in the navigation menu.
						{ label: 'Example Guide', slug: 'guides/example' },
					],
				},
				{
					label: 'Skills',
					items: skillSidebarItems,
				},
			],
		}),
	],
});
