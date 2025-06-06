output "lambda_function_name" {
  value = aws_lambda_function.guestbook.function_name
}

output "alb_dns_name" {
  value = aws_lb.api_alb.dns_name
}
