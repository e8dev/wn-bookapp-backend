# My Books App Backend

To run the app on the default port (3009):

```
npm install
npm start
```

## Installation

Ensure you have Node.js and npm installed. Then, run the following command to install dependencies:

```
npm install
```

## Structure

- **database**: Connection to the database.
- **models**: Storage of models.
- **routes**: Storage of routes, can be extended by adding new route files.
- **services**: App services, by default only the book service.

## Security

For setting up the environment and storing app secrets, the app uses a `.env` file.

Example `.env` file:

```
DB_HOST=localhost
DB_PORT=5432
DB_DATABASE=your-db-name
DB_USERNAME=your-username
DB_PASSWORD=your-password
```

## Description

The My Books App Backend project provides a basic API structure with a unified response. It follows the backend paradigm of route -> handler -> controller. This API allows for easy management of books, including adding, listing, editing, and deleting books.

## License

This project is licensed under the [MIT License](LICENSE).
