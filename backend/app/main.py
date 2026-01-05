from fastapi import FastAPI, HTTPException, UploadFile, File, Body
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, EmailStr
from pymongo import MongoClient
from fastapi_mail import FastMail, MessageSchema, ConnectionConfig
from dotenv import load_dotenv
from datetime import date
from datetime import datetime
import os
import random
from bson import ObjectId

load_dotenv()

app = FastAPI()

app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")


# ---------------- CORS ----------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------------- MongoDB ----------------
client = MongoClient(os.getenv("MONGO_URI"))
db = client["hostelDB"]
students = db["students"]
mess = db["mess"]
complaints = db["complaints"]
leaves = db["leaves"]


# ---------------- Email SMTP ----------------
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

# ---------------- Models ----------------
class EmailModel(BaseModel):
    email: EmailStr

class StudentRegister(BaseModel):
    email: EmailStr
    password: str
    data: dict


# ---------------- Home ----------------
@app.get("/")
def home():
    return {"msg": "Backend running 👍"}


# ---------------- Send OTP ----------------
@app.post("/send-otp")
async def send_otp(body: EmailModel):

    otp = str(random.randint(100000, 999999))

    message = MessageSchema(
        subject="Hostel Portal OTP",
        recipients=[body.email],
        body=f"Your OTP is {otp}",
        subtype="plain"
    )

    fm = FastMail(conf)

    try:
        await fm.send_message(message)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    return {"otp": otp, "message": "OTP sent"}


# ---------------- Register Student ----------------
@app.post("/register")
async def register_student(req: StudentRegister):

    # check duplicate email
    existing = students.find_one({"email": req.email})

    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    students.insert_one({
        "email": req.email,
        "password": req.password,
        "details": req.data,
        "status": "pending"        # NEW important field
    })

    return {"message": "Registration completed, wait for rector approval"}


@app.get("/rector/pending-students")
def get_pending_students():
    data = list(students.find({"status": "pending"}, {"password": 0}))
    for i in data:
        i["_id"] = str(i["_id"])
    return data


@app.post("/rector/approve/{email}")
def approve_student(email: str):
    students.update_one(
        {"email": email},
        {"$set": {"status": "approved"}}
    )
    return {"message": "Student approved"}


@app.post("/rector/reject/{email}")
def reject_student(email: str):
    students.update_one(
        {"email": email},
        {"$set": {"status": "rejected"}}
    )
    return {"message": "Student rejected"}

class LoginModel(BaseModel):
    email: EmailStr
    password: str


@app.post("/login")
def login(req: LoginModel):

    user = students.find_one({"email": req.email})

    if not user:
        raise HTTPException(status_code=404, detail="User not registered")

    if user["password"] != req.password:
        raise HTTPException(status_code=400, detail="Wrong password")

    if user["status"] == "pending":
        raise HTTPException(status_code=401, detail="Approval pending from rector")

    if user["status"] == "rejected":
        raise HTTPException(status_code=401, detail="Your request was rejected")

    return {"message": "Login success", "status": user["status"]}

@app.get("/rector/active-students")
def get_active_students():
    data = list(students.find({"status": "approved"}, {"password": 0}))
    for s in data:
        s["_id"] = str(s["_id"])
    return data

@app.get("/student/{email}")
def get_student(email: str):
    s = students.find_one({"email": email})
    s["_id"] = str(s["_id"])
    return s

# mess menu section
# ADD / UPDATE MENU
@app.post("/rector/mess/save")
def save_menu(data: dict):

    data["_id"] = "today_menu"
    data["date"] = datetime.now().strftime("%d-%m-%Y")

    mess.replace_one(
        {"_id": "today_menu"},
        data,
        upsert=True
    )

    return {"message": "Mess menu updated"}


# GET MENU FOR ALL
@app.get("/mess/today")
def get_menu():

    menu = mess.find_one({"_id": "today_menu"})

    if not menu:
        return {}

    menu["_id"] = str(menu["_id"])
    return menu

# room assign section
@app.post("/rector/assign-room/{email}")
def assign_room(email: str, data: dict = Body(...)):

    floor = data.get("floor")
    room = data.get("room")
    bed = data.get("bed")

    # check already assigned?
    occupied = students.find_one({
        "floor": floor,
        "room": room,
        "bed": bed,
        "status": "approved"
    })

    if occupied:
        raise HTTPException(status_code=400, detail="This bed is already occupied")

    students.update_one(
        {"email": email},
        {"$set": {
            "floor": floor,
            "room": room,
            "bed": bed
        }}
    )

    return {"message": "Room assigned successfully"}

