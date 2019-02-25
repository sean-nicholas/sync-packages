#!/usr/bin/env node
import * as program from 'commander'
import { install, installToProject, installAll } from './install'
import { loadPackageDefs } from './utils/package-defs-io'
import { printSame } from './find-same'
import { init } from './init'
import { syncPackageDefsToRoot, syncPackageDefsToAllProjects } from './sync-package-defs'
import { syncPackageLockToAllProjects } from './sync-package-lock'

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
  .action(async () => {
    const packageDefs = loadPackageDefs()

    await syncPackageDefsToRoot(packageDefs)
    await install()
    await Promise.all([
      syncPackageDefsToAllProjects(packageDefs),
      syncPackageLockToAllProjects(packageDefs)
    ])
  })

program
  .command('find-same')
  .description('searches for common packages in all projects')
  .action(async () => {
    printSame()
  })

program.parse(process.argv)