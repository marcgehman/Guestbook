import boto3
import uuid
from datetime import datetime
import os
import requests
from decimal import Decimal

dynamodb = boto3.resource(
    'dynamodb',
    region_name='us-east-2'
)

def get_table():
    return dynamodb.Table("GuestbookMessages")

def geolocate_ip(ip_address):
    try:
        print("Geolocating IP address:", ip_address)
        res = requests.get(f"http://ip-api.com/json/{ip_address}")
        data = res.json()

        city = data.get('city', 'Unknown')
        region = data.get('regionName', 'Unknown')
        country = data.get('country', 'Unknown')
        lat = data.get('lat', None)
        lon = data.get('lon', None)

        return {
            "full": f"{city}, {region}, {country}",
            "latitude": lat,
            "longitude": lon
        }
    except Exception:
        return {
            "full": "Unknown",
            "latitude": None,
            "longitude": None
        }


def save_message(name, company, message, ip=""):
    loc = geolocate_ip(ip)
    item = {
        "id": str(uuid.uuid4()),
        "name": name,
        "company": company,
        "message": message,
        "timestamp": datetime.utcnow().isoformat(),
        "location": loc["full"],
        "latitude": Decimal(str(loc["latitude"])) if loc["latitude"] is not None else None,
        "longitude": Decimal(str(loc["longitude"])) if loc["longitude"] is not None else None
    }
    get_table().put_item(Item=item)
    return item


def list_messages():
    table = get_table()
    response = table.scan()
    return response.get("Items", [])
