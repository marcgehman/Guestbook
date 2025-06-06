provider "aws" {
  region = "us-east-2"
}

module "frontend" {
  source      = "./frontend"
  domain_name = "guestbook.marcgehman.com"   
}

module "backend" {
  source           = "./backend"
  lambda_zip_path  = var.lambda_zip_path
  security_group   = var.security_group
  subnet_ids       = var.subnet_ids
}

module "data" {
  source = "./data"
}