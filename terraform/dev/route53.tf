resource "aws_acm_certificate" "cert" {
  count = var.url != "" ? 1 : 0

  provider          = aws.aws_n_va
  domain_name       = var.url
  validation_method = "DNS"
}

resource "aws_route53_zone" "main" {
  count = var.url != "" ? 1 : 0

  name = var.url
}

resource "aws_route53_record" "cert_validation" {
  count = var.url != "" ? 1 : 0

  name    = aws_acm_certificate.cert[count.index].domain_validation_options[0].resource_record_name
  type    = aws_acm_certificate.cert[count.index].domain_validation_options[0].resource_record_type
  zone_id = aws_route53_zone.main[count.index].zone_id
  records = [
  aws_acm_certificate.cert[count.index].domain_validation_options[0].resource_record_value]
  ttl = 60
}

resource "aws_route53_record" "custom-url-a" {
  count = var.url != "" ? 1 : 0

  name    = var.url
  type    = "A"
  zone_id = aws_route53_zone.main[count.index].zone_id

  alias {
    evaluate_target_health = false
    name                   = aws_cloudfront_distribution.cdn.domain_name
    zone_id                = aws_cloudfront_distribution.cdn.hosted_zone_id
  }
}

resource "aws_route53_record" "custom-url-4a" {
  count = var.url != "" ? 1 : 0

  name    = var.url
  type    = "AAAA"
  zone_id = aws_route53_zone.main[count.index].zone_id

  alias {
    evaluate_target_health = false
    name                   = aws_cloudfront_distribution.cdn.domain_name
    zone_id                = aws_cloudfront_distribution.cdn.hosted_zone_id
  }
}
