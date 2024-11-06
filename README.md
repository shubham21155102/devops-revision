# docker-learn

## Project Description

This project demonstrates the use of Docker to set up a Node.js and MySQL application with Nginx for load balancing and rate limiting. The main features of this project include:

- Dockerized MySQL and Node.js services
- Nginx for load balancing and rate limiting
- Express.js server for handling API requests
- Example API endpoints for interacting with the MySQL database

## Setup Instructions

### Prerequisites

- Docker and Docker Compose installed on your machine

### Installation Steps

1. Clone the repository:
   ```bash
   git clone https://github.com/shubham21155102/devops-revision.git
   cd devops-revision
   ```

2. Run the setup script:
   ```bash
   ./run.sh
   ```

3. Start the Docker containers:
   ```bash
   docker-compose up -d
   ```

## Usage Instructions

### Interacting with the API

The API provides endpoints for interacting with the MySQL database. Here are some example requests and responses:

- **GET /test**: Inserts a test user into the database and returns all users.
  ```bash
  curl http://localhost/test
  ```

  Response:
  ```json
  [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com"
    }
  ]
  ```

- **GET /health**: Returns the health status of the server.
  ```bash
  curl http://localhost/health
  ```

  Response:
  ```
  OK
  ```

## Architecture

The project consists of the following components:

- **MySQL**: A Dockerized MySQL service for database management.
- **Node.js**: Two Dockerized Node.js services running the Express.js server.
- **Nginx**: A Dockerized Nginx service for load balancing and rate limiting.

The services interact as follows:

- The Node.js services connect to the MySQL database to handle API requests.
- Nginx load balances incoming requests between the two Node.js services and applies rate limiting to prevent abuse.
