import * as program from 'commander'
import { install, installToProject } from './install'
import { syncPackageDefs, syncToRootPackageJson } from './sync'
import { loadPackageDefs } from './package-defs'

const ownPackageJson = require('../package.json')

program
  .version(ownPackageJson.version)

program
  .command('install <project> <npmParams...>')
  .description('install dependencies to project')
  .action(async (projectName, commands) => {
    await installToProject(projectName, commands)
  })

program
  .command('install')
  .description('installs dependencies from all projects into root folder')
  .action(async () => {
    await syncToRootPackageJson()
    await install()
  })

program
  .command('sync')
  .description('updates the package.json of all projects with the dependencies defined in package-defs.json')
  .action(async () => {
    const packageDefs = loadPackageDefs()
    await Promise.all([
      syncToRootPackageJson(),
      syncPackageDefs('', packageDefs)
    ])
  })

program.parse(process.argv)