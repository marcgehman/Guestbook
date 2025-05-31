FROM python:3.10-slim
WORKDIR /app

COPY requirements.txt .
RUN pip install -r requirements.txt

COPY app/ ./app
CMD ["sh", "-c", "python app/create_tables.py && uvicorn app.main:app --host 0.0.0.0 --port 8000"]
