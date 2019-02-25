import { resolve } from 'path'
import { PackageDefs } from '../types/package-defs'


export function pathToPackageDefs() {
  return resolve(process.cwd(), 'package-defs.json')
}

export function pathToRootPackageJson() {
  return resolve(process.cwd(), 'package.json')
}

export function pathToRootPackageLockJson() {
  return resolve(process.cwd(), 'package-lock.json')
}

function pathToProject(projectName, packageDefs: PackageDefs) {
  const project = packageDefs[projectName]
  if (project && project.projectPath) return project.projectPath
  return resolve(process.cwd(), projectName)
}

export function pathToProjectPackageJson(projectName, packageDefs: PackageDefs) {
  const packageJsonFolder = pathToProject(projectName, packageDefs)
  return resolve(packageJsonFolder, 'package.json')
}

export function pathToProjectPackageLockJson(projectName, packageDefs: PackageDefs) {
  const packageJsonFolder = pathToProject(projectName, packageDefs)
  return resolve(packageJsonFolder, 'package-lock.json')
}