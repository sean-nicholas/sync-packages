export interface PackageDefs {
  [projectName: string]: {
    uses?: string[]
    packageJsonPath?: string
    sync?: boolean
    dependencies?: {
      [packageName: string]: string
    }[]
    devDependencies?: {
      [packageName: string]: string
    }[]
  }
}