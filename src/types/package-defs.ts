export interface PackageDefs {
  [projectName: string]: {
    // TODO:
    uses?: string[]
    // TODO:
    packageJsonPath?: string
    // TODO:
    sync?: boolean
    dependencies?: {
      [packageName: string]: string
    }[]
    devDependencies?: {
      [packageName: string]: string
    }[]
  }
}