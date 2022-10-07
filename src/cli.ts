#!/usr/bin/env node

import { program } from 'commander'
import { version } from '../package.json'
import chalk from 'chalk'
import cimi from '.'

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
    console.log(`    ${green('$')} cimi patch [branch] (default: master)`)
    console.log(`    ${green('$')} cimi minor [branch] (default: master)`)
    console.log(`    ${green('$')} cimi major [branch] (default: master)`)
    console.log(`    ${green('$')} cimi patchBeta [branch] (default: master)`)
    console.log(`    ${green('$')} cimi minorBeta [branch] (default: master)`)
    console.log(`    ${green('$')} cimi majorBeta [branch] (default: master)`)
    console.log('')
  })
  .parse(process.argv)

cimi(program).catch((err) => {
  console.error(`${red(err)}`)
  process.exit(1)
})
