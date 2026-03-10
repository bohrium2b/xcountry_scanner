# XCountry Scanner

An experimental (alpha) race place recording system designed for cross-country event management.

## Features

- **Real-time Barcode Scanning**: Scan student ID cards using a mobile device or webcam to record race results.
- **Manual Entry**: Manually enter student IDs on the scanner page for students who forgot their cards.
- **Live Results Table**: View a real-time table of recorded results directly on the scanner page.
- **Barcode Generator**: Built-in tool to generate and print student ID barcodes from CSV files.

## Prerequisites

Before installing the toolkit, ensure you have the following installed:
*   Python (>= 3.10)
*   Pip
*   Poetry (with the shell command plugin: [installation guide](https://github.com/python-poetry/poetry-plugin-shell))
*   pnpm

## Installation

### 1. Backend Dependencies

Navigate to the root directory and install the backend dependencies:
```bash
poetry install
poetry lock # Ensure lockfile is up to date
poetry shell
```
*(Note: If it doesn't work, try running with `sudo`.)*

### 2. Frontend Dependencies

Navigate to the `frontend/` directory and install the Node.js dependencies:
```bash
pnpm install
```

## Database Setup

The backend uses Django. To set up the database, run the following commands in the `backend/` directory:

```bash
python3 manage.py makemigrations
python3 manage.py migrate
```

## Running the Server

### 1. Build and Sync Frontend

In the `scripts/` directory, run the following to compile the frontend and copy it to the Django static folder:
```bash
python3 startserver.py
```

### 2. Collect Static Files

In the root `backend/` directory, collect all static files:
```bash
python3 manage.py collectstatic
```

### 3. Accessing the Application

- **Admin Account**: Create a superuser to access the admin panel:
  ```bash
  python3 manage.py createsuperuser
  ```
  *(Default credentials: `admin` / `admin` are pre-configured in some environments.)*
- **Barcode Generator**: Access the generator at `/testlist/` to upload student CSVs and generate printable PDFs.
- **Local Server**: Start the server:
  ```bash
  python3 manage.py runserver [your_ip]:8000
  ```

## Roadmap

*   **TODO:** Password protect the API and backoffice (HIGH PRIORITY!!!!!!)
*   **TODO:** Migrate JSON-based results storage to a formal Database model for better concurrency.
