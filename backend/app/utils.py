import random
from fastapi_mail import FastMail, MessageSchema, ConnectionConfig
from pydantic import EmailStr
import os
from dotenv import load_dotenv

load_dotenv()

conf = ConnectionConfig(
    MAIL_USERNAME=os.getenv("EMAIL_USER"),
    MAIL_PASSWORD=os.getenv("EMAIL_PASSWORD"),
    MAIL_FROM=os.getenv("EMAIL_USER"),
    MAIL_PORT=587,
    MAIL_SERVER="smtp.gmail.com",
    MAIL_STARTTLS=True,
    MAIL_SSL_TLS=False,
    USE_CREDENTIALS=True
)

async def send_otp(email: EmailStr, otp: str):
    message = MessageSchema(
        subject="Your Hostel Registration OTP",
        recipients=[email],
        body=f"Your OTP is: {otp}",
        subtype="plain"
    )
    fm = FastMail(conf)
    await fm.send_message(message)

def generate_otp():
    return str(random.randint(100000, 999999))
