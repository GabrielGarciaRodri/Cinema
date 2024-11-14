# Cinema App

A full-stack web application for managing a cinema's movie showings, ticket sales, and user interactions.

## Table of Contents
- [Introduction](#introduction)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Database Schema](#database-schema)
- [API Endpoints](#api-endpoints)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## Introduction
The Cinema App is a comprehensive platform designed to streamline the management of a cinema's operations. It provides functionalities for adding and managing movie showings, handling ticket sales, and allowing users to interact with the cinema's offerings.

## Features
- **Movies Management**: Add, update, and delete movie details, including title, genre, release date, duration, description, poster image, and trailer link.
- **Theaters Management**: Create and manage theater information, including name, location, number of screens, and available amenities.
- **Showtimes Management**: Schedule movie showings, assign them to specific theaters and screens, set ticket prices, and track available seats.
- **User Accounts**: Allow users to register, log in, view their purchase history, manage their favorite movies, and create a watchlist.
- **Ratings and Reviews**: Users can rate movies and leave reviews, which are displayed on the movie details page.

## Technologies Used
- **Backend**: Node.js, Express.js, MongoDB (with Mongoose)
- **Frontend**: React Native, Tailwind CSS
- **Authentication**: JSON Web Tokens (JWT)

## Database Schema
The Cinema App uses a MongoDB database with the following collections:

1. **Movies**
2. **Theaters**
3. **Showtimes**
4. **Users**

#### Detail Schema's Validation

```sql

db.createCollection("movies", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["title", "genre", "releaseDate", "duration", "description"],
      properties: {
        title: {
          bsonType: "string",
          description: "must be a string and is required"
        },
        genre: {
          bsonType: "array",
          items: {
            bsonType: "string"
          },
          description: "must be an array of strings and is required"
        },
        releaseDate: {
          bsonType: "date",
          description: "must be a date and is required"
        },
        duration: {
          bsonType: "int",
          minimum: 1,
          description: "must be an integer in minutes and is required"
        },
        description: {
          bsonType: "string",
          description: "must be a string and is required"
        },
        posterImage: {
          bsonType: "string",
          description: "must be a string URL"
        },
        trailerLink: {
          bsonType: "string",
          description: "must be a string URL"
        },
        ratings: {
          bsonType: "object",
          required: ["average", "userRatings"],
          properties: {
            average: {
              bsonType: "double",
              minimum: 0,
              maximum: 5,
              description: "must be a number between 0 and 5"
            },
            userRatings: {
              bsonType: "array",
              items: {
                bsonType: "object",
                required: ["userId", "rating", "date"],
                properties: {
                  userId: {
                    bsonType: "objectId",
                    description: "must be an ObjectId reference to users collection"
                  },
                  rating: {
                    bsonType: "int",
                    minimum: 1,
                    maximum: 5,
                    description: "must be an integer between 1 and 5"
                  },
                  date: {
                    bsonType: "date",
                    description: "must be a date"
                  }
                }
              }
            }
          }
        },
        reviews: {
          bsonType: "array",
          items: {
            bsonType: "object",
            required: ["userId", "text", "date"],
            properties: {
              userId: {
                bsonType: "objectId",
                description: "must be an ObjectId reference to users collection"
              },
              text: {
                bsonType: "string",
                description: "must be a string"
              },
              date: {
                bsonType: "date",
                description: "must be a date"
              }
            }
          }
        }
      }
    }
  }
});

db.createCollection("theaters", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["name", "location", "numberOfScreens", "amenities"],
      properties: {
        name: {
          bsonType: "string",
          description: "must be a string and is required"
        },
        location: {
          bsonType: "object",
          required: ["address", "city", "state", "zipCode"],
          properties: {
            address: {
              bsonType: "string",
              description: "must be a string"
            },
            city: {
              bsonType: "string",
              description: "must be a string"
            },
            state: {
              bsonType: "string",
              description: "must be a string"
            },
            zipCode: {
              bsonType: "string",
              description: "must be a string"
            }
          }
        },
        numberOfScreens: {
          bsonType: "int",
          minimum: 1,
          description: "must be an integer greater than 0"
        },
        amenities: {
          bsonType: "array",
          items: {
            bsonType: "string",
            enum: ["3D", "IMAX", "Dolby Atmos", "VIP", "4DX"],
            description: "must be one of the predefined amenities"
          }
        }
      }
    }
  }
});

db.createCollection("showtimes", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["movieId", "theaterId", "screenNumber", "startTime", "endTime", "ticketPrice", "availableSeats"],
      properties: {
        movieId: {
          bsonType: "objectId",
          description: "must be an ObjectId reference to movies collection"
        },
        theaterId: {
          bsonType: "objectId",
          description: "must be an ObjectId reference to theaters collection"
        },
        screenNumber: {
          bsonType: "int",
          minimum: 1,
          description: "must be an integer greater than 0"
        },
        startTime: {
          bsonType: "date",
          description: "must be a date"
        },
        endTime: {
          bsonType: "date",
          description: "must be a date"
        },
        ticketPrice: {
          bsonType: "double",
          minimum: 0,
          description: "must be a positive number"
        },
        availableSeats: {
          bsonType: "int",
          minimum: 0,
          description: "must be a non-negative integer"
        }
      }
    }
  }
});

db.createCollection("users", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["username", "email", "password", "phoneNumber"],
      properties: {
        username: {
          bsonType: "string",
          minLength: 3,
          maxLength: 50,
          description: "must be a string between 3 and 50 characters"
        },
        email: {
          bsonType: "string",
          pattern: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$",
          description: "must be a valid email address"
        },
        password: {
          bsonType: "string",
          minLength: 8,
          description: "must be a string with at least 8 characters"
        },
        phoneNumber: {
          bsonType: "string",
          pattern: "^\\+?[1-9]\\d{1,14}$",
          description: "must be a valid phone number"
        },
        address: {
          bsonType: "object",
          properties: {
            street: {
              bsonType: "string"
            },
            city: {
              bsonType: "string"
            },
            state: {
              bsonType: "string"
            },
            zipCode: {
              bsonType: "string"
            }
          }
        },
        purchaseHistory: {
          bsonType: "array",
          items: {
            bsonType: "object",
            required: ["showtimeId", "purchaseDate", "quantity", "totalAmount"],
            properties: {
              showtimeId: {
                bsonType: "objectId",
                description: "must be an ObjectId reference to showtimes collection"
              },
              purchaseDate: {
                bsonType: "date",
                description: "must be a date"
              },
              quantity: {
                bsonType: "int",
                minimum: 1,
                description: "must be at least 1"
              },
              totalAmount: {
                bsonType: "double",
                minimum: 0,
                description: "must be a positive number"
              }
            }
          }
        },
        favoriteMovies: {
          bsonType: "array",
          items: {
            bsonType: "objectId",
            description: "must be an ObjectId reference to movies collection"
          }
        },
        watchlist: {
          bsonType: "array",
          items: {
            bsonType: "objectId",
            description: "must be an ObjectId reference to movies collection"
          }
        }
      }
    }
  }
});
```



## API Endpoints
The Cinema App provides the following API endpoints:

| Method | Endpoint            | Description                             |
| ------ | ------------------- | --------------------------------------- |
| GET    | /api/movies         | Retrieve a list of all movies           |
| GET    | /api/movies/:id     | Retrieve details of a specific movie    |
| POST   | /api/movies         | Create a new movie                      |
| PUT    | /api/movies/:id     | Update an existing movie                |
| DELETE | /api/movies/:id     | Delete a movie                          |
| GET    | /api/theaters       | Retrieve a list of all theaters         |
| GET    | /api/theaters/:id   | Retrieve details of a specific theater  |
| POST   | /api/theaters       | Create a new theater                    |
| PUT    | /api/theaters/:id   | Update an existing theater              |
| DELETE | /api/theaters/:id   | Delete a theater                        |
| GET    | /api/showtimes      | Retrieve a list of all showtimes        |
| GET    | /api/showtimes/:id  | Retrieve details of a specific showtime |
| POST   | /api/showtimes      | Create a new showtime                   |
| PUT    | /api/showtimes/:id  | Update an existing showtime             |
| DELETE | /api/showtimes/:id  | Delete a showtime                       |
| POST   | /api/users/register | Register a new user                     |
| POST   | /api/users/login    | Log in a user                           |
| GET    | /api/users/me       | Retrieve the current user's information |
| PUT    | /api/users/me       | Update the current user's information   |

## Getting Started

### Prerequisites
- Node.js (version 14 or higher)
- MongoDB (version 4.4 or higher)
- npm (version 6 or higher)

### Installation
1. Clone the repository:
   ```
   git clone https://github.com/GabrielGarciaRodri/Cinema
   ```
2. Navigate to the project directory:
   ```
   cd Cinema
   ```
3. Install the dependencies:
   ```
   npm install
   ```
4. Start the development server:
   ```
   npm start
   ```
5. Open your web browser and visit `http://localhost:3000` to access the Cinema App.

## Usage
The Cinema App provides a user-friendly interface for managing a cinema's operations. Users can:
- Browse and search for movies
- View movie details, including ratings and reviews
- Purchase tickets for movie showings
- Manage their account, including favorite movies and watchlist
- Administrators can manage movies, theaters, and showtimes through the provided API endpoints

## Contributing
If you'd like to contribute to the Cinema App, please follow these steps:
1. Fork the repository
2. Create a new branch for your feature or bug fix
3. Make your changes and commit them
4. Push your changes to your forked repository
5. Create a pull request to the main repository





