import { promisify } from 'util'
import { writeFile, readFile } from 'fs'
import { orderObject } from './order-object'

const write = promisify(writeFile)
const read = promisify(readFile)

export async function saveDependencies({ path, packageJson, dependencies, devDependencies }) {
  packageJson.dependencies = orderObject(dependencies)
  packageJson.devDependencies = orderObject(devDependencies)
  await write(path, JSON.stringify(packageJson, null, 2))
}