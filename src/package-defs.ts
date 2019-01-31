import { PackageDefs } from './types/package-defs'
import { pathToPackageDefs } from './utils'
import { existsSync, writeFile } from 'fs'
import { promisify } from 'util'

const write = promisify(writeFile)

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

export async function writePackageDefs(packageDefs: PackageDefs) {
  const packageDefsPath = pathToPackageDefs()
  await write(packageDefsPath, JSON.stringify(packageDefs, null, 2))
  return packageDefs
}