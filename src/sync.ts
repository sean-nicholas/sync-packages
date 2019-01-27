import { orderObject, pathToProjectPackageJson, pathToRootPackageJson } from './utils'
import { writeFile } from 'fs'
import { promisify } from 'util'
import { loadPackageDefs } from './package-defs'

const write = promisify(writeFile)

export async function syncProject(projectName, packageDefs) {
  // Shared does not have a local package.json
  if (projectName === 'shared') return

  const packageJsonPath = pathToProjectPackageJson(projectName)
  const packageJson = require(packageJsonPath)
  const dependencies = packageDefs[projectName].dependencies || {}
  const devDependencies = packageDefs[projectName].devDependencies || {}

  // Add shared dependencies
  if (packageDefs.shared) {
    if (packageDefs.shared.dependencies) Object.assign(dependencies, packageDefs.shared.dependencies)
    if (packageDefs.shared.devDependencies) Object.assign(devDependencies, packageDefs.shared.devDependencies)
  }

  packageJson.dependencies = orderObject(dependencies)
  packageJson.devDependencies = orderObject(devDependencies)
  await write(packageJsonPath, JSON.stringify(packageJson, null, 2))

  // TODO: Check if this works with npm ci install
  // const localePackageLockPath = `./${projectName}/package-lock.json`
  // const packageLock = await read('./package-lock.json')
  // await write(localePackageLockPath, packageLock)
}


export async function syncAllProjects(packageDefs) {
  return Promise.all(Object.keys(packageDefs).map(projectName => syncProject(projectName, packageDefs)))
}

export async function syncToRootPackageJson() {
  const packageJsonPath = pathToRootPackageJson()
  const packageJson = require(packageJsonPath)
  const packageDefs = loadPackageDefs()
  const dependencies = {}
  const devDependencies = {}
  for (const project of Object.values(packageDefs)) {
    Object.assign(dependencies, (project as any).dependencies)
    Object.assign(devDependencies, (project as any).devDependencies)
  }
  packageJson.dependencies = orderObject(dependencies)
  packageJson.devDependencies = orderObject(devDependencies)
  await write(packageJsonPath, JSON.stringify(packageJson, null, 2))
}

export async function syncPackageDefs(projectName, packageDefs) {
  if (!projectName) return syncAllProjects(packageDefs)
  return syncProject(projectName, packageDefs)
}