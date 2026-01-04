# Event Management API - Task1

A Node.js REST API for managing events using Express.js and MongoDB.

## Features

- Create, read, update, and delete events
- Paginated event listing
- RESTful API endpoints
- MongoDB integration using native driver (no Mongoose)
- Schema-less document storage for flexibility

## Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Raghavendracharykurella/dt-nodejs-event-api-task1.git
cd dt-nodejs-event-api-task1
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file with your configuration:
```
PORT=3000
MONGODB_URI=mongodb://localhost:27017
NODE_ENV=development
```

4. Start the server:
```bash
npm start
```

The API will be running on `http://localhost:3000`

## API Endpoints

### GET /api/v3/app/events

**Get event by ID:**
```
GET /api/v3/app/events?id=:event_id
```

**Get latest events with pagination:**
```
GET /api/v3/app/events?type=latest&limit=5&page=1
```

### POST /api/v3/app/events

Create a new event:
```json
{
  "name": "Tech Conference 2024",
  "tagline": "Innovation and Technology",
  "schedule": "2024-02-15T10:00:00Z",
  "description": "A conference about latest tech trends",
  "moderator": "John Doe",
  "category": "Technology",
  "sub_category": "Conference",
  "rigor_rank": 5
}
```

### PUT /api/v3/app/events/:id

Update an event (same payload as POST):
```
PUT /api/v3/app/events/:event_id
```

### DELETE /api/v3/app/events/:id

Delete an event:
```
DELETE /api/v3/app/events/:event_id
```

## Testing with Postman

1. Open Postman
2. Create a new collection named "Event API"
3. Test the endpoints following the API documentation above
4. Example: GET http://localhost:3000/api/v3/app/events?type=latest&limit=5&page=1

## Project Structure

```
.
├── server.js      # Main server file with all routes
├── package.json   # Project dependencies
├── .env           # Environment variables
└── README.md      # This file
```

## Technology Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (native driver)
- **Environment**: dotenv
- **Development**: nodemon

## Notes

- This project uses MongoDB native driver instead of Mongoose for schema flexibility
- Events are stored as flexible documents without a fixed schema
- ObjectId is used as the unique identifier for each event

## Author

Raghavendra Chary Kurella

## License

ISC
