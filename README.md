# Chess Tournament Manager

A comprehensive chess tournament management application built with Nuxt 4, Prisma, and Supabase.

## 🚀 Features

### Core Functionality

- **Tournament Management**: Create, edit, and manage chess tournaments
- **Competitor Registration**: Allow visitors to register for tournaments
- **Admin Dashboard**: Comprehensive admin interface with statistics and management tools
- **Role-Based Access Control**: Super Admin, Admin, and User roles
- **Audit Logging**: Complete audit trail for all actions

### Advanced Features

- **Table Sorting**: Sortable tables for tournaments, competitors, and users
- **Import/Export**: CSV, Excel, and PDF export capabilities
- **File Management**: Secure file upload and storage
- **Email Notifications**: Automated email notifications for registrations and approvals
- **Mobile-First Design**: Responsive design optimized for all devices
- **Internationalization**: Multi-language support (English/Greek)

### Security & Performance

- **Production-Grade Security**: Comprehensive security measures and validation
- **Rate Limiting**: API rate limiting and protection
- **File Validation**: Virus scanning and file type validation
- **Caching**: Redis caching for performance optimization
- **Testing**: Comprehensive test suite with 80%+ coverage

## 🛠 Tech Stack

### Frontend

- **Nuxt 4**: Vue.js framework with SSR
- **Nuxt UI**: Component library
- **Pinia**: State management
- **VueUse**: Vue composition utilities
- **Tailwind CSS**: Utility-first CSS framework
- **TypeScript**: Type safety

### Backend

- **Nitro**: Nuxt server engine
- **Prisma**: Database ORM
- **Supabase**: Database and authentication
- **PostgreSQL**: Primary database

### Testing & Quality

- **Vitest**: Unit testing
- **Playwright**: E2E testing
- **ESLint**: Code linting
- **Prettier**: Code formatting
- **MSW**: API mocking

## 📦 Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd ctm
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env
   ```

   Configure the following variables:

   ```env
   # Database
   DATABASE_URL="postgresql://username:password@localhost:5432/ctm"
   DIRECT_URL="postgresql://username:password@localhost:5432/ctm"

   # Supabase
   NUXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
   NUXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
   SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"

   # Email
   SMTP_HOST="smtp.gmail.com"
   SMTP_PORT="587"
   SMTP_USER="your-email@gmail.com"
   SMTP_PASS="your-app-password"
   SMTP_FROM="noreply@yourdomain.com"
   ```

   Additional OAuth variables (for Google/GitHub/Microsoft OAuth flows):

   ```env
   # App origin for OAuth redirects
   AUTH_ORIGIN="http://localhost:3000"

   # Google OAuth
   GOOGLE_CLIENT_ID=
   GOOGLE_CLIENT_SECRET=
   GOOGLE_REDIRECT_URI=

   # GitHub OAuth
   GITHUB_CLIENT_ID=
   GITHUB_CLIENT_SECRET=
   GITHUB_REDIRECT_URI=

   # Microsoft OAuth
   MICROSOFT_CLIENT_ID=
   MICROSOFT_CLIENT_SECRET=
   MICROSOFT_REDIRECT_URI=

   # JWT
   JWT_SECRET="change-me-in-production"
   ```

   If a provider Client ID is not set, the app redirects to `/auth/demo-oauth` instead of attempting real OAuth.

4. **Set up the database**

   ```bash
   npm run db:generate
   npm run db:push
   npm run db:seed
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

## 🧪 Testing

### Unit Tests

```bash
npm run test
npm run test:ui
npm run test:coverage
```

### E2E Tests

```bash
npm run test:e2e
npm run test:e2e:ui
```

### All Tests

```bash
npm run test:all
```

## 📁 Project Structure

```
ctm/
├── app/
│   ├── components/          # Vue components
│   │   ├── admin/          # Admin-specific components
│   │   ├── competitor/     # Competitor-related components
│   │   ├── tournament/     # Tournament-related components
│   │   └── ui/            # Reusable UI components
│   ├── pages/             # Nuxt pages
│   │   ├── admin/         # Admin pages
│   │   ├── auth/          # Authentication pages
│   │   └── tournaments/   # Tournament pages
│   └── generated/         # Generated Prisma client
├── components/            # Global components
├── server/
│   ├── api/              # API endpoints
│   └── utils/            # Server utilities
├── stores/               # Pinia stores
├── types/                # TypeScript type definitions
├── tests/                # Test files
│   ├── e2e/             # E2E tests
│   ├── mocks/           # Mock data
│   └── setup.ts         # Test setup
└── prisma/              # Database schema and migrations
```

## 🔧 Key Components

### Sortable Tables

All tables in the application support sorting:

- **TournamentsTable**: Sort by name, status, dates, competitor count
- **CompetitorsTable**: Sort by name, category, gender, status
- **UsersTable**: Sort by name, role, creation date

### Security Features

- **Authentication**: Supabase Auth with JWT tokens
- **Authorization**: Role-based access control
- **Input Validation**: Comprehensive validation on all inputs
- **File Security**: Virus scanning and type validation
- **Rate Limiting**: API protection against abuse

### Import/Export

- **Formats**: CSV, Excel (XLSX), PDF
- **Data Types**: Tournaments, competitors, users
- **Validation**: Schema validation for imports
- **Templates**: Pre-built import templates

## 🚀 Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Manual Deployment

1. Build the application:

   ```bash
   npm run build
   ```

2. Deploy the generated files to your hosting provider

### Database Migration

```bash
npm run db:migrate
```

## 📊 Performance

- **Bundle Size**: <500KB initial load
- **Load Time**: <3s on mobile
- **Caching**: Redis caching for frequently accessed data
- **Optimization**: Lazy loading and code splitting

## 🔒 Security

- **Authentication**: JWT-based authentication
- **Authorization**: Role-based access control
- **Input Validation**: Comprehensive validation
- **File Security**: Virus scanning and validation
- **Rate Limiting**: API protection
- **HTTPS**: Enforced in production

## 🧪 Testing Coverage

- **Unit Tests**: 80%+ coverage
- **E2E Tests**: Critical user flows
- **API Tests**: All endpoints tested
- **Accessibility**: WCAG 2.1 AA compliance

## 📱 Mobile Support

- **Responsive Design**: Mobile-first approach
- **Touch Optimization**: Touch-friendly interactions
- **Performance**: Optimized for mobile devices
- **PWA**: Progressive Web App features

## 🌐 Internationalization

- **Languages**: English, Greek
- **Extensible**: Easy to add more languages
- **RTL Support**: Right-to-left language support

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:

- Create an issue in the repository
- Check the documentation
- Contact the development team

## 🔄 Recent Updates

### v1.0.0 - Initial Release

- ✅ Complete tournament management system
- ✅ Sortable tables for all data
- ✅ Comprehensive security implementation
- ✅ Import/export functionality
- ✅ Mobile-responsive design
- ✅ Testing suite with 80%+ coverage
- ✅ Production-ready deployment configuration

---

**Built with ❤️ using Nuxt 4, Prisma, and Supabase**
