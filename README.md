# Guestbook

Guestbook is a web app where visitors can leave a message with their name and company. Submitted messages are stored in a cloud database and displayed in a live visitor log along with their location on a world map. This demonstrates a modern full-stack architecture, cloud deployment, and real-time visitor interaction.

> **Live Demo**: [http://guestbook.marcgehman.com](http://guestbook.marcgehman.com)

## Project Highlights

-  **Serverless** - Powered by AWS-managed services
-  **Fast, lightweight React frontend** with real-time data rendering
-  **Global visitor tracking** with IP-based geolocation & visual mapping
-  **Secure backend** with FastAPI, CORS handling, and request validation
-  **Production-grade architecture** using infrastructure-as-code (Terraform)

---

## Features

-  Visitors can sign the guestbook with Name, Company, and Message
-  All entries are saved to DynamoDB with a timestamp and geolocation
-  Entries are displayed in a sortable visitor log
-  Integrated map visualization using Leaflet
-  Statistics panel to analyze usage patterns
-  Deployed live to `guestbook.marcgehman.com` with a custom subdomain

---

##  Tech Stack

### 🖥️ Frontend

- React 18 (Vite)
- Leaflet.js (for interactive maps)
- Tailwind CSS (custom theme)
- Axios (for async data handling)

### ⚙️ Backend
- FastAPI (Python 3.10, ASGI)
- mangum (for AWS Lambda compatibility)
- boto3 (AWS SDK for Python)
- DynamoDB (fully managed NoSQL)

### ☁️ Cloud Infrastructure (AWS)

| Component | Service |
|----------|---------|
| Frontend Hosting | S3 Bucket |
| Custom Domain | Squarespace DNS + S3 |
| Backend | AWS Lambda (via ALB trigger) |
| Data Storage | DynamoDB |
| Certificate Management | ACM (planned for CloudFront HTTPS) |
| Infrastructure Provisioning | Terraform |

---

##  Architecture Overview

```text
Browser
  ↓
guestbook.marcgehman.com
  ↓
[S3 Bucket (React App)]
  ↓
React Form → Axios POST /submit
  ↓
ALB → Lambda → FastAPI → DynamoDB
  ↓
ALB ← Lambda ← FastAPI ← Axios GET /messages