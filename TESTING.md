# Testing Guide

## Backend Testing

### Unit Tests

#### Running Tests
```bash
cd backend
mvn test
```

#### Test Structure
```
src/test/java/com/meditrack/
├── controller/
│   ├── AuthControllerTest.java
│   ├── AdminControllerTest.java
│   └── MedicineControllerTest.java
├── service/
│   ├── UserServiceTest.java
│   ├── MedicineServiceTest.java
│   └── JwtServiceTest.java
└── repository/
    ├── UserRepositoryTest.java
    └── MedicineRepositoryTest.java
```

### Integration Tests

#### Test Configuration
```java
@SpringBootTest
@AutoConfigureMockMvc
class MedicineIntegrationTest {
    @Autowired
    private MockMvc mockMvc;
    
    @Test
    void testCreateMedicine() throws Exception {
        // Test implementation
    }
}
```

### API Testing

#### Using Postman
1. Import API collection
2. Set environment variables
3. Run tests

#### Using curl
```bash
# Login
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@meditrack.com","password":"admin123"}'

# Get medicines
curl -X GET http://localhost:8080/api/admin/medicines \
  -H "Authorization: Bearer <token>"
```

## Frontend Testing

### Unit Tests

#### Running Tests
```bash
cd frontend
npm test
```

#### Test Structure
```
src/
├── __tests__/
│   ├── components/
│   ├── pages/
│   └── utils/
└── setupTests.js
```

### Component Testing

#### Example Test
```javascript
import { render, screen } from '@testing-library/react'
import LoginPage from '../pages/public/LoginPage'

test('renders login form', () => {
  render(<LoginPage />)
  const emailInput = screen.getByLabelText(/email/i)
  expect(emailInput).toBeInTheDocument()
})
```

### E2E Testing

#### Using Cypress
```bash
npm install cypress --save-dev
npx cypress open
```

#### Example E2E Test
```javascript
describe('Login Flow', () => {
  it('should login successfully', () => {
    cy.visit('/login')
    cy.get('input[name="email"]').type('admin@meditrack.com')
    cy.get('input[name="password"]').type('admin123')
    cy.get('button[type="submit"]').click()
    cy.url().should('include', '/admin/dashboard')
  })
})
```

## Test Coverage

### Backend Coverage
```bash
mvn test jacoco:report
```

### Frontend Coverage
```bash
npm test -- --coverage
```

## Performance Testing

### Load Testing
```bash
# Using Apache Bench
ab -n 1000 -c 10 http://localhost:8080/api/admin/medicines

# Using JMeter
# Create test plan and run
```

### Stress Testing
- Test with high concurrent users
- Test database under load
- Test API response times

## Security Testing

### Authentication Testing
- Test JWT token validation
- Test expired tokens
- Test invalid tokens
- Test role-based access

### Authorization Testing
- Test admin-only endpoints
- Test supplier endpoints
- Test pharmacy endpoints
- Test unauthorized access

### Input Validation Testing
- Test SQL injection
- Test XSS attacks
- Test CSRF protection
- Test input validation

## Test Data

### Sample Users
```sql
INSERT INTO users (email, password, role) VALUES
('admin@test.com', '$2a$10$...', 'ADMIN'),
('supplier@test.com', '$2a$10$...', 'SUPPLIER'),
('pharmacy@test.com', '$2a$10$...', 'PHARMACY');
```

### Sample Medicines
```sql
INSERT INTO medicines (name, category, current_stock) VALUES
('Paracetamol', 'PAINKILLER', 1000),
('Amoxicillin', 'ANTIBIOTIC', 500);
```

## Continuous Integration

### GitHub Actions
```yaml
name: CI
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Run tests
        run: mvn test
```

## Test Best Practices

1. **Write tests first** (TDD)
2. **Test edge cases**
3. **Mock external dependencies**
4. **Use descriptive test names**
5. **Keep tests independent**
6. **Clean up test data**
7. **Test error handling**
8. **Test security**
9. **Test performance**
10. **Maintain test coverage > 80%**



