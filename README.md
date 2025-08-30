# House Listing API

A minimal RESTful API for managing house listings. Built with Node.js, Express and MongoDB (Mongoose), featuring authentication, owner-scoped CRUD, filtering, search, sorting and pagination.

## Features

**Authentication**: Register, login, JWT-based sessions.

**Listings CRUD**: Create, update or delete only your own listings.

**Filtering & Search**: Query listings by city, state, property type, price, amenities, etc.

**Sorting & Pagination**: Sort by price/createdAt with proper pagination.

**Validation**: Input validation with Joi.

**Security**: Password hashing with bcrypt, protected routes with JWT.

**Seeding**: Preloaded demo user + 25 listings across Nigerian cities.

## Tech Stack

**Runtime**: Node.js (v18+)

**Framework**: Express.js

**Database**: MongoDB Atlas / Local MongoDB

**ODM**: Mongoose

**Auth**: JWT + bcrypt

**Validation**: Joi

## Getting Started
## 1. Clone the repo

``` bash
git clone https://github.com/JewelChidinma/house-listing_api.git
cd house-listing-api
```

## 2. Install dependencies

``` bash
npm install
```

## 3. Environment variables

Create a .env file in the project root (use .env.example as reference):

``` env
MONGO_URI = mongodb+srv://<username>:<password>@house-listing-cluster.jslzzve.mongodb.net/?retryWrites=true&w=majority&appName=house-listing-cluster
JWT_SECRET = your-secret-key
PORT = 3000
```

Replace <username> and <password> with your MongoDB Atlas credentials.

## 4. Seed database

Run the seed script to create a demo user and 25 sample listings:

``` bash
npm run seed
```

## 5. Start the server

``` bash
npm run dev
```

Server will start on: http://localhost:3000

## Auth Endpoints

**Register**

**POST /auth/register**

``` json
{"name": "John Doe", "email": "john@example.com", "password": "password123"}
```

**Login**

**POST /auth/login**

``` json
{"email": "john@example.com", "password": "password123"}
```

Returns ```{"accessToken": "..."}```

**Me (Protected)**

```GET /auth/me``` → requires ```Authorization: Bearer <token>```

## Listing Endpoints

**POST /listings** (protected) → Create listing

**GET /listings/:id** → Get listing by ID

**PATCH /listings/:id** (protected, owner only) → Update listing

**DELETE /listings/:id** (protected, owner only) → Delete listing

**GET /listings** → Query listings with filters

Example query:

``` bash
/listings?city=Lagos&status=active&bedrooms=3&minPrice=200000&sort=-price&page=1&limit=20
```

Response (paginated):
```json
{
  "data": [ /* listings */ ],
  "page": 1,
  "limit": 20,
  "total": 237,
  "totalPages": 12
}
```

## Demo User

Use this account to test immediately after seeding:

``` makefile
Email: demo@user.com
Password: password123
```


## Documentation

You can read the Postman documentation here https://documenter.getpostman.com/view/25387596/2sB3HhrgcX
