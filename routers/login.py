from fastapi import APIRouter, HTTPException, Form
from database import get_connection
import mysql.connector

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/login")
def login(id: str = Form(...), password: str = Form(...)):
    try:
        conn = get_connection()
        cursor = conn.cursor(dictionary=True)

        sql = "SELECT * FROM user_data WHERE id = %s AND password = %s"
        cursor.execute(sql, (id, password)) # 
        user = cursor.fetchone()

        if user:
            return {
                "message": "Login successful",
                "user_id": user["id"],
                "name": user["name"]
            }
        else:
            raise HTTPException(status_code=401, detail="Invalid credentials")

    except mysql.connector.Error as e:
        raise HTTPException(status_code=500, detail=str(e))

    finally:
        if 'cursor' in locals() and cursor:
            cursor.close()
        if 'conn' in locals() and conn:
            conn.close()