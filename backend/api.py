#!/usr/bin/env python3
"""
Flask API Backend for Password Security Lab
Provides REST API endpoints for password analysis
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import sys
import os
import random
import string
import re

# Add parent directory to path to import password_analyzer
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))
from password_analyzer import PasswordAnalyzer, ARGON2_AVAILABLE

app = Flask(__name__)
CORS(app)  # Enable CORS for React frontend


@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'argon2_available': ARGON2_AVAILABLE
    })


@app.route('/api/analyze', methods=['POST'])
def analyze_password():
    """
    Analyze password strength and return comprehensive results
    
    Request body:
    {
        "password": "string"
    }
    
    Response:
    {
        "success": true,
        "data": {
            "strength": {...},
            "crack_times": [...],
            "suggestions": [...],
            "hashes": {...}
        }
    }
    """
    try:
        data = request.get_json()
        
        if not data or 'password' not in data:
            return jsonify({
                'success': False,
                'error': 'Password is required'
            }), 400
        
        password = data['password']
        
        if not password:
            return jsonify({
                'success': False,
                'error': 'Password cannot be empty'
            }), 400
        
        # Analyze password
        analyzer = PasswordAnalyzer(password)
        
        # Get all analysis data
        crack_times = analyzer.get_all_crack_times()
        suggestions = analyzer.get_enhancement_suggestions()
        hashes = analyzer.get_hash_comparison()
        
        # Prepare response
        response_data = {
            'strength': {
                'score': analyzer.strength_score,
                'level': analyzer.strength_level,
                'length': analyzer.length,
                'entropy': round(analyzer.entropy, 2),
                'char_sets': analyzer.char_sets,
                'is_common': analyzer.password.lower() in analyzer.COMMON_PASSWORDS
            },
            'crack_times': [
                {
                    'algorithm': ct['algorithm'],
                    'time_human': ct['time_human'],
                    'time_seconds': ct['time_seconds'],
                    'attack_speed': ct['attack_speed']
                }
                for ct in crack_times
            ],
            'suggestions': suggestions,
            'hashes': {
                k: v[:60] + '...' if len(v) > 60 else v 
                for k, v in hashes.items()
            }
        }
        
        return jsonify({
            'success': True,
            'data': response_data
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@app.route('/api/algorithms', methods=['GET'])
def get_algorithms_info():
    """Get information about all hashing algorithms"""
    algorithms = [
        {
            'name': 'Plain Text',
            'status': 'insecure',
            'speed': '1000 trillion H/s',
            'description': 'No protection - passwords visible to anyone with database access',
            'use_case': 'NEVER use in production systems',
            'year': 'N/A'
        },
        {
            'name': 'MD5',
            'status': 'deprecated',
            'speed': '180 billion H/s',
            'description': 'Fast hashing = fast cracking. Vulnerable to rainbow tables',
            'use_case': 'Do not use for passwords',
            'year': 'Deprecated since 2004'
        },
        {
            'name': 'SHA256',
            'status': 'weak',
            'speed': '65 billion H/s',
            'description': 'Better than MD5 but still too fast. No built-in salting',
            'use_case': 'Use for checksums, NOT for passwords',
            'year': 'Not suitable for passwords'
        },
        {
            'name': 'bcrypt',
            'status': 'secure',
            'speed': '85 thousand H/s',
            'description': 'Slow by design, includes salt, adjustable cost factor',
            'use_case': 'Recommended for password storage',
            'year': 'Since 1999'
        },
        {
            'name': 'Argon2',
            'status': 'most_secure',
            'speed': '1 thousand H/s',
            'description': 'Winner of Password Hashing Competition, memory-hard',
            'use_case': 'Best choice for new systems',
            'year': 'Since 2015',
            'available': ARGON2_AVAILABLE
        }
    ]
    
    return jsonify({
        'success': True,
        'data': algorithms
    })


@app.route('/api/examples', methods=['GET'])
def get_examples():
    """Get example passwords for demonstration"""
    examples = [
        {
            'password': 'password',
            'description': 'Very Weak - Common Password',
            'expected_score': 5
        },
        {
            'password': 'Pass123',
            'description': 'Weak - Short & Predictable',
            'expected_score': 22
        },
        {
            'password': 'MyP@ssw0rd',
            'description': 'Moderate - Better but Still Risky',
            'expected_score': 55
        },
        {
            'password': 'Tr0ub4dor&3',
            'description': 'Strong - Good Mix',
            'expected_score': 70
        },
        {
            'password': 'correct-horse-battery-staple-2024',
            'description': 'Very Strong - Long Passphrase',
            'expected_score': 100
        }
    ]
    
    return jsonify({
        'success': True,
        'data': examples
    })


@app.route('/api/generate', methods=['POST'])
def generate_password():
    """Generate random password based on criteria"""
    try:
        data = request.get_json() or {}
        
        length = data.get('length', 16)
        include_lowercase = data.get('include_lowercase', True)
        include_uppercase = data.get('include_uppercase', True)
        include_digits = data.get('include_digits', True)
        include_special = data.get('include_special', True)
        
        # Build character set
        chars = ''
        if include_lowercase:
            chars += string.ascii_lowercase
        if include_uppercase:
            chars += string.ascii_uppercase
        if include_digits:
            chars += string.digits
        if include_special:
            chars += '!@#$%^&*()_+-=[]{}|;:,.<>?'
        
        if not chars:
            return jsonify({
                'success': False,
                'error': 'At least one character type must be selected'
            }), 400
        
        # Generate password ensuring at least one of each selected type
        password = []
        if include_lowercase:
            password.append(random.choice(string.ascii_lowercase))
        if include_uppercase:
            password.append(random.choice(string.ascii_uppercase))
        if include_digits:
            password.append(random.choice(string.digits))
        if include_special:
            password.append(random.choice('!@#$%^&*()_+-=[]{}|;:,.<>?'))
        
        # Fill remaining length
        remaining_length = max(0, length - len(password))
        password.extend(random.choice(chars) for _ in range(remaining_length))
        
        # Shuffle to avoid predictable pattern
        random.shuffle(password)
        generated_password = ''.join(password)
        
        # Analyze the generated password
        analyzer = PasswordAnalyzer(generated_password)
        
        return jsonify({
            'success': True,
            'data': {
                'password': generated_password,
                'score': analyzer.strength_score,
                'level': analyzer.strength_level,
                'length': len(generated_password),
                'entropy': round(analyzer.entropy, 2)
            }
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@app.route('/api/improve', methods=['POST'])
def improve_password():
    """Generate improved password variations based on input"""
    try:
        data = request.get_json()
        
        if not data or 'password' not in data:
            return jsonify({
                'success': False,
                'error': 'Password is required'
            }), 400
        
        original = data['password']
        
        if not original:
            return jsonify({
                'success': False,
                'error': 'Password cannot be empty'
            }), 400
        
        improvements = []
        
        # Strategy 1: Add length
        if len(original) < 16:
            improved = original + random.choice(['2024', '2025', '@123'])
            improvements.append({
                'password': improved,
                'strategy': 'Added characters',
                'description': f'Extended to {len(improved)} characters'
            })
        
        # Strategy 2: Add special characters
        if not re.search(r'[!@#$%^&*()_+-]', original):
            special_chars = ['!', '@', '#', '$', '%', '&', '*']
            improved = original + random.choice(special_chars)
            improvements.append({
                'password': improved,
                'strategy': 'Added special character',
                'description': 'Increased complexity with symbols'
            })
        
        # Strategy 3: Add uppercase
        if not re.search(r'[A-Z]', original):
            improved = original[0].upper() + original[1:] if len(original) > 0 else original
            improvements.append({
                'password': improved,
                'strategy': 'Added uppercase',
                'description': 'Capitalized first letter'
            })
        
        # Strategy 4: Replace letters with numbers/symbols (leetspeak)
        leet_map = {'a': '@', 'e': '3', 'i': '!', 'o': '0', 's': '$', 't': '7'}
        improved = original
        for old, new in leet_map.items():
            improved = improved.replace(old, new, 1)
        if improved != original:
            improvements.append({
                'password': improved,
                'strategy': 'Character substitution',
                'description': 'Replaced letters with numbers/symbols'
            })
        
        # Strategy 5: Add numbers
        if not re.search(r'\d', original):
            improved = original + str(random.randint(100, 999))
            improvements.append({
                'password': improved,
                'strategy': 'Added numbers',
                'description': 'Appended numeric sequence'
            })
        
        # Strategy 6: Create passphrase variant
        if len(original) > 3:
            words = ['Secure', 'Strong', 'Private', 'Safe']
            improved = f"{random.choice(words)}-{original}-{random.randint(100, 999)}!"
            improvements.append({
                'password': improved,
                'strategy': 'Passphrase creation',
                'description': 'Created memorable passphrase'
            })
        
        # Analyze each improvement
        for improvement in improvements:
            analyzer = PasswordAnalyzer(improvement['password'])
            improvement['score'] = analyzer.strength_score
            improvement['level'] = analyzer.strength_level
            improvement['length'] = len(improvement['password'])
        
        # Sort by score
        improvements.sort(key=lambda x: x['score'], reverse=True)
        
        return jsonify({
            'success': True,
            'data': {
                'original': original,
                'improvements': improvements[:5]  # Return top 5
            }
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


if __name__ == '__main__':
    print("🔐 Password Security Lab API Server")
    print("=" * 50)
    print(f"Argon2 Support: {'✓ Available' if ARGON2_AVAILABLE else '✗ Not Available'}")
    print("=" * 50)
    print("\nStarting server on http://localhost:5000")
    print("API Endpoints:")
    print("  GET  /api/health       - Health check")
    print("  POST /api/analyze      - Analyze password")
    print("  POST /api/generate     - Generate random password")
    print("  POST /api/improve      - Get password improvements")
    print("  GET  /api/algorithms   - Get algorithm info")
    print("  GET  /api/examples     - Get example passwords")
    print("\n")
    
    app.run(debug=True, host='0.0.0.0', port=5000)
