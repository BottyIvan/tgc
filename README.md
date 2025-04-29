# TCG Manager

> [!CAUTION]
> Some features of TCG Manager are still under development and may not be fully functional. Stay tuned for updates!

TCG Manager is a web application designed to help users manage their trading card collections efficiently. It provides features for user authentication, card management, and profile customization.

## Features

- **User Authentication**: Register, log in, and log out securely using JWT-based authentication.
- **Card Management**: Add, view, update, and delete trading cards in your collection.
- **Profile Management**: Update user profile information and customize the application theme.
- **Responsive Design**: Optimized for both desktop and mobile devices.
- **Dark/Light Theme**: Switch between dark and light themes for better user experience.

## Technologies Used

- **Backend**: Flask, Flask-SQLAlchemy, Flask-Migrate, Flask-JWT-Extended
- **Frontend**: HTML, CSS (Bootstrap), JavaScript
- **Database**: MySQL
- **Containerization**: Docker, Docker Compose

## Installation

### Prerequisites

- Docker and Docker Compose installed on your machine.

### Steps

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd tgc
   ```

2. Create a `.env` file:
   Copy the `.env.example` file and update the environment variables as needed.
   ```bash
   cp .env.example .env
   ```

3. Build and start the application:
   ```bash
   docker-compose up --build
   ```

4. Access the application:
   - Web application: [http://localhost:8081](http://localhost:8081)
   - phpMyAdmin: [http://localhost:8080](http://localhost:8080)

## Usage

### Authentication

- **Register**: Create a new account.
- **Login**: Log in to access your card collection.
- **Logout**: Securely log out of your account.

### Card Management

- **Add Card**: Add a new card to your collection.
- **View Cards**: Browse your card collection.
- **Edit Card**: Update card details.
- **Delete Card**: Remove a card from your collection.

### Profile Management

- **Update Profile**: Modify your username, email, or password.
- **Theme Customization**: Switch between light and dark themes.

## Project Structure

```
tgc/
├── app/
│   ├── static/          # Static files (CSS, JS, images)
│   ├── templates/       # HTML templates
│   ├── __init__.py      # Flask app initialization
│   ├── config.py        # Application configuration
│   ├── models.py        # Database models
│   ├── routes.py        # API routes
│   ├── users.py         # User-related logic
│   ├── cards.py         # Card-related logic
├── migrations/          # Database migrations
├── .env                 # Environment variables
├── docker-compose.yaml  # Docker Compose configuration
├── Dockerfile           # Dockerfile for the application
├── requirements.txt     # Python dependencies
└── README.md            # Project documentation
```

## API Endpoints

### Authentication

- `POST /auth/register`: Register a new user.
- `POST /auth/login`: Log in and receive a JWT token.
- `POST /auth/logout`: Log out and invalidate the JWT token.

### Cards

- `GET /cards`: Retrieve all cards for the logged-in user.
- `GET /cards/<cardId>`: Retrieve details of a specific card.
- `POST /cards/add`: Add a new card.
- `PUT /cards/update/<cardId>`: Update details of a specific card.
- `DELETE /cards/delete/<cardId>`: Delete a card.

### Profile

- `GET /profile`: Retrieve the logged-in user's profile.

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Commit your changes and push the branch.
4. Open a pull request.

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.

## Acknowledgments

- [Flask](https://flask.palletsprojects.com/)
- [Bootstrap](https://getbootstrap.com/)
- [Docker](https://www.docker.com/)