# upload-photo section
@app.post("/upload-photo/{email}")
async def upload_photo(email: str, file: UploadFile = File(...)):

    contents = await file.read()

    file_name = f"{email}.jpg"

    with open(f"uploads/{file_name}", "wb") as f:
        f.write(contents)

    students.update_one(
        {"email": email},
        {"$set": {"photo": file_name}}
    )

    return {"message": "uploaded", "file": file_name}

# complaint section 
# student side
@app.post("/complaint/add")
def add_complaint(data: dict):

    complaints.insert_one({
        "email": data["email"],
        "category": data["category"],
        "issue": data["issue"],
        "description": data.get("description", ""),
        "status": "pending"
    })

    return {"message": "Complaint submitted"}

@app.get("/complaint/student/{email}/{status}")
def get_student_complaints(email: str, status: str):

    data = list(complaints.find(
        {"email": email, "status": status}
    ))

    for c in data:
        c["_id"] = str(c["_id"])

    return data

@app.get("/complaint/rector/{status}")
def rector_view(status: str):

    data = list(complaints.find({"status": status}))

    for c in data:
        c["_id"] = str(c["_id"])

    return data

@app.post("/complaint/accept/{cid}")
def accept_complaint(cid: str):

    complaints.update_one(
        {"_id": ObjectId(cid)},
        {"$set": {"status": "working"}}
    )

    return {"message": "Complaint accepted"}

@app.post("/complaint/complete/{cid}")
def rector_complete(cid: str):

    complaints.update_one(
        {"_id": ObjectId(cid)},
        {"$set": {"status": "completed"}}
    )

    return {"message": "Complaint completed"}

@app.post("/complaint/student-complete/{cid}")
def student_completed(cid: str):

    complaints.update_one(
        {"_id": ObjectId(cid)},
        {"$set": {"status": "completed"}}
    )

    return {"message": "Complaint closed by student"}

# rector side
# ---------- helper: attach student data ----------

@app.get("/complaint/rector/pending")
def rector_pending():
    data = list(complaints.find({"status": "pending"}))

    for c in data:
        stu = students.find_one(
            {"email": c["email"]},
            {
                "details.studentName": 1,
                "details.mobile1": 1,
                "floor": 1,
                "room": 1,
                "bed": 1
            }
        )

        c["_id"] = str(c["_id"])

        if stu:
            stu["_id"] = str(stu["_id"])
            c["student"] = stu

    return data


@app.get("/complaint/rector/working")
def rector_working():
    data = list(complaints.find({"status": "working"}))

    for c in data:
        stu = students.find_one(
            {"email": c["email"]},
            {
                "details.studentName": 1,
                "details.mobile1": 1,
                "floor": 1,
                "room": 1,
                "bed": 1
            }
        )

        c["_id"] = str(c["_id"])

        if stu:
            stu["_id"] = str(stu["_id"])
            c["student"] = stu

    return data


@app.get("/complaint/rector/completed")
def rector_completed():
    data = list(complaints.find({"status": "completed"}))

    for c in data:
        stu = students.find_one(
            {"email": c["email"]},
            {
                "details.studentName": 1,
                "details.mobile1": 1,
                "floor": 1,
                "room": 1,
                "bed": 1
            }
        )

        c["_id"] = str(c["_id"])

        if stu:
            stu["_id"] = str(stu["_id"])
            c["student"] = stu

    return data


@app.post("/complaint/start/{cid}")
def rector_start(cid: str):
    complaints.update_one(
        {"_id": ObjectId(cid)},
        {"$set": {"status": "working"}}
    )
    return {"message": "Moved to working"}


@app.post("/complaint/rector-complete/{cid}")
def rector_complete(cid: str):
    complaints.update_one(
        {"_id": ObjectId(cid)},
        {"$set": {"status": "completed"}}
    )
    return {"message": "Marked completed by rector"}


