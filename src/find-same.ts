import { loadPackageDefs } from './package-defs'
import * as _ from 'lodash'

export function findSame() {
  const packageDefs = loadPackageDefs()

  const allDependencies = _(packageDefs)
    .map((project, projectName) => {
      const mapper = (val, packageName: string) => ({ packageName, projectName })
      return [
        ..._.map(project.dependencies, mapper),
        ..._.map(project.devDependencies, mapper)
      ]
    })
    .flatten()
    .value()

  const duplicates = allDependencies.filter(dep => _.find(allDependencies, allDep => {
    return (allDep.packageName === dep.packageName)
      && (allDep.packageName !== dep.projectName)
  }))

  console.log('duplicates', duplicates)
}