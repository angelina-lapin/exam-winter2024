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
- **Development Server:**
  - Live Server for serving the application locally.

## Installation

### Prerequisites

- Node.js (v14 or higher)
- npm (Node Package Manager)
- A web browser
- Live Server extension for Visual Studio Code

### Steps

1. Clone the repository:

   ```bash
   git clone https://github.com/angelina-lapin/exam-winter2024
   cd auction-website
   ```

2. Open the folder in Visual Studio Code:

   ```bash
   code .
   ```

3. Start the Live Server:

- Right-click on index.html in the Explorer panel.
- Select Open with Live Server.
- The application will be served on http://127.0.0.1:5500 by default.

## Usage

### Running the Application

1. **Start Live Server:**:  
   Ensure the project is open in Visual Studio Code, and start Live Server as mentioned in the installation steps.

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

node_modules/
src/
├── assets/
│   ├── images/
│   └── scss/
│   └── css/
├── js/
│   ├── api/
│   │   ├── login.js
│   │   ├── login.js
│   │   └── register.js
│   ├── modules/
│   │   ├── constants.js
│   │   └── headers.js
│   ├── forms/
│   │   ├── forms.js
│   ├── product.js
│   ├── main.js
│   └── profile.js
├── pages/
│   ├── home.html
│   ├── login.html
│   ├── product.html
│   ├── profile.html
│   └── registration.html
├── index.html
package-lock.json
package.json
readme.md

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

I welcome contributions from students and educators. If you have any additional study materials or practice exams, please submit a pull request.

