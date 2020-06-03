| Master Branch | Dev Branch |
| ---- | ---- |
| ![CI Checks](https://github.com/byu-oit/REPO_NAME/workflows/CI%20Checks/badge.svg?branch=master) | ![CI Checks](https://github.com/byu-oit/REPO_NAME/workflows/CI%20Checks/badge.svg?branch=dev) |
| ![CD Pipeline](https://github.com/byu-oit/REPO_NAME/workflows/CD%20Pipeline/badge.svg?branch=master) | ![CD Pipeline](https://github.com/byu-oit/REPO_NAME/workflows/CD%20Pipeline/badge.svg?branch=dev) |
| <MASTER_CODECOV_BADGE> | <DEV_CODECOV_BADGE> |


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

## Project Setup

1) Click the Green *Use this template* button at the top of the template repository. Then clone the repository and checkout a new branch called `dev`.
2) Setup GitHub secrets
    1) Ask on the #github-actions slack channel to get secrets assigned to your newly created repo; something like:
        `I need the GitHub secrets for the AWS Accounts: <dev account> and <prd account> associated with my new GitHub repo: <my new repo>`
    2) Go to [codecov.io](https://codecov.io), login with your GitHub account, find your repo and copy the token.
        1) Copy the codecov token and [upload it to your github repo's secrets](https://help.github.com/en/actions/configuring-and-managing-workflows/creating-and-storing-encrypted-secrets) with the name of `codecov_token`
        2) __(Optional)__ Add the Codecov badge (found under Settings->Badge in codecov for you repo) to the badge table at the top of this README. The badge copied from Codecov is only for master, but you can use the same code for the dev branch by replacing `master` with `dev`.  
3) Create 2 new applications in WSO2 (one for dev and one for prd).
    The application name should be something simple and unique (maybe the name of your repo) and the callback URL should be what you put inside your [app-dev.tf](terraform/dev/app/app-dev.tf) and [app-prd.tf](terraform/prd/app/app-prd.tf) files for `local.url` variable.
    It'll look something like (be sure to include the protocol and trailing slash):
    ```
    https://<APP_NAME>.<AWS_ACCOUNT_NAME>.amazon.byu.edu/
    ```
    1) Subscribe both applications you just made to the OpenID-Userinfo - v1 API.
    2) Generate sandbox keys for the dev application and production keys for the production application.
4) AWS Setup *(this will create Route53 hosted zones in your aws accounts and upload SSM params)*
    1) Create 2 terraform variable files (these files are gitignored) in `/terraform/dev/setup/dev.tfvars` (use the dev client_id and callback from step #6) and `/terraform/prd/setup/prd.tfvars` (use the prd client_id and callback from step #6):
        ```hcl
        client_id = "<WSO2_CLIENT_ID>"
        callback_url = "<WSO2_CALLBACK_URL>"
        // custom_domain = "custom-domain.byu.edu" // OPTIONAL. Only required if you want a custom domain name.
        // app_dynamics_key = "<APP_DYNAMICS_KEY>" // OPTIONAL. See the "AppDynamics Setup" for instructions how to get the key.
        ```
    2) Update the TODO items in `/terraform/dev/setup/setup-dev.tf` and `/terraform/dev/setup/setup-prd.tf`
    3) Run terraform to setup the DEV environment
        1) Run `awslogin` and login to the dev account you want to deploy to.
        2) Run setup which uploads SSM parameters:
            ```bash
            cd terraform/dev/setup
            terraform init
            terraform apply -var-file=dev.tfvars
            ```
        3) Use [this order form](https://it.byu.edu/it/?id=sc_cat_item&sys_id=2f7a54251d635d005c130b6c83f2390a) to request having your dev subdomain added to BYU's DNS servers.
           Add yourself as the technical contact, select Cname and list the NS records found in Route 53 (from above step).
    4) Run terraform to setup the PRD environment
        1) Run `awslogin` and login to the prd account you want to deploy to.
        2) Run setup which uploads SSM parameters:
            ```bash
            cd ../../prd/setup
            terraform init
            terraform apply -var-file=prd.tfvars
            ```
        3) **NOTE** if you're transferring an existing URL to a new Account see the [instructions below](#using-an-exisiting-domain-name) instead
        3) Use [this order form](https://it.byu.edu/it/?id=sc_cat_item&sys_id=2f7a54251d635d005c130b6c83f2390a) to request having your dev subdomain added to BYU's DNS servers.
           Add yourself as the technical contact, select Cname and list the NS records found in Route 53 (from above step).
5) Now we have to wait for the order forms to be completed by the networking team. 
While waiting you can update the code in the repo:
    1) Customize this README.
    2) Change the Name, Description, and Author in package.json.
    3) Cycle through the **TODO**s to update (any TODOs that don't talk about replacing can be deleted. They are TODOs for this template only.)
        - `<APP_NAME>` - typically your repo name (keep it short if you can, there tends to be issues with longer names with some AWS resources)
        - `<DEV_AWS_ACCT_NUM>` - the AWS account number for your dev account
        - `<PRD_AWS_ACCT_NUM>` - the AWS account number for your prd account
        - `<GITHUB_AWS_DEV_KEY_NAME>` - the name of the GitHub secret for dev AWS key (i.e. `byu_oit_customapps_dev_key`)
        - `<GITHUB_AWS_DEV_SECRET_NAME>` - the name of the GitHub secret for dev AWS secret (i.e. `byu_oit_customapps_dev_secret`)
        - `<GITHUB_AWS_PRD_KEY_NAME>` - the name of the GitHub secret for prd AWS key (i.e. `byu_oit_customapps_prd_key`)
        - `<GITHUB_AWS_PRD_SECRET_NAME>` - the name of the GitHub secret for prd AWS secret (i.e. `byu_oit_customapps_prd_secret`)
        - `<STD_CHANGE_TEMPLATE_ID>` - WHEN READY FOR PRODUCTION: In ServiceNow, create a new standard change template and be sure to give it an alias, put that alias here
        - the page/site title
        - the dependabot [config.yml](.dependabot/config.yml) file
        - the [repo-meta.yml](.repo-meta.yml) file (you really only need the standard change template for creating standard RFCs for production deployments)

6) **Wait** until the order forms are completed and DNS is routed to your AWS hosted zones. This could take a few hours to a day.
7) Push your changes to your GitHub repo master branch (and dev branch)
    * this should start the pipeline worklfows (dev and prd), which will each take 15-30 minutes to spin up the CloudFront distributions
