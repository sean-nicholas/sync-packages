import { spawn } from 'child_process'
import { writeFile } from 'fs'
import { promisify } from 'util'
import { loadPackageDefs } from './package-defs'
import { syncPackageDefs } from './sync'

const write = promisify(writeFile)

function extractPackageNameFromCommands(commands: string[]) {
  for (const command of commands) {
    if (!command.startsWith('--')) return command
  }
}

function getNewInstalledPackageInfo(commands: string[]) {
  const packageName = extractPackageNameFromCommands(commands)
  const packageJson = require('./package.json')
  const depPlaces = {
    'dependencies': packageJson.dependencies,
    'devDependencies': packageJson.devDependencies
  }

  for (const [depName, dependencies] of Object.entries(depPlaces)) {
    for (const [name, version] of Object.entries(dependencies)) {
      if (name === packageName) return { depName, packageName, version }
    }
  }
}

export async function addToPackageDefs(projectName, commands) {
  const packageDefsPath = './package-defs.json'
  const { depName, packageName, version } = getNewInstalledPackageInfo(commands)
  const packageDefs = loadPackageDefs()

  packageDefs[projectName] = packageDefs[projectName] || {}
  packageDefs[projectName][depName] = packageDefs[projectName][depName] || {}
  packageDefs[projectName][depName][packageName] = version

  await write(packageDefsPath, JSON.stringify(packageDefs, null, 2))
  return packageDefs
}

export function install(commands = []) {
  return new Promise((res, rej) => {
    const npmInstall = spawn('npm', ['install', ...commands])

    npmInstall.stdout.on('data', (data) => {
      console.log(data.toString())
    })

    npmInstall.stderr.on('data', (data) => {
      console.log(data.toString())
    })

    npmInstall.on('exit', (code) => {
      if (code === 0) return res()
      console.log('child process exited with code ' + code.toString())
      rej(code)
    })
  })
}

export async function installToProject(projectName, commands) {
  await install(commands)
  const packageDefs = await addToPackageDefs(projectName, commands)
  await syncPackageDefs(projectName, packageDefs)
}