![Build Status](https://codebuild.us-west-2.amazon.com/badges?uuid=...&branch=master)

# Frontend Nuxt Project Template

> For the BYU Apps Custom Code team.

## What this contains

This template includes the initial setup and scaffolding you need to create a frontend application in our custom stack. It includes the following:

- [BYU Browser OAuth Implicit](https://github.com/byuweb/byu-browser-oauth-implicit) package preconfigured. There is also a custom Nuxt plugin that adds the bearer token to `$axios` for use throughout your project.
- Graceful error handling including network errors and authentication errors. A `v-dialog` is created presenting the error to the user.
- Vuetify customized with BYU brand compliant colors.
- The BYU theme components
- BYU fonts (Ringside and Public Sans).
- Skeleton/Example pages converted to TypeScript.
- Tests for functionality already included in the template.
- A functioning Vuex store.
- Type definitions for the initial project.
- Proper linting and code style setup.
- CI/CD files (for Handel, Handel CodePipeline, and CodeBuild).
- Browser support.
- Tools to auto-generate TypeScript definitions from swagger files (see the README in the `swagger` folder).
- Default `.repo-meta.yml` template
- Integration with Codecov

## WSO2/Codecov Setup (do this before the next section)

1) Decide on an application name. You will use this in setting up the pipeline and project.
2) Create a new application in WSO2. The application name should be what you decided and the callback URL should follow this format: *https://APPLICATION-NAME.AWS-ACCOUNT-NAME.amazon.byu.edu/* (be sure to include the protocol and trailing slash).
3) Subscribe the application you just made to the OpenID-Userinfo - v1 API.
4) Generate sandbox keys (you can generate production keys later).
5) Create the following parameters in parameter store: `/APPLICATION-NAME/oauth_client_id`, `/APPLICATION-NAME/callback_url`, `/APPLICATION-NAME/codecov_token`, and `/APPLICATION-NAME/s3-cloudfront-connection`. The `oauth_client_id` is the client ID of the application you just made in WSO2, the `callback_url` is the callback URL you created with that WSO2 application, the the `codecov_token` is your Codecov repo token. The `s3-cloudfront-connection` should be a random string of alphanumeric characters. Make sure the values are type String, not StringList or SecureString.
6) WHEN READY FOR PRODUCTION: In ServiceNow, create a new standard change template and be sure to give it an alias.

## Project Setup

1) Click the Green *Use this template* button at the top of the repository.
2) Customize the README.
3) Change the Name, Description, and Author in package.json.
4) Update the `homne-url` attribute in `layouts/default.vue`.
5) Change the parameter store param names in `buildspec.yml`.
6) Update the build badge URL in the README (when you have a CodeBuild project created).
7) Update the page title in `nuxt.config.ts`
8) Update the site title in `layouts/default.vue`
9) Update the reviewer in the Dependabot config.
10) Uncomment the target branch line in the Dependabot config.
11) Create a branch named `dev` in your project.
12) Update the `.repo-meta.yml` file.
13) Add the repo key from Codecov into `cb-buildspec.yml` and then run `cbsetup` locally to create a CodeBuild project.
14) Add the Codecov badge to the README.
15) Create `static/config.json` with the following format:

```json
{
  "autoRefreshOnTimeout": true,
  "clientId": "CLIENT_ID_GOES_HERE",
  "callbackUrl": "CALLBACK_URL_GOES_HERE"
}

```

## Pipeline Setup

This project includes Terraform files so you can have a CodePipeline triggered by a push to your GitHub repo which will build your projects and deploy it to a public S3 bucket with a URL in the format of `APP-NAME.AWS-ACCOUNT-NAME.amazon.byu.edu` so you can see it deployed right away. 

Run the following steps in the `terraform/dev` or `terraform/prd` folder depending on the environment you want to deploy to.

1) Run `awslogin` and login to the account you want to deploy to.
2) Update the variables in the `terraform.tfvars` file.
3) Update the AWS account ID and application name in each `tfstate.tf` file.
4) Run `terraform init` so initialize Terraform (you only need ot do this once).
5) Run `terraform apply` to create the resources in AWS.

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

## Using a Custom URL

Using a custom URL will require a bit of one-time configuration in the AWS console.

### Using an exisiting domain name.

If you're using an existing domain name, follow the steps outlined below, but after step 2 in the process outlined below, you'll need to manually copy the CNAME record for the new ACM certificate into the old Route 53 hosted zone. Then ACM can validate against that. Once the new certificate in ACM is validated, you should skip step 3 and do it last (as not to have any downtime in transitioning from one hosted zone to another).

### Using a new domain name.

1) Set the `url` variable in the `terraform.tfvars` file.
2) Run `terraform apply`. This will create the Route 53 hosted zone, a certificate in ACM, and add the validation CNAME's to that hosted zone. **You will get an error about the CloudFront distribution.** That is expected.
3) *If using an existing domain name, see note above before doing this step.* Create a new Engineering Task in ServiceNow using the "Route 53 Domain Redirect" template. Go to your newly created Route 53 hosted zone in the AWS Console, copy the name servers, and paste them in the request.
4) Wait for the Network Team to complete that task. Once that task is completed, ACM will be able to validate your certificate (it can take 30 minutes for more for ACM to validate your certificate).
5) Run `terraform apply` again once the certificate is validated. This will finish setting up CloudFront and your other resources.
6) Trigger your CodePipeline so it builds your project, then you should be good to go.

## Linting

This template include some pretty intense linting. It will be in your favor to be sure your IDE is set to use the JavaScript Standard Style as well as be sure children of the `<script>` tag are not indented.
