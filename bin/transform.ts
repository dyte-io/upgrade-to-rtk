import { execSync } from 'child_process';
import path from 'path';
import fs from 'fs';
import inquirer from 'inquirer';

export default async function transform(location: string = '.') {
    
    let packageManager: string = 'npm'
    const packageManagerChoices = ['npm', 'yarn', 'pnpm', 'bun']
    const fileTypeChoices = ['ts/tsx/js/jsx', 'ts/tsx', 'js/jsx'];
    try {
        const answer = await inquirer
        .prompt([
            {
                type: 'list',
                name: 'packageManager',
                message: 'Which package manager do you use?',
                choices: packageManagerChoices,
                default: 'npm',
            },        
        ])
        packageManager = answer.packageManager;
    } catch(error) {   
        if (error.isTtyError) {
            console.warn(`Prompt couldn't be rendered in the current environment, using ${packageManager} package manager by default`)
        } else {
            // Something else went wrong
            console.error(`Something went wrong, using ${packageManager} package manager by default`);
        }
    };
    
    if (!packageManagerChoices.includes(packageManager)) throw Error(`Invalid package manager type ${packageManager}`)
        
    let fileType = 'ts/tsx';
    try {
        const answer = await inquirer
        .prompt([
            {
                type: 'list',
                name: 'fileType',
                message: 'Which files to run the transformation for?',
                choices: ['ts/tsx', 'js', 'ts/tsx/js'],
                default: 'ts/tsx',
            },        
        ])
        fileType = answer.fileType;
    } catch(error) {   
        if (error.isTtyError) {
            console.warn(`Prompt couldn't be rendered in the current environment, transforming ${fileType} file types by default`)
        } else {
            // Something else went wrong
            console.error(`Something went wrong, transforming ${fileType} file types by default`);
        }
    };
    
    if (!fileTypeChoices.includes(fileType)) throw Error(`Invalid package manager type ${fileType}`)
        
    // Map of Dyte package → RealtimeKit replacement
    const PACKAGE_MAP = {
        '@dytesdk/react-ui-kit': '@cloudflare/realtimekit-react-ui',
        '@dytesdk/react-web-core': '@cloudflare/realtimekit-react',
        '@dytesdk/ui-kit': '@cloudflare/realtimekit-ui',
        '@dytesdk/web-core': '@cloudflare/realtimekit'
    };
    
    // Utility to run a shell command
    function run(command) {
        execSync(command, { stdio: 'inherit' });
    }
    
    // Check which Dyte packages are installed
    function getInstalledDytePackages() {
        const pkgJsonPath = path.join(process.cwd(), 'package.json');
        const pkgJson = JSON.parse(fs.readFileSync(pkgJsonPath, 'utf-8'));
        const allDeps = {
            ...pkgJson.dependencies,
            ...pkgJson.devDependencies,
            ...pkgJson.peerDependencies,
            ...pkgJson.optionalDependencies
        };
        
        return Object.keys(PACKAGE_MAP).filter(pkg => allDeps[pkg]);
    }
    
    // Step 1: Run the codemod
    const transformerPath = path.join(__dirname, './transforms/dyte-to-rtk.js');

    if (fileTypeChoices.includes('ts/tsx')) {
        console.log(`Starting code transformations at ${location} for ts files`)
        run(`npx jscodeshift --ignore-pattern="**/node_modules/**" -t ${transformerPath} ${location} --extensions=ts --parser=ts`);
        console.log(`Starting code transformations at ${location} for tsx files`)
        run(`npx jscodeshift --ignore-pattern="**/node_modules/**" -t ${transformerPath} ${location} --extensions=tsx --parser=tsx`);
    }
    if (fileTypeChoices.includes('js')) {
        console.log(`Starting code transformations at ${location} for js files`)
        run(`npx jscodeshift --ignore-pattern="**/node_modules/**" -t ${transformerPath} ${location} --extensions=js`);
    }
    
    // Step 2: Handle packages
    const installed = getInstalledDytePackages();
    
    // Could be cdn installs or some other way of injecting packages so not treating this
    // as a failure
    if (installed.length === 0) {
        console.log('✅ No Dyte packages found — skipping package install/removal.');
        process.exit(0);
    }
    
    // Remove existing Dyte packages
    run(`${packageManager} remove ${installed.join(' ')}`);
    
    // Install corresponding RealtimeKit packages
    const replacements = installed.map(dytePkg => PACKAGE_MAP[dytePkg]);
    run(`${packageManager} install ${replacements.join('@staging ')}@staging`);
}