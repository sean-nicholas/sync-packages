import { orderObject, pathToProjectPackageJson, pathToRootPackageJson, pathToProjectPackageLockJson } from './utils'
import { writeFile, readFile } from 'fs'
import { promisify } from 'util'
import { loadPackageDefs } from './package-defs'
import { PackageDefs } from './types/package-defs'

const write = promisify(writeFile)
const read = promisify(readFile)

export async function syncProject(projectName, packageDefs: PackageDefs) {
  const project = packageDefs[projectName]

  if (!project.sync) return

  const packageJsonPath = pathToProjectPackageJson(projectName)
  const packageJson = require(packageJsonPath)
  const dependencies = packageDefs[projectName].dependencies || {}
  const devDependencies = packageDefs[projectName].devDependencies || {}

  // Add dependencies from other projects in project.uses
  if (project.uses) {
    for (const usedProjectName of project.uses) {
      const usedProject = packageDefs[usedProjectName]
      if (usedProject.dependencies) Object.assign(dependencies, usedProject.dependencies)
      if (usedProject.devDependencies) Object.assign(devDependencies, usedProject.devDependencies)
    }
  }

  packageJson.dependencies = orderObject(dependencies)
  packageJson.devDependencies = orderObject(devDependencies)
  await write(packageJsonPath, JSON.stringify(packageJson, null, 2))

  // Sync root package-lock.json to projects
  const localePackageLockPath = pathToProjectPackageLockJson(projectName)
  const packageLock = await read(pathToRootPackageJson())
  await write(localePackageLockPath, packageLock)
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