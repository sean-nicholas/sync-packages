#!/usr/bin/env node
import * as program from 'commander'
import { installToProject, installAll } from './install'
import { printSame } from './find-same'
import { init } from './init'
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
  .command('find-same')
  .description('searches for common packages in all projects')
  .action(async () => {
    printSame()
  })

program.parse(process.argv)