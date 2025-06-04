from app.main import handler

event = {
    "version": "2.0",
    "routeKey": "POST /submit",
    "rawPath": "/submit",
    "rawQueryString": "",
    "headers": {
        "content-type": "application/json"
    },
    "requestContext": {
        "http": {
            "method": "POST",
            "path": "/submit",
            "sourceIp": "127.0.0.1",  
            "userAgent": "local"
        }
    },
    "body": '{"name":"Lambda Tester","company":"Local","message":"This is a Lambda test."}',
    "isBase64Encoded": False
}

context = {}

response = handler(event, context)
print("Lambda Response:\n", response)
