from .models import Card

def insertCard(data):
    # Validate the input data
    required_fields = ["card_set", "card_type", "description", "image", "name", "rarity", "set_number"]
    for field in required_fields:
        if not data.get(field):
            return { "error": f"{field.replace('_', ' ').capitalize()} is required" }, 400
    
    # Try to create a new Card object
    try:
        card = Card(
            card_set=data["card_set"],
            card_type=data["card_type"],
            description=data["description"],
            image=data["image"],
            name=data["name"],
            rarity=data["rarity"],
            set_number=data["set_number"],
            user_id=data["user_id"]
        )
    except Exception as e:
        return { "error": f"Failed to create card object: {str(e)}" }, 500
    
    # Try to insert the card into the database
    try:
        card.insertCard()
    except Exception as e:
        return { "error": f"Failed to insert card into database: {str(e)}" }, 500
    
    # Return the card data without the timestamps
    data = card.toDictionary()
    del data["created_at"]  # Don't return the created_at timestamp
    del data["updated_at"]  # Don't return the updated_at timestamp
    return { "message": "Card added successfully", "card": data }

def getAllCards(user_id):
    try:
        print("Fetching all cards")
        return Card.getAllCards(user_id)
    except Exception as e:
        print("An error occurred:", e)
        return None
    
def getCardById(card_id):
    try:
        print(f"Fetching card with ID: {card_id}")
        return Card.getCardById(card_id)
    except Exception as e:
        print("An error occurred:", e)
        return None
    
def deleteCard(card_id):
    try:
        print(f"Attempting to delete card with ID: {card_id}")
        # Getting the card by ID
        # TODO: This should be improved to use the getCardById method
        # to avoid code duplication
        # and to ensure that the card exists
        # keeping this becase the getCardById method is retuning a list
        # of dictionaries instead of a single card object
        # and we need to delete the card object
        # not the dictionary
        # card = Card.getCardById(card_id)
        # card = Card.query.filter_by(id=card_id).first()
        card = Card.query.filter_by(id=card_id).first()
        if not card:
            return { "error": "Card not found" }, 404
        
        # Deleting the card
        Card.deleteCard(card)
        return { "success": "Card deleted successfully" }
    except Exception as e:
        print("An error occurred:", e)
        return { "error": "Failed to delete card" }, 500
    
def editCard(data):
    # Validate the input data
    required_fields = ["card_set", "card_type", "description", "image", "name", "rarity", "set_number"]
    for field in required_fields:
        if not data.get(field):
            return { "error": f"{field.replace('_', ' ').capitalize()} is required" }, 400
    
    # Attempt to retrieve the card by ID
    print(f"Attempting to edit card with ID: {data['cardId']}")
    try:
        # TODO: This should be improved to use the getCardById method
        # to avoid code duplication
        # and to ensure that the card exists
        # keeping this because the getCardById method is returning a list
        # of dictionaries instead of a single card object
        # and we need the card object to perform updates
        # card = Card.getCardById(data["cardId"])
        # card = Card.query.filter_by(id=data["cardId"]).first()
        card = Card.query.filter_by(id=data["cardId"]).first()
        if not card:
            return { "error": "Card not found" }, 404
    except Exception as e:
        return { "error": f"Failed to fetch card: {str(e)}" }, 500
    
    # Try to update the card in the database
    try:
        # Save the updated card to the database
        card = Card.updateCard(
            card,
            name=data["name"],
            description=data["description"],
            image=data["image"],
            card_type=data["card_type"],
            rarity=data["rarity"],
            card_set=data["card_set"],
            set_number=data["set_number"]
        )        
    except Exception as e:
        return { "error": f"Failed to update card in the database: {str(e)}" }, 500
    
    # Return the card data without the timestamps
    data = card.toDictionary()
    del data["created_at"]  # Don't return the created_at timestamp
    del data["updated_at"]  # Don't return the updated_at timestamp
    return { "message": "Card updated successfully", "card": data }