[![npm](https://img.shields.io/npm/v/qpub.svg)](https://www.npmjs.com/package/qpub)
[![npm](https://img.shields.io/npm/l/qpub.svg)](https://www.npmjs.com/package/qpub)

# qpub
`quick-publish`一款全自动npm发包工具，一行命令帮助你git replase、创建git tag、发布npm包。

qpub自动生成新版本号，自动生成commit message，创建tag，push到github，最后发布到npm中，整个过程只需要一行命令，解放你的双手！

改自`fengxin`的`cimi`

## 使用示例

![Screenshot](./.github/demo.jpg)

## qpub有什么优势？

当我们在开发组件库或者其他开源工具包时，我们发一个新的 NPM 包可能需要这些工作：

* 手动修改`package.json`中的`version`.
* `git add .`、`git commit -m "xxxx"`生成一个提交.
* `git push origin master` 推送到远端.
* 在github中打一个新`tag`.
* `npm publish`将代码提交到NPM.

听起来是不是很麻烦？而有了`qpub`，你只需要一行简单的代码:

`qpub patch master`

就可以完成上面所有事情。

## qpub修改版本规则

`qpub`共有三种规则，来进行发包，其实也就是确定版本号。

* `qpub -patch` 更新一个小版本，如1.1.1 -> 1.1.2，如bug修复;
* `qpub -minor` 更新一个中版本，如1.1.1 -> 1.2.0，如新增功能;
* `qpub -major` 更新一个大版本，如1.1.1 -> 2.0.0，如重构架构;
### 参数 -B --beta
* `qpub -patch -B` 更新一个小的测试版本，如1.1.1 -> 1.1.2-beta，如bug修复;
* `qpub -minor --beta` 更新一个中的测试版本，如1.1.1 -> 1.2.0-beta，如新增功能;

### 参数 -branch
而分支默认为`master`，如果主分支为其他分支，应这样使用:
`qpub -patch -branch main`
`qpub -patch -branch beta`

## 使用

```bash
# 全局安装qpub
npm i qpub -g
# 本地安装qpub
npm i qpub -D
```

推荐使用pnpm安装。
```bash
# 全局安装qpub
pnpm i qpub -g
# 本地安装qpub
pnpm i qpub -D
```

以下是`qpub -h`的输出：

```
Usage: qpub [options]

Options:
  -v, --version     output the version number
  -B --beta         publish your new npm package with beta (default: false)
  -patch            patch your new npm package with beta (default: true)
  -minor            minor your new npm package with beta (default: false)
  -major            major your new npm package with beta (default: false)
  -branch [master]  pull this branch (default: "master")
  -h, --help        display help for command

```

## LICENSE

[MIT](./LICENSE) © fengxin
[MIT](./LICENSE) © 西索酱