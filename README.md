![Build Status](https://codebuild.us-west-2.amazon.com/badges?uuid=...&branch=master)

# Frontend Nuxt Project Template

> For the BYU Apps Custom Code team.

## What this contains

This template includes the initial setup and scaffolding you need to create a frontend application in our custom stack. It includes the following:

- [BYU Browser OAuth Implicit](https://github.com/byuweb/byu-browser-oauth-implicit) package preconfigured. There is also a custom Nuxt plugin that adds the bearer token to `$axios` for use throughout your project.
- Graceful error handling including network errors and authentication errors. A `v-dialog` is created presenting the error to the user.
- Vuetify customized with BYU brand compliant colors.
- The BYU theme components
- BYU fronts (Ringside and Public Sans).
- Skeleton/Example pages converted to TypeScript.
- Tests for functionality already included in the template.
- A functioning Vuex store.
- Type definitions for the initial project.
- Proper linting and code style setup.
- CI/CD files (for Handel, Handel CodePipeline, and CodeBuild).
- Browser support.

## Pipeline Setup (do this before the next section)

1) Decide on an application name. You will use this in setting up the pipeline and project.
2) Create a new application in WSO2. The application name should be what you decided and the callback URL should follow this format: *https://APPLICATION-NAME.AWS-ACCOUNT-NAME.amazon.byu.edu/* (be sure to include the protocol and trailing slash).
3) Subscribe the application you just made to the OpenID-Userinfo - v1 API.
4) Generate sandbox keys (you can generate production keys later).
5) Create the following parameters in parameter store: `/APPLICATION-NAME/oauth_client_id` and `/APPLICATION-NAME/callback_url`. The `oauth_client_id` is the client ID of the application you just made in WSO2 and the `callback_url` is the callback URL you created with that WSO2 application. Make sure the values are type String, not StringList or SecureString.

## Project Setup

1) Click the Green *Use this template* button at the top of the repository.
2) Customize the README.
3) Change the Name, Description, and Author in package.json.
4) Update the `homne-url` attribute in `layouts/default.vue`.
5) Change the parameter store param names in `buildspec.yml`.
6) Change the application name and repository name in `handel-codepipeline.yml`.
7) Change the application name, cert id's, and url's in `handel.yml`.
8) Update the build badge URL in the README (when you have a CodeBuild project created).
9) Update the page title in `nuxt.config.ts`
10) Update the site title in `layouts/default.vue`
11) Update the reviewer in the Dependabot config.
12) Uncomment the target branch line in the Dependabot config.
13) Create a branch named `dev` in your project.
14) Create `static/config.json` with the following format:

```json
{
  "autoRefreshOnTimeout": true,
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

