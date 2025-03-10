# Royal Udaipur Restaurant System

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Node.js](https://img.shields.io/badge/node-16.8%2B-brightgreen)
![FastAPI](https://img.shields.io/badge/fastapi-0.100%2B-blue)
![Next.js](https://img.shields.io/badge/next.js-13%2B-black)

A comprehensive full-stack restaurant management system designed specifically for Royal Udaipur, featuring an elegant user interface for customers and a powerful management dashboard for restaurant staff and administrators.

<div align="center">
  <img src="https://placeholder-for-screenshot.jpg" alt="Royal Udaipur Restaurant System" width="800px" />
</div>

## 📋 Table of Contents

- [Features](#-features)
- [Architecture](#-architecture)
- [Project Structure](#-project-structure)
- [Technologies Used](#-technologies-used)
- [Getting Started](#-getting-started)
- [Usage Guide](#-usage-guide)
- [API Documentation](#-api-documentation)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)
- [Contact](#-contact)

## ✨ Features

### Customer Experience
- **Cultural UI/UX Design** - Beautiful interface with traditional Rajasthani design elements
- **Online Table Reservations** - Seamless booking system with time slot selection
- **Real-time Availability** - Live updates on table availability
- **Interactive Digital Menu** - Visually appealing menu with detailed descriptions, images, and dietary information
- **Special Event Bookings** - System for reserving space for celebrations and gatherings
- **Loyalty Program** - Points system for returning customers
- **Online Ordering** - Takeaway and delivery options
- **Multilingual Support** - Interface available in English and Hindi
- **AI-powered Chatbot** - Instant assistance for common customer queries



## 🏗️ Architecture

The Royal Udaipur Restaurant System follows a modern microservices architecture:

### Frontend Architecture
- **Framework**: Next.js 13+ with App Router for SSR and routing
- **Styling**: TailwindCSS with custom Rajasthani theme
- **State Management**: React Context API and Hooks
- **Authentication**: JWT-based auth with secure HTTP-only cookies
- **API Integration**: Custom API client with retries and error handling

### Backend Architecture
- **API Framework**: FastAPI for high-performance Python API development
- **Database**: SQLite for simplified deployment and maintenance
- **AI Agents**: Crew AI agents for intelligent task handling and automation
- **Authentication**: JWT authentication with role-based access control
- **Socket Service**: WebSockets for real-time updates (reservations, orders)
- **Payment Processing**: Integration with payment gateways
- **File Storage**: Cloud storage for menu images and assets
- **Caching Layer**: Redis for performance optimization
- **Background Jobs**: Celery for asynchronous task processing

## 📂 Project Structure

```
Resturant_System/
├── frontend/                # Next.js frontend application
│   ├── app/                 # App router pages and layouts
│   ├── components/          # Reusable UI components
│   ├── contexts/            # React contexts for state management
│   ├── hooks/               # Custom React hooks
│   ├── public/              # Static assets
│   ├── styles/              # Global styles and Tailwind config
│   └── utils/               # Utility functions and helpers
│
├── backend/                 # FastAPI backend application
│   ├── app/                 # Main application package
│   │   ├── api/             # API routes and endpoints
│   │   ├── models/          # 
│   │   ├── schemas/         # Pydantic schemas
│   │   ├── services/        # Business logic services
│   │   ├── core/            # Core application components
│   │   └── utils/           # Utility functions
│   ├── agents/              # Crew AI agents
│   │   ├── reservation/     # Reservation management agents
│   │   ├── inventory/       # Inventory management agents
│   │   ├── recommendation/  # Menu recommendation agents
│   │   └── customer/        # Customer service agents
│   ├── database/            # Database configuration and migrations
│   └── tests/               # Test suites
│
├
│
├── scripts/                 # Development and deployment scripts
├── docs/                    # Documentation files
└── tests/                   # Test suites
```

## 🔧 Technologies Used

### Frontend
- Next.js 13+
- React 18+
- TypeScript
- TailwindCSS
- React Query
- Framer Motion (animations)
- React Hook Form
- date-fns
- SWR for data fetching

### Backend
- Python 3.9+
- FastAPI
- SQLite & SQLAlchemy ORM
- Pydantic
- Crew AI Framework
- JWT Authentication
- Celery
- Redis
- Pytest (testing)


## 🚀 Getting Started

### Prerequisites
- Node.js 16.8+ and npm/yarn
- Python 3.9+ and pip
- Git

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/Revantabiswas/Resturant_System.git
cd Resturant_System
```

2. **Install dependencies**
```bash
# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
pip install -r requirements.txt
```

3. **Environment Setup**
```bash
# Configure frontend environment
cd frontend
cp .env.example .env.local

# Configure backend environment
cd ../backend
cp .env.example .env
```

4. **Start development servers**
```bash
# Start frontend development server
cd frontend
npm run dev

# Start backend development server
cd ../backend
uvicorn app.main:app --reload
```

5. **Access the application**
- Customer portal: http://localhost:3000
- Admin dashboard: http://localhost:3000/admin
- Backend API: http://localhost:8000/api
- API Documentation: http://localhost:8000/docs

## 📘 Usage Guide

### For Customers

1. **Browse the Restaurant**
   - View the restaurant's information, gallery, and special offerings
   - Check menu items and their descriptions

2. **Make a Reservation**
   - Click "Book a Table" button
   - Select date, time, party size, and any special requirements
   - Receive confirmation email with booking details

3. **Online Ordering**
   - Browse the menu and add items to cart
   - Specify dietary preferences and customizations
   - Choose delivery or takeaway option
   - Complete payment and track order status

### For Restaurant Staff

1. **Access Admin Dashboard**
   - Navigate to /admin and login with staff credentials
   - View today's reservations and incoming orders

2. **Manage Reservations**
   - Confirm or reject new reservation requests
   - Modify existing reservations
   - Handle walk-in customers

3. **Update Menu**
   - Add new menu items with descriptions and images
   - Adjust prices and availability
   - Create seasonal specials and promotions

### For Restaurant Managers

1. **Access Performance Analytics**
   - View sales reports and customer metrics
   - Analyze peak hours and popular menu items

2. **Staff Management**
   - Add and remove staff accounts
   - Assign roles and permissions
   - Schedule shifts and track attendance

3. **Inventory Control**
   - Monitor stock levels
   - Create purchase orders
   - Track food costs and wastage

## 📡 API Documentation

Our API follows RESTful principles and is documented using Swagger UI and ReDoc.

### Main API Endpoints

#### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

#### Reservations
- `GET /api/reservations` - List all reservations
- `POST /api/reservations` - Create new reservation
- `GET /api/reservations/{id}` - Get reservation details
- `PUT /api/reservations/{id}` - Update reservation
- `DELETE /api/reservations/{id}` - Cancel reservation

#### Menu
- `GET /api/menu` - Get full menu
- `GET /api/menu/categories` - Get menu categories
- `GET /api/menu/items/{id}` - Get menu item details
- `POST /api/menu/items` - Add menu item (admin)
- `PUT /api/menu/items/{id}` - Update menu item (admin)

#### Orders
- `GET /api/orders` - List orders
- `POST /api/orders` - Create new order
- `GET /api/orders/{id}` - Get order details
- `PUT /api/orders/{id}/status` - Update order status

#### AI Agents
- `POST /api/agents/recommend-menu` - Get AI-powered menu recommendations
- `POST /api/agents/optimize-inventory` - Run inventory optimization
- `GET /api/agents/analytics` - Get AI-generated business insights

For complete API documentation:
- Development: http://localhost:8000/docs
- Production: https://royaludaipur.com/docs

## 🌐 Deployment

### Frontend Deployment

The frontend is configured for deployment on Vercel:

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy from frontend directory
cd frontend
vercel
```

### Backend Deployment

The backend can be deployed to any Python hosting service:

```bash
# Using Gunicorn on a Linux server
cd backend
pip install gunicorn
gunicorn -w 4 -k uvicorn.workers.UvicornWorker app.main:app
```

### Docker Deployment

```bash
# Build and run with Docker Compose
docker-compose up -d
```

## 🤝 Contributing

We welcome contributions to the Royal Udaipur Restaurant System!

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Please ensure your code follows our style guidelines and includes appropriate tests.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Contact

Project Owner: Revanta Biswas - [revanta.biswas@example.com](mailto:revanta.biswas@example.com)

Project Repository: [https://github.com/Revantabiswas/Resturant_System](https://github.com/Revantabiswas/Resturant_System)

---

<div align="center">
  <p>Built with ❤️ for Royal Udaipur Restaurant</p>
</div>
