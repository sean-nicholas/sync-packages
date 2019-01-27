import { orderObject, pathToProjectPackageJson, pathToRootPackageJson, pathToProjectPackageLockJson } from './utils'
import { writeFile, readFile } from 'fs'
import { promisify } from 'util'
import { loadPackageDefs } from './package-defs'
import { PackageDefs } from './types/package-defs'

const write = promisify(writeFile)
const read = promisify(readFile)

async function saveDependencies({ path, packageJson, dependencies, devDependencies }) {
  packageJson.dependencies = orderObject(dependencies)
  packageJson.devDependencies = orderObject(devDependencies)
  await write(path, JSON.stringify(packageJson, null, 2))
}

function addDependencies(dependencies, dependenciesToAdd) {
  if (!dependenciesToAdd) return dependencies
  return Object.assign({}, dependencies, dependenciesToAdd)
}

export async function syncProject(projectName, packageDefs: PackageDefs) {
  const project = packageDefs[projectName]

  if (!project.sync) return

  const packageJsonPath = pathToProjectPackageJson(projectName)
  const packageJson = require(packageJsonPath)
  let dependencies = project.dependencies || {}
  let devDependencies = project.devDependencies || {}

  // Add dependencies from other projects in project.uses
  if (project.uses) {
    for (const usedProjectName of project.uses) {
      const usedProject = packageDefs[usedProjectName]
      dependencies = addDependencies(dependencies, usedProject.dependencies)
      devDependencies = addDependencies(devDependencies, usedProject.devDependencies)
    }
  }

  await saveDependencies({
    path: packageJsonPath,
    packageJson,
    dependencies,
    devDependencies
  })

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

  let dependencies = {}
  let devDependencies = {}
  for (const project of Object.values(packageDefs)) {
    dependencies = addDependencies(dependencies, project.dependencies)
    devDependencies = addDependencies(devDependencies, project.devDependencies)
  }

  await saveDependencies({
    path: packageJsonPath,
    packageJson,
    dependencies,
    devDependencies
  })
}

export async function syncPackageDefs(projectName, packageDefs) {
  if (!projectName) return syncAllProjects(packageDefs)
  return syncProject(projectName, packageDefs)
}