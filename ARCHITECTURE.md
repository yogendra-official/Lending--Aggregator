# Account Aggregator Platform Architecture

## System Architecture Overview

The Account Aggregator platform follows a microservices architecture to ensure scalability, maintainability, and separation of concerns. The system is composed of two primary microservices and a frontend application.

![Architecture Diagram](./architecture-diagram.png)

## Components

### 1. User Management Service

**Responsibility**: Manages user accounts, authentication, authorization, and profile data.

#### Key Components:

- **AuthController**: Handles user registration, login, token validation, and refresh operations
- **UserController**: Manages user profile operations
- **SecurityConfig**: Configures JWT authentication, role-based access control, and security filters
- **JwtTokenProvider**: Generates and validates JWT tokens
- **UserService**: Business logic for user management
- **UserRepository**: Data access layer for user information
- **Security Filters**: Input validation, CSRF protection, and other security measures
- **Custom Health Indicators**: System health monitoring
- **API Metrics**: Usage tracking and performance monitoring

#### Security Features:

- JWT-based authentication
- Role-based authorization (USER, ADMIN, LOAN_MANAGER)
- Password encryption
- Token validation and refresh mechanisms
- API request logging and monitoring

### 2. Loan Aggregation Service

**Responsibility**: Manages bank connections, account aggregation, transaction data, and loan offers.

#### Key Components:

- **BankAccountController**: Manages linked bank accounts
- **LoanOfferController**: Handles loan offers and applications
- **TransactionController**: Provides access to transaction data
- **BankLoanProviderFactory**: Factory pattern implementation for bank-specific services
- **BankLoanProvider**: Interface for bank-specific implementations
- **Concrete Providers**: SBI, HDFC, and other bank-specific implementations
- **SecurityService**: Controls access to sensitive financial data
- **ScheduledTasks**: Background operations for data synchronization
- **Custom Health Indicators**: System health monitoring
- **API Metrics**: Usage tracking and performance monitoring

#### Bank Integration:

The service uses the Factory Pattern to integrate with different banks:

```
BankLoanProvider (Interface)
  ├── SbiLoanProvider
  ├── HdfcLoanProvider
  └── Other bank providers...
```

Each provider implements bank-specific API interactions while maintaining a consistent interface for the application.

#### Monitoring Components:

- **ApiMetricsAspect**: Tracks API usage using AOP
- **CustomHealthIndicator**: Provides detailed system health information
- **ApiUsageEndpoint**: Custom actuator endpoint for monitoring

### 3. Frontend Application

**Responsibility**: Provides the user interface for interacting with the system.

#### Key Components:

- **Authentication Flow**: Login, registration, and secure session management
- **Dashboard**: Account summary and financial overview
- **Linked Accounts**: View and manage connected bank accounts
- **Transactions**: Track and filter financial transactions
- **Reports**: Generate financial insights and visualizations
- **Loan Offers**: View and apply for personalized loan offers
- **Settings**: User profile and preference management
- **Notifications**: Real-time alerts for account activity

#### Technical Implementation:

- React with TypeScript for type safety
- TanStack Query for data fetching and state management
- React Hook Form for validation
- Tailwind CSS and Shadcn/UI for styling
- Recharts for data visualization
- Adapter pattern to integrate with backend microservices

## Communication Patterns

### API Gateway Pattern

The frontend communicates with the microservices through an API gateway pattern, which provides:

- Request routing
- API composition
- Authentication forwarding
- Cross-cutting concerns

### Service-to-Service Communication

- **Synchronous**: REST API calls with JWT token authentication
- **Service Discovery**: Eureka registry for locating services

## Data Flow

1. **Authentication Flow**:
   - User submits credentials → User Management Service validates → JWT token returned → Frontend stores token
   - Subsequent requests include JWT in Authorization header

2. **Account Aggregation Flow**:
   - User adds bank → Loan Aggregation Service connects to bank API → Bank data retrieved → Data normalized and stored
   - Dashboard displays aggregated data

3. **Loan Offer Flow**:
   - Loan Aggregation Service analyzes financial data → Creates personalized offers → User views offers → User applies for loan
   - Application processed through bank-specific provider

## Security Measures

### Data Protection

- End-to-end encryption for sensitive data
- Data masking for PII (Personally Identifiable Information)
- Secure transmission with TLS/HTTPS
- Minimal data retention policies

### Access Control

- JWT with short expiration times
- Role-based access control (RBAC)
- Permission-based authorization
- IP-based rate limiting

### Monitoring and Alerting

- Custom health indicators
- API usage metrics
- Performance monitoring
- Security event logging

## Deployment Architecture

The system is containerized using Docker and orchestrated with Docker Compose, allowing for:

- Consistent environments
- Easy horizontal scaling
- Environment-specific configurations
- Simplified deployment process

In a production environment, the system could be deployed to Kubernetes for advanced orchestration capabilities.

## Database Schema

### User Management Database

- **users**: User accounts and authentication data
- **roles**: User role definitions
- **user_roles**: Many-to-many relationship between users and roles
- **profiles**: Extended user profile information
- **sessions**: User session data

### Loan Aggregation Database

- **linked_bank_accounts**: Connected bank account information
- **transactions**: Financial transaction data
- **categories**: Transaction categorization
- **loan_offers**: Available loan offers
- **loan_applications**: User loan applications
- **notifications**: User notification data

## Scalability Considerations

- Stateless services for horizontal scaling
- Database connection pooling
- Caching strategies for frequently accessed data
- Asynchronous processing for background tasks

## Monitoring and Observability

- Spring Boot Actuator endpoints
- Prometheus metrics collection
- Custom health indicators
- API usage tracking

## Failure Handling

- Circuit breakers for external service calls
- Graceful degradation
- Comprehensive error handling
- Retry mechanisms with exponential backoff

## Future Architecture Considerations

- Event-driven architecture with Kafka for real-time updates
- GraphQL API for optimized data fetching
- Kubernetes deployment for container orchestration
- Service mesh for advanced networking features
- AI/ML integration for enhanced financial insights