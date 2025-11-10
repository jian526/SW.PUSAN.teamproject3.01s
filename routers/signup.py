from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from database import get_connection
import mysql.connector

router = APIRouter(prefix="/user", tags=["user"])

class UserRegister(BaseModel):
    id: str
    password: str
    name: str
    email: str
    tel: str

@router.post("/signup")
def signup(data: UserRegister):
    try:
        # DB 연결
        conn = get_connection()
        cursor = conn.cursor()
        # SQL 쿼리 작성
        sql = """
            INSERT INTO user_data (id, password, name, email, tel)
            VALUES (%s, %s, %s, %s, %s)
        """
        
        values = (
            data.id,
            data.password,
            data.name,
            data.email,
            data.tel
        )

        # 쿼리 실행
        cursor.execute(sql, values)
        conn.commit()

        # 성공시 메세지
        return {
            "message": "User registered sucessfully",
            "user_id": data.id,
            "name": data.name
        }

    except mysql.connector.IntegrityError as e:
        if e.errno == 1062:
            raise HTTPException(status_code=400, detail="ID already exists.")
        raise HTTPException(status_code=500, detail=str(e))

    finally:
        # 커넥션 종료
        if 'cursor' in locals() and cursor: # cursor 종료
            cursor.close()
        if 'conn' in locals() and conn: # db연결 종료
            conn.close()