8) If all was successful, your site should be available at both dev and prd URLs 
       
## AppDynamics Setup

This project includes the JavaScript Agent for AppDynamics synthetic monitoring configured. To enable it:

1. Ask an AppDynamics admin (currently Tyler Johnson) to create a browser application in AppDynamics for synthetic monitoring.
2. Once that application is created, login to AppDynamics, go to the User Experience tab, and select the application.
3. In the left menu, click "Configuration" -> "Configure JavaScript Agent", and copy the app key
4. Be sure the AppDynamics key is in AWS SMM Parameter Store. If you still have the original `dev.tfvars` and `prd.tfvars` files from when the project was setup, uncomment the `app_dynamics_key` line and set the key from AppDynamics as the value. Then run `terraform apply -var-file=ENV.tfvars` with the appropriate var file and logged in to the appropriate AWS account. If you're missing that file, then go do step four in the [Project Setup](#project-setup) section of this README.
5. Uncomment the "NUXT_ENV_APP_DYNAMICS_KEY" line in `.github/workflows/pipeline.yml`.
   - NOTE: because our Dev and Prod builds use the same pipeline workflow, you MUST create the parameter store key in BOTH environments. If you're only monitoring one environment, then simply leave the value blank in the other environment.

If you want dev and prd monitoring, you will have to have a second browser application made in AppDynamics. Use the second app key in the second environment's parameter store.

# Configuring Implicit Grant Locally

Create an `.env` file in the project root with the following contents:

```.env
NUXT_ENV_OAUTH_CALLBACK_URL=http://localhost:3000/
NUXT_ENV_OAUTH_CLIENT_ID={your client id here}
```

## Build Setup

To run and build locally

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

Using a custom URL will require a bit of one-time configuration.
This is due to the fact that BYU's DNS servers need to be updated manually to point new subdomains to AWS's Route53 Hosted Zones.

You can use [this order form](https://it.byu.edu/it/?id=sc_cat_item&sys_id=2f7a54251d635d005c130b6c83f2390a) or create an Engineering task using the "Route53 Domain Redirect" template to request having your dev subdomain added to BYU's DNS servers.


### Using an exisiting domain name.
**Transfering an old, existing URL to our new accounts and pipelines will cause ~20 minutes of downtime.** The total amount of downtime will depend on how long it takes you to complete steps 5-7.

1) Go ahead and finish the steps in the setup without waiting for the Network team to finish changing the DNS.
2) Your GitHub action pipeline workflow will create the certificate in ACM, and add the validation CNAME's to that hosted zone. **You will get an error about the CloudFront distribution.** That is expected.
3) If you're still waiting for the network team at this time then
    * In the AWS Console, go to ACM and copy the validation CNAME record for the certificate. Put that in the old Route 53 hosted zone so the certificate can be validated (it can take 30 minutes for more for ACM to validate your certificate).
4) Once that new certificate is validated, go to the old CloudFront distribution and remove the CNAME associated with it.
5) Work with the network team to complete the ENG task you created.
6) Trigger your pipeline again (in the pipeline workflow you should be able to rerun the pipeline job) so it builds your project, then you should be good to go.

**Note**: If you get WSO2 errors after these steps, be sure to invalidate your CloudFront distribution's cache.

## Linting

This template include some pretty intense linting. It will be in your favor to be sure your IDE is set to use the JavaScript Standard Style as well as be sure children of the `<script>` tag are not indented.
