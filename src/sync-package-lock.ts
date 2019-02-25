import { pathToProjectPackageLockJson, pathToRootPackageLockJson } from './utils/paths'
import { promisify } from 'util'
import { writeFile, readFile } from 'fs'
import { PackageDefs } from './types/package-defs'

const write = promisify(writeFile)
const read = promisify(readFile)

/**
 * Sync root package-lock.json to project
 */
export async function syncPackageLockToProject(packageDefs: PackageDefs, projectName: string) {
  const localePackageLockPath = pathToProjectPackageLockJson(packageDefs, projectName)
  const packageLock = await read(pathToRootPackageLockJson())
  await write(localePackageLockPath, packageLock)
}

export async function syncPackageLockToAllProjects(packageDefs: PackageDefs) {
  return Promise.all(Object.keys(packageDefs).map(projectName => syncPackageLockToProject(packageDefs, projectName)))
}