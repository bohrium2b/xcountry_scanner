from argparse import ArgumentParser
import os
import subprocess
import shutil


def build_and_copy_frontend():
    # Define paths
    frontend_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '../frontend'))
    backend_static_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '../backend/main/static/main/'))

    # Build the frontend
    subprocess.run(['pnpm', 'run', 'build'], cwd=frontend_dir, check=True)

    # Define source and destination paths
    build_dir = os.path.join(frontend_dir, 'dist')
    destination_dir = backend_static_dir

    # Remove existing static directory if it exists
    if os.path.exists(destination_dir):
        shutil.rmtree(destination_dir)

    # Copy the build directory to the backend static folder
    shutil.copytree(build_dir, destination_dir)

if __name__ == "__main__":
    build_and_copy_frontend()