import { execSync } from 'child_process';
import path from 'path';
import fs from 'fs';
import inquirer from 'inquirer';
import removeAllDeprecatedProperties from './transforms/update-deprecated-properties/update-deprecated';

export default async function transform(location: string = '.') {
    
    let packageManager: string = 'npm'
    const packageManagerChoices = ['npm', 'yarn', 'pnpm', 'bun']
    
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

    let tsconfigLocation = './tsconfig.json'
    try {
        const answer = await inquirer
        .prompt([
            {
                type: 'input',
                name: 'tsconfigLocation',
                message: 'Where is your tsconfig located? (assumes ./tsconfig.json by default)',
                default: './tsconfig.json',
            },        
        ])
        tsconfigLocation = answer.tsconfigLocation;
    } catch(error) {   
        if (error.isTtyError) {
            console.warn(`Prompt couldn't be rendered in the current environment, using ${packageManager} package manager by default`)
        } else {
            // Something else went wrong
            console.error(`Something went wrong, using ${packageManager} package manager by default`);
        }
    };

    // Check if tsconfig exists
    if (!fs.existsSync(tsconfigLocation)) {
      console.warn(`Warning: tsconfig file not found at ${tsconfigLocation}, using default ./tsconfig.json`);
      tsconfigLocation = './tsconfig.json';
      
      // Double check if the default exists
      if (!fs.existsSync(tsconfigLocation)) {
        console.error(`Error: No tsconfig.json found. Please create a tsconfig.json file.`);
        process.exit(1);
      }
    }
    
    // try {
    //     const answer = await inquirer
    //     .prompt([
    //         {
    //             type: 'list',
    //             name: 'fileType',
    //             message: 'Which files to run the transformation for?',
    //             choices: ['ts/tsx', 'js', 'ts/tsx/js'],
    //             default: 'ts/tsx',
    //         },        
    //     ])
    //     fileType = answer.fileType;
    // } catch(error) {   
    //     if (error.isTtyError) {
    //         console.warn(`Prompt couldn't be rendered in the current environment, transforming ${fileType} file types by default`)
    //     } else {
    //         // Something else went wrong
    //         console.error(`Something went wrong, transforming ${fileType} file types by default`);
    //     }
    // };
    
    // if (!fileTypeChoices.includes(fileType)) throw Error(`Invalid package manager type ${fileType}`)
    
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
    const transformerPath = path.join(__dirname, './transforms/update-imports/dyte-to-rtk.js');
    
    console.log(`Starting porting from dyte sdk to cloudflare at ${location} for ts files`)
    run(`npx jscodeshift --ignore-pattern="**/node_modules/**" -t ${transformerPath} ${location} --extensions=ts --parser=ts`);
    console.log(`Starting porting from dyte sdk to cloudflare at ${location} for tsx files`)
    run(`npx jscodeshift --ignore-pattern="**/node_modules/**" -t ${transformerPath} ${location} --extensions=tsx --parser=tsx`);
    
    console.log(`Starting updation of deprecated properties at ${location} for ts & tsx files`)
    await removeAllDeprecatedProperties(tsconfigLocation);
    
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
    run(`${packageManager} install ${replacements.join(' ')}`);
}