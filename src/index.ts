import { readFileSync, writeFileSync } from 'fs'
import { resolve } from 'path'
import chalk from 'chalk'

const { cyan, green, red } = chalk
export { cyan, green, red };
const _path = resolve(process.cwd(), 'package.json');
var projectVersion, projectName

export function getVersion(): {
  projectVersion: [number, number, number],
  projectName: string
} {
  const packageJson = JSON.parse(
    readFileSync(_path, 'utf8')
  )

  projectVersion = packageJson.version
  projectName = packageJson.name

  let [major, minor, patch] = projectVersion.split('.')
  if (patch.length > 2 && patch.includes('-beta')) {
    patch = patch.split('-')[0];
  }
  return {
    projectVersion: [major, minor, patch],
    projectName: packageJson.name,
  }
}

//写入新版本号，更新项目文件
export function writeNewVersion(newVersion: string) {
  const packageJson = readFileSync(_path, 'utf8')
  const newPackageJson = packageJson.replace(
    `"version": "${projectVersion}"`,
    `"version": "${newVersion}"`
  )
  writeFileSync(_path, newPackageJson)
  console.info(green('\nUpdate package.json success!'))
}

