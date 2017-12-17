from index import db
from ..url_config import reverse_geo_url, nearest_zips_url
import requests
from sqlalchemy import text

class ZipCode(db.Model):
    __tablename__ = 'zip_code'

    id = db.Column(db.Integer(), primary_key=True)
    code = db.Column(db.BigInteger(), unique=True, index=True)
    search_count = db.Column(db.Integer())

    def __init__(self, code, search_count):
        self.code = code
        self.search_count = search_count

    @staticmethod
    def get_nearest_zip_codes(lat, lng):
        zip_and_country = ZipCode.__get_zip_from_latlng(lat, lng)
        postal_code = zip_and_country["zip"]
        country = zip_and_country["country"]

        # make request to geo api to get nearest zip codes
        nearest_zip_string = "{url}&postalcode={pc}&country={cntry}".format(url=nearest_zips_url, pc=postal_code, cntry=country)
        nearest_zip_object = requests.get(nearest_zip_string).json()
        nearest_codes = [code_obj["postalCode"] for code_obj in nearest_zip_object["postalCodes"]]

        # upsert zip codes to db
        ZipCode.__upsert_zips(nearest_codes)

        return nearest_codes

    #private method - get zip from coordinates
    @staticmethod
    def __get_zip_from_latlng(lat, lng):
        # create google reverse geocode string and send get request
        location_string = "{url}{lat},{lng}".format(url=reverse_geo_url, lat=lat, lng=lng)
        location = requests.get(location_string).json()

        # convert location to json to get location and country
        location = location["results"][0]["address_components"]
        zip_code = next(attr["long_name"] for attr in location if "postal_code" in attr["types"])
        country = next(attr["short_name"] for attr in location if "country" in attr["types"])

        return { "zip": zip_code, "country": country }


    @staticmethod
    def __upsert_zips(nearest_codes):
        for zip_code in nearest_codes:
            upsert_string = """
                INSERT INTO zip_code as zc (code, search_count)
                    VALUES({cd}, 1)
                ON CONFLICT (code)
                DO UPDATE SET search_count = zc.search_count + 1
                    WHERE zc.code = '{cd}';
            """.format(cd=zip_code)

            # upsert into db
            sql = text(upsert_string)
            db.engine.execute(sql)
