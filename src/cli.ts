#!/usr/bin/env node

import { program } from 'commander'
import { version } from '../package.json'
import { green, cyan, getVersion, writeNewVersion } from '.'
import { exec } from 'child_process'

const enum changeType {
  patch = 'patch', 
  minor = 'minor', 
  major = 'major',
}

const msg = console.info;
const { projectVersion, projectName } = getVersion()
var state: changeType
var branch: string
var [major, minor, patch] = projectVersion

program
  .name('qpub')
  .version(version, '-v, --version')
  .on('--help', () => {
    msg('\n  Tip:\n')
    msg('    You should run this script in the root directory of you project or run by npm scripts.')
    msg('\n  Examples:\n')
    msg(`    ${green('$')} qpub patch [branch] (default: master)`)
    msg(`    ${green('$')} qpub minor [branch] (default: master)`)
    msg(`    ${green('$')} qpub major [branch] (default: master)`)
    msg(`    ${green('$')} qpub patch -B [branch] (default: master)`)
    msg(`    ${green('$')} qpub minor -B [branch] (default: master)`)
    msg(`    ${green('$')} qpub major -B [branch] (default: master)`)
    msg('')
  })
  .parse(process.argv)
  .option('-B --beta', 'patch your new npm package with beta', false)
  .option('patch [branch]', 'patch your new npm package,branch default: master',a=>{
    state = changeType.patch
    patch += 1;
    return a
  }, 'master')
  .option('minor [branch]', 'minor your new npm package,branch default: master', a => {
    state = changeType.minor
    minor += 1;
    return a
  }, 'master')
  .option('major [branch]', 'major your new npm package,branch default: master', a => {
    state = changeType.major
    major += 1;
    return a
  }, 'master')
  .action(async (dir,cmd)=>{
    msg(state, branch ,dir, cmd)
    msg(green(`Start to ${state} version to ${projectName}...`))
    let newVersion = `${+major}.${+minor}.${+patch}${cmd.beta ? '-beta' : ''}`
    writeNewVersion(newVersion)
    msg(green(`\nVersion: ${cyan(`${projectVersion} -> ${newVersion}`)}`))
    msg(green(`${state} ${projectName} version to ${newVersion}`))
    await execShell(state,newVersion)
    msg(`\n${green('[ qpub ]')} Release ${projectName} Success!\n`)
  })

//执行整个流程的命令
function execShell(type: string, newVersion:string) {
  const echo1 = [
    '[ 1 / 3 ]',
    `Commit and push to ${branch} branch`
  ]
  const part1 = [
    'git add .',
    `git commit -m "${type} version to ${newVersion}"`,
    `git push origin ${branch}`,
  ]
  const echo2 = [
    '[ 2 / 3 ]',
    `Tag and push tag to ${branch}`
  ]

  const part2 = [
    `git tag ${newVersion}`,
    `git push origin ${newVersion}`,
  ]
  const echo3 = [
    '[ 3 / 3 ]',
    'Publish to NPM'
  ]
  const part3 = [
    `npm publish ${program['accessPublic'] ? '--access=public' : ''}`,
  ]
  return step(echo1, part1)
    .then(() => step(echo2, part2))
    .then(() => step(echo3, part3))
}

async function step(desc: string[], command: string[]) {
  msg(`${green(desc[0])} ${cyan(desc[1])}`)
  return new Promise((resolve, reject) => {
    const childExec = exec(
      command.join(' && '),
      { maxBuffer: 10000 * 10240 },
      (err, stdout, stderr) => {
        console.log(err, stdout, stderr)
        if (err) {
          reject(err)
          throw err
        } else {
          resolve('')
        }
      }
    )
    childExec.stdout?.pipe(process.stdout)
    childExec.stderr?.pipe(process.stderr)
  })
}