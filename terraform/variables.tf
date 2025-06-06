variable "domain_name" {
  description = "Custom domain name"
  type        = string
}

variable "lambda_zip_path" {
  description = "Path to Lambda zip file"
  type        = string
}

variable "subnet_ids" {
  description = "List of public subnet IDs"
  type        = list(string)
}

variable "security_group" {
  description = "ID of the security group that allows ALB traffic"
  type        = string
}
