# API Routes Template

This document outlines all the API endpoints needed for the GNI Campus Connect application.

## Authentication Routes (`/api/auth`)

### POST /api/auth/register
Register a new user
```json
Request: {
  "email": "student@example.com",
  "password": "password123",
  "fullName": "John Doe"
}
Response: {
  "message": "User registered successfully",
  "userId": "uuid"
}
```

### POST /api/auth/login
Login user
```json
Request: {
  "email": "student@example.com",
  "password": "password123"
}
Response: {
  "token": "jwt_token",
  "user": {
    "id": "uuid",
    "email": "student@example.com",
    "fullName": "John Doe"
  }
}
```

### POST /api/auth/logout
Logout user (invalidate token)

---

## User Routes (`/api/users`)

### GET /api/users/:userId
Get user profile
```json
Response: {
  "id": "uuid",
  "email": "student@example.com",
  "fullName": "John Doe",
  "profile": {
    "bio": "Computer Science Student",
    "department": "CSE",
    "yearOfStudy": 3
  }
}
```

### PUT /api/users/:userId
Update user profile

---

## Course Routes (`/api/courses`)

### GET /api/courses
Get all courses
```json
Response: [
  {
    "id": "uuid",
    "title": "Introduction to Programming",
    "instructor": "Dr. Smith",
    "duration": "8 weeks",
    "level": "Beginner"
  }
]
```

### GET /api/courses/:courseId
Get course details

### POST /api/courses/:courseId/enroll
Enroll in a course
```json
Request: {
  "userId": "uuid"
}
```

---

## Notice Board Routes (`/api/notices`)

### GET /api/notices
Get all notices
```json
Response: [
  {
    "id": "uuid",
    "title": "Important Announcement",
    "content": "...",
    "category": "academic",
    "publishedAt": "2025-10-30T00:00:00Z"
  }
]
```

### POST /api/notices
Create new notice (Admin only)

---

## Placements Routes (`/api/placements`)

### GET /api/placements/jobs
Get all job postings
```json
Response: [
  {
    "id": "uuid",
    "companyName": "Tech Corp",
    "position": "Software Engineer",
    "location": "Bangalore",
    "jobType": "Full-time",
    "deadline": "2025-11-30"
  }
]
```

### POST /api/placements/jobs/:jobId/apply
Apply for a job
```json
Request: {
  "userId": "uuid",
  "resumeUrl": "...",
  "coverLetter": "..."
}
```

---

## Schedule Routes (`/api/schedule`)

### GET /api/schedule/:userId
Get user's schedule

### POST /api/schedule/events
Create new event
```json
Request: {
  "userId": "uuid",
  "title": "Team Meeting",
  "startTime": "2025-10-30T10:00:00Z",
  "endTime": "2025-10-30T11:00:00Z",
  "location": "Room 101"
}
```

---

## Implementation Notes

1. All routes (except auth) require JWT authentication
2. Add proper error handling for each route
3. Validate request data using a validation library (e.g., Joi, express-validator)
4. Use appropriate HTTP status codes
5. Implement pagination for list endpoints
6. Add rate limiting for security
