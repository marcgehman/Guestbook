resource "aws_dynamodb_table" "guestbook" {
  name         = "GuestbookMessages"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "id"

  attribute {
    name = "id"
    type = "S"
  }

  tags = {
    Environment = "prod"
    Project     = "guestbook"
  }
}