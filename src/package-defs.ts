import { PackageDefs } from './types/package-defs'
import { pathToPackageDefs } from './utils'
import { existsSync } from 'fs'

export function loadPackageDefs({ withDefaults = true } = {}) {
  const packageDefsPath = pathToPackageDefs()

  let packageDefs: PackageDefs
  if (existsSync(packageDefsPath)) {
    packageDefs = require(packageDefsPath)
  } else {
    packageDefs = {}
  }

  if (withDefaults) {
    if (packageDefs.$schema) delete packageDefs.$schema

    for (const project of Object.values(packageDefs)) {
      if (project.sync === undefined) project.sync = true
    }
  }


  return packageDefs
}