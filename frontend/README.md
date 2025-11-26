# Ekart Frontend - React Application

A modern React frontend for the Ekart cargo management system, providing an intuitive user interface for managing orders, trucks, drivers, and carriers.

## Features

- **Dashboard**: View key statistics and recent orders
- **Orders Management**: List, create, and manage orders
- **Truck Management**: View available trucks
- **Driver Management**: View driver details and availability
- **Carrier Management**: Manage carrier information
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Real-time API Integration**: Connected to Spring Boot backend

## Tech Stack

- **React 18**: Modern UI framework
- **React Router v6**: Client-side routing
- **Axios**: HTTP client for API communication
- **CSS**: Custom styling with modern layouts

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn package manager
- Spring Boot backend running on `http://localhost:8080`

## Installation

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env` file (already included with default values):
   ```
   REACT_APP_API_BASE_URL=http://localhost:8080
   REACT_APP_API_TIMEOUT=30000
   ```

## Running the Application

### Development Mode

```bash
npm start
```

The application will start at `http://localhost:3000`

### Production Build

```bash
npm run build
```

This creates an optimized production build in the `build/` directory.

## Project Structure

```
frontend/
├── public/
│   └── index.html          # Main HTML file
├── src/
│   ├── pages/              # Page components
│   │   ├── Dashboard.js
│   │   ├── OrderList.js
│   │   ├── AddOrder.js
│   │   ├── TruckList.js
│   │   ├── DriverList.js
│   │   └── CarrierList.js
│   ├── services/           # API service layer
│   │   └── api.js
│   ├── App.js              # Main App component
│   ├── App.css             # App styles
│   ├── index.js            # Entry point
│   └── index.css           # Global styles
├── .env                    # Environment variables
├── .gitignore              # Git ignore rules
└── package.json            # Project dependencies
```

## API Endpoints

The frontend communicates with the following backend endpoints:

### Orders
- `GET /orders` - Get all orders
- `GET /orders/{id}` - Get order by ID
- `POST /orders` - Create new order
- `PUT /orders/{id}` - Update order
- `DELETE /orders/{id}` - Delete order

### Trucks
- `GET /trucks` - Get all trucks
- `GET /trucks/{id}` - Get truck by ID
- `POST /trucks` - Create new truck
- `PUT /trucks/{id}` - Update truck
- `DELETE /trucks/{id}` - Delete truck

### Drivers
- `GET /drivers` - Get all drivers
- `GET /drivers/{id}` - Get driver by ID
- `POST /drivers` - Create new driver
- `PUT /drivers/{id}` - Update driver
- `DELETE /drivers/{id}` - Delete driver

### Carriers
- `GET /carriers` - Get all carriers
- `GET /carriers/{id}` - Get carrier by ID
- `POST /carriers` - Create new carrier
- `PUT /carriers/{id}` - Update carrier
- `DELETE /carriers/{id}` - Delete carrier

## Environment Variables

- `REACT_APP_API_BASE_URL`: Backend API base URL (default: `http://localhost:8080`)
- `REACT_APP_API_TIMEOUT`: Request timeout in milliseconds (default: `30000`)

## Available Scripts

- `npm start` - Run development server
- `npm run build` - Create production build
- `npm test` - Run tests
- `npm run eject` - Eject from Create React App (not reversible)

## Features to Be Implemented

- User authentication and authorization
- Advanced filtering and search
- Order tracking with real-time updates
- Export reports (PDF, Excel)
- Email notifications
- Payment integration

## Troubleshooting

### Backend Connection Issues
- Ensure Spring Boot backend is running on port 8080
- Check CORS configuration in backend
- Verify `REACT_APP_API_BASE_URL` in `.env` file

### Port 3000 Already in Use
```bash
npm start -- --port 3001
```

### Dependencies Issues
```bash
rm -rf node_modules package-lock.json
npm install
```

## Contributing

1. Create a new branch for your feature
2. Make your changes
3. Submit a pull request

## License

This project is part of the Ekart Cargo Management System.

## Support

For issues or questions, please contact the development team.
