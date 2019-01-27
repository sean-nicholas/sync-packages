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

  for (const project of Object.values(packageDefs)) {
    if (project.sync === undefined) project.sync = true
  }

  return packageDefs
}