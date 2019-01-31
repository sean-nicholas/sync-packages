import { loadPackageDefs, writePackageDefs } from './package-defs'
import { join, relative } from 'path'

export function init() {
  const packageDefs: any = loadPackageDefs()
  const schemaFullPath = join(__dirname, 'package-defs.json')
  packageDefs.$schema = relative(process.cwd(), schemaFullPath)
  writePackageDefs(packageDefs)
}