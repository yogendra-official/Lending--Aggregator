# Account Aggregator Platform

A comprehensive Account Aggregator platform for the Indian financial ecosystem, focusing on advanced user management and secure financial interactions.

## Overview

The Account Aggregator platform is a cutting-edge financial application designed for the Indian market that enables users to view and manage their financial accounts across multiple banks, track transactions, generate reports, and access personalized loan offers. The system implements India's Account Aggregator framework standards for secure financial data sharing.

## Key Features

- **Secure User Management**: Advanced authentication, authorization, and user profile management
- **Multi-Bank Integration**: Connect and manage accounts from multiple Indian banks 
- **Financial Dashboard**: Overview of all connected accounts with real-time balance and transaction data
- **Transaction Monitoring**: Track and categorize transactions across all linked accounts
- **Financial Reports**: Generate insights and trends based on financial activity
- **Loan Offers**: Receive personalized loan offers based on financial history
- **Notifications**: Stay updated with real-time alerts for account activity
- **Security**: End-to-end encryption and compliance with Indian regulatory requirements

## Technology Stack

### Backend
- **Java 21**: Latest LTS version for core development
- **Spring Boot**: Framework for microservices development
- **Spring Security**: Robust authentication and authorization
- **Spring Data JPA**: Data access layer
- **PostgreSQL**: Relational database for persistent storage
- **JWT**: Secure token-based authentication
- **Spring Cloud**: Microservices orchestration
- **Actuator & Prometheus**: Application monitoring
- **Docker**: Containerization for deployment

### Frontend
- **React**: UI framework
- **TypeScript**: Type-safe JavaScript
- **TanStack Query**: Data fetching and state management
- **Tailwind CSS**: Utility-first styling
- **Shadcn/UI**: Component library based on Radix UI
- **React Hook Form**: Form validation
- **Recharts**: Data visualization

## Architecture

The system follows a microservice architecture with the following components:

1. **User Management Service**: Handles user authentication, profile management, and security
2. **Loan Aggregation Service**: Manages bank connections, account data aggregation, and loan offers
3. **Frontend Application**: React-based user interface for interactions

See [ARCHITECTURE.md](./ARCHITECTURE.md) for detailed architecture documentation.

## Getting Started

### Prerequisites
- Docker and Docker Compose
- Java Development Kit (JDK) 21
- Node.js 20+
- PostgreSQL (or use the Docker container)

### Environment Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/your-org/account-aggregator.git
   cd account-aggregator
   ```

2. Configure environment variables:
   Create a `.env` file in the root directory with the following variables:
   ```
   JWT_SECRET=your_secure_jwt_secret
   SBI_API_KEY=your_sbi_api_key
   HDFC_API_KEY=your_hdfc_api_key
   ```

3. Build and run with Docker Compose:
   ```bash
   docker-compose up -d
   ```

4. Access the application:
   - Frontend: http://localhost:3000
   - User Management API: http://localhost:8081
   - Loan Aggregation API: http://localhost:8082
   - Eureka Service Registry: http://localhost:8761

### Development Setup

For local development without Docker:

1. Start PostgreSQL databases:
   ```bash
   docker-compose up -d user-db loan-db
   ```

2. Start the User Management Service:
   ```bash
   cd user-management-service
   ./mvnw spring-boot:run
   ```

3. Start the Loan Aggregation Service:
   ```bash
   cd loan-aggregation-service
   ./mvnw spring-boot:run
   ```

4. Start the Frontend application:
   ```bash
   cd client
   npm install
   npm run dev
   ```

## API Documentation

- User Management Service Swagger UI: http://localhost:8081/swagger-ui.html
- Loan Aggregation Service Swagger UI: http://localhost:8082/swagger-ui.html

## Monitoring

- User Management Service Actuator: http://localhost:8081/actuator
- Loan Aggregation Service Actuator: http://localhost:8082/actuator

## Security Considerations

- Use strong, unique passwords for database access
- Keep JWT secrets secure and rotate them regularly
- Enable HTTPS in production
- Store API keys securely using environment variables or a secrets manager
- Regularly update dependencies for security patches

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.