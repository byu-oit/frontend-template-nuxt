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
- CI/CD files.
- Browser support.
- Tools to auto-generate TypeScript definitions from swagger files (see the README in the `swagger` folder).
- Default `.repo-meta.yml` template
- Integration with Codecov
- Integration with AppDynamics Synthetic Monitoring

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
15) For running locally, create a file named `.env` in this project's root directory:
    ```dotenv
    NUXT_ENV_OAUTH_CLIENT_ID=[WSO2 OAuth client ID goes here]
    NUXT_ENV_OAUTH_CALLBACK_URL=[WSO2 OAuth callback URL goes here]
    ```
    Alternatively, you can use your IDE to set these environment variables.

## AppDynamics Setup

This project includes the JavaScript Agent for AppDynamics synthetic monitoring configured. To enable it:

1. Ask an AppDynamics admin (currently Tyler Johnson) to create a browser application in AppDynamics for synthetic monitoring.
2. Once that application is created, login to AppDynamics, go to the User Experience tab, and select the application.
3. In the left menu, click "Configuration" -> "Configure JavaScript Agent", and copy the app key
4. In AWS, create the parameter store key `/APPLICATION-NAME/app_dynamics_key` with the value of the copied app key
5. Uncomment the "NUXT_ENV_APP_DYNAMICS_KEY" line in buildspec.yml
   - NOTE: because our Dev and Prod builds use the same buildspec file and CodeBuild fails if you refer to a non-existent
    parameter store key, you MUST create the parameter store key in BOTH environments.
    if you're only monitoring one environment, then simply leave the value blank in the other environment.

If you want dev and prd monitoring, you will have to have a second browser application made in AppDynamics.
Use the second app key in the second environment's parameter store

## Pipeline Setup

This project includes Terraform files so you can create a site hosted in S3 and fronted with HTTPS by a CloudFront distribution with a custom URL. 

Run the following steps in the `terraform/dev` or `terraform/prd` folder depending on the environment you want to deploy to.

1) Run `awslogin` and login to the account you want to deploy to.
2) Update the variables in the `terraform.tfvars` file.
3) Update the AWS account ID and application name in each `tfstate.tf` file.
4) Run `terraform init` so initialize Terraform (you only need ot do this once).
5) Run `terraform apply` to create the resources in AWS.

**Note**: Because DNS has to be manually setup by the network team, you will have to run `terraform apply` twice. The first time it will create the Route 53 hosted zone, certificate in ACM, and S3 bucket for deployment. Then it will fail because AWS can't validate the certificate (you'll get an error message similar to the image below). You need to contact the network team to setup a record in QIP for your desired subdomain name pointing to the name servers of the hosted zone created by Terraform (you can find that information in the Route 53 console). After AWS has validated the certificate, run `terraform apply` again and it should succeed.
The generated certificate in AWS can be found in Certificate Manager (ACM), but you must switch to the **us-east-1 "US East (N. Virginia)"** region to view it.

Use [this order form](https://it.byu.edu/it/?id=sc_cat_item&sys_id=2f7a54251d635d005c130b6c83f2390a) to request having your subdomain added. Add yourself as the technical contact, select Cname and list the NS records found in Route 53.

### Infinite CloudFront Distribution Deploy

There is a known issue where Terraform may get stuck deploying CloudFront distributions for the first time (see [this issue](https://github.com/terraform-providers/terraform-provider-aws/issues/10039)). You will know this happened if you check the AWS Console and see the CloudFront distribution has status of "Deployed", but `terraform apply` is still trying to deploy the distribution. If this happens to you, stop the `terraform apply` command with Ctrl+C (if it doesn't stop, press Ctrl+C again). Then run the following command:

```bash
terrafrom import aws_cloudfront_distribution.cdn DISTRIBUTOIN_ID
```

Once you have done that, run `terraform apply` again and it will finish creating the resources for your application.

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

**Note**: If you get WSO2 errors after following either set of steps below, be sure to invalidate your CloudFront distribution's cache.

### Using an exisiting domain name.

**Transfering an old, existing URL to our new accounts and pipelines will cause ~20 minutes of downtime.** The total amount of downtime will depend on how long it takes you to complete steps 5-7.

1) Set the `url` variable in the `terraform.tfvars` file.
2) Run `terraform apply`. This will create the Route 53 hosted zone, a certificate in ACM, and add the validation CNAME's to that hosted zone. **You will get an error about the CloudFront distribution.** That is expected.
3) Create a new Engineering Task in ServiceNow using the "Route 53 Domain Redirect" template. Go to your newly created Route 53 hosted zone in the AWS Console, copy the name servers, and paste them in the request.
4) In the AWS Console, go to ACM and copy the validation CNAME record for the certificate. Put that in the old Route 53 hosted zone so the certificate can be validated (it can take 30 minutes for more for ACM to validate your certificate).
5) Once that new certificate is validated, go to the old CloudFront distribution and remove the CNAME associated with it.
6) Work with the network team to complete the ENG task you created.
7) Run `terraform apply` again. This will finish setting up CloudFront and your other resources.
8) Trigger your CodePipeline so it builds your project, then you should be good to go.

### Using a new domain name.

1) Set the `url` variable in the `terraform.tfvars` file.
2) Run `terraform apply`. This will create the Route 53 hosted zone, a certificate in ACM, and add the validation CNAME's to that hosted zone. **You will get an error about the CloudFront distribution.** That is expected.
3) *If using an existing domain name, see note above before doing this step.* Create a new Engineering Task in ServiceNow using the "Route 53 Domain Redirect" template. Go to your newly created Route 53 hosted zone in the AWS Console, copy the name servers, and paste them in the request.
4) Wait for the Network Team to complete that task. Once that task is completed, ACM will be able to validate your certificate (it can take 30 minutes for more for ACM to validate your certificate).
5) Run `terraform apply` again once the certificate is validated. This will finish setting up CloudFront and your other resources.
6) Trigger your CodePipeline so it builds your project, then you should be good to go.

## Linting

This template include some pretty intense linting. It will be in your favor to be sure your IDE is set to use the JavaScript Standard Style as well as be sure children of the `<script>` tag are not indented.
