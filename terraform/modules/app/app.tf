variable "site_url" {}
variable "hosted_zone_id" {}
variable "s3_bucket_name" {}
variable "tags" {
  type = map(string)
}

data "aws_route53_zone" "hosted_zone" {}

module "s3_site" {
  source               = "github.com/byu-oit/terraform-aws-s3staticsite?ref=v2.0.0"
  site_url             = var.site_url
  hosted_zone_id       = var.hosted_zone_id
  s3_bucket_name       = var.s3_bucket_name
  tags = var.tags
}

output "site_bucket" {
  value = module.s3_site.site_bucket
}
