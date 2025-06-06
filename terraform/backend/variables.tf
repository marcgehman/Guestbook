variable "lambda_zip_path" {
  description = "Path to the zipped FastAPI Lambda package"
  type        = string
}

variable "subnet_ids" {
  description = "List of subnet IDs for the ALB"
  type        = list(string)
}

variable "security_group" {
  description = "Security group ID for the ALB"
  type        = string
}