---
id: yarn-v2-monorepo
title: Yarn v2 Monorepo
sidebar_label: Yarn v2 Monorepo
---

This is a short guide on how to set up a new monorepo using only Yarn v2.

> It is expected that you already have installed Node and Git, otherwise have a look at the other monorepo guide where this is explained [Yarn-Lerna Monorepo]("./yarn-lerna-monorepo.md").

## Install Yarn v2

As of this writing the recommended way of instaling Yarn v2 is per-project. This means you still have NPM or Yarn v1 as the default global binary and you only enable Yarn v2 in projects where needed.

To enable Yarn v2 per-project you simply go to your project folder root and run this command → `yarn set version berry`. Now this project is using Yarn v2, you can check it by running `yarn --version`.

## Setup Yarn v2 monorepo

To create a monorepo is very easy, just go to your monorepo folder and initialize Yarn with `yarn init`. Now you should have a `package.json` file in the root.

Now we need to modifiy the `package.json` as follows:
  - It needs the private flag to be set `"private": true`.
  - It needs to have Workspaces declared with `"workspaces"` entry. This accepts an array of glob patterns. For example → `"workspaces": ["packages/*"]`, this will search for projects inside `packages` folder.

## Usefull notes about how to use Yarn v2 monorepo

### New resolution protocol `workspace`

When there is a need to prevent a package being resolved from the remote registry we can use the `workspace` resolution protocol. Here is an example (let's asume the current version is 1.5.0):

```json
{
  "dependencies": {
    "foo": "workspace:*",
    "bar": "workspace:^1.2.3",
    "baz": "workspace:path/to/baz"
  }
}
```

will be resolved to:

```json
{
  "dependencies": {
    "foo": "1.5.0",
    "bar": "1.2.3",
    "baz": "1.5.0"
  }
}
```

### Usefull CLI commands

#### Run a command within the specified workspace (`yarn workspace`)

Usage:
```bash
yarn workspace <workspaceName> <commandName>
```

Example: Install React in components package
```bash
yarn workspace components add -D react
```

#### Run a command on all workspaces

> This command needs `workspace-tools` to be installed. They should be already by default otherwise use `yarn plugin import workspace-tools` to install them.

Usage:
```bash
yarn workspaces foreach [-a,--all] [-v,--verbose] [-p,--parallel] [-i,--interlaced] [-j,--jobs #0] [-t,--topological] [--topological-dev] [--include #0] [--exclude #0] [--private] <commandName> ...
```

Example: Run build script on current and all descendant packages in parallel, building dependent packages first
```bash
yarn workspace foreach -pt run build
```

> For more consult [Yarn v2 documentation](https://yarnpkg.com/cli/workspaces/foreach)

