# Habit Tracker

[![CI](https://github.com/tahakulac1/habit-tracker/actions/workflows/ci.yml/badge.svg)](https://github.com/tahakulac1/habit-tracker/actions/workflows/ci.yml)

A full-stack habit tracking app built step by step to learn modern web development and DevOps end to end: a React frontend, a Node.js/Express REST API, PostgreSQL, Docker, automated tests and a CI pipeline.

## Features

- Create, list, complete/uncomplete and delete daily habits
- Undo a deletion within 5 seconds
- Error-safe frontend: failed API responses are handled without crashing the UI
- Fully containerized: frontend, backend and database start with a single command
- Automated API tests that run on every push and pull request

## Tech Stack

| Layer | Technologies |
| --- | --- |
| Frontend | React 19, Vite, served by Nginx |
| Backend | Node.js 24, Express 5, `pg` (node-postgres) |
| Database | PostgreSQL 15 |
| Testing | Jest, Supertest |
| DevOps | Docker, Docker Compose (multi-stage builds, healthchecks), GitHub Actions |

## Architecture

```
Browser
  │
  ├── http://localhost        → frontend container (Nginx serving the React build)
  │
  └── http://localhost:3000   → backend container (Express REST API)
                                     │
                                     └── db container (PostgreSQL, host port 5433)
```

- The backend waits for the database healthcheck (`pg_isready`) before starting.
- Database data is stored in the `postgres_data` volume, so it survives container restarts.
- Secrets (database password) are read from a `.env` file that is never committed.

## Getting Started

### Prerequisites

- [Docker](https://www.docker.com/) with Docker Compose
- [Node.js 24](https://nodejs.org/) (only needed to run the tests locally)

### Run the app

```bash
git clone https://github.com/tahakulac1/habit-tracker.git
cd habit-tracker
cp .env.example .env        # then set DB_PASSWORD in .env
docker compose up -d --build
```

- Frontend: http://localhost
- API: http://localhost:3000

Stop everything with `docker compose down`. Add `-v` to also delete the database volume.

## Running Tests

The tests run against a separate `habits_test` database, so they never touch your development data.

```bash
docker compose up -d db
docker compose exec db psql -U postgres -c "CREATE DATABASE habits_test;"   # first time only
npm install
npm test
```

> The `npm test` script uses Unix-style environment variables (`DB_NAME=habits_test jest`). Run it from Linux, macOS or WSL.

Each test starts with an empty table (`beforeEach`), and the database connection is closed when the run finishes (`afterAll`).

## API Endpoints

| Method | Endpoint | Description | Success | Errors |
| --- | --- | --- | --- | --- |
| `GET` | `/` | Health message | `200` | |
| `GET` | `/habits` | List all habits | `200` | `500` |
| `GET` | `/habits/:id` | Get one habit | `200` | `404`, `500` |
| `POST` | `/habits` | Create a habit. Body: `{ "title": "Read a book" }` | `201` | `500` |
| `PUT` | `/habits/:id` | Toggle `completed` | `200` | `404`, `500` |
| `DELETE` | `/habits/:id` | Delete a habit | `200` | `404`, `500` |

Example habit:

```json
{ "id": 1, "title": "Read a book", "completed": false }
```

## CI

[`.github/workflows/ci.yml`](.github/workflows/ci.yml) runs on every push and pull request:

1. Starts a PostgreSQL 15 service container
2. Checks out the code and sets up Node.js 24
3. Installs dependencies with `npm ci`
4. Runs the test suite with `npm test`

## Project Structure

```
habit-tracker/
├── .github/workflows/ci.yml   # GitHub Actions pipeline
├── client/                    # React frontend (Vite)
│   ├── src/
│   │   ├── App.jsx            # State and API calls
│   │   └── components/        # HabitForm, HabitList, HabitItem, UndoToast
│   └── Dockerfile             # Multi-stage: Node build → Nginx
├── src/
│   ├── app.js                 # Express app and routes
│   ├── index.js               # Initializes the database, then starts the server
│   └── db.js                  # PostgreSQL pool and table setup
├── tests/
│   └── app.test.js            # API tests (Jest + Supertest)
├── docker-compose.yml         # db, backend and frontend services
├── Dockerfile                 # Backend image
└── .env.example               # Environment variable template
```

## Development Workflow

- Every change is made on its own branch (`feature/...`, `fix/...`) and merged into `main` through a pull request.
- Commits follow [Conventional Commits](https://www.conventionalcommits.org/) (`feat:`, `fix:`, `test:`, `ci:`, `chore:`, `refactor:`, `docs:`).
- CI must pass before merging.

## Roadmap

- [x] REST API with Express
- [x] PostgreSQL integration
- [x] React frontend
- [x] Multi-container Docker Compose setup
- [x] Automated tests and CI pipeline
- [ ] User accounts: registration, login and JWT authentication *(in progress)*
- [ ] UI improvements and user-facing error messages
- [ ] Deployment to a Linux server with Nginx reverse proxy, HTTPS and continuous deployment
- [ ] Redis caching
- [ ] Monitoring with Prometheus and Grafana
- [ ] Kubernetes
