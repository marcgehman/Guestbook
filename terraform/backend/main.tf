resource "aws_iam_role" "lambda_exec" {
  name = "guestbook_lambda_exec"

  assume_role_policy = jsonencode({
    Version = "2012-10-17",
    Statement = [{
      Action    = "sts:AssumeRole",
      Effect    = "Allow",
      Principal = {
        Service = "lambda.amazonaws.com"
      }
    }]
  })
}

resource "aws_iam_role_policy_attachment" "lambda_basic_exec" {
  role       = aws_iam_role.lambda_exec.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

resource "aws_iam_role_policy_attachment" "lambda_dynamo_access" {
  role       = aws_iam_role.lambda_exec.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonDynamoDBFullAccess"
}

resource "aws_lambda_function" "guestbook" {
  function_name = "guestbook-backend"
  handler       = "main.handler"
  runtime       = "python3.10"
  role          = aws_iam_role.lambda_exec.arn
  filename      = var.lambda_zip_path
  source_code_hash = filebase64sha256(var.lambda_zip_path)
  timeout = 10 # Increase default timeout of 3.0 seconds for longer request.
  environment {
    variables = {
      DYNAMODB_TABLE = "GuestbookMessages"
    }
  }
}

resource "aws_lb" "api_alb" {
  name               = "guestbook-api-alb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [var.security_group]
  subnets            = var.subnet_ids 
}

resource "aws_lb_target_group" "lambda" {
  name     = "guestbook-lambda-tg"
  target_type = "lambda"
}

# Grant the ALB permission to invoke the Lambda from the load balancer itself.
# This is needed for incoming HTTP requests.
resource "aws_lambda_permission" "alb_invoke" {
  statement_id  = "AllowALBInvoke"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.guestbook.function_name
  principal     = "elasticloadbalancing.amazonaws.com"
  source_arn    = aws_lb.api_alb.arn
}

# Grants the Target Group permission to register and manage the Lambda as a backend.
# This is required before registering the Lambda in the target group.
resource "aws_lambda_permission" "allow_alb" {
  statement_id  = "AllowExecutionFromALB"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.guestbook.function_name
  principal     = "elasticloadbalancing.amazonaws.com"
  source_arn    = aws_lb_target_group.lambda.arn
}

resource "aws_lambda_permission" "allow_alb_target_group" {
  statement_id  = "AllowExecutionFromALBTargetGroup"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.guestbook.function_name
  principal     = "elasticloadbalancing.amazonaws.com"
  source_arn    = aws_lb_target_group.lambda.arn
}


resource "aws_lb_target_group_attachment" "lambda_target" {
  target_group_arn = aws_lb_target_group.lambda.arn
  target_id        = aws_lambda_function.guestbook.arn
}

resource "aws_lb_listener" "http" {
  load_balancer_arn = aws_lb.api_alb.arn
  port              = 80
  protocol          = "HTTP"

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.lambda.arn
  }
}
