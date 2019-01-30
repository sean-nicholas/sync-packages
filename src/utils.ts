import { join } from 'path'
import { PackageDefs } from './types/package-defs'

export function orderObject(unordered) {
  const ordered = {}
  Object.keys(unordered).sort().forEach((key) => {
    ordered[key] = unordered[key]
  })
  return ordered
}

export function pathToPackageDefs() {
  return join(process.cwd(), 'package-defs.json')
}

export function pathToRootPackageJson() {
  return join(process.cwd(), 'package.json')
}

export function pathToRootPackageLockJson() {
  return join(process.cwd(), 'package-lock.json')
}

function pathToProject(projectName, packageDefs: PackageDefs) {
  const project = packageDefs[projectName]
  if (project && project.projectPath) return project.projectPath
  return join(process.cwd(), projectName)
}

export function pathToProjectPackageJson(projectName, packageDefs: PackageDefs) {
  const packageJsonFolder = pathToProject(projectName, packageDefs)
  return join(packageJsonFolder, 'package.json')
}

export function pathToProjectPackageLockJson(projectName, packageDefs: PackageDefs) {
  const packageJsonFolder = pathToProject(projectName, packageDefs)
  return join(packageJsonFolder, 'package-lock.json')
}