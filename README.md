# E-Commerce Backend API

A RESTful backend for the Flutter E-Commerce application built using Node.js and Express.js. The backend serves product, category, banner, wishlist, cart, and user data using JSON files.

## Features

- REST API Architecture
- Product APIs
- Category APIs
- Banner APIs
- Cart APIs
- Wishlist APIs
- User APIs
- JSON Data Storage
- CORS Enabled

## Tech Stack

- Node.js
- Express.js
- JavaScript
- JSON
- CORS

## API Endpoints

### User

POST /ecom/user/add

### Categories

GET /ecom/category/all

### Banners

GET /ecom/banner/all

### Products

GET /item/recommendation

GET /item/get/:category

GET /item/get/single?id=

### Wishlist

POST /wishlist/add

GET /wishlist/all

DELETE /wishlist/remove/item/:id

### Cart

POST /cart/add

GET /cart/all

PUT /cart/increase/:id

PUT /cart/decrease/:id

DELETE /cart/remove/:id



Server runs on

```
http://localhost:3000
```

## Folder Structure

```
data/
routes/
public/
server.js
package.json
```

## Live Backend

https://ecommerce-app-backend-pvep.onrender.com

## Author

Amey Vagare
