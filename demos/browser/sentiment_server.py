from flask import Flask, request, jsonify
from transformers import pipeline
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  
sentiment_pipeline = pipeline("sentiment-analysis", model="distilbert-base-uncased-finetuned-sst-2-english")

@app.route("/analyze", methods=["POST"])
def analyze():
    data = request.get_json()
    transcript = data.get("transcript", "")
    if not transcript:
        return jsonify({"error": "Missing transcript"}), 400

    result = sentiment_pipeline(transcript[:512])[0]  # Truncate for safety
    return jsonify({
        "label": result["label"],   # 'POSITIVE' or 'NEGATIVE'
        "score": result["score"]    # Confidence score
    })

if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5005)