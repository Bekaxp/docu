---
id: yarn-lerna-monorepo
title: Yarn-Lerna Monorepo
sidebar_label: Yarn-Lerna Monorepo
---

This is a guide on how to set up a new project, using a monorepo approach based on Yarn Workspaces + Lerna.

A high-level overview of the technology stack:

- **Node** (the engine)
- **GIT** (version control)
- **Yarn** (dependencies manager)
- **Yarn workspaces** (Mono-repo manager)
- **Lerna** (Executing tasks through all workspaces/projects inside the monorepo)

---

## Let's start: Node and folder setup

1. Check your Node version. Maybe you don't even have it installed... Execute the following command in your Terminal/CMD/Powershell... → `node -v`

2. Install or update your Node version. You can do this depends on your operating system:

   - Using MACOS: Use Homebrew or go to Node website https://nodejs.org/en/ and download the latest version.
   - Using Windows: Go to https://nodejs.org/en/ and download the latest version.

3. Install or update `GIT` and `yarn`:

   - Go to the GIT official website https://git-scm.com/downloads, download and install the latest version of GIT for your operating system.
   - Yarn can be installed in multiple ways but as you already have Node and NPM installed, you can run this command in the Terminal/Cmd/PowerShell → `npm install -g yarn`. This will install Yarn globaly on your system.

4. Create an empty folder for your project and run → `npx lerna init`. This will initialise the mono-repo.

---

## Setting up the monorepo Lerna + Yarn workspaces

Once we successfully initialized our monorepo with `npx lerna init` command, we need to apply a few more settings to allow Yarn workspaces to work together with Lerna.

1. Modify `lerna.json` file:

   - Add `"useWorkspaces": true`, which should enable Yarn workspaces inside Lerna.
   - Add `"version": "independent"`, which means each package inside the monorepo will use it's own versioning.
   - Define where are your workspaces/packages with `"packages": ["packages/*"]`.
   - Define your npm client, in our case we use Yarn. `"npmClient": "yarn"`

2. Modify `package.json` file:
   - Inside the main `package.json` file we need to define our workspaces (projects). We can do it by adding `"workspaces"` entry. We can specify the workspaces file by file or using a regex pattern. For example: `"workspaces": ["packages/*"]`. This means search for our projects inside the "packages" folder.
   - It needs to have the private flag set to true. `"private": true`

That's it. Now when we will have multiple workspaces/projects... each one will have it's own package.json. The dependencies, which are the same between workspaces/projects will be scoped to the root.
