# Hinode Module - Hanko

<!-- Tagline -->
<p align="center">
    <b>A Hugo module to add authentication powered by Hanko to your Hinode site</b>
    <br />
</p>

<!-- Badges -->
<p align="center">
    <a href="https://gohugo.io" alt="Hugo website">
        <img src="https://img.shields.io/badge/generator-hugo-brightgreen">
    </a>
    <a href="https://gethinode.com" alt="Hinode theme">
        <img src="https://img.shields.io/badge/theme-hinode-blue">
    </a>
    <a href="https://github.com/gethinode/mod-hanko/commits/main" alt="Last commit">
        <img src="https://img.shields.io/github/last-commit/gethinode/mod-hanko.svg">
    </a>
    <a href="https://github.com/gethinode/mod-hanko/issues" alt="Issues">
        <img src="https://img.shields.io/github/issues/gethinode/mod-hanko.svg">
    </a>
    <a href="https://github.com/gethinode/mod-hanko/pulls" alt="Pulls">
        <img src="https://img.shields.io/github/issues-pr-raw/gethinode/mod-hanko.svg">
    </a>
    <a href="https://github.com/gethinode/mod-hanko/blob/main/LICENSE" alt="License">
        <img src="https://img.shields.io/github/license/gethinode/mod-hanko">
    </a>
</p>

## About

![Logo](https://raw.githubusercontent.com/gethinode/hinode/main/static/img/logo.png)

Hinode is a clean blog theme for [Hugo][hugo], an open-source static site generator. Hinode is available as a [template][repository_template], and a [main theme][repository]. This repository maintains a Hugo module to add authentication powered by [Hanko](https://hanko.io) to a Hinode site. Visit the Hinode documentation site for addtional [installation instructions][hinode_docs]. This module requires a Hanko account, check out the [Hanko docs](https://docs.hanko.io/setup-hanko-cloud) to get you started.

## Contributing

This module uses [semantic-release][semantic-release] to automate the release of new versions. The package uses `husky` and `commitlint` to ensure commit messages adhere to the [Conventional Commits][conventionalcommits] specification. You can run `npx git-cz` from the terminal to help prepare the commit message.

## Configuration

A login template is available in the `layouts` folder, which is automatically mounted into your site. You can reference this template by setting `layout: login` in the frontmatter of your content page. For example, create a login page `content/login.md` with the following content.

```yml
---
title: Login
description: Login page
layout: login
---
```

This module supports the following parameters (see the section `params.modules` in `config.toml`):

| Setting                   | Default | Description |
|---------------------------|---------|-------------|
| endpoint                  |         | Hanko API URL, such as `https://f4****-4802-49ad-8e0b-3d3****ab32.hanko.io`. Check the [Hanko console](https://cloud.hanko.io/) to retrieve the value. |
| login-redirect            |         | Redirect destination after a successful login, e.g. `/` to redirect to the site's homepage. |
| logout-redirect           |         | Redirect destination after a successful logout, e.g. `/login/` to redirect to the login page. |
| timeout-redirect          |         | Redirect destination when the session has expired, e.g. `/login/` to redirect to the login page. A modal dialog is shown to confirm the redirect. |

When using Content Security Policies, be sure to add the endpoint to the `connect-src` safelist. For example, the following configuration in your site parameters will enable connections to the example Hanko API URL.

```toml
[modules.hanko.csp]
    connect-src = [
        "f4****-4802-49ad-8e0b-3d3****ab32.hanko.io"
    ]
```

<!-- MARKDOWN LINKS -->
[hugo]: https://gohugo.io
[hinode_docs]: https://gethinode.com
[repository]: https://github.com/gethinode/hinode.git
[repository_template]: https://github.com/gethinode/template.git
[conventionalcommits]: https://www.conventionalcommits.org
[husky]: https://typicode.github.io/husky/
[semantic-release]: https://semantic-release.gitbook.io/
