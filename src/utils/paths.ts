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

function pathToProject(packageDefs: PackageDefs, projectName: string) {
  const project = packageDefs[projectName]
  if (project && project.projectPath) return project.projectPath
  return resolve(process.cwd(), projectName)
}

export function pathToProjectPackageJson(packageDefs: PackageDefs, projectName: string) {
  const packageJsonFolder = pathToProject(packageDefs, projectName)
  return resolve(packageJsonFolder, 'package.json')
}

export function pathToProjectPackageLockJson(packageDefs: PackageDefs, projectName: string) {
  const packageJsonFolder = pathToProject(packageDefs, projectName)
  return resolve(packageJsonFolder, 'package-lock.json')
}