import os

host = os.getenv('DB_HOST', 'localhost')
user = os.getenv('MYSQL_USER', 'utente')
password = os.getenv('MYSQL_PASSWORD', 'password')
db_name = os.getenv('MYSQL_DATABASE', 'nome_db')
port = os.getenv('DB_PORT', 3306)

class Config:
    SECRET_KEY = os.getenv('SECRET_KEY', 'your_secret_key')
    DEBUG = os.getenv('DEBUG', 'True').lower() in ['true', '1', 'yes']
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY', 'your_jwt_secret_key')
    JWT_ACCESS_TOKEN_EXPIRES = os.getenv('JWT_ACCESS_TOKEN_EXPIRES', 3600)  # 1 hour
    SQLALCHEMY_DATABASE_URI = f'mysql+pymysql://{user}:{password}@{host}:{port}/{db_name}'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
