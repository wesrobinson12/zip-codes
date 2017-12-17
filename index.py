from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from config import Config

app = Flask(__name__, static_folder="./frontend/dist", template_folder="./frontend")
app.config.from_object(Config)
db = SQLAlchemy(app)
