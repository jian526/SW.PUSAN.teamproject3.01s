# backend/routes/cases.py (또는 main.py에 직접 넣어도 됨)

from fastapi import APIRouter, HTTPException
from database import get_connection
import mysql.connector

router = APIRouter()

@router.get("/cases")
def get_cases():
    try:
        conn = get_connection()
        cursor = conn.cursor(dictionary=True)

        query = "SELECT * FROM accident_cases"
        cursor.execute(query)
        result = cursor.fetchall()

        return result

    except mysql.connector.Error as e:
        raise HTTPException(status_code=500, detail=str(e))

    finally:
        if 'cursor' in locals():
            cursor.close()
        if 'conn' in locals():
            conn.close()
