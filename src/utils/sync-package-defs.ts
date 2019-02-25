import * as _ from 'lodash'
import { PackageDefs } from '../types/package-defs'
import { pathToProjectPackageJson, pathToRootPackageJson } from './paths'
import { saveDependencies } from './save-dependencies'

function getAllDependencies(packageDefs: PackageDefs, projectNames: string[]) {
  const depList = _.map(projectNames, name => (packageDefs[name] || {}).dependencies)
  const devDepList = _.map(projectNames, name => (packageDefs[name] || {}).devDependencies)

  const dependencies = Object.assign({}, ..._.filter(depList, el => el))
  const devDependencies = Object.assign({}, ..._.filter(devDepList, el => el))

  return {
    dependencies,
    devDependencies
  }
}

export async function syncPackageDefsToProject(packageDefs: PackageDefs, projectName) {
  const project = packageDefs[projectName]

  if (!project.sync) return

  const packageJsonPath = pathToProjectPackageJson(packageDefs, projectName)
  const packageJson = require(packageJsonPath)

  await saveDependencies({
    path: packageJsonPath,
    packageJson,
    ...getAllDependencies(packageDefs, [projectName, project.uses])
  })
}

export async function syncPackageDefsToAllProjects(packageDefs: PackageDefs) {
  return Promise.all(Object.keys(packageDefs).map(projectName => syncPackageDefsToProject(packageDefs, projectName)))
}

export async function syncPackageDefsToRoot(packageDefs: PackageDefs) {
  const packageJsonPath = pathToRootPackageJson()
  const packageJson = require(packageJsonPath)

  await saveDependencies({
    path: packageJsonPath,
    packageJson,
    ...getAllDependencies(packageDefs, Object.keys(packageDefs))
  })
}