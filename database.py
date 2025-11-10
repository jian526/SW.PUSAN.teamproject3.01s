import mysql.connector
from mysql.connector import Error

# fastapi와 mysql을 연결하는 함수 생성
def get_connection():
    try:
        conn = mysql.connector.connect(
            host="127.0.0.1",
            user="root",
            password="12345",
            database="accident_db"
        )
        return conn
    except Error as e:
        print(f"[DB 연결 오류] {e}")
        return None