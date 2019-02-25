import { loadPackageDefs } from './utils/package-defs-io'
import { syncPackageDefsToRoot, syncPackageDefsToAllProjects } from './utils/sync-package-defs'
import { install } from './install'
import { syncPackageLockToAllProjects } from './utils/sync-package-lock'

export async function sync() {
  const packageDefs = loadPackageDefs()

  await syncPackageDefsToRoot(packageDefs)
  await install()
  await Promise.all([
    syncPackageDefsToAllProjects(packageDefs),
    syncPackageLockToAllProjects(packageDefs)
  ])
}