

# PDF Generator Project

A full-stack application that generates beautifully designed PDFs using user input. The project consists of three main components: a Next.js frontend and two Express.js backends for handling data processing and PDF generation.

## Architecture Overview

- **Frontend**: Next.js + React application for user input and PDF preview
- **Backend 1**: Express.js server for data validation and MongoDB storage
- **Backend 2**: Express.js server for PDF generation

## Prerequisites

- Node.js (v14 or higher)
- MongoDB Atlas account
- npm or yarn package manager

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd pdf-generator
```

### 2. Frontend Setup

```bash
cd frontend
npm install
```

Create `.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:4001
```

### 3. Backend 1 Setup

```bash
cd backend1
npm install
```

Create `.env`:
```
PORT=4001
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.ssvuf.mongodb.net/solruf_pdf
BACKEND_2_URL=http://localhost:4002
```

### 4. Backend 2 Setup

```bash
cd backend2
npm install
npx puppeteer browsers install chrome
```

Create `.env`:
```
PORT=4002
```

### 5. Running the Application

1. Start Backend 2:
```bash
cd backend2
npm run dev
```

2. Start Backend 1:
```bash
cd backend1
npm run dev
```

3. Start Frontend:
```bash
cd frontend
npm run dev
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend 1: http://localhost:4001
- Backend 2: http://localhost:4002

## API Documentation

### Frontend to Backend 1

#### Generate PDF
- **Endpoint**: `POST /api/generate-pdf`
- **Content-Type**: `application/json`
- **Request Body**:
```json
{
  "name": "string",
  "email": "string",
  "reportTitle": "string",
  "content": "string",
  "logoUrl": "string",
  "primaryColor": "string"
}
```
- **Response**: 
  - Success: PDF file stream
  - Error: `{ "error": "error message" }`

### Backend 1 to Backend 2

#### Generate PDF Design
- **Endpoint**: `POST /api/create-pdf`
- **Content-Type**: `application/json`
- **Request Body**: Same as above
- **Response**:
  - Success: PDF buffer
  - Error: `{ "error": "error message" }`

## Testing Instructions

### Frontend Testing

```bash
cd frontend
npm test
```

Test the UI by:
1. Fill in all required fields
2. Click "Preview" to verify data
3. Click "Generate PDF" to create PDF
4. Verify By "Show PDF" preview

### API Testing

Using Postman or similar tool:

1. Test Backend 1 PDF Generation:
```
POST http://localhost:4001/api/generate-pdf
Content-Type: application/json

{
  "name": "Test User",
  "email": "test@example.com",
  "reportTitle": "Test Report",
  "content": "Test Content",
  "logoUrl": "https://example.com/logo.png",
  "primaryColor": "#000000"
}
```





