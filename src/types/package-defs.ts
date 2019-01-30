export interface PackageDefs {
  [projectName: string]: {
    uses?: string[]
    projectPath?: string
    sync?: boolean
    dependencies?: {
      [packageName: string]: string
    }[]
    devDependencies?: {
      [packageName: string]: string
    }[]
  }
}