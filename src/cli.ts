#!/usr/bin/env node

import { program } from 'commander'
import { version } from '../package.json'
import chalk from 'chalk'
import qpub from '.'

const { green, red } = chalk

program
  .version(version, '-v, --version')
  .option('patch', 'patch your new npm package')
  .option('minor', 'minor your new npm package')
  .option('major', 'major your new npm package')
  .option('patchBeta', 'patch your new beta npm package')
  .option('minorBeta', 'minor your new beta npm package')
  .option('majorBeta', 'major your new beta npm package')
  .on('--help', () => {
    console.log('\n  Tip:\n')
    console.log(
      '    You should run this script in the root directory of you project or run by npm scripts.'
    )
    console.log('\n  Examples:\n')
    console.log(`    ${green('$')} qpub patch [branch] (default: master)`)
    console.log(`    ${green('$')} qpub minor [branch] (default: master)`)
    console.log(`    ${green('$')} qpub major [branch] (default: master)`)
    console.log(`    ${green('$')} qpub patchBeta [branch] (default: master)`)
    console.log(`    ${green('$')} qpub minorBeta [branch] (default: master)`)
    console.log(`    ${green('$')} qpub majorBeta [branch] (default: master)`)
    console.log('')
  })
  .parse(process.argv)

qpub(program).catch((err) => {
  console.error(`${red(err)}`)
  process.exit(1)
})
