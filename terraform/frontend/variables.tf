variable "domain_name" {
  description = "Custom domain for the React app"
  type        = string
}

variable "react_bucket_name" {
  default = "guestbook-marcgehman-app"
}
