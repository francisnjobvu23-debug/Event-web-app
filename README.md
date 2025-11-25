# Event-web-app-Installation

Clone the repository:
git clone https://github.com/yourusername/event-monolith-app.git
cd event-monolith-app
Install dependencies:
# Install backend dependencies
npm install

# Install frontend dependencies
cd client
npm install
Set up environment variables:
Copy .env.example to .env
Update the environment variables with your values
Set up the database:
npx prisma migrate dev
Start the development servers:
Backend:

npm run dev
Frontend:

cd client
npm run dev
Project Structure
event-monolith-app/
├── src/                  # Backend source code
│   ├── controllers/      # Request handlers
│   ├── middleware/       # Auth & validation middleware
│   ├── routes/          # API routes
│   ├── services/        # Business logic & external services
│   ├── utils/           # Helper functions
│   └── prisma/          # Database client & schema
├── client/              # Frontend React application
├── prisma/              # Database migrations
└── public/              # Static assets
API Endpoints
Authentication
POST /auth/signup - Register a new user
POST /auth/login - Login user
Events
GET /events - List all events
POST /events - Create a new event
GET /events/:id - Get event details
PUT /events/:id - Update event
DELETE /events/:id - Delete event
RSVPs
POST /events/:id/rsvp - RSVP to an event
GET /events/:id/rsvp - Get event RSVPs
DELETE /events/:id/rsvp - Cancel RSVP
