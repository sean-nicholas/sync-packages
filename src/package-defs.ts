import { PackageDefs } from './types/package-defs'
import { pathToPackageDefs } from './utils'

export function loadPackageDefs() {
  const packageDefsPath = pathToPackageDefs()

  let packageDefs: PackageDefs
  try {
    packageDefs = require(packageDefsPath)
  } catch (error) {
    // TODO: Better error handling. Maybe package-defs.json exists but is not readable
    packageDefs = {}
  }

  for (const project of Object.values(packageDefs)) {
    if (project.sync === undefined) project.sync = true
  }

  return packageDefs
}