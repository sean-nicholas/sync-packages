import { spawn } from 'child_process'
import { loadPackageDefs, writePackageDefs } from './utils/package-defs-io'
import { pathToRootPackageJson } from './utils/paths'
import { syncPackageDefsToAllProjects, syncPackageDefsToRoot } from './utils/sync-package-defs'
import { syncPackageLockToAllProjects } from './utils/sync-package-lock'

function extractPackageNameFromCommands(commands: string[]) {
  let packageInfo: string
  for (const command of commands) {
    if (!command.startsWith('--')) {
      packageInfo = command
      break
    }
  }
  // If package is installed with a version (package@1.0.4) the version must be removed
  const matches = packageInfo.match(/^(.*)\@[0-9\.]*/)
  if (matches) return matches[1]

  // No version seems to be appended
  return packageInfo
}

function getNewInstalledPackageInfo(commands: string[]) {
  const packageName = extractPackageNameFromCommands(commands)
  const packageJson = require(pathToRootPackageJson())
  const depPlaces = {
    'dependencies': packageJson.dependencies,
    'devDependencies': packageJson.devDependencies
  }

  for (const [depName, dependencies] of Object.entries(depPlaces)) {
    for (const [name, version] of Object.entries(dependencies)) {
      if (name === packageName) return { depName, packageName, version }
    }
  }

  throw new Error(`Can't find package ${packageName} in root package.json`)
}

async function addToPackageDefs(projectName, commands) {
  const { depName, packageName, version } = getNewInstalledPackageInfo(commands)
  const packageDefs = loadPackageDefs({ withDefaults: false })

  packageDefs[projectName] = packageDefs[projectName] || {}
  packageDefs[projectName][depName] = packageDefs[projectName][depName] || {}
  packageDefs[projectName][depName][packageName] = version

  return writePackageDefs(packageDefs)
}

export function npmInstall(commands = []) {
  return new Promise((res, rej) => {
    const npmProcess = spawn('npm', ['install', ...commands])

    npmProcess.stdout.on('data', (data) => {
      console.log(data.toString())
    })

    npmProcess.stderr.on('data', (data) => {
      console.log(data.toString())
    })

    npmProcess.on('exit', (code) => {
      if (code === 0) return res()
      console.log('child process exited with code ' + code.toString())
      rej(code)
    })
  })
}

export async function installToProject(projectName: string, commands: string[]) {
  await npmInstall(commands)
  const packageDefs = await addToPackageDefs(projectName, commands)
  await Promise.all([
    syncPackageDefsToAllProjects(packageDefs),
    syncPackageLockToAllProjects(packageDefs),
  ])
}

export async function installAll() {
  const packageDefs = loadPackageDefs()
  await syncPackageDefsToRoot(packageDefs)
  await npmInstall()
  await Promise.all([
    syncPackageDefsToAllProjects(packageDefs),
    syncPackageLockToAllProjects(packageDefs),
  ])
}