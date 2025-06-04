# XCountry Scanner

An experimental (alpha) race place recording system.


## Development Instructions

Installing toolkit. You need:
 * Python, Pip, Poetry with shell command (see below)
 * pnpm

Find the `poetry shell` command installation guide here: https://github.com/python-poetry/poetry-plugin-shell

In this directory, run `poetry install` and `poetry shell`. If it doesn't work, try running with sudo.

In `frontend/` run `pnpm install`. If it doesn't work, try running with sudo.

Then in `backend/` run `python3 manage.py makemigrations` and `python3 manage.py migrate`. If `makemigrations` has errors or has nothing to migrate, continue to `migrate`.

In the `scripts/`, run `python3 startserver.py` (or something similar like that) to copy and sync the frontend. It is a misleading name for now, TODO is to fix it.

Run `python3 manage.py collectstatic` to get the static files in one basket, then the same thing follows:

The backend is on Django. In order to access the app for development testing, you need to create an account/admin through the CLI.

Inside your Python shell, run `python3 manage.py createsuperuser`. Make sure you NEVER commit `db.sqlite3`.

Then, to run the localhost server, `python3 manage.py runserver [your_ip]:8000`.


## Roadmap

TODO Password protect the API, backoffice (HIGH PRIORITY!!!!!!)
