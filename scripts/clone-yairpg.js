import { execSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// In ES Modules, __dirname and __filename are not defined. 
// We recreate them using the current file's URL.
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function cloneRepo(repoUrl, targetFolder) {
    try {
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