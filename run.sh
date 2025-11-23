#!/bin/bash

echo "=========================================="
echo "Starting Password Security Lab Web App"
echo "=========================================="
echo ""

# Function to handle cleanup
cleanup() {
    echo ""
    echo "Shutting down servers..."
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
    exit 0
}

# Set up trap to catch Ctrl+C
trap cleanup INT TERM

# Start backend
echo "Starting Flask backend on port 5000..."
cd backend
./venv/bin/python api.py &
BACKEND_PID=$!
cd ..

# Wait a moment for backend to start
sleep 2

# Start frontend
echo "Starting React frontend on port 3000..."
cd frontend
npm start &
FRONTEND_PID=$!
cd ..

echo ""
echo "=========================================="
echo "✅ Both servers started!"
echo "=========================================="
echo ""
echo "Backend:  http://localhost:5000"
echo "Frontend: http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop both servers"
echo ""

# Wait for processes
wait
