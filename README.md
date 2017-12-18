# domio-app

I really enjoyed doing this challenge, so I decided to add a very simple react UI to it for demo purposes!

## Architecture & Implementation

**Back-End:**
I've never used Python and Flask to build an application before, as my past experience is working with Rails or .NET Core, but I decided to give it a try to show that I'm able to pick up technologies quickly.  For the setup, I partially used a Flask boilerplate that I found on Github.  This was helpful in structuring the file tree and it helped me get up and running quickly as well as providing examples of Flask best practices.  I used SQL Alchemy to make vanilla SQL queries to a PostgreSQL database.  My only model for the project was a ZipCode model, which stored the unique code itself and a count of the times it appeared in a search.  I used two API's to find my list of nearest zip codes -- one being the google reverse geocoding API given in the challenge rules, and another that I found which provides a list of closest zip codes given a single zip code.  Since the project was very small, all of my controllers are stored within the app.py file.

**Front-End:**
I used a very simple react UI with an express server running to capture requests and re-direct them to the backend.  For this reason, there were no Views in the project, other than a simple index.html with a root component. The `/search` and `/top` routes each return JSON objects to the UI.    

## Demo

### Installation

#### PostgreSQL

If you don't have PostgreSQL already, download the app here: http://postgresapp.com/

To create a user, open a terminal and type psql.  If there is an authentication error, use `sudo -u postgres psql template1` to create an initial template.  This will open the psql CLI.  From there, first create a user by typing `CREATE ROLE {yourusername} WITH LOGIN PASSWORD {yourpassword};`.  Close this terminal, open a new one, and login with your new username and password using `sudo -u postgres psql`.  From here, create a database using the command `CREATE DATABASE {yourdatabasename};`.  You should now be setup with a new PostgreSQL database to use with the project.

#### Setup

First, set your database url environment variable using:
```
$ export DATABASE_URL="postgresql://username:password@localhost/{yourdatabasename}"
```

Run the following commands to create the DB and run the migrations:
```
$ python manage.py create_db
$ python manage.py db upgrade
$ python manage.py db migrate
```

Next, run the back-end server:
```
$ python manage.py runserver
```

Once you have the back-end running, the front end can be started using:
```
$ cd frontend
$ npm install
$ npm start
```


You should be up and running! Feel free to navigate to `localhost:3000` and check it out!

### Notes

In case you don't already have the proper Flask libraries installed, run:
```
$ sudo pip install flask flask_script flask_migrate psycopg2
```

Credit to https://github.com/dternyak/React-Redux-Flask for the boilerplate setup that helped me get up and running quickly.
