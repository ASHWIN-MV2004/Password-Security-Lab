# Password Security Lab - Web Application

A modern, interactive web application for analyzing password strength and learning about secure password storage practices.

## 🌟 Features

### Frontend (React)
- **Stunning Dark Mode** - Glassmorphism design with gradient effects ✨
- **Password Generator** - One-click random password creation 🎲
- **Smart Improvements** - AI-powered password enhancement suggestions 🪄
- **Real-time Analysis** - Instant password strength feedback
- **Interactive Visualizations** - Color-coded strength indicators and animated progress bars
- **Tabbed Interface** - Organized views for different analysis aspects
- **Example Passwords** - Quick testing with pre-configured examples
- **Copy to Clipboard** - Easy copying of passwords and hashes
- **Responsive Design** - Works beautifully on all devices
- **Smooth Animations** - Professional transitions and effects

### Backend (Flask API)
- **RESTful API** - Clean endpoints for password analysis
- **Python Integration** - Uses the core password_analyzer module
- **CORS Enabled** - Allows frontend-backend communication
- **Multiple Endpoints** - Health check, analysis, algorithms info, examples
- **Error Handling** - Comprehensive error responses

## 📸 Screenshots

### Main Interface
- Password input with show/hide toggle
- Example password quick-selection
- Real-time analysis button

### Analysis Results
- **Score Card** - 0-100 strength score with visual indicator
- **Metrics Dashboard** - Length, entropy, character sets
- **Strength Bar** - Color-coded progress visualization
- **Character Set Indicators** - Shows used/missing character types

### Tabbed Views
1. **Crack Time Analysis** - Comparison across all 5 algorithms
2. **Algorithm Comparison** - Detailed security information
3. **Recommendations** - Personalized suggestions
4. **Hash Examples** - Educational hash demonstrations

## 🚀 Quick Start

### Prerequisites
- Python 3.7+
- Node.js 14+ and npm
- Virtual environment (recommended)

### Installation

#### 1. Backend Setup
**Linux/Mac:**
```bash
cd backend

# Create virtual environment
python3 -m venv venv
source venv/bin/activate

# Install Python dependencies
pip install -r requirements.txt

# Start Flask server
python api.py
```

**Windows:**
Simply run `setup.bat` once, then `run.bat`.
Or manually:
```cmd
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python api.py
```

The backend will start on `http://localhost:5000`

#### 2. Frontend Setup
**Linux/Mac:**
```bash
cd frontend

# Install Node dependencies
npm install

# Start React development server
npm start
```

**Windows:**
Run `run.bat` (if setup is done).
Or manually:
```cmd
cd frontend
npm install
npm start
```

The frontend will start on `http://localhost:3000`

### Access the Application
Open your browser and navigate to: **http://localhost:3000**

## 📁 Project Structure

```
.
├── backend/
│   ├── api.py              # Flask API server
│   ├── requirements.txt    # Python dependencies
│   └── venv/              # Virtual environment
│
├── frontend/
│   ├── public/
│   ├── src/
│   ├── package.json       # Node dependencies
│   └── tailwind.config.js
│
├── password_analyzer.py    # Core logic
├── run.sh                 # Linux run script
├── setup.sh               # Linux setup script
├── run.bat                # Windows run script
└── setup.bat              # Windows setup script
```

## 🔌 API Endpoints

### GET `/api/health`
Health check endpoint
```json
{
  "status": "healthy",
  "argon2_available": true
}
```

### POST `/api/analyze`
Analyze password strength
**Request:**
```json
{
  "password": "MyPassword123!"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "strength": {
      "score": 55,
      "level": "Moderate",
      "length": 14,
      "entropy": 78.42,
      "char_sets": {...},
      "is_common": false
    },
    "crack_times": [...],
    "suggestions": [...],
    "hashes": {...}
  }
}
```

### GET `/api/algorithms`
Get information about all hashing algorithms
```json
{
  "success": true,
  "data": [...]
}
```

### GET `/api/examples`
Get example passwords for testing
```json
{
  "success": true,
  "data": [
    {
      "password": "password",
      "description": "Very Weak - Common Password",
      "expected_score": 5
    },
    ...
  ]
}
```

## 🎨 UI Components

### 1. Header
- Application title and logo
- Team information badge

### 2. Password Input Section
- Large input field with show/hide toggle
- "Analyze Password" button with loading state
- Error message display
- Example password buttons

