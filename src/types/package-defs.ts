export interface PackageDefs {
  [projectName: string]: {
    uses?: string[]
    // TODO: Add
    // packageJsonPath?: string
    sync?: boolean
    dependencies?: {
      [packageName: string]: string
    }[]
    devDependencies?: {
      [packageName: string]: string
    }[]
  }
}