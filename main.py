from fastapi import FastAPI # FastAPI로 백엔드 구성
from routers import signup, login, logout, cases, machine # routers 폴더에서 라우터들 등록
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# 다른 노드에서의 접근은 허락
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # 프론트엔드 주소
    allow_credentials=True,  # 쿠키/세션 허용
    allow_methods=["*"], # 모든 HTTP 메서드 허용
    allow_headers=["*"], # 모든 헤더 허용
)

#  라우터 연결
app.include_router(signup.router)   
app.include_router(login.router)
app.include_router(logout.router)
app.include_router(cases.router)
app.include_router(machine.router)
