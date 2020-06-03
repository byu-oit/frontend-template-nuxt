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
}
resource "aws_ssm_parameter" "callback_url" {
  name  = "/${var.app_name}/callback_url"
  type  = "String"
  value = var.callback_url
}
resource "aws_ssm_parameter" "cloudfront_connection" {
  name  = "/${var.app_name}/s3-cloudfront-connection"
  type  = "String"
  value = random_string.cloudfront_connection.result
}

resource "aws_route53_zone" "custom_zone" {
  name = var.custom_domain != null ? var.custom_domain : "${var.app_name}.byu.edu"
}

output "hosted_zone" {
  value = aws_route53_zone.custom_zone
}
