import fs from 'fs';
import { execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import fetch from 'node-fetch';

// Get the current directory of the script
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define paths to package.json and module.json
const packageJsonPath = path.join(__dirname, 'package.json');
const moduleJsonPath = path.join(__dirname, 'module.json');

const args = process.argv.slice(2);
const versionType = args[0];
const isDraft = args.includes('draft') || args.includes('--draft');
const isPreRelease = args.includes('pre') || args.includes('--pre');
const isTestRelease = isDraft || isPreRelease;

// Check for uncommitted changes (must be before any branch switching or merging)
try {
    const gitStatus = execSync('git status --porcelain').toString().trim();
    if (gitStatus) {
        console.error('❌ There are uncommitted changes in your working directory:');
        console.error(gitStatus);
        console.error('Please commit or stash your changes before running a release.');
        process.exit(1);
    }
} catch (error) {
    console.error('❌ Error checking git status:', error.message);
    process.exit(1);
}

if (!versionType) {
    console.error('Usage: node release.js <major|minor|patch> [draft|pre]');
    console.error('');
    console.error('Release Types:');
    console.error('  (none)  - Public release on main branch (triggers GitHub Actions)');
    console.error('  draft   - Draft release on next branch (private, triggers GitHub Actions)');
    console.error('  pre     - Pre-release on next branch (public preview, triggers GitHub Actions)');
    console.error('');
    console.error('Examples:');
    console.error('  node release.js patch        # Public release');
    console.error('  node release.js minor draft  # Private draft for internal testing');
    console.error('  node release.js major pre    # Public pre-release for beta testing');
    process.exit(1);
}

// Validate version type
const validTypes = ['major', 'minor', 'patch'];
if (!validTypes.includes(versionType)) {
    console.error(`Invalid version type: ${versionType}. Valid types are: ${validTypes.join(', ')}`);
    console.error('Usage: node release.js <major|minor|patch> [draft|pre]');
    process.exit(1);
}

// Validate that only one release type is specified
if (isDraft && isPreRelease) {
    console.error('❌ Cannot specify both "draft" and "pre". Choose one.');
    process.exit(1);
}

// Function to validate version format (including pre-release)
const isValidVersion = (version) => /^\d+\.\d+\.\d+(-\w+\.\d+)?$/.test(version);

// Function to increment version with clear pre-release logic
const incrementVersion = (version, type, isPreRelease = false) => {
    if (!isValidVersion(version)) {
        console.error(`❌ Invalid version format: "${version}". Expected format: x.y.z or x.y.z-pre.n`);
        process.exit(1);
    }
    
    // Check if current version is already a pre-release
    const isCurrentlyPreRelease = /-beta\.(\d+)$/.test(version);
    const baseVersion = version.replace(/-.*$/, '');
    const currentBetaMatch = version.match(/-beta\.(\d+)$/);
    const currentBetaNumber = currentBetaMatch ? parseInt(currentBetaMatch[1], 10) : 0;
    
    const parts = baseVersion.split('.').map(Number);
    console.log(`📋 Current version: ${version}`);
    console.log(`📋 Base version parts: [${parts.join(', ')}]`);
    console.log(`📋 Is currently pre-release: ${isCurrentlyPreRelease}`);
    
    // Validate that all parts are valid numbers
    if (parts.some(part => isNaN(part))) {
        console.error(`❌ Version contains invalid numbers: "${version}". Resetting to 1.0.0`);
        parts[0] = 1;
        parts[1] = 0;
        parts[2] = 0;
    }
    
    let newVersion;
    
    if (isPreRelease) {
        if (isCurrentlyPreRelease) {
            // Current version is already a pre-release, just increment beta number
            newVersion = `${baseVersion}-beta.${currentBetaNumber + 1}`;
            console.log(`📋 Incrementing beta: ${version} → ${newVersion}`);
        } else {
            // Current version is stable, increment the specified part and add -beta.1
            switch (type) {
                case 'major':
                    parts[0]++;
                    parts[1] = 0;
                    parts[2] = 0;
                    break;
                case 'minor':
                    parts[1]++;
                    parts[2] = 0;
                    break;
                case 'patch':
                    parts[2]++;
                    break;
            }
            newVersion = `${parts.join('.')}-beta.1`;
            console.log(`📋 Creating new pre-release: ${version} → ${newVersion}`);
        }
    } else {
        if (isCurrentlyPreRelease) {
            // Current version is a pre-release, remove the pre-release part for stable release
            newVersion = baseVersion;
            console.log(`📋 Graduating to stable: ${version} → ${newVersion}`);
        } else {
            // Current version is stable, increment normally
            switch (type) {
                case 'major':
                    parts[0]++;
                    parts[1] = 0;
                    parts[2] = 0;
                    break;
                case 'minor':
                    parts[1]++;
                    parts[2] = 0;
                    break;
                case 'patch':
                    parts[2]++;
                    break;
            }
            newVersion = parts.join('.');
            console.log(`📋 Incrementing stable: ${version} → ${newVersion}`);
        }
    }
    
    return newVersion;
};

// Function to update version in both files
const updateVersions = (newVersion) => {
    // Update package.json
    const packageData = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    packageData.version = newVersion;
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageData, null, 2) + '\n');
    console.log(`✅ Updated package.json version to ${newVersion}`);

    // Update module.json
    const moduleData = JSON.parse(fs.readFileSync(moduleJsonPath, 'utf8'));
    moduleData.version = newVersion;
    fs.writeFileSync(moduleJsonPath, JSON.stringify(moduleData, null, 2) + '\n');
    console.log(`✅ Updated module.json version to ${newVersion}`);
};

