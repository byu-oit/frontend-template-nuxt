variable "app_name" {
  type = string
}
variable "custom_domain" {
  type = string
  default = null
}
variable "client_id" {
  type = string
}
variable "callback_url" {
  type = string
}
variable "app_dynamics_key" {
  type = string
  default = null
}
variable "tags" {
  type = map(string)
}

resource "random_string" "cloudfront_connection" {
  length  = 16
  special = false
  keepers = {
    create_once = true
  }
}

resource "aws_ssm_parameter" "client_id" {
  name  = "/${var.app_name}/oauth_client_id"
  type  = "String"
  value = var.client_id
  tags  = var.tags
}
resource "aws_ssm_parameter" "callback_url" {
  name  = "/${var.app_name}/callback_url"
  type  = "String"
  value = var.callback_url
  tags  = var.tags
}
resource "aws_ssm_parameter" "cloudfront_connection" {
  name  = "/${var.app_name}/s3-cloudfront-connection"
  type  = "String"
  value = random_string.cloudfront_connection.result
  tags  = var.tags
}
resource "aws_ssm_parameter" "app_dynamics_key" {
  count = var.app_dynamics_key == null ? 0 : 1
  name  = "/${var.app_name}/app_dynamics_key"
  type  = "String"
  value = var.app_dynamics_key
  tags  = var.tags
}

resource "aws_route53_zone" "custom_zone" {
  name = var.custom_domain != null ? var.custom_domain : "${var.app_name}.byu.edu"
  tags = var.tags
}

resource "aws_resourcegroups_group" "group" {
  name        = var.app_name
  description = "Resources used for ${var.app_name}"
  tags        = var.tags
  resource_query {
    query = <<JSON
{
  "ResourceTypeFilters": [
    "AWS::AllSupported"
  ],
  "TagFilters": [
    {
      "Key": "repo",
      "Values": ["${var.tags["repo"]}"]
    }
  ]
}
JSON
  }
}

output "hosted_zone" {
  value = aws_route53_zone.custom_zone
}
