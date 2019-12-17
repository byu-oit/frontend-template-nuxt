terraform {
  backend "s3" {
    encrypt        = true
    bucket         = "terraform-state-storage-ACCOUNTIDNUMBER"
    dynamodb_table = "terraform-state-lock-ACCOUNTIDNUMBER"
    key            = "APPLICATION-NAME/terraform.tfstate"
    region         = "us-west-2"
  }
}
