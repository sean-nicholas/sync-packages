import { PackageDefs } from './types/package-defs'
import { pathToPackageDefs } from './utils'

export function loadPackageDefs() {
  const packageDefsPath = pathToPackageDefs()

  let packageDefs: PackageDefs
  try {
    packageDefs = require(packageDefsPath)
  } catch (error) {
    packageDefs = {}
  }

  return packageDefs
}