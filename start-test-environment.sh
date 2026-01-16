#!/bin/bash

echo "Starting MediTrack Test Environment..."

# Check if MySQL is running
if ! pgrep -x "mysqld" > /dev/null; then
    echo "⚠️  MySQL is not running. Please start MySQL first."
    exit 1
fi

# Check if backend is running
if ! curl -s http://localhost:8081 > /dev/null 2>&1; then
    echo "Starting Backend..."
    cd backend
    mvn spring-boot:run > ../backend.log 2>&1 &
    BACKEND_PID=$!
    echo "Backend started (PID: $BACKEND_PID)"
    echo "Waiting for backend to be ready..."
    sleep 15
else
    echo "✅ Backend is already running"
fi

# Check if frontend is running
if ! curl -s http://localhost:3000 > /dev/null 2>&1; then
    echo "Starting Frontend..."
    cd frontend
    npm run dev > ../frontend.log 2>&1 &
    FRONTEND_PID=$!
    echo "Frontend started (PID: $FRONTEND_PID)"
    echo "Waiting for frontend to be ready..."
    sleep 10
else
    echo "✅ Frontend is already running"
fi

echo ""
echo "✅ Test environment is ready!"
echo "Backend: http://localhost:8081"
echo "Frontend: http://localhost:3000"
echo ""
echo "You can now run tests in TestSprite."
echo ""
echo "To stop the services, run:"
echo "  pkill -f 'spring-boot:run'"
echo "  pkill -f 'vite'"
