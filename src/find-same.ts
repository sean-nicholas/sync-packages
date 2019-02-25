import { loadPackageDefs } from './utils/package-defs-io'
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
      && (allDep.projectName !== dep.projectName)
  }))

  return _(duplicates)
    .sortBy(dup => dup.packageName)
    .groupBy(dup => dup.packageName)
    .mapValues(dups => dups.map(dup => dup.projectName))
    .value()
}

export function printSame() {
  const packages = findSame()

  for (const [packageName, projects] of Object.entries(packages)) {
    console.log(packageName)
    for (const project of projects) {
      console.log(`\t${project}`)
    }
  }
}