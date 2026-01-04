# Postman Testing Guide for Event Management API

This guide explains how to test all the Event API endpoints using Postman.

## Prerequisites

- Postman installed on your machine
- Node.js server running (`npm start`)
- MongoDB running locally or accessible

## Base URL

```
http://localhost:3000
```

## Testing the API Endpoints

### 1. Health Check

**Request Type:** GET
**URL:** `http://localhost:3000/health`
**Description:** Check if the server is running

**Expected Response (200 OK):**
```json
{
  "status": "Server is running"
}
```

---

### 2. POST - Create a New Event

**Request Type:** POST
**URL:** `http://localhost:3000/api/v3/app/events`
**Content-Type:** application/json

**Request Body:**
```json
{
  "name": "Tech Conference 2024",
  "tagline": "Latest Technology Trends",
  "schedule": "2024-02-15T10:00:00Z",
  "description": "A comprehensive conference covering AI, Cloud, and DevOps",
  "moderator": "John Doe",
  "category": "Technology",
  "sub_category": "Conference",
  "rigor_rank": 8
}
```

**Expected Response (201 Created):**
```json
{
  "message": "Event created successfully",
  "eventId": "ObjectId_here"
}
```

**Note:** Save the eventId for testing other endpoints.

---

### 3. GET - Get Event by ID

**Request Type:** GET
**URL:** `http://localhost:3000/api/v3/app/events?id=<eventId>`
**Description:** Retrieve a specific event by its ID

**Example URL:**
```
http://localhost:3000/api/v3/app/events?id=507f1f77bcf86cd799439011
```

**Expected Response (200 OK):**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "type": "event",
  "name": "Tech Conference 2024",
  "tagline": "Latest Technology Trends",
  "schedule": "2024-02-15T10:00:00Z",
  "description": "A comprehensive conference covering AI, Cloud, and DevOps",
  "moderator": "John Doe",
  "category": "Technology",
  "sub_category": "Conference",
  "rigor_rank": 8,
  "attendees": [],
  "createdAt": "2024-01-04T17:00:00Z"
}
```

---

### 4. GET - Get Latest Events with Pagination

**Request Type:** GET
**URL:** `http://localhost:3000/api/v3/app/events?type=latest&limit=5&page=1`
**Description:** Retrieve paginated list of events

**Query Parameters:**
- `type`: "latest" (required for pagination)
- `limit`: Number of events per page (default: 5)
- `page`: Page number (default: 1)

**Example URL:**
```
http://localhost:3000/api/v3/app/events?type=latest&limit=5&page=1
```

**Expected Response (200 OK):**
```json
{
  "events": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "type": "event",
      "name": "Tech Conference 2024",
      ...
    }
  ],
  "page": 1,
  "limit": 5,
  "total": 10,
  "totalPages": 2
}
```

---

### 5. PUT - Update an Event

**Request Type:** PUT
**URL:** `http://localhost:3000/api/v3/app/events/<eventId>`
**Content-Type:** application/json
**Description:** Update an existing event

**Example URL:**
```
http://localhost:3000/api/v3/app/events/507f1f77bcf86cd799439011
```

**Request Body (send the fields you want to update):**
```json
{
  "name": "Tech Conference 2024 - Updated",
  "tagline": "Updated Technology Trends",
  "rigor_rank": 9
}
```

**Expected Response (200 OK):**
```json
{
  "message": "Event updated successfully"
}
```

---

### 6. DELETE - Delete an Event

**Request Type:** DELETE
**URL:** `http://localhost:3000/api/v3/app/events/<eventId>`
**Description:** Delete an event

**Example URL:**
```
http://localhost:3000/api/v3/app/events/507f1f77bcf86cd799439011
```

**Expected Response (200 OK):**
```json
{
  "message": "Event deleted successfully"
}
```

---

## Testing Steps

1. **Start the server:**
   ```bash
   npm start
   ```
   Should see: "Server is running on port 3000"

2. **Test Health Check:**
   - Create a GET request to `/health`
   - Verify response shows server is running

3. **Create Events:**
   - Send POST requests with different event data
   - Save the returned eventIds

4. **Retrieve Events:**
   - Test GET by ID with saved eventIds
   - Test pagination with different page numbers

5. **Update Events:**
   - Use PUT requests to modify existing events
   - Verify changes are reflected in GET requests

6. **Delete Events:**
   - Delete specific events
   - Verify they are no longer retrievable

## Error Handling

**Invalid Event ID:**
```json
{
  "message": "Invalid event ID"
}
Status: 400 Bad Request
```

**Event Not Found:**
```json
{
  "message": "Event not found"
}
Status: 404 Not Found
```

**Missing Required Fields:**
```json
{
  "message": "Missing required fields"
}
Status: 400 Bad Request
```

## Tips for Postman

1. **Set Base URL:** In Postman, set a base URL variable to avoid typing the full URL each time
2. **Use Environment Variables:** Store eventIds in variables for reuse
3. **Create Collections:** Organize all endpoints in a Postman collection
4. **Save Tests:** Write tests to validate responses
5. **Documentation:** Export the collection for sharing
