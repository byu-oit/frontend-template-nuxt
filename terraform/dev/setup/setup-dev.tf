provider "aws" {
  region = "us-west-2"
}

terraform {
  backend "s3" {
    encrypt        = true
    bucket         = "terraform-state-storage-<DEV_AWS_ACCT_NUM>" // TODO replace <DEV_AWS_ACCT_NUM>
    dynamodb_table = "terraform-state-lock-<DEV_AWS_ACCT_NUM>"    // TODO replace <DEV_AWS_ACCT_NUM>
    key            = "<APP_NAME>/dev/setup.tfstate"               // TODO replace <APP_NAME>
    region         = "us-west-2"
  }
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 3.0"
    }
    random = {
      source  = "hashicorp/random"
      version = "~> 2.3"
    }
  }
  required_version = ">= 0.13.3"
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

locals {
  app_name = "<APP_NAME>-dev" // TODO replace <APP_NAME>
}

module "setup" {
  source = "../../modules/setup"

  app_name         = local.app_name
  callback_url     = var.callback_url
  client_id        = var.client_id
  custom_domain    = var.custom_domain
  app_dynamics_key = var.app_dynamics_key
  tags = {
    env              = "dev"
    team             = "OIT-BYU-APPS-CUSTOM"
    data-sensitivity = "confidential"                         // TODO update data-sensitivity (if needed)
    repo             = "https://github.com/byu-oit/REPO_NAME" // TODO Update REPO_NAME
    app              = local.app_name
  }
}

output "hosted_zone_id" {
  value = module.setup.hosted_zone.zone_id
}

output "hosted_zone_name_servers" {
  value = module.setup.hosted_zone.name_servers
}
