from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from transformers import pipeline
from pydantic import BaseModel

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://127.0.0.1:8080"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

classifier = pipeline("zero-shot-classification", model="facebook/bart-large-mnli")

class Input(BaseModel):
  text: str

LABELS = ["question", "proposal", "confusion", "statement", "instruction"]

@app.post("/classify")
def classify_text(data: Input):
  result = classifier(data.text, LABELS)
  top_label = result["labels"][0]
  score = result["scores"][0]
  return {"label": top_label, "score": score}