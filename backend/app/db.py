from pymongo import MongoClient
import os
from dotenv import load_dotenv

load_dotenv()

client = MongoClient(os.getenv("MONGO_URI"))
db = client["hostelDB"]

students = db["students"]
complaints = db["complaints"]
mess = db["mess"]
leaves = db["leaves"]
