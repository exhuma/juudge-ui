#!/bin/bash
sudo apt-get update && sudo apt-get install -y fabric python3-pip python3-venv
pip install pipx
pipx install pre-commit
pre-commit install
npm clean-install
