#!/usr/bin/env node
import * as program from 'commander'
import { install, installToProject, installAll } from './install'
import { loadPackageDefs } from './utils/package-defs-io'
import { printSame } from './find-same'
import { init } from './init'
import { syncPackageDefsToRoot, syncPackageDefsToAllProjects } from './utils/sync-package-defs'
import { syncPackageLockToAllProjects } from './utils/sync-package-lock'
import { sync } from './sync'

const ownPackageJson = require('../package.json')

program
  .version(ownPackageJson.version)

program
  .command('init')
  .description('initializes package-defs.json')
  .action(() => {
    init()
  })

program
  .command('install <project> <npmParams...>')
  .description('install dependencies to project')
  .action((projectName, commands) => {
    installToProject(projectName, commands)
  })

program
  .command('install-all')
  .description('installs dependencies from all projects into root folder')
  .action(() => {
    installAll()
  })

program
  .command('sync')
  .description('updates the package.json of all projects with the dependencies defined in package-defs.json')
  .action(() => {
    sync()
  })

program
  .command('find-same')
  .description('searches for common packages in all projects')
  .action(async () => {
    printSame()
  })

program.parse(process.argv)