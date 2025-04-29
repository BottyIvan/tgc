import os
# Import methods from model files
from .cards import getAllCards, getCardById, insertCard, deleteCard, editCard
from .users import insertUser, loggingUser, getUserById

# Import Flask and other necessary modules
from flask import Blueprint, request, render_template, jsonify, make_response
from flask_jwt_extended import jwt_required, set_access_cookies, get_jwt_identity, unset_jwt_cookies

main = Blueprint("main", __name__)

@main.route("/")
@jwt_required(locations=["cookies"])
def home():
    return render_template("index.html")

@main.route("/auth")
def auth():
    return render_template("auth.html")

@main.route("/auth/register", methods=["POST"])
def create():
    try:
        data = request.get_json()
        return jsonify(insertUser(data))
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@main.route("/auth/login", methods=["POST"])
def login():
    try:
        data = request.get_json()

        # Asking for a token
        access_token = loggingUser(data)

        # If the token is a dictionary and contains an error,
        # return the error message and status code
        if isinstance(access_token, dict) and "error" in access_token:
            return jsonify(access_token), access_token.get("status", 500)

        # If the token is valid, set it in the cookies
        # and return a success message
        response = make_response(jsonify({"success": "Login successful"}))
        set_access_cookies(response, access_token)
        return response
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@main.route("/auth/logout", methods=["POST"])
@jwt_required(locations=["cookies"])
def logout():
    try:
        # Prepare the response
        # This will be returned to the client
        # after the logout process is completed
        response = make_response(jsonify({"success": "Logout successful"}))

        # Unset the JWT cookies
        # This will remove the JWT from the cookies
        # and invalidate the session
        unset_jwt_cookies(response)
        return response
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@main.route("/profile")
@jwt_required(locations=["cookies"])
def profile():
    try:
        # Get the user ID from the JWT token
        user_id = get_jwt_identity()
        return jsonify(getUserById(user_id))
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@main.route("/cards")
@jwt_required(locations=["cookies"])
def cards():
    try:
        # Get the user ID from the JWT token
        user_id = get_jwt_identity()
        return jsonify(getAllCards(user_id))
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@main.route("/cards/<cardId>")
@jwt_required(locations=["cookies"])
def card(cardId):
    try:
        return jsonify(getCardById(cardId))
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@main.route("/cards/update/<cardId>", methods=["PUT"])
@jwt_required(locations=["cookies"])
def updateCard(cardId):
    # Get the user ID from the JWT token
    user_id = get_jwt_identity()
    # Check if the user ID is valid
    if not user_id:
        return jsonify({"error": "User ID is required"}), 400
    # Check if the user exists
    try:
        user = getUserById(user_id)
        if not user:
            return jsonify({"error": "User not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
    try:
        # Get the card by ID
        card = getCardById(cardId)
        if not card:
            return jsonify({"error": "Card not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500

    try:
        # Get the updated data from the request
        data = request.get_json()
        data['cardId'] = cardId
        # Update the card in the database
        # and return the updated card data
        return jsonify(editCard(data))
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@main.route("/cards/add", methods=["POST"])
@jwt_required(locations=["cookies"])
def addCard():
    # Get the user ID from the JWT token
    user_id = get_jwt_identity()
    # Check if the user ID is valid
    if not user_id:
        return jsonify({"error": "User ID is required"}), 400
    # Check if the user exists
    try:
        user = getUserById(user_id)
        if not user:
            return jsonify({"error": "User not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500

    try:
        data = request.get_json()
        # Add the user_id to the data
        data["user_id"] = user_id
        # Insert the card into the database
        # and return the card data
        return jsonify(insertCard(data)), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@main.route("/cards/delete/<cardId>", methods=["DELETE"])
@jwt_required(locations=["cookies"])
def deleteCardRoute(cardId):
    # Get the user ID from the JWT token
    user_id = get_jwt_identity()
    # Check if the user ID is valid
    if not user_id:
        return jsonify({"error": "User ID is required"}), 400
    # Check if the user exists
    try:
        user = getUserById(user_id)
        if not user:
            return jsonify({"error": "User not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
    try:
        # Get the card by ID
        card = getCardById(cardId)
        if not card:
            return jsonify({"error": "Card not found"}), 404
        # Delete the card from the database
        return jsonify(deleteCard(cardId))
    except Exception as e:
        return jsonify({"error": str(e)}), 500