import { join } from 'path'

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

export function pathToProjectPackageJson(projectName) {
  return join(process.cwd(), projectName, 'package.json')
}