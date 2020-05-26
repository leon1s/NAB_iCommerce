# Code Structure
RESTful api with Domain Driven Design. 

## Microservice-based E-Commerce System

### Goal

A small start-up named "iCommerce" wants to build an online shopping application to sell their products. In order to get to the market quickly, they just want to build a version with a very limited set of functionalities.

Concepts & Patterns:

- Microservices
- DDD : Domain Driven Design
- CQRS : Command Query Responsibility Segregation
- Unit Testing

Tools:
- Docker & Docker Compose

Language:
- Node.js

### Project Structure

In this system we derive system to these two (micro)services:

- Ordering Service: browsing product catalog, create an order,.
- Product Service: product inventory will be managed inside this service.

- Source code in src.
    - app: the same with controller, handle and switching task.
    - domain: core, we define core class and attribute here.
    - infra: our libs, connection, mapper and repository.
    - interface: user interface. Http requests here.

### Prerequisites

All you need is Docker with Docker Compose enabled.


### Step set up

unit test: npm run test:all 

How to start:  
1) We can start project by npm cmd:
    - Setup the database on config/database.js (there's an example file there to be used with Mysql)
    - Install the dependencies with yarn or npm install
    - Create the development and test databases you have setup on config/database.js
    - Run the database migrations with npm run sequelize db:migrate
    - Run the application in development mode with npm run dev
    
2) We can start project by docker-compose:
    -  Install docker &  docker-compose.
    -  Run docker-compose up --build.
    -  Run exec -ti <name docker> sh.
    -  Run npm run sequelize db:migrate.
 
