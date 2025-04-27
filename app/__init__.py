from flask import Flask, request, jsonify, redirect
from flask_migrate import Migrate
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager, jwt_required
from datetime import timedelta

db = SQLAlchemy()
migrate = Migrate()
jwt = JWTManager()

@jwt.unauthorized_loader
def custom_unauthorized_response(error):
    if not request.path.startswith('/auth'):
        return redirect('/auth'), 302
    return jsonify({"error": f"Unauthorized: {error}"}), 401

def create_app():
    app = Flask(__name__)
    app.config.from_object('app.config.Config')

    db.init_app(app)
    migrate.init_app(app, db)
    app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=int(app.config.get('JWT_ACCESS_TOKEN_EXPIRES')))
    jwt.init_app(app)

    from app.routes import main
    app.register_blueprint(main)

    return app