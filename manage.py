from flask_script import Manager
from flask_migrate import Migrate, MigrateCommand

from app.app import app, db

migrate = Migrate(app, db)
manager = Manager(app)

# migrations
manager.add_command('db', MigrateCommand)


@manager.command
def create_db():
    db.create_all()


if __name__ == '__main__':
    manager.run()
