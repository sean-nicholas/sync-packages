import { PackageDefs } from './types/package-defs'

export function loadPackageDefs() {
  const packageDefsPath = './package-defs.json'

  let packageDefs: PackageDefs
  try {
    packageDefs = require(packageDefsPath)
  } catch (error) {
    packageDefs = {}
  }

  return packageDefs
}