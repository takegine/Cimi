#!/usr/bin/env node

import { program } from 'commander'
import { version } from '../package.json'
import qpub from '.'

program
  .name('qpub')
  .version(version, '-v, --version')
  .option('-B --beta', 'publish your new npm package with beta', false)
  .option('-patch', 'patch your new npm package with beta', true)
  .option('-minor', 'minor your new npm package with beta', false)
  .option('-major', 'major your new npm package with beta', false)
  .option('-branch [master]', 'pull this branch', 'master')
  .action(qpub)
  .parse(process.argv)