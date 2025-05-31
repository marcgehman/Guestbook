import boto3
import uuid
from datetime import datetime
import os
import requests

dynamodb = boto3.resource(
    'dynamodb',
    region_name='us-west-2',
    endpoint_url=os.getenv('DYNAMODB_ENDPOINT', 'http://localhost:8000'),
    aws_access_key_id='dummy',
    aws_secret_access_key='dummy'
)

def get_table():
    return dynamodb.Table("GuestbookMessages")

def geolocate_ip(ip_address):
    try:
        print("Geolocating IP address:", ip_address)
        res = requests.get(f"http://ip-api.com/json/{ip_address}")
        data = res.json()
        return f"{data.get('city', 'Unknown')}, {data.get('country', 'Unknown')}"
    except Exception:
        return "Unknown"

def save_message(name, company, message, ip=""):
    item = {
        "id": str(uuid.uuid4()),
        "name": name,
        "company": company,
        "message": message,
        "timestamp": datetime.utcnow().isoformat(),
        "location": geolocate_ip(ip)
    }
    get_table().put_item(Item=item)
    return item

def list_messages():
    table = get_table()
    response = table.scan()
    return response.get("Items", [])
