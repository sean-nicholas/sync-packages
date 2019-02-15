#!/usr/bin/env node
import * as program from 'commander'
import { install, installToProject } from './install'
import { syncPackageDefs, syncToRootPackageJson } from './sync'
import { loadPackageDefs } from './package-defs'
import { findSame, printSame } from './find-same'
import { init } from './init'

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
  .action(async (projectName, commands) => {
    await installToProject(projectName, commands)
  })

program
  .command('install-all')
  .description('installs dependencies from all projects into root folder')
  .action(async () => {
    await syncToRootPackageJson()
    await install()
    // TODO: Sync package-lock.json's
  })

program
  .command('sync')
  .description('updates the package.json of all projects with the dependencies defined in package-defs.json')
  .action(async () => {
    const packageDefs = loadPackageDefs()
    await Promise.all([
      // TODO: npm install before syncing package-lock.json
      syncToRootPackageJson(),
      syncPackageDefs(null, packageDefs)
    ])
  })

program
  .command('find-same')
  .description('searches for common packages in all projects')
  .action(async () => {
    printSame()
  })

program.parse(process.argv)