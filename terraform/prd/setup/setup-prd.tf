provider "aws" {
  region = "us-west-2"
}

terraform {
  backend "s3" {
    encrypt        = true
    bucket         = "terraform-state-storage-<PRD_AWS_ACCT_NUM>" // TODO replace <PRD_AWS_ACCT_NUM>
    dynamodb_table = "terraform-state-lock-<PRD_AWS_ACCT_NUM>"    // TODO replace <PRD_AWS_ACCT_NUM>
    key            = "<APP_NAME>/prd/setup.tfstate"               // TODO replace <APP_NAME>
    region         = "us-west-2"
  }
}

variable "client_id" {
  type = string
}
variable "callback_url" {
  type = string
}
variable "custom_domain" {
  type    = string
  default = null
}
variable "app_dynamics_key" {
  type    = string
  default = null
}

module "setup" {
  source = "../../modules/setup"

  app_name         = "<APP_NAME>-prd" // TODO replace <APP_NAME>
  callback_url     = var.callback_url
  client_id        = var.client_id
  custom_domain    = var.custom_domain
  app_dynamics_key = var.app_dynamics_key
}

output "hosted_zone_id" {
  value = module.setup.hosted_zone.zone_id
}

output "hosted_zone_name_servers" {
  value = module.setup.hosted_zone.name_servers
}
