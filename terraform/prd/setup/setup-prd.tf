provider "aws" {
  region = "us-west-2"
}

terraform {
  backend "s3" {
    encrypt        = true
    bucket         = "terraform-state-storage-<PRD_AWS_ACCT_NUM>" // TODO replace <PRD_AWS_ACCT_NUM>
    dynamodb_table = "terraform-state-lock-<PRD_AWS_ACCT_NUM>" // TODO replace <PRD_AWS_ACCT_NUM>
    key            = "<APP_NAME>/prd/setup.tfstate" // TODO replace <APP_NAME>
    region         = "us-west-2"
  }
}

variable "client_id" {
  type = string
}
variable "callback_url" {
  type = string
}
variable "codecov_token" {
  type = string
}

module "setup" {
  source = "../../modules/setup"

  app_name      = "<APP_NAME>-prd" // TODO replace <APP_NAME>
  callback_url  = var.callback_url
  client_id     = var.client_id
  codecov_token = var.codecov_token
}
