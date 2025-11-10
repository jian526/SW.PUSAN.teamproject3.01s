from fastapi import APIRouter
from pydantic import BaseModel
import numpy as np
import pandas as pd
import joblib

router = APIRouter(prefix="/machine", tags=["machine"])

# 모델 및 전처리기, 스케일러 로딩
model = joblib.load('./model/GBM_model.joblib')
label_encoder = joblib.load('./model/label_encoder.joblib')
scaler = joblib.load('./model/scaler.joblib')
feature_names = joblib.load('./model/feature_names.joblib')

# 입력 데이터 형식
class InputData(BaseModel):
    temperature: float
    humidity: int
    weather: str
    construction: str
    season: str
    process: str

@router.post("/predict")
async def predict(data: InputData):
    # 1. 입력값 정리
    raw_input = {
        "temperature": data.temperature,
        "humidity": data.humidity,
        "weather": data.weather,
        "construction": data.construction,
        "season": data.season,
        "process": data.process
    }

    # 2. DataFrame으로 변환
    df = pd.DataFrame([raw_input])

    # 3. 수치형 정규화 먼저 수행
    num_cols = ['temperature', 'humidity']
    df[num_cols] = scaler.transform(df[num_cols])

    # 4. 범주형만 원핫 인코딩
    categorical_cols = ['weather', 'construction', 'season', 'process']
    df_encoded = pd.get_dummies(df, columns=categorical_cols)

    # 5. 누락된 열 채우기
    for col in feature_names:
        if col not in df_encoded.columns:
            df_encoded[col] = 0

    # 6. 컬럼 순서 맞추기
    df_encoded = df_encoded[feature_names]

    # 7. 예측
    x = df_encoded.to_numpy()
    proba = model.predict_proba(x)[0]

    # 8. 예측 결과 포맷
    predictions = []
    for idx, prob in enumerate(proba):
        label = label_encoder.classes_[idx]
        prob_percent = round(prob * 100, 2)
        predictions.append({
            "label": label,
            "probability": f"{prob_percent}%"
        })

    return {"predictions": predictions}
