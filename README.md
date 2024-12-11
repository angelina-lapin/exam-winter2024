# Auction Website

This is a web application for managing and participating in auctions. Users can create listings, place bids, and view details of auction items. The project is built with JavaScript, utilizing modern practices for dynamic rendering and API integration.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Usage](#usage)
- [Folder Structure](#folder-structure)
- [API Reference](#api-reference)
- [Contributing](#contributing)
- [License](#license)

## Features

- **User Authentication:**
  - Secure login and registration.
- **Profile Management:**
  - Update profile information (avatar, banner, bio).
- **Auction Listings:**
  - Create, edit, and delete auction listings.
  - View all user-created listings on the profile page.
  - Search for listings.
- **Bidding:**
  - Place bids on items.
  - View the highest bid and bid history.
- **Dynamic Navigation:**
  - Custom navigation bar depending on user authentication status.

## Technologies Used

- **Frontend:**
  - HTML, CSS (Bootstrap)
  - JavaScript (ES6+)
- **Backend API:**
  - REST API integration using Fetch API.
- **Build Tools:**
  - [Vite](https://vitejs.dev) for development and build process.

## Installation

### Prerequisites

- Node.js (v14 or higher)
- A web browser

### Steps

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/auction-website.git
   cd auction-website
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open the application in your browser:
   ```bash
   http://localhost:5173
   ```

## Usage

### Running the Application

1. **Start the Server**:  
   After installing dependencies, run the development server using:
   ```bash
   npm run dev
   ```

   The application will be available at [http://localhost:5173](http://localhost:5173).

2. **Explore the Features**:
   
   - **Homepage**: View a grid of auction listings.
   - **Profile Page**: Manage your profile and view your created listings.
   - **Product Details**: Access detailed information about specific listings.

### Key Features in Action

- **Create a Listing**:
  Navigate to the Profile page.
  Use the "Create Listing" form to add a title, description, media URLs, and auction deadline.
  Submit the form to create a new listing.

- **Place a Bid**:
  From the homepage or your profile, click "View Details" on a listing.
  Enter a bid amount higher than the current highest bid.
  Submit the bid to participate in the auction.

- **Manage Your Listings**:
  On the Profile page, view all your created listings.
  Use the "Delete" button to remove a listing.

## Folder Structure
```
src/
├── assets/          # Images and static files
├── js/
│   ├── api.js       # Handles API requests
│   ├── headers.js   # Manages headers for API requests
│   ├── constants.js # Contains API base URLs and keys
│   ├── profile.js   # Profile page logic
│   ├── product.js   # Product details logic
│   └── main.js      # Shared utilities and navigation
├── pages/
│   ├── index.html   # Homepage
│   ├── profile.html # Profile page
│   ├── product.html # Product details page
└── styles/          # CSS files
```


## API Reference

### Base URL
The API base URL is:  
`https://docs.noroff.dev/docs/v2/auction-house`

### Endpoints

- **Get Listings**  
  **Method**: `GET`  
  **Endpoint**: `/listings`  
  Retrieves all auction listings.

- **Create Listing**  
  **Method**: `POST`  
  **Endpoint**: `/listings`  
  Adds a new auction listing.

- **Delete Listing**  
  **Method**: `DELETE`  
  **Endpoint**: `/listings/:id`  
  Deletes a specific listing.

- **User Profile**  
  **Method**: `GET`  
  **Endpoint**: `/profiles/:username`  
  Retrieves user profile details.

For a complete reference, see the [API Documentation](https://docs.noroff.dev/docs/v2/auction-house).


## Contributing

We welcome contributions from students and educators. If you have any additional study materials or practice exams, please submit a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.
