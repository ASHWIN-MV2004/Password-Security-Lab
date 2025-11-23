import React, { useState, useEffect } from 'react';
import {
  Shield, Lock, Eye, EyeOff, AlertTriangle, CheckCircle, 
  Clock, Database, Info, TrendingUp, Zap, Activity, Award
} from 'lucide-react';
import './styles/App.css';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

function App() {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [algorithms, setAlgorithms] = useState([]);
  const [examples, setExamples] = useState([]);

  // Fetch algorithms and examples on mount
  useEffect(() => {
    fetchAlgorithms();
    fetchExamples();
  }, []);

  const fetchAlgorithms = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/algorithms`);
      const data = await response.json();
      if (data.success) {
        setAlgorithms(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch algorithms:', err);
    }
  };

  const fetchExamples = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/examples`);
      const data = await response.json();
      if (data.success) {
        setExamples(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch examples:', err);
    }
  };

  const analyzePassword = async (pwd = password) => {
    if (!pwd) {
      setError('Please enter a password');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password: pwd }),
      });

      const data = await response.json();

      if (data.success) {
        setAnalysis(data.data);
      } else {
        setError(data.error || 'Analysis failed');
      }
    } catch (err) {
      setError('Failed to connect to server. Make sure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleExampleClick = (examplePassword) => {
    setPassword(examplePassword);
    analyzePassword(examplePassword);
  };

  const getStrengthColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-blue-500';
    if (score >= 40) return 'text-yellow-500';
    if (score >= 20) return 'text-orange-500';
    return 'text-red-500';
  };

  const getStrengthBgColor = (score) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-blue-500';
    if (score >= 40) return 'bg-yellow-500';
    if (score >= 20) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const getCrackTimeColor = (seconds) => {
    if (seconds < 3600) return 'text-red-600 bg-red-50';
    if (seconds < 86400) return 'text-orange-600 bg-orange-50';
    if (seconds < 31536000) return 'text-yellow-600 bg-yellow-50';
    if (seconds < 31536000 * 100) return 'text-blue-600 bg-blue-50';
    return 'text-green-600 bg-green-50';
  };

  const formatSpeed = (speed) => {
    if (speed >= 1e12) return `${(speed / 1e12).toFixed(1)} trillion H/s`;
    if (speed >= 1e9) return `${(speed / 1e9).toFixed(1)} billion H/s`;
    if (speed >= 1e6) return `${(speed / 1e6).toFixed(1)} million H/s`;
    if (speed >= 1e3) return `${(speed / 1e3).toFixed(1)} thousand H/s`;
    return `${speed.toFixed(0)} H/s`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Shield className="w-10 h-10 text-blue-600" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Password Security Lab</h1>
                <p className="text-sm text-gray-600">Educational Tool for Password Strength Analysis</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Activity className="w-4 h-4" />
              <span>Team GA14</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Password Input Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center">
              <Lock className="w-6 h-6 mr-2 text-blue-600" />
              Enter Password to Analyze
            </h2>
            <p className="text-gray-600">Your password is analyzed locally and never stored or transmitted.</p>
          </div>

          <div className="flex flex-col space-y-4">
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && analyzePassword()}
                placeholder="Enter your password..."
                className="w-full px-6 py-4 text-lg border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-colors pr-12"
              />
              <button
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            <button
              onClick={() => analyzePassword()}
              disabled={loading || !password}
              className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Analyzing...</span>
                </>
              ) : (
                <>
                  <Shield className="w-5 h-5" />
                  <span>Analyze Password</span>
                </>
              )}
            </button>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
                <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-red-800">{error}</p>
              </div>
            )}
          </div>

          {/* Example Passwords */}
          {examples.length > 0 && !analysis && (
            <div className="mt-8">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Try Example Passwords:</h3>
              <div className="flex flex-wrap gap-2">
                {examples.map((example, index) => (
                  <button
                    key={index}
                    onClick={() => handleExampleClick(example.password)}
                    className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                  >
                    {example.description}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Analysis Results */}
        {analysis && (
          <div className="space-y-6">
            {/* Strength Overview */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <TrendingUp className="w-6 h-6 mr-2 text-blue-600" />
                Password Strength Assessment
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-blue-800">Score</span>
                    <Award className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className={`text-4xl font-bold ${getStrengthColor(analysis.strength.score)}`}>
                    {analysis.strength.score}/100
                  </div>
                  <div className="mt-2 text-sm font-semibold text-gray-700">
                    {analysis.strength.level}
                  </div>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-purple-800">Length</span>
                    <Activity className="w-5 h-5 text-purple-600" />
                  </div>
                  <div className="text-4xl font-bold text-purple-700">
                    {analysis.strength.length}
                  </div>
                  <div className="mt-2 text-sm text-gray-600">characters</div>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-green-800">Entropy</span>
                    <Zap className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="text-4xl font-bold text-green-700">
                    {analysis.strength.entropy}
                  </div>
                  <div className="mt-2 text-sm text-gray-600">bits</div>
                </div>

                <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-orange-800">Status</span>
                    <Info className="w-5 h-5 text-orange-600" />
                  </div>
                  <div className="text-lg font-bold text-orange-700 mt-2">
                    {analysis.strength.is_common ? (
                      <span className="flex items-center text-red-600">
                        <AlertTriangle className="w-5 h-5 mr-1" />
                        Common
                      </span>
                    ) : (
                      <span className="flex items-center text-green-600">
                        <CheckCircle className="w-5 h-5 mr-1" />
                        Unique
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Strength Bar */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">Overall Strength</span>
                  <span className={`text-sm font-bold ${getStrengthColor(analysis.strength.score)}`}>
                    {analysis.strength.level}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                  <div
                    className={`h-full ${getStrengthBgColor(analysis.strength.score)} transition-all duration-500 ease-out rounded-full`}
                    style={{ width: `${analysis.strength.score}%` }}
                  ></div>
                </div>
              </div>

              {/* Character Sets */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(analysis.strength.char_sets).map(([key, value]) => (
                  <div
                    key={key}
                    className={`p-4 rounded-lg border-2 ${
                      value ? 'border-green-500 bg-green-50' : 'border-gray-300 bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700 capitalize">{key}</span>
                      {value ? (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      ) : (
                        <div className="w-5 h-5 rounded-full border-2 border-gray-400"></div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="border-b border-gray-200">
                <div className="flex space-x-1 p-2">
                  {[
                    { id: 'crack-times', label: 'Crack Time Analysis', icon: Clock },
                    { id: 'algorithms', label: 'Algorithm Comparison', icon: Database },
                    { id: 'suggestions', label: 'Recommendations', icon: TrendingUp },
                    { id: 'hashes', label: 'Hash Examples', icon: Lock }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-colors ${
                        activeTab === tab.id
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <tab.icon className="w-4 h-4" />
                      <span className="hidden sm:inline">{tab.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-8">
                {/* Crack Times Tab */}
                {activeTab === 'crack-times' && (
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">
                      Estimated Crack Time by Algorithm
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Time required to crack using brute-force attack on modern GPU (NVIDIA RTX 3090)
                    </p>

                    <div className="space-y-4">
                      {analysis.crack_times.map((ct, index) => (
                        <div
                          key={index}
                          className={`p-6 rounded-xl border-2 ${getCrackTimeColor(ct.time_seconds)}`}
                        >
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <h4 className="text-lg font-bold uppercase">{ct.algorithm}</h4>
                              <p className="text-sm text-gray-600">
                                Attack Speed: {formatSpeed(ct.attack_speed)}
                              </p>
                            </div>
                            <Clock className="w-8 h-8" />
                          </div>
                          <div className="text-2xl font-bold">
                            {ct.time_human}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Algorithms Tab */}
                {activeTab === 'algorithms' && (
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">
                      Algorithm Security Comparison
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Understanding different password storage methods and their security levels
                    </p>

                    <div className="space-y-4">
                      {algorithms.map((algo, index) => {
                        const statusColors = {
                          insecure: 'border-red-500 bg-red-50',
                          deprecated: 'border-orange-500 bg-orange-50',
                          weak: 'border-yellow-500 bg-yellow-50',
                          secure: 'border-green-500 bg-green-50',
                          most_secure: 'border-emerald-500 bg-emerald-50'
                        };

                        return (
                          <div
                            key={index}
                            className={`p-6 rounded-xl border-2 ${statusColors[algo.status]}`}
                          >
                            <div className="flex items-start justify-between mb-3">
                              <div>
                                <h4 className="text-xl font-bold text-gray-900">{algo.name}</h4>
                                <p className="text-sm text-gray-600">{algo.year}</p>
                              </div>
                              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase bg-white">
                                {algo.speed}
                              </span>
                            </div>
                            <p className="text-gray-700 mb-2">{algo.description}</p>
                            <p className="text-sm font-semibold text-gray-800">
                              Use Case: {algo.use_case}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Suggestions Tab */}
                {activeTab === 'suggestions' && (
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">
                      Password Enhancement Recommendations
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Follow these suggestions to improve your password security
                    </p>

                    <div className="space-y-3">
                      {analysis.suggestions.map((suggestion, index) => {
                        const isCritical = suggestion.includes('CRITICAL');
                        const isGood = suggestion.includes('✅') || suggestion.includes('Excellent');
                        const isWarning = suggestion.includes('⚠️') || suggestion.includes('🔄') || suggestion.includes('🚫');

                        return (
                          <div
                            key={index}
                            className={`p-4 rounded-lg border-l-4 ${
                              isCritical
                                ? 'border-red-500 bg-red-50'
                                : isGood
                                ? 'border-green-500 bg-green-50'
                                : isWarning
                                ? 'border-yellow-500 bg-yellow-50'
                                : 'border-blue-500 bg-blue-50'
                            }`}
                          >
                            <p className="text-gray-800">{suggestion}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Hashes Tab */}
                {activeTab === 'hashes' && (
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">
                      Hash Examples (Educational Purpose)
                    </h3>
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6 flex items-start space-x-3">
                      <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-yellow-800">
                        <strong>Warning:</strong> Never log or display real password hashes in production systems!
                      </p>
                    </div>

                    <div className="space-y-4">
                      {Object.entries(analysis.hashes).map(([algo, hash], index) => (
                        <div key={index} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="text-sm font-bold uppercase text-gray-700">{algo}</h4>
                            <button
                              onClick={() => navigator.clipboard.writeText(hash)}
                              className="text-xs text-blue-600 hover:text-blue-800"
                            >
                              Copy
                            </button>
                          </div>
                          <code className="text-xs text-gray-600 break-all font-mono">
                            {hash}
                          </code>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-sm text-gray-600">
            <p className="mb-2">
              <strong>Educational Tool</strong> - Password Security Lab by Team GA14
            </p>
            <p>
              Your passwords are analyzed locally and never stored or transmitted. 
              For educational purposes only.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
