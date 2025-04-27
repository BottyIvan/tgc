from .models import User
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token

def insertUser(data):

    # Validate the input data 
    required_fields = ["username", "password", "confirm_password", "email"]
    for field in required_fields:
        if not data.get(field):
            return { "error": f"{field.replace('_', ' ').capitalize()} is required" }, 400

    # Check if the email is equal to the password confirmation
    if data["password"] != data["confirm_password"]:
        return { "error": "Passwords do not match" }, 400

    # Hashing the password
    try:
        hashed_password = generate_password_hash(data["password"])
    except Exception as e:
        return { "error": f"Failed to hash password: {str(e)}" }, 500
    
    # Create a new User object
    try:
        user = User(
            username=data["username"],
            password=hashed_password,
            email=data["email"],
        )
    except Exception as e:
        return { "error": f"Failed to create User object: {str(e)}" }, 500

    # Check if the user already exists
    try:
        existing_user = user.getUserByEmail(data["email"])
        if existing_user:
            return { "error": "Email already exists" }, 400
    except Exception as e:
        return { "error": f"Failed to check existing user: {str(e)}" }, 500
    
    # Insert the user into the database
    try:
        user.insertUser()
    except Exception as e:
        return { "error": f"Failed to insert user into database: {str(e)}" }, 500

    # Return the user data without the timestamps
    data = user.toDictionary()
    del data["created_at"]  # Don't return the created_at timestamp
    del data["updated_at"]  # Don't return the updated_at timestamp
    return { "success": "User added successfully", "user": data }

def loggingUser(data):
    required_fields = ["email", "password"]
    for field in required_fields:
        if not data.get(field):
            return { "error": f"{field.replace('_', ' ').capitalize()} is required" }, 400
        
    # Check if the user exists
    try:
        user = User.getUserByEmail(data["email"].lower().strip())
        if not user:
            return { "error": "User not found" }, 404
    except Exception as e:
        return { "error": f"Failed to check existing user: {str(e)}" }, 500
    
    # Check if the password is correct
    try:
        if not check_password_hash(user.password, data["password"]):
            return { "error": "Invalid password" }, 401
    except Exception as e:
        return { "error": f"Failed to check password: {str(e)}" }, 500
    
    # Generate the access token
    try:
        access_token = create_access_token(identity=user.id)
        return access_token
    except Exception as e:
        return { "error": f"Failed to generate access token: {str(e)}" }, 500
    
def getUserById(user_id):
    # Validate the user_id
    if not user_id:
        return { "error": "User ID is required" }, 400

    # Check if the user exists
    try:
        user = User.getUserById(user_id)
        if not user:
            return { "error": "User not found" }, 404
    except Exception as e:
        return { "error": f"Failed to check existing user: {str(e)}" }, 500
    
    data = user[0]
    # Return the user data without the timestamps
    del data["created_at"]  # Don't return the created_at timestamp
    del data["updated_at"]  # Don't return the updated_at timestamp
    return { "user": data }