# helper function -> attach student info
def attach_student_details(l):

    stu = students.find_one(
        {"email": l["email"]},
        {
            "details.studentName": 1,
            "mobile1": 1,
            "floor": 1,
            "room": 1,
            "bed": 1
        }
    )

    if stu:
        stu["_id"] = str(stu["_id"])
        l["student"] = stu

    l["_id"] = str(l["_id"])
    return l


# ---------------- STUDENT APPLY LEAVE ----------------
@app.post("/leave/apply")
def apply_leave(data: dict):

    data["status"] = "pending"

    leaves.insert_one(data)

    return {"message": "Leave applied"}


# ---------------- STUDENT VIEW OWN LEAVES ----------------
@app.get("/student/leaves/{email}")
def get_student_leaves(email: str):

    result = list(
        leaves.find({"email": email}).sort("_id", -1)
    )

    return [attach_student_details(l) for l in result]


# ---------------- PENDING REQUESTS (RECTOR) ----------------
@app.get("/rector/leaves/pending")
def rector_pending_leaves():

    result = list(leaves.find({"status": "pending"}).sort("_id", -1))

    for l in result:

        stu = students.find_one(
            {"email": l["email"]},
            {
                "details.studentName": 1,
                "details.mobile1": 1,
                "floor": 1,
                "room": 1,
                "bed": 1
            }
        )

        if stu:
            stu["_id"] = str(stu["_id"])
            l["student"] = stu

        l["_id"] = str(l["_id"])

    return result



# ---------------- APPROVE LEAVE ----------------
@app.post("/rector/leaves/approve/{leave_id}")
def approve_leave(leave_id: str):

    leaves.update_one(
        {"_id": ObjectId(leave_id)},
        {"$set": {"status": "approved"}}
    )

    return {"message": "Leave approved"}


# ---------------- REJECT LEAVE ----------------
@app.post("/rector/leaves/reject/{leave_id}")
def reject_leave(leave_id: str):

    leaves.update_one(
        {"_id": ObjectId(leave_id)},
        {"$set": {"status": "rejected"}}
    )

    return {"message": "Leave rejected"}


# ---------------- APPROVED LEAVES LIST ----------------
@app.get("/rector/leaves/approved")
def rector_approved_leaves():

    result = list(leaves.find({"status": "approved"}).sort("_id", -1))

    for l in result:

        stu = students.find_one(
            {"email": l["email"]},
            {
                "details.studentName": 1,
                "details.mobile1": 1,
                "floor": 1,
                "room": 1,
                "bed": 1
            }
        )

        if stu:
            stu["_id"] = str(stu["_id"])
            l["student"] = stu   # <<--- IMPORTANT

        l["_id"] = str(l["_id"])

    return result



# ---------------- REJECTED LEAVES LIST ----------------
@app.get("/rector/leaves/rejected")
def rector_rejected_leaves():

    result = list(leaves.find({"status": "rejected"}).sort("_id", -1))

    for l in result:

        stu = students.find_one(
            {"email": l["email"]},
            {
                "details.studentName": 1,
                "details.mobile1": 1,
                "floor": 1,
                "room": 1,
                "bed": 1
            }
        )

        if stu:
            stu["_id"] = str(stu["_id"])
            l["student"] = stu

        l["_id"] = str(l["_id"])

    return result


# old student 
@app.post("/rector/move-old/{email}")
def move_old(email: str):
    students.update_one(
        {"email": email},
        {"$set": {"status": "old"}}
    )
    return {"message": "student moved to old"}

@app.get("/rector/old-students")
def old_students():
    data = list(students.find({"status": "old"}))
    for s in data:
        s["_id"] = str(s["_id"])
    return data

# detils Student
@app.get("/student-by-id/{sid}")
def get_student_by_id(sid: str):
    s = students.find_one({"_id": ObjectId(sid)})
    if not s:
        return {}
    s["_id"] = str(s["_id"])
    return s

# Chnage password
@app.post("/student/change-password")
def change_password(data: dict):

    email = data["email"]
    old = data["old_password"]
    new = data["new_password"]

    user = students.find_one({"email": email})

    if not user:
        raise HTTPException(status_code=404, detail="Student not found")

    if user.get("password") != old:
        raise HTTPException(status_code=400, detail="Old password is incorrect")

    students.update_one(
        {"email": email},
        {"$set": {"password": new}}
    )

    return {"message": "Password updated successfully"}