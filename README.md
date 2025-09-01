# CraveCrush

CraveCrush is a modern, full-stack fast-food ordering web application. It features a robust admin dashboard, guest and registered user ordering, real-time notifications, image upload, and a seamless cart and checkout experience.

## Live Demo
Visit the live site: [CraveCrush](https://cravecrush.vercel.app)

## Features

### For Customers
- **Browse Menu:** View categorized menu items (deals, burgers, pizza, drinks, desserts) with images and descriptions.
- **Add to Cart:** Add, remove, and update quantities of menu items in a modern sidebar cart.
- **Floating Cart Button:** Quick access to cart on mobile devices.
- **Order Placement:** Place orders as a guest or registered user. Enter delivery details and notes.
- **Order Confirmation:** Receive email confirmation after placing an order.
- **Order History:** Registered users can view their past orders.
- **Authentication:** Signup and login with password constraints and show/hide functionality.
- **Notifications:** All alerts and errors are shown as modern notifications.

### For Admins
- **Dashboard:** View, approve, or reject orders. See all menu items.
- **Menu Management:** Add, edit (with modal), or delete menu items. Upload images or provide image URLs.
- **Order Management:** Approve, reject (with reason), or auto-cancel orders. Receive email notifications for new orders.
- **Access Control:** Only admins can access dashboard and menu management routes.

### Backend
- **REST API:** Built with Node.js, Express, and MongoDB.
- **Authentication:** JWT-based, with role-based access (admin/customer).
- **Image Upload:** Uses Multer for secure image uploads, stores files in `/uploads`.
- **Email:** Sends order and contact notifications via Nodemailer (Gmail).
- **Environment Variables:** All sensitive config in a single `.env` at the project root.

## Tech Stack

- **Frontend:** React, Vite, Tailwind CSS, React Router, Axios
- **Backend:** Node.js, Express, MongoDB, Mongoose, JWT, Multer, Nodemailer
- **Other:** ESLint, PostCSS, modern notification and context systems

## Project Structure

```
cravecrush/
  client/         # React frontend
    src/
      components/ # UI components (CartSidebar, Navbar, etc.)
      context/    # Context providers (Auth, Cart, Notification)
      pages/      # Main pages (Home, Cart, AdminDashboard, etc.)
      utils/      # Route guards (PrivateRoute, AdminRoute)
    public/       # Static assets
    ...
  server/         # Node.js backend
    controllers/  # Route controllers (auth, menu, order, etc.)
    models/       # Mongoose models (User, Order, MenuItem)
    routes/       # Express routes
    middleware/   # Auth, admin, upload, error handling
    uploads/      # Uploaded images
    utils/        # Email, cron jobs
  .env            # Environment variables (shared for backend)
```

## Setup & Installation

1. **Clone the repository**
2. **Install dependencies**
   - `cd cravecrush/client && npm install`
   - `cd ../server && npm install`
3. **Configure environment variables**
   - Edit `.env` in the root folder with your MongoDB URI, JWT secret, email credentials, etc.
4. **Run the backend**
   - `cd cravecrush/server && npm run dev`
5. **Run the frontend**
   - `cd cravecrush/client && npm run dev`
6. **Access the app**
   - Frontend: [http://localhost:5173](http://localhost:5173)
   - Backend API: [http://localhost:5000](http://localhost:5000)

## Environment Variables Example

```
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
EMAIL_USER=your_gmail_address
EMAIL_PASS=your_gmail_app_password
```

## Security & Best Practices

- Passwords are hashed with bcrypt.
- JWT tokens are used for authentication and role-based access.
- All sensitive data is stored in `.env` (never commit this file).
- Image uploads are validated and stored securely.

## License
This project is for educational and demonstration purposes.
