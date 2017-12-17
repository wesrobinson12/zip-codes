from flask import request, render_template, jsonify, url_for, redirect, g
from models.zip_code import ZipCode
from index import app, db
from sqlalchemy import text
import json

@app.route('/', methods=['GET'])
def index():
    return render_template('index.html')

@app.route('/top', methods=['GET'])
def top():
    top_string = """
        SELECT code
        FROM zip_code
        ORDER BY search_count
        DESC LIMIT 5
    """
    sql = text(top_string)
    top_results = db.engine.execute(sql)
    return json.dumps([code["code"] for code in top_results])

@app.route('/search', methods=['POST'])
def search():
    data = request.json
    lng, lat = data["longitude"], data["latitude"]
    nearest = ZipCode.get_nearest_zip_codes(lat, lng)
    return jsonify(nearest=nearest)
