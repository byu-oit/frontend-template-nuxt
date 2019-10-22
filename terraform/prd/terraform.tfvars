app-name            = "APPLICATION-NAME" // Application name
region              = "us-west-2" // Region you want to deploy to
repo-name           = "APPLICATION-NAME" // Repository name
branch              = "master" // Branch to trigger CodePipeline
index-doc           = "index.html" // DO NOT CHANGE (unless you know why you're changing it)
public-dir          = "/dist" // DO NOT CHANGE (unless you know why you're changing it)
account-cert-arn    = "CERT-ARN" // Account URL cert ARD (from N. Virginia region)
account-r53-zone-id = "ZONE-ID" // Route 53 Zone ID for account hosted zone
price-class         = "100" // DO NOT CHANGE (unless you know why you're changing it)
// Uncomment if you want a custom URL
// url = "URL"
