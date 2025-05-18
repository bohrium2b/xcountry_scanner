# XCountry Scanner

An experimental (alpha) race place recording system.


## Development Instructions

Installing toolkit. You need:
 * Python, Pip, Poetry with shell command (see below)
 * pnpm

Find the `poetry shell` command installation guide here: https://github.com/python-poetry/poetry-plugin-shell

In this directory, run `poetry install` and `poetry shell`.

In the `frontend/` run `pnpm install`.


The backend is on Django. In order to access the app for development testing, you need to create an account/admin through the CLI.
Inside your Python shell, run `python manage.py createsuperuser`. Make sure you NEVER commit `db.sqlite3`.

