# Chicken Shop Management System - Frontend

Angular 17 standalone application for chicken shop owners to manage their business operations.

## Features

### User Interface Components
- **Login Component**: Secure authentication with JWT tokens
- **Register Component**: User registration with shop name collection
- **Dashboard Component**: Main navigation hub with shop name display
- **Profile Component**: User settings management including Telegram configuration
- **Intake Management**: CRUD operations for chicken intake records with owner display
- **Sales Management**: CRUD operations for sales transactions with owner display
- **Expenses Management**: CRUD operations for business expenses with owner display
- **Reports Component**: Daily and monthly report generation
- **Admin Panel**: User management and system-wide data viewing with user-wise filtering

### Technical Features
- Angular 17 with standalone components
- Angular Material Design for consistent UI
- Reactive forms with validation
- JWT-based authentication
- Role-based access control (Admin vs User)
- Responsive design for mobile and desktop
- Real-time data updates

## Project Structure

```
frontend/
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── login/           # Authentication UI
│   │   │   ├── register/        # User registration with shop name
│   │   │   ├── dashboard/       # Main dashboard with shop name display
│   │   │   ├── profile/         # User profile and Telegram settings
│   │   │   ├── intake/          # Intake management with owner columns
│   │   │   ├── sales/           # Sales management with owner columns
│   │   │   ├── expenses/        # Expenses management with owner columns
│   │   │   ├── reports/         # Report generation UI
│   │   │   └── admin/           # Admin panel with user filtering
│   │   ├── services/
│   │   │   ├── auth.service.ts  # Authentication and user management
│   │   │   ├── api.service.ts   # HTTP client for backend API
│   │   │   ├── intake.service.ts # Intake CRUD operations
│   │   │   ├── sales.service.ts  # Sales CRUD operations
│   │   │   ├── expenses.service.ts # Expenses CRUD operations
│   │   │   ├── reports.service.ts # Report generation
│   │   │   └── admin.service.ts # Admin API operations
│   │   ├── guards/
│   │   │   ├── auth.guard.ts    # Route protection for authenticated users
│   │   │   ├── admin.guard.ts   # Route protection for admin users
│   │   │   └── user-only.guard.ts # Route protection for regular users
│   │   ├── app.config.ts        # Application configuration
│   │   ├── app.routes.ts        # Route definitions
│   │   └── app.ts               # Root component
│   ├── index.html               # Main HTML template
│   ├── main.ts                  # Application bootstrap
│   └── styles.scss              # Global styles
├── package.json                 # Dependencies and scripts
├── angular.json                 # Angular CLI configuration
├── tsconfig.json                # TypeScript configuration
└── tsconfig.app.json            # Application TypeScript config
```

## Development Setup

### Prerequisites
- Node.js 18+ and npm
- Angular CLI 17+
- Backend API running (see backend README)

### Installation
```bash
# Install dependencies
npm install

# Start development server
npm start
```

The application will be available at `http://localhost:4200`

### Build for Production
```bash
# Build the application
npm run build

# The build artifacts will be stored in the `dist/` directory
```

## Key Components

### Authentication Flow
- **Register**: Collects shop name during signup
- **Login**: JWT token-based authentication
- **Profile**: Update shop name and Telegram settings
- **Dashboard**: Displays user's shop name

### Data Management
- **Owner Display**: All lists show owner names for data clarity
- **Admin Filtering**: Admin can filter data by specific users
- **CRUD Operations**: Full create, read, update, delete for all entities

### User Experience
- **Responsive Design**: Works on mobile and desktop
- **Material Design**: Consistent, professional UI
- **Form Validation**: Client-side validation with error messages
- **Loading States**: User feedback during API calls

## Configuration

### API Endpoint
Update `src/app/services/api.service.ts` to point to your backend:
```typescript
private baseUrl = 'http://localhost:8000/api'; // Development
// private baseUrl = 'https://your-production-api.com/api'; // Production
```

### Environment Files
Create `src/environments/environment.prod.ts` for production builds:
```typescript
export const environment = {
  production: true,
  apiUrl: 'https://your-api-domain.com/api'
};
```

## Testing

### Unit Tests
```bash
npm test
```

### End-to-End Tests
```bash
npm run e2e
```

## Deployment

### Static Hosting
The built application can be deployed to any static hosting service:
- Vercel
- Netlify
- GitHub Pages
- Railway Static

### Build Command
```bash
npm run build
```

Upload the contents of `dist/frontend/browser/` to your hosting provider.

## Technologies Used

- **Angular 17**: Modern web framework
- **TypeScript**: Type-safe JavaScript
- **Angular Material**: UI component library
- **RxJS**: Reactive programming
- **Angular CLI**: Development tools
- **SCSS**: Styling preprocessor

## Contributing

1. Follow Angular style guide
2. Use reactive forms for data input
3. Implement proper error handling
4. Add loading states for better UX
5. Test components thoroughly

## Support

For issues related to the frontend:
- Check browser console for errors
- Verify backend API is running
- Ensure CORS is properly configured
- Check network tab for failed requests

See main project documentation for complete setup instructions.
