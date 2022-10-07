import { readFileSync, writeFileSync } from 'fs'
import { resolve } from 'path'
import chalk from 'chalk'
import { exec } from 'child_process';

declare interface optionType {
  Patch: boolean,
  Minor: boolean,
  Major: boolean,
  beta: boolean,
  Branch: string
}

const enum changeType {
  patch = 'patch',
  minor = 'minor',
  major = 'major',
}

const msg = console.info;
const { cyan, green, red } = chalk;
const package_path = resolve(process.cwd(), 'package.json');

export default async (options: optionType, cmd:any) => {
  let state: changeType
  switch (true) {
    case options.Major:
      state = changeType.major
      break;
    case options.Minor:
      state = changeType.minor
      break;
    case options.Patch: default:
      state = changeType.patch
      break;
  }

  // msg(options)
  let branch = options.Branch
  let packageJson = getPackage()
  msg(green(`Start to ${state} version to ${packageJson.name}...`))

  try {
    bar('[ 1 / 4 ]', 'Update package.json')
    let version = updateVersion(packageJson, state, options.beta)
    bar('[ 2 / 4 ]', `Commit and push to ${branch} branch`)
    await step([
      'git add .',
      `git commit -m "${state} version to ${version}"`,
      `git push origin ${branch}`,
    ])
    bar('[ 3 / 4 ]', `Tag and push tag to ${branch}`)
    await step([
      `git tag ${version}`,
      `git push origin ${version}`,
    ])
    bar('[ 4 / 4 ]', 'Publish to NPM')
    await step([
      `npm publish ${cmd['accessPublic'] ? '--access=public' : ''}`,
    ])
  } catch (error) {
    msg(`\n${red('[ qpub ]')} Release ${packageJson.name} Fail!\n`)
    console.error(error)
    process.exit(1);
  }

  msg(`\n${red('[ qpub ]')} Release ${packageJson.name} Success!\n`)
}

function getPackage() {
  let packageStr = readFileSync(package_path, 'utf8')
  return JSON.parse(packageStr)
}

function updateVersion(packageJson:any,state:changeType, beta:boolean) {
  let { version: oldVer } = packageJson;

  let [major, minor, patch ] = oldVer.split(/[\-|\.]/g)
  let newVer:string
  switch (state) {
    case changeType.major:
      newVer = `${+major+1}.0.0`
      break;
    case changeType.minor:
      newVer = `${+major}.${+minor+1}.0`
      break;
    case changeType.patch: default:
      newVer = `${+major}.${+minor}.${+patch + 1}`
      break;
  }
  if(beta)
    newVer += '-beta'

  packageJson.version = newVer

  bar('\nVersion: ', `${oldVer} -> ${newVer}`)
  writeFileSync(package_path, JSON.stringify(packageJson, null, '  '))
  // msg(green('\nUpdate package.json success!'))
  return newVer
}

async function step(commands: string[]) {
  return new Promise((resolve, reject) => {
    const childExec = exec(
      commands.join(' && '),
      { maxBuffer: 10000 * 10240 },
      (err, stdout, stderr) => {
        msg(err, stdout, stderr)
        if (err)
          reject(err) 
        else
          resolve('')
      }
    )
    childExec.stdout?.pipe(process.stdout)
    childExec.stderr?.pipe(process.stderr)
  })
}

function bar(Progress:string, desc:string) {
  msg(`  ${green(Progress)} ${cyan(desc)}`)
}