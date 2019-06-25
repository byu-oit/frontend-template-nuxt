![Build Status](https://codebuild.us-west-2.amazon.com/badges?uuid=...&branch=master)

# Frontend Nuxt Project Template

> For the BYU Apps Custom Code team.

## Project Setups

1) Click the Green *Use this template* button at the top of the repository.
2) Customize the README.
3) Change the Name, Description, and Author in package.json.
5) Update the `homne-url` attribute in `layouts/default.vue`.
6) Change the parameter store param names in `buildspec.yml`.
7) Change the application name and repository name in `handel-codepipeline.yml`.
8) Change the application name, cert id's, and url's in `handel.yml`.
9) Update the build badge URL in the README.
10) Create `static/config.json` with the following format:

```json
{
  "clientId": "CLIENT_ID_GOES_HERE",
  "callbackUrl": "CALLBACK_URL_GOES_HERE"
}

```

## Build Setup

``` bash
# install dependencies
$ yarn install

# serve with hot reload at localhost:3000
$ yarn run dev

# build for production and launch server
$ yarn run build
$ yarn start

# generate static project
$ yarn run generate
```

For detailed explanation on how things work, checkout [Nuxt.js docs](https://nuxtjs.org).
