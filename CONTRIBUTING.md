# Contributing to MediTrack

Thank you for your interest in contributing to MediTrack!

## Getting Started

1. Fork the repository
2. Clone your fork
3. Create a feature branch
4. Make your changes
5. Submit a pull request

## Development Setup

### Backend
```bash
cd backend
mvn clean install
mvn spring-boot:run
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### AI Module
```bash
cd ai-module
pip install -r requirements.txt
python app.py
```

## Coding Standards

### Backend (Java)
- Follow Java naming conventions
- Use Lombok for boilerplate code
- Add Javadoc comments
- Write unit tests
- Follow Spring Boot best practices

### Frontend (React)
- Use functional components
- Follow React hooks best practices
- Use Tailwind CSS for styling
- Keep components small and focused
- Add PropTypes or TypeScript types

### Python (AI Module)
- Follow PEP 8 style guide
- Add docstrings
- Write unit tests
- Use type hints

## Commit Messages

Use clear and descriptive commit messages:
```
feat: Add user management feature
fix: Fix medicine search bug
docs: Update API documentation
refactor: Refactor authentication service
test: Add unit tests for medicine service
```

## Pull Request Process

1. Update documentation
2. Add tests for new features
3. Ensure all tests pass
4. Update CHANGELOG.md
5. Request review

## Code Review

- Be respectful and constructive
- Provide specific feedback
- Suggest improvements
- Approve when ready

## Reporting Issues

Use GitHub Issues to report bugs or suggest features:
- Provide clear description
- Include steps to reproduce
- Add screenshots if applicable
- Specify environment details

## Feature Requests

- Describe the feature
- Explain the use case
- Suggest implementation approach
- Discuss alternatives

## Questions?

Feel free to open an issue or contact the maintainers.

Thank you for contributing!



