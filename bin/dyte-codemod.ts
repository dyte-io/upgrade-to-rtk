#!/usr/bin/env node
import { Command } from 'commander'
import transform from './transform'

const packageJson = require('../package.json')

const program = new Command(packageJson.name)
  .description('Codemods for migrating from Dyte SDKs to Cloudflare RealtimeKit')
  .version(
    packageJson.version,
    '-v, --version',
    `Output the current version of ${packageJson.name}.`
  )
  .argument(
    '[location]',
    'Where to run the transform, assumes . by default'
  )
  .usage('[location]')
  .helpOption('-h, --help', 'Display this help message.')
  .action(transform)

program.parse(process.argv)

  