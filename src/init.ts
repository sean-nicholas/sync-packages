import { loadPackageDefs, writePackageDefs } from './utils/package-defs'
import { join, relative } from 'path'

export function init() {
  const packageDefs: any = loadPackageDefs({ withDefaults: false })
  const schemaFullPath = join(__dirname, 'package-defs.json')
  packageDefs.$schema = relative(process.cwd(), schemaFullPath)
  writePackageDefs(packageDefs)
}