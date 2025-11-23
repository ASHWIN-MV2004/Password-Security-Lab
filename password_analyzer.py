#!/usr/bin/env python3
"""
Password Security Lab - Educational Tool for Password Strength Analysis
Demonstrates the difference between secure and insecure hashing algorithms
"""

import re
import math
import hashlib
import bcrypt
from datetime import timedelta
from typing import Dict, List, Tuple

try:
    from argon2 import PasswordHasher
    from argon2.low_level import hash_secret_raw, Type
    ARGON2_AVAILABLE = True
except ImportError:
    ARGON2_AVAILABLE = False


class PasswordAnalyzer:
    """Analyzes password strength and estimates crack times across different algorithms"""
    
    # Common weak passwords (subset for demonstration)
    COMMON_PASSWORDS = {
        'password', '123456', '12345678', 'qwerty', 'abc123', 'monkey', 
        'letmein', 'trustno1', 'dragon', 'baseball', 'iloveyou', 'master',
        'sunshine', 'ashley', 'bailey', 'shadow', 'superman', 'qazwsx'
    }
    
    # Attack speeds (hashes per second) based on modern GPU capabilities
    # Source: hashcat benchmarks on NVIDIA RTX 3090
    ATTACK_SPEEDS = {
        'plaintext': 1e15,      # Instant (comparison operation)
        'md5': 1.8e11,          # 180 billion H/s
        'sha256': 6.5e10,       # 65 billion H/s
        'bcrypt': 8.5e4,        # 85 thousand H/s (cost factor 12)
        'argon2': 1e3,          # 1 thousand H/s (recommended params)
    }
    
    def __init__(self, password: str):
        self.password = password
        self.length = len(password)
        self.char_sets = self._identify_char_sets()
        self.entropy = self._calculate_entropy()
        self.strength_score = self._calculate_strength_score()
        self.strength_level = self._determine_strength_level()
        
    def _identify_char_sets(self) -> Dict[str, bool]:
        """Identify which character sets are used in the password"""
        return {
            'lowercase': bool(re.search(r'[a-z]', self.password)),
            'uppercase': bool(re.search(r'[A-Z]', self.password)),
            'digits': bool(re.search(r'\d', self.password)),
            'special': bool(re.search(r'[!@#$%^&*()_+\-=\[\]{};:\'",.<>?/\\|`~]', self.password))
        }
    
    def _calculate_entropy(self) -> float:
        """Calculate password entropy in bits"""
        charset_size = 0
        if self.char_sets['lowercase']:
            charset_size += 26
        if self.char_sets['uppercase']:
            charset_size += 26
        if self.char_sets['digits']:
            charset_size += 10
        if self.char_sets['special']:
            charset_size += 32
        
        if charset_size == 0:
            return 0
        
        # Entropy = log2(charset_size ^ length)
        entropy = self.length * math.log2(charset_size)
        return entropy
    
    def _calculate_strength_score(self) -> int:
        """Calculate a strength score (0-100)"""
        score = 0
        
        # Length scoring (up to 35 points)
        if self.length >= 16:
            score += 35
        elif self.length >= 12:
            score += 25
        elif self.length >= 8:
            score += 15
        elif self.length >= 6:
            score += 5
        
        # Character diversity (up to 30 points)
        char_type_count = sum(self.char_sets.values())
        score += char_type_count * 7.5
        
        # Entropy bonus (up to 20 points)
        if self.entropy >= 80:
            score += 20
        elif self.entropy >= 60:
            score += 15
        elif self.entropy >= 40:
            score += 10
        elif self.entropy >= 28:
            score += 5
        
        # Penalize common passwords
        if self.password.lower() in self.COMMON_PASSWORDS:
            score = max(0, score - 50)
        
        # Penalize simple patterns
        if self._has_simple_patterns():
            score = max(0, score - 20)
        
        # Bonus for good practices (up to 15 points)
        if self.length >= 12 and char_type_count >= 3:
            score += 10
        if not self._has_repeated_chars():
            score += 5
        
        return min(100, max(0, score))
    
    def _has_simple_patterns(self) -> bool:
        """Check for simple patterns like 'abc', '123', 'aaa'"""
        patterns = [
            r'(.)\1{2,}',           # Repeated characters (aaa, 111)
            r'(abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz)',
            r'(012|123|234|345|456|567|678|789)',
            r'(qwert|asdf|zxcv)',   # Keyboard patterns
        ]
        return any(re.search(pattern, self.password.lower()) for pattern in patterns)
    
    def _has_repeated_chars(self) -> bool:
        """Check if password has excessively repeated characters"""
        return bool(re.search(r'(.)\1{2,}', self.password))
    
    def _determine_strength_level(self) -> str:
        """Determine password strength level based on score"""
        if self.strength_score >= 80:
            return "Very Strong"
        elif self.strength_score >= 60:
            return "Strong"
        elif self.strength_score >= 40:
            return "Moderate"
        elif self.strength_score >= 20:
            return "Weak"
        else:
            return "Very Weak"
    
    def estimate_crack_time(self, algorithm: str) -> Dict[str, any]:
        """Estimate time to crack password using brute force attack"""
        if algorithm not in self.ATTACK_SPEEDS:
            raise ValueError(f"Unknown algorithm: {algorithm}")
        
        # Calculate total possible combinations
        charset_size = 0
        if self.char_sets['lowercase']:
            charset_size += 26
        if self.char_sets['uppercase']:
            charset_size += 26
        if self.char_sets['digits']:
            charset_size += 10
        if self.char_sets['special']:
            charset_size += 32
        
        if charset_size == 0:
            charset_size = 26  # Assume lowercase if nothing detected
        
        total_combinations = charset_size ** self.length
        
        # Adjust for common password (would be cracked almost instantly)
        if self.password.lower() in self.COMMON_PASSWORDS:
            total_combinations = 1
        
        # Average case: 50% of keyspace needs to be searched
        avg_attempts = total_combinations / 2
        
        # Calculate time in seconds
        attack_speed = self.ATTACK_SPEEDS[algorithm]
        time_seconds = avg_attempts / attack_speed
        
        return {
            'algorithm': algorithm,
            'attack_speed': attack_speed,
            'combinations': total_combinations,
            'time_seconds': time_seconds,
            'time_human': self._format_time(time_seconds)
        }
    
    def _format_time(self, seconds: float) -> str:
        """Convert seconds to human-readable format"""
        if seconds < 1:
            return "Instant"
        elif seconds < 60:
            return f"{seconds:.2f} seconds"
        elif seconds < 3600:
            return f"{seconds/60:.2f} minutes"
        elif seconds < 86400:
            return f"{seconds/3600:.2f} hours"
        elif seconds < 31536000:
            return f"{seconds/86400:.2f} days"
        elif seconds < 31536000 * 1000:
            return f"{seconds/31536000:.2f} years"
        elif seconds < 31536000 * 1000000:
            return f"{seconds/(31536000*1000):.2f} thousand years"
        elif seconds < 31536000 * 1e9:
            return f"{seconds/(31536000*1e6):.2f} million years"
        elif seconds < 31536000 * 1e12:
            return f"{seconds/(31536000*1e9):.2f} billion years"
        else:
            return f"{seconds/(31536000*1e12):.2e} trillion years"
    
    def get_all_crack_times(self) -> List[Dict]:
        """Get crack time estimates for all algorithms"""
        algorithms = ['plaintext', 'md5', 'sha256', 'bcrypt', 'argon2']
        return [self.estimate_crack_time(algo) for algo in algorithms]
    
    def get_enhancement_suggestions(self) -> List[str]:
        """Generate suggestions to improve password strength"""
        suggestions = []
        
        if self.length < 12:
            suggestions.append(f"📏 Increase length to at least 12 characters (current: {self.length})")
        elif self.length < 16:
            suggestions.append(f"📏 Consider increasing length to 16+ characters for better security (current: {self.length})")
        
        if not self.char_sets['uppercase']:
            suggestions.append("🔠 Add uppercase letters (A-Z)")
        
        if not self.char_sets['lowercase']:
            suggestions.append("🔡 Add lowercase letters (a-z)")
        
        if not self.char_sets['digits']:
            suggestions.append("🔢 Add numbers (0-9)")
        
        if not self.char_sets['special']:
            suggestions.append("🔣 Add special characters (!@#$%^&*)")
        
        if self.password.lower() in self.COMMON_PASSWORDS:
            suggestions.append("⚠️  CRITICAL: This is a commonly used password! Change it immediately!")
        
        if self._has_simple_patterns():
            suggestions.append("🔄 Avoid predictable patterns (abc, 123, aaa, keyboard patterns)")
        
        if self._has_repeated_chars():
            suggestions.append("🚫 Avoid repeating the same character multiple times")
        
        # Check for dictionary words
        if len(self.password) >= 4 and self.password.isalpha():
            suggestions.append("📖 Avoid using single dictionary words - use passphrases or random characters")
        
        # General best practices
        if len(suggestions) > 0:
            suggestions.append("💡 Best Practice: Use a passphrase (e.g., 'Correct-Horse-Battery-Staple-2024!')")
            suggestions.append("🔐 Best Practice: Use a password manager to generate and store strong passwords")
            suggestions.append("🔄 Best Practice: Never reuse passwords across different accounts")
        
        if len(suggestions) == 0:
            suggestions.append("✅ Excellent password! Maintain this security level for all accounts.")
        
        return suggestions
    
    def get_hash_comparison(self) -> Dict[str, str]:
        """Generate hashes using different algorithms for demonstration"""
        hashes = {}
        
        # Plain text (insecure!)
        hashes['plaintext'] = self.password
        
        # MD5 (weak, deprecated)
        hashes['md5'] = hashlib.md5(self.password.encode()).hexdigest()
        
        # SHA256 (better but still vulnerable to brute force)
        hashes['sha256'] = hashlib.sha256(self.password.encode()).hexdigest()
        
        # Bcrypt (secure, salted, slow by design)
        salt = bcrypt.gensalt(rounds=12)
        hashes['bcrypt'] = bcrypt.hashpw(self.password.encode(), salt).decode()
        
        # Argon2id (most secure, memory-hard)
        if ARGON2_AVAILABLE:
            try:
                ph = PasswordHasher(
                    time_cost=3,        # Number of iterations
                    memory_cost=65536,  # 64 MB memory
                    parallelism=4,      # Number of parallel threads
                    hash_len=32,        # Length of hash in bytes
                    salt_len=16,        # Length of salt in bytes
                    type=Type.ID        # Argon2id variant (hybrid)
                )
                hashes['argon2'] = ph.hash(self.password)
            except Exception as e:
                hashes['argon2'] = f"[Argon2 error: {str(e)}]"
        else:
            hashes['argon2'] = "[Argon2id - install argon2-cffi: pip install argon2-cffi]"
        
        return hashes
    
    def get_summary(self) -> Dict:
        """Get complete password analysis summary"""
        return {
            'length': self.length,
            'character_sets': self.char_sets,
            'entropy': self.entropy,
            'strength_score': self.strength_score,
            'strength_level': self.strength_level,
            'crack_times': self.get_all_crack_times(),
            'suggestions': self.get_enhancement_suggestions(),
            'is_common': self.password.lower() in self.COMMON_PASSWORDS
        }
