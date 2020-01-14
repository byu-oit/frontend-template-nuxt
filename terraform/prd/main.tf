provider "aws" {
  profile = "default"
  region  = var.region
}

module "acs" {
  source = "git@github.com:byu-oit/terraform-aws-acs-info.git?ref=v1.2.0"
  env    = var.env
}

module "s3_site" {
  source               = "git@github.com:byu-oit/terraform-aws-s3staticsite?ref=v1.0.0"
  env_tag              = var.env
  repo_name            = var.repo_name
  branch               = "dev"
  site_url             = var.url
  data_sensitivity_tag = var.data_sensitivity_tag
}

module "codepipeline" {
  source          = "git@github.com:byu-oit/terraform-aws-codepipeline?ref=v1.2.0"
  app_name        = var.repo_name
  repo_name       = var.repo_name
  branch          = var.branch
  github_token    = module.acs.github_token
  deploy_provider = "S3"
  deploy_configuration = {
    BucketName = module.s3_site.site_bucket.bucket
    Extract    = true
  }
  account_env                   = var.env
  env_tag                       = var.env
  role_permissions_boundary_arn = module.acs.role_permissions_boundary.arn
  power_builder_role_arn        = module.acs.power_builder_role.arn
  data_sensitivity_tag          = var.data_sensitivity_tag
}
