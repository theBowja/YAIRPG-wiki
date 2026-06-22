import { execSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import fs from 'node:fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function cloneRepo(repoUrl, targetFolder) {
    try {
        // Check if the directory already exists
        if (fs.existsSync(targetFolder)) {
            console.log(`⚠️  Target directory ${targetFolder} already exists. Cleaning it up...`);

            // Recursive delete to ensure the folder is completely empty/gone
            fs.rmSync(targetFolder, { recursive: true, force: true });
        }

        console.log(`Cloning ${repoUrl} into ${targetFolder}...`);

        execSync(
            `git clone --depth 1 --single-branch "${repoUrl}" "${targetFolder}"`,
            { stdio: 'inherit' }
        );

        console.log("✅ Clone complete!");
    } catch (err) {
        console.error("❌ Git operation failed:", err.message);
    }
}

// Usage
const url = 'https://github.com/miktaew/yet-another-idle-rpg.git';
const dir = path.join(__dirname, '..', 'yairpg');

cloneRepo(url, dir);