// Function to build the project
const buildProject = () => {
    console.log('🏗️  Building project...');
    try {
        execSync('bun run build', { stdio: 'inherit' });
        console.log('✅ Build completed successfully');
    } catch (error) {
        console.error('❌ Build failed:', error.message);
        process.exit(1);
    }
};

// Function to create git tag and push
const createGitTag = (version, isTestRelease) => {
    const targetBranch = isTestRelease ? 'next' : 'main';
    
    try {
        // Ensure we're on the correct branch
        const currentBranch = execSync('git branch --show-current').toString().trim();
        
        if (isTestRelease) {
            // For test releases, ensure next branch exists and switch to it
            try {
                execSync('git fetch origin next', { stdio: 'pipe' });
                execSync('git checkout next', { stdio: 'pipe' });
            } catch (error) {
                // If next branch doesn't exist, create it from main
                console.log('📋 Creating next branch from main...');
                execSync('git checkout main', { stdio: 'pipe' });
                execSync('git checkout -b next', { stdio: 'pipe' });
                execSync('git push -u origin next', { stdio: 'pipe' });
            }
        } else {
            // For production releases, ensure we're on main
            if (currentBranch !== 'main') {
                console.log('📋 Switching to main branch...');
                execSync('git checkout main', { stdio: 'pipe' });
            }
            
            // Pull latest changes
            execSync('git pull origin main', { stdio: 'pipe' });
        }
        
        // Stage and commit the version changes
        execSync('git add package.json module.json', { stdio: 'pipe' });
        execSync(`git commit -m "Release ${version}"`, { stdio: 'pipe' });
        
        // Create and push tag
        execSync(`git tag -a v${version} -m "Release ${version}"`, { stdio: 'pipe' });
        execSync(`git push origin v${version}`, { stdio: 'pipe' });
        execSync(`git push origin ${targetBranch}`, { stdio: 'pipe' });
        
        console.log(`✅ Created and pushed tag: v${version}`);
        console.log(`✅ Pushed to branch: ${targetBranch}`);
        
    } catch (error) {
        console.error('❌ Git operations failed:', error.message);
        process.exit(1);
    }
};

// Function to create GitHub release
const createGitHubRelease = async (version, isTestRelease, isDraft) => {
    const releaseData = {
        tag_name: `v${version}`,
        name: `Release ${version}`,
        body: `Release ${version}\n\nChanges in this release:\n- TODO: Add release notes`,
        draft: isDraft,
        prerelease: isTestRelease && !isDraft
    };
    
    try {
        // Check if we have GitHub CLI available
        execSync('gh --version', { stdio: 'pipe' });
        
        const releaseCommand = [
            'gh', 'release', 'create', `v${version}`,
            '--title', `"Release ${version}"`,
            '--notes', `"Release ${version}\\n\\nChanges in this release:\\n- TODO: Add release notes"`
        ];
        
        if (isDraft) {
            releaseCommand.push('--draft');
        } else if (isTestRelease) {
            releaseCommand.push('--prerelease');
        }
        
        execSync(releaseCommand.join(' '), { stdio: 'inherit' });
        console.log(`✅ Created GitHub release: v${version}`);
        
    } catch (error) {
        console.log('⚠️  GitHub CLI not available or failed. The GitHub Action will handle the release.');
        console.log('   Make sure to push the tag to trigger the release workflow.');
    }
};

// Main execution
(async () => {
    console.log('🚀 Starting release process...');
    console.log(`📋 Release type: ${versionType}`);
    console.log(`📋 Is draft: ${isDraft}`);
    console.log(`📋 Is pre-release: ${isPreRelease}`);
    console.log(`📋 Is test release: ${isTestRelease}`);
    
    // Read current versions
    const packageData = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    const moduleData = JSON.parse(fs.readFileSync(moduleJsonPath, 'utf8'));
    
    const currentVersion = packageData.version;
    console.log(`📋 Current version: ${currentVersion}`);
    
    // Validate versions match
    if (packageData.version !== moduleData.version) {
        console.error(`❌ Version mismatch: package.json (${packageData.version}) vs module.json (${moduleData.version})`);
        process.exit(1);
    }
    
    // Calculate new version
    const newVersion = incrementVersion(currentVersion, versionType, isTestRelease);
    console.log(`📋 New version: ${newVersion}`);
    
    // Update versions in files
    updateVersions(newVersion);
    
    // Build project
    buildProject();
    
    // Create git tag and push
    createGitTag(newVersion, isTestRelease);
    
    // Create GitHub release (if GitHub CLI is available)
    await createGitHubRelease(newVersion, isTestRelease, isDraft);
    
    console.log('🎉 Release process completed successfully!');
    console.log(`📋 Released version: ${newVersion}`);
    console.log('📋 The GitHub Action will build and publish the release.');
})().catch(error => {
    console.error('❌ Release process failed:', error.message);
    process.exit(1);
});
