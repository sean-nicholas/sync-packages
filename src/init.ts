import { loadPackageDefs, writePackageDefs } from './package-defs'

export function init() {
  const packageDefs = loadPackageDefs()
  writePackageDefs(packageDefs)
}