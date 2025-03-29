# PWP SPRING 2025

# Task Management API

A comprehensive RESTful API for managing tasks, projects, teams, and users. Built with Flask, PostgreSQL, and Docker.

---

## Prerequisites

- **Docker** (v20.10+)
- **Python** (v3.9+)
- **PostgreSQL** (via Docker)
- **pip** (Python package manager)

---

## Installation & Setup

### 1. Clone Repository
```bash
git clone https://github.com/your-repo/task-management-api.git
cd task-management-api
```

### 2. Set Up Virtual Environment
```bash
python -m venv venv
source venv/bin/activate  # Linux/MacOS
venv\Scripts\activate  # Windows
```

### 3. Install Dependencies
```bash
pip install -r requirements.txt
pip install -r requirements-test.txt  # For testing
```

### 4. Start PostgreSQL with Docker
```bash
docker-compose up -d
```
This will:
- Start a PostgreSQL container
- Create `task_management_db` database
- Run initialization scripts

---

## Configuration

### Environment Variables
Create a `.env` file (optional for local development):
```ini
JWT_SECRET_KEY=your-secure-key
SQLALCHEMY_DATABASE_URI=postgresql://admin:helloworld123@localhost/task_management_db
```

---

## Running the API
```bash
python app.py
```
The API will be available at [http://localhost:5000](http://localhost:5000)

---

## Running Tests

### 1. Ensure PostgreSQL is Running
```bash
docker-compose up -d
```

### 2. Run All Tests
```bash
pytest -v tests/ --html=reports/test_report.html --self-contained-html
```
Test report will be generated in `reports/test_report.html`

### 3. Run Specific Test Module
```bash
pytest -v tests/test_user_routes.py
```

---

## API Documentation

### Postman Collection
Import `Task Management API - Complete Collection.postman_collection.json`

Set environment variables:
- `base_url`: `http://localhost:5000`
- `auth_token`: Obtain from `/login` endpoint

### Entry Points

| Resource  | Endpoint         |
|-----------|-----------------|
| Users     | `GET /users`    |
| Tasks     | `GET /tasks`    |
| Projects  | `GET /projects` |
| Teams     | `GET /teams`    |

---

## Deployment

### Production Setup
Use Gunicorn with 4 workers:
```bash
gunicorn -w 4 'app:create_app()' -b 0.0.0.0:5000
```

### Environment variables for production:
```bash
export JWT_SECRET_KEY=your-prod-secret
export SQLALCHEMY_DATABASE_URI=postgresql://prod_user:securepass@prod-db:5432/prod_db
```

### Dockerized Deployment
#### Sample Dockerfile
```dockerfile
FROM python:3.9-slim

WORKDIR /app
COPY . .
RUN pip install -r requirements.txt

CMD ["gunicorn", "-w", "4", "app:create_app()", "-b", "0.0.0.0:5000"]
```

---

## License

MIT License. See `LICENSE` for details.

---

## Authors
- **Syed Abdullah Hassan** - [syehassa24@student.oulu.fi](mailto:syehassa24@student.oulu.fi)
- **Muhammad Hassan Sohail** - [hassan.sohail@student.oulu.fi](mailto:hassan.sohail@student.oulu.fi)
- **Uswah Batool** - [uswah.batool@student.oulu.fi](mailto:uswah.batool@student.oulu.fi)
- **Mathéo Morin** - [matheo.morin@student.oulu.fi](mailto:matheo.morin@student.oulu.fi)
