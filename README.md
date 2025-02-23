# T3 Stack Project (Dockerized)

This project is a T3 Stack application bootstrapped with `create-t3-app` and configured to run within Docker containers.

## Technologies Used

- **Next.js:** React framework for server-rendered applications.
- **NextAuth.js:** Authentication library.
- **Prisma/Drizzle:** Database ORM (adjust based on your project).
- **Tailwind CSS:** Utility-first CSS framework.
- **tRPC:** End-to-end typesafe APIs.
- **pnpm:** Package manager.
- **Docker:** Containerization platform.
- **Docker Compose:** Tool for defining and running multi-container Docker applications.
- **PostgreSQL:** Database.

## Prerequisites

- **Docker:** Install Docker Desktop or Docker Engine on your system.
- **pnpm:** Ensure pnpm is installed globally.

## Setup Instructions

1.  **Clone the Repository:**

    ```bash
    git clone https://github.com/farhan294sha/project-managment.git
    cd project-managment
    ```

2.  Set up your `.env` file

    - Duplicate `.env.example` to `.env`
    - Use `openssl rand -base64 32` to generate a key and add it under `NEXTAUTH_SECRET` in the `.env` file.
    - Environment variables are loaded from the `.env` file within the `web` container.
    - Ensure that your `.env` file contains the necessary environment variables for your Next.js app, including the `DATABASE_URL_DEV` that points to the `db` service (e.g., `DATABASE_URL_DEV=postgresql://admin:postgres@db:5432/projectmanagement?schema=public`).

3.  **Start Docker Containers:**

    ```bash
    docker compose up --build
    ```

    This command will:

    - Build the Docker image for your Next.js application.
    - Start the necessary containers (web and database).
    - Download the PostgreSQL image if needed.
    - Execute database migrations and start the Next.js development server.

4.  **Access the Application:**

    - Open your web browser and navigate to `http://localhost:3000`.

#### Setting up your first user

```sh
 pnpm prisma db seed
```

The above command will populate the local db with dummy users.