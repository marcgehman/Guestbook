from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from .db import save_message, list_messages
from pydantic import BaseModel
from typing import Optional

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class MessageForm(BaseModel):
    name: str
    company: str
    message: str
    ip: Optional[str] = ""

@app.get("/messages")
def get_messages():
    return list_messages()

@app.post("/submit")
async def submit_message(form: MessageForm, request: Request):
    # Trust 'x-forwarded-for' if deployed behind proxy
    forwarded = request.headers.get("x-forwarded-for")
    client_ip = forwarded.split(",")[0] if forwarded else request.client.host
    return save_message(form.name, form.company, form.message, form.ip)
