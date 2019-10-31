provider "aws" {
  profile = "default"
  region  = var.region
}

provider "aws" {
  alias  = "aws_n_va"
  region = "us-east-1"
}

data "aws_caller_identity" "current" {}
data "aws_iam_account_alias" "current" {}
data "aws_ssm_parameter" "github-token" {
  name = "byu-oit-bot-github-token"
}
data "aws_ssm_parameter" "s3-cloudfront-connection" {
  name = "/${var.app-name}/s3-cloudfront-connection"
}
data "aws_iam_role" "power-builder" {
  name = "PowerBuilder"
}

