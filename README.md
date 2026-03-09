# XCountry Scanner

An experimental (alpha) race place recording system.

## Prerequisites

Before installing the toolkit, ensure you have the following installed:
*   Python
*   Pip
*   Poetry (with the shell command plugin: [installation guide](https://github.com/python-poetry/poetry-plugin-shell))
*   pnpm

## Installation

### Backend Dependencies

1. Navigate to the root directory.
2. Install the backend dependencies and activate the virtual environment:
   ```bash
   poetry install
   poetry shell
   ```
   *(Note: If it doesn't work, try running with `sudo`.)*

### Frontend Dependencies

1. Navigate to the `frontend/` directory.
2. Install the Node.js dependencies:
   ```bash
   pnpm install
   ```
   *(Note: If it doesn't work, try running with `sudo`.)*

## Database Setup

The backend uses Django. To set up the database, run the following commands in the `backend/` directory:

```bash
python3 manage.py makemigrations
python3 manage.py migrate
```
*(Note: If `makemigrations` has errors or indicates no changes detected, simply proceed to `migrate`.)*

## Running the Server

### 1. Build Frontend

In the `scripts/` directory, run the start server script to copy and sync the frontend (this script currently has a misleading name and is marked as a TODO to fix):

```bash
python3 startserver.py
```

### 2. Collect Static Files

Gather all static files into one location by running the following in the root backend directory:

```bash
python3 manage.py collectstatic
```

### 3. Create Superuser (Admin Account)

To access the app for development testing, you need to create an admin account through the CLI. In your Python shell, run:

```bash
python3 manage.py createsuperuser
```
*(Alternatively, use the default credentials if they were generated: `admin` as the username and `admin` as the password.)*

**Warning:** Make sure you NEVER commit `db.sqlite3`.

### 4. Start Localhost Server

To run the localhost development server, execute:

```bash
python3 manage.py runserver [your_ip]:8000
```

## Roadmap

*   **TODO:** Password protect the API and backoffice (HIGH PRIORITY!!!!!!)
