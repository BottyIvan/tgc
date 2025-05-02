from . import db
import uuid
from datetime import datetime
from sqlalchemy import text

class Card(db.Model):
    __tablename__ = "cards"

    # Define the columns for the "cards" table
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = db.Column(db.String(50), nullable=False)
    description = db.Column(db.String(200), nullable=False)
    image = db.Column(db.String(200), nullable=False)
    card_type = db.Column(db.String(50), nullable=False)
    rarity = db.Column(db.String(50), nullable=False)
    card_set = db.Column(db.String(50), nullable=False)
    set_number = db.Column(db.String(50), nullable=False)
    created_at = db.Column(db.DateTime, nullable=False, server_default=text('CURRENT_TIMESTAMP'))
    updated_at = db.Column(db.DateTime, nullable=False,
                       server_default=text('CURRENT_TIMESTAMP'),
                       onupdate=text('CURRENT_TIMESTAMP'))
    
    # Foreign key to the "users" table
    user_id = db.Column(db.String(36), db.ForeignKey('users.id'), nullable=False)

    # Define the relationship with the User model
    user = db.relationship('User', back_populates='cards', lazy=True)

    # To dictionary method for easy JSON serialization
    def toDictionary(self):
        return {
            "id": self.id,
            "name": self.name,
            "description": self.description,
            "image": self.image,
            "card_type": self.card_type,
            "rarity": self.rarity,
            "card_set": self.card_set,
            "set_number": self.set_number,
            "created_at": self.created_at,
            "updated_at": self.updated_at
        }
    
    # Constructor
    def __init__(self, name, description, image, card_type, rarity, card_set, set_number, id=None, created_at=None, updated_at=None, user_id=None):
        self.id = id or str(uuid.uuid4())  # Generate UUID if not provided
        self.name = name.strip() # Normalize name
        self.description = description.strip() # Normalize description
        self.image = image
        self.card_type = card_type.strip() # Normalize type
        self.rarity = rarity.strip() # Normalize rarity
        self.card_set = card_set.strip() # Normalize set
        self.set_number = set_number.strip() # Normalize set number
        self.created_at = datetime.utcnow()
        self.updated_at = datetime.utcnow()
        self.user_id = user_id

    # Debug-friendly string representation
    def __repr__(self):
        return f"<Card {self.name} ({self.rarity}) - {self.card_set} #{self.set_number}>"

    # Insert this card into the database
    def insertCard(self):
        user = User.query.get(self.user_id)
        if not user:
            raise ValueError("User ID does not exist.")
        db.session.add(self)
        db.session.commit()
        return self

    # Delete this card from the database
    def deleteCard(self):
        db.session.delete(self)
        db.session.commit()
        return self

    # Update fields that are provided (others stay the same)
    def updateCard(self, name=None, description=None, image=None, card_type=None, rarity=None, card_set=None, set_number=None):
        if name:
            self.name = name
        if description:
            self.description = description
        if image:
            self.image = image
        if card_type:
            self.card_type = card_type
        if rarity:
            self.rarity = rarity
        if card_set:
            self.card_set = card_set
        if set_number:
            self.set_number = set_number
        self.updated_at = datetime.utcnow()
        db.session.commit()
        return self

    # Static method: get all cards from the database and convert to dictionaries
    @staticmethod
    def getAllCards(user_id):
        cards = Card.query.filter_by(user_id=user_id).all()
        return [card.toDictionary() for card in cards]


    # Static method: get one card by ID
    @staticmethod
    def getCardById(card_id):
        cards = [Card.query.filter_by(id=card_id).first()]
        return [card.toDictionary() for card in cards]

    # Static method: get one card by name
    @staticmethod
    def getCardByName(name):
        return Card.query.filter_by(name=name).first()

    # Static method: get cards by set
    @staticmethod
    def getCardBySet(card_set):
        return Card.query.filter_by(card_set=card_set).all()

    # Static method: get cards by type
    @staticmethod
    def getCardByType(card_type):
        return Card.query.filter_by(card_type=card_type).all()

    # Static method: get cards by rarity
    @staticmethod
    def getCardByRarity(rarity):
        return Card.query.filter_by(rarity=rarity).all()

    # Static method: get cards by set number
    @staticmethod
    def getCardBySetNumber(set_number):
        return Card.query.filter_by(set_number=set_number).all()

    # Static method: get cards by description
    @staticmethod
    def getCardByDescription(description):
        return Card.query.filter_by(description=description).all()

class User(db.Model):

    __tablename__ = "users"

    # Define the columns for the "users" table
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    username = db.Column(db.String(50), nullable=False)
    password = db.Column(db.String(200), nullable=False)
    email = db.Column(db.String(100), nullable=False)
    created_at = db.Column(db.DateTime, nullable=False, server_default=text('CURRENT_TIMESTAMP'))
    updated_at = db.Column(db.DateTime, nullable=False,
                       server_default=text('CURRENT_TIMESTAMP'),
                       onupdate=datetime.utcnow)
    
    # Define the relationship with the Card model
    cards = db.relationship('Card', back_populates='user', lazy=True)

    # Constructor
    def __init__(self, username, password, email, created_at=None, updated_at=None):
        self.id = str(uuid.uuid4())  # Generate UUID
        self.username = username.lower().strip() # Normalize username
        self.password = password # Store hashed password
        self.email = email.lower().strip() # Normalize email
        self.created_at = created_at or datetime.utcnow()
        self.updated_at = updated_at or datetime.utcnow()


    def toDictionary(self):
        return {
            "id": self.id,
            "username": self.username,
            "email": self.email,
            "created_at": self.created_at,
            "updated_at": self.updated_at
        }
    
    # Debug-friendly string representation
    def __repr__(self):
        return f"<User {self.username} ({self.email})>"
    
    # Insert this user into the database
    def insertUser(self):
        db.session.add(self)
        db.session.commit()
        return self
    
    # Delete this user from the database
    def deleteUser(self):
        db.session.delete(self)
        db.session.commit()
        return self
    
    # Update fields that are provided (others stay the same)
    def updateUser(self, username=None, password=None, email=None):
        if username:
            self.username = username
        if password:
            self.password = password
        if email:
            self.email = email
        self.updated_at = datetime.utcnow()
        db.session.commit()
        return self
    
    # Static method: get all users from the database and convert to dictionaries
    @staticmethod
    def getAllUsers():
        users = User.query.all()
        return [user.toDictionary() for user in users]
    
    # Static method: get one user by ID
    @staticmethod
    def getUserById(user_id):
        users = [User.query.filter_by(id=user_id).first()]
        return [user.toDictionary() for user in users]
    
    # Static method: get one user by email
    @staticmethod
    def getUserByEmail(email):
        return User.query.filter_by(email=email).first()