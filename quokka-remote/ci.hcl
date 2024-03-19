provider "aws" {
  region = "us-sounth-1" # Singap rẻ
}

# Create S3 bucket
resource "aws_s3_bucket" "quokka" {
  bucket = "quokka"
  acl    = "public"
}

# Create EC2 instance
resource "aws_instance" "nk" {
  ami           = "ami-"
  instance_type = "t2.micro"


  tags = {
    Name = "nk"
  }
}

# Create CodePipeline
resource "aws_codepipeline" "nk_pipeline" {
  name     = "nk-pipeline"
  role_arn = aws_iam_role.my_pipeline_role.arn

  artifact_store {
    location = aws_s3_bucket.my_bucket.bucket
    type     = "S3"
  }

  stage {
    name = "Source"

    action {
      name             = "Source"
      category         = "Source"
      owner            = "AWS"
      provider         = "S3"
      version          = "1"
      output_artifacts = ["source_output"]

      configuration = {
        S3Bucket = aws_s3_bucket.quokka.bucket
        S3ObjectKey = "source.zip"
      }
    }
  }

  stage {
    name = "Deploy"

    action {
      name             = "Deploy"
      category         = "Deploy"
      owner            = "AWS"
      provider         = "CodeDeploy"
      version          = "1"
      input_artifacts  = ["source_output"]

      configuration = {
        ApplicationName         = "m"
        DeploymentGroupName     = ""
        DeploymentConfigName    = "CodeDeployDefault.AllAtOnce"
      }
    }
  }
}

# Create IAM role for CodePipeline
resource "aws_iam_role" "nk_pipeline_role" {
  name = "nk-pipeline-role"

  assume_role_policy = <<EOF
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

  tags = {
    Name = "nk-pipeline-role"
  }
}

# Attach necessary policies to the CodePipeline role
resource "aws_iam_role_policy_attachment" "my_pipeline_policy_attachment" {
  role       = aws_iam_role.nk_pipeline_role.name
  policy_arn = "arn:aws:iam::aws:policy/AWSCodeDeployFullAccess"
}

# Output the S3 bucket and EC2 instance details
output "s3_bucket_name" {
  value = aws_s3_bucket.quokka
}

output "ec2_instance_id" {
  value = aws_instance.nk
}
