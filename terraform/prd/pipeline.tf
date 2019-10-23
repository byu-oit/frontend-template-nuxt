resource "aws_iam_role" "codepipeline_role" {
  name                 = "${var.app-name}-codepipeline-role"
  permissions_boundary = "arn:aws:iam::${data.aws_caller_identity.current.account_id}:policy/iamRolePermissionBoundary"
  assume_role_policy   = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "codepipeline.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
EOF
}

resource "aws_iam_role_policy" "codepipeline_policy" {
  name = "${var.app-name}-codepipeline_policy"
  role = aws_iam_role.codepipeline_role.id

  policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect":"Allow",
      "Action": [
        "s3:GetObject",
        "s3:GetObjectVersion",
        "s3:GetBucketVersioning",
        "s3:PutObject"
      ],
      "Resource": [
        "${aws_s3_bucket.codebuild-bucket.arn}",
        "${aws_s3_bucket.codebuild-bucket.arn}/*",
        "${aws_s3_bucket.static-website.arn}",
        "${aws_s3_bucket.static-website.arn}/*"
      ]
    },
    {
      "Effect": "Allow",
      "Action": [
        "codebuild:BatchGetBuilds",
        "codebuild:StartBuild",
        "codedeploy:*"
      ],
      "Resource": "*"
    }
  ]
}
EOF
}

resource "aws_codepipeline" "pipeline" {
  name     = var.app-name
  role_arn = aws_iam_role.codepipeline_role.arn
  artifact_store {
    location = aws_s3_bucket.codebuild-bucket.bucket
    type     = "S3"
  }
  stage {
    name = "Source"
    action {
      category         = "Source"
      name             = "Source"
      owner            = "ThirdParty"
      provider         = "GitHub"
      version          = "1"
      output_artifacts = ["source_output"]

      configuration = {
        Owner      = "byu-oit"
        Repo       = var.repo-name
        Branch     = var.branch
        OAuthToken = data.aws_ssm_parameter.github-token.value
      }
    }
  }

  stage {
    name = "Build"
    action {
      name             = "Build"
      category         = "Build"
      owner            = "AWS"
      provider         = "CodeBuild"
      input_artifacts  = ["source_output"]
      output_artifacts = ["build_output"]
      version          = "1"

      configuration = {
        ProjectName = "${var.app-name}-s3staticsite-Build"
      }
    }
  }

  stage {
    name = "Deploy"
    action {
      category        = "Deploy"
      name            = "Deploy"
      owner           = "AWS"
      provider        = "S3"
      version         = "1"
      input_artifacts = ["build_output"]

      configuration = {
        BucketName = aws_s3_bucket.static-website.bucket
        Extract    = true
      }
    }
  }
}

resource "aws_s3_bucket" "codebuild-bucket" {
  bucket = "${var.app-name}-${var.branch}-codebuild-cache"
}

resource "aws_codebuild_project" "build-project" {
  name         = "${var.app-name}-s3staticsite-Build"
  service_role = data.aws_iam_role.power-builder.arn
  artifacts {
    type = "CODEPIPELINE"
  }
  environment {
    compute_type    = "BUILD_GENERAL1_SMALL"
    image           = "aws/codebuild/standard:2.0"
    type            = "LINUX_CONTAINER"
    privileged_mode = true
    environment_variable {
      name  = "AWS_ACCOUNT_ID"
      value = data.aws_caller_identity.current.account_id
    }
  }
  cache {
    type     = "S3"
    location = "${aws_s3_bucket.codebuild-bucket.bucket}/cache"
  }
  source {
    type      = "CODEPIPELINE"
    buildspec = "buildspec.yml"
  }
}