### 3. Strength Assessment Card
- **Score Display** - Large 0-100 score with color coding
- **Metrics Grid** - Length, entropy, status cards
- **Progress Bar** - Visual strength indicator
- **Character Set Grid** - Checkboxes for lowercase, uppercase, digits, special

### 4. Analysis Tabs
**Crack Time Analysis**
- List of all algorithms with estimated crack times
- Color-coded by security level (red = instant, green = centuries)
- Attack speed display

**Algorithm Comparison**
- Detailed cards for each algorithm
- Status badges (insecure, deprecated, weak, secure, most secure)
- Description and use case recommendations

**Recommendations**
- Personalized suggestions with color coding
- Critical warnings (red), warnings (yellow), best practices (blue)
- Checkmarks for good passwords

**Hash Examples**
- Educational display of actual hashes
- Copy-to-clipboard functionality
- Warning about production use

### 5. Footer
- Team attribution
- Privacy assurance message
- Educational disclaimer

## 🎨 Color Scheme

- **Very Strong** - Green (#10b981)
- **Strong** - Blue (#3b82f6)
- **Moderate** - Yellow (#eab308)
- **Weak** - Orange (#f97316)
- **Very Weak** - Red (#ef4444)

## 🔧 Development

### Adding New Features

**Frontend:**
1. Create new components in `src/components/`
2. Import and use in `App.js`
3. Add Tailwind classes for styling

**Backend:**
1. Add new routes in `api.py`
2. Follow RESTful conventions
3. Return consistent JSON responses

### Building for Production

**Frontend:**
```bash
cd frontend
npm run build
```

This creates an optimized production build in `build/` directory.

**Backend:**
For production deployment, use a production WSGI server like Gunicorn:
```bash
pip install gunicorn
gunicorn -w 4 -b 0.0.0.0:5000 api:app
```

## 🐛 Troubleshooting

### Backend Issues

**Problem:** "Module not found: password_analyzer"
**Solution:** Make sure you're running from the correct directory and the parent modules are accessible
```bash
cd backend
python api.py
```

**Problem:** "Address already in use"
**Solution:** Kill the process using port 5000
```bash
lsof -ti:5000 | xargs kill -9
```

### Frontend Issues

**Problem:** "Cannot connect to backend"
**Solution:** Ensure Flask server is running on port 5000

**Problem:** "npm install fails"
**Solution:** Delete `node_modules` and `package-lock.json`, then reinstall
```bash
rm -rf node_modules package-lock.json
npm install
```

**Problem:** Tailwind styles not applying
**Solution:** Rebuild Tailwind
```bash
npm run build:css
```

## 📱 Responsive Design

The application is fully responsive:
- **Desktop** (1024px+): Full layout with all features
- **Tablet** (768px-1024px): Adapted grid layouts
- **Mobile** (< 768px): Stacked layouts, collapsible sections

## ♿ Accessibility

- Semantic HTML structure
- ARIA labels where appropriate
- Keyboard navigation support
- High contrast color combinations
- Screen reader friendly

## 🔒 Security Considerations

1. **No Password Storage** - Passwords are analyzed in-memory only
2. **No Logging** - Passwords are never logged
3. **HTTPS Recommended** - Use HTTPS in production
4. **Rate Limiting** - Consider adding rate limiting for production
5. **Input Validation** - Backend validates all inputs

## 📚 Technologies Used

### Frontend
- **React 18.2** - UI framework
- **Tailwind CSS 3.3** - Utility-first CSS
- **lucide-react** - Modern icon library
- **Fetch API** - HTTP requests

### Backend
- **Flask 3.0** - Python web framework
- **Flask-CORS** - Cross-origin resource sharing
- **bcrypt** - Password hashing
- **argon2-cffi** - Argon2 hashing

## 🎯 Future Enhancements

- [ ] Password generator feature
- [ ] Dark mode toggle
- [ ] Export analysis as PDF
- [ ] Password history tracking (client-side only)
- [ ] Multi-language support
- [ ] Animation improvements
- [ ] Progressive Web App (PWA) support
- [ ] WebSocket for real-time updates
- [ ] Integration with Have I Been Pwned API

## 📄 License

Educational project for learning purposes.

## 🙏 Acknowledgments

- Password strength algorithms based on industry standards
- Attack speed data from hashcat benchmarks
- UI inspired by modern web design practices

---

**Remember:** This is an educational tool. Always use proper password management practices and never reuse passwords across different accounts!

🔐 Stay secure!
