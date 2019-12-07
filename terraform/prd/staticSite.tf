resource "aws_s3_bucket" "static-website" {
  bucket = "${var.app-name}-${var.branch}-s3staticsite"

  website {
    index_document = var.index-doc
  }
}

data "aws_iam_policy_document" "static_website_read_with_secret" {
  statement {
    sid       = "1"
    actions   = ["s3:GetObject"]
    resources = ["${aws_s3_bucket.static-website.arn}/*"]

    principals {
      identifiers = ["*"]
      type        = "AWS"
    }

    condition {
      test     = "StringEquals"
      values   = [data.aws_ssm_parameter.s3-cloudfront-connection.value]
      variable = "aws:UserAgent"
    }
  }
}

resource "aws_s3_bucket_policy" "static_website_read_with_secret" {
  bucket = aws_s3_bucket.static-website.id
  policy = data.aws_iam_policy_document.static_website_read_with_secret.json
}

resource "aws_cloudfront_distribution" "cdn" {
  price_class = "PriceClass_${var.price-class}"
  origin {
    domain_name = aws_s3_bucket.static-website.website_endpoint
    origin_id   = aws_s3_bucket.static-website.bucket

    custom_origin_config {
      http_port              = 80
      https_port             = 443
      origin_protocol_policy = "http-only"
      origin_ssl_protocols   = ["TLSv1.2", "TLSv1.1", "TLSv1"]
    }

    custom_header {
      name  = "User-Agent"
      value = data.aws_ssm_parameter.s3-cloudfront-connection.value
    }
  }

  comment             = "CDN for ${var.app-name} S3 Bucket"
  enabled             = true
  is_ipv6_enabled     = true
  default_root_object = var.index-doc
  aliases             = var.url != "" ? [var.url] : ["${var.app-name}.${data.aws_iam_account_alias.current.account_alias}.amazon.byu.edu"]

  default_cache_behavior {
    target_origin_id = aws_s3_bucket.static-website.bucket
    allowed_methods  = ["GET", "HEAD"]
    cached_methods   = ["GET", "HEAD"]

    forwarded_values {
      query_string = false
      cookies {
        forward = "none"
      }
    }
    viewer_protocol_policy = "redirect-to-https"
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    acm_certificate_arn      = var.url == "" ? data.aws_acm_certificate.nva_account_cert.arn : aws_acm_certificate.cert[0].arn
    ssl_support_method       = "sni-only"
    minimum_protocol_version = "TLSv1.1_2016"
  }
}

resource "aws_route53_record" "alias-a" {
  count = var.url == "" ? 1 : 0

  name    = "${var.app-name}.${data.aws_iam_account_alias.current.account_alias}.amazon.byu.edu"
  type    = "A"
  zone_id = data.aws_route53_zone.account_hosted_zone.id

  alias {
    evaluate_target_health = false
    name                   = aws_cloudfront_distribution.cdn.domain_name
    zone_id                = aws_cloudfront_distribution.cdn.hosted_zone_id
  }
}

resource "aws_route53_record" "alias-4a" {
  count = var.url == "" ? 1 : 0

  name    = "${var.app-name}.${data.aws_iam_account_alias.current.account_alias}.amazon.byu.edu"
  type    = "AAAA"
  zone_id = data.aws_route53_zone.account_hosted_zone.id

  alias {
    evaluate_target_health = false
    name                   = aws_cloudfront_distribution.cdn.domain_name
    zone_id                = aws_cloudfront_distribution.cdn.hosted_zone_id
  }
}
