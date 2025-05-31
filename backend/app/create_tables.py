import boto3

dynamodb = boto3.resource(
    'dynamodb',
    region_name='us-west-2',
    endpoint_url='http://dynamodb:8000',
    aws_access_key_id='dummy',
    aws_secret_access_key='dummy'
)

def create_guestbook_table():
    try:
        table = dynamodb.create_table(
            TableName='GuestbookMessages',
            KeySchema=[{'AttributeName': 'id', 'KeyType': 'HASH'}],
            AttributeDefinitions=[{'AttributeName': 'id', 'AttributeType': 'S'}],
            ProvisionedThroughput={'ReadCapacityUnits': 5, 'WriteCapacityUnits': 5}
        )
        table.wait_until_exists()
        print("GuestbookMessages table created.")
    except Exception as e:
        print(f"Error: {e}")

create_guestbook_table()
