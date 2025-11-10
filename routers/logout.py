from fastapi import APIRouter, Response

router = APIRouter(prefix="/auth", tags=["auth"])

@router.get("/logout")
def logout(response: Response):
    # user_name 쿠키 삭제 (만료일을 과거로)
    response.delete_cookie("user_name")
    return {"message": "Logged out successfully"}
