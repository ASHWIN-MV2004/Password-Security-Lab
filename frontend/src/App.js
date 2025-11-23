import React, { useState, useEffect } from 'react';
import {
  Shield, Lock, Eye, EyeOff, AlertTriangle, CheckCircle, 
  Clock, Database, TrendingUp, Zap, Activity, Award,
  Sparkles, RefreshCw, Copy, Check, Wand2, Lightbulb,
  ChevronRight, BarChart3
} from 'lucide-react';
import './styles/App.css';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

function App() {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('crack-times');
  const [algorithms, setAlgorithms] = useState([]);
  const [examples, setExamples] = useState([]);
  const [showGenerator, setShowGenerator] = useState(false);
  const [showImprovements, setShowImprovements] = useState(false);
  const [improvements, setImprovements] = useState([]);
  const [copied, setCopied] = useState(false);
  
  // Generator settings
  const [genLength, setGenLength] = useState(16);
  const [genOptions, setGenOptions] = useState({
    include_lowercase: true,
    include_uppercase: true,
    include_digits: true,
    include_special: true
  });

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
    setShowImprovements(false);

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

  const generatePassword = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          length: genLength,
          ...genOptions
        }),
      });

      const data = await response.json();

      if (data.success) {
        setPassword(data.data.password);
        await analyzePassword(data.data.password);
        setShowGenerator(false);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('Failed to generate password');
    } finally {
      setLoading(false);
    }
  };

  const getImprovements = async () => {
    if (!password) {
      setError('Please enter a password first');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/improve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (data.success) {
        setImprovements(data.data.improvements);
        setShowImprovements(true);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('Failed to get improvements');
    } finally {
      setLoading(false);
    }
  };

  const handleExampleClick = (examplePassword) => {
    setPassword(examplePassword);
    analyzePassword(examplePassword);
    setShowImprovements(false);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getStrengthColor = (score) => {
    if (score >= 80) return 'from-emerald-400 to-green-500';
    if (score >= 60) return 'from-blue-400 to-cyan-500';
    if (score >= 40) return 'from-yellow-400 to-orange-400';
    if (score >= 20) return 'from-orange-400 to-red-400';
    return 'from-red-500 to-pink-500';
  };

  const getStrengthBorder = (score) => {
    if (score >= 80) return 'border-emerald-500/50';
    if (score >= 60) return 'border-blue-500/50';
    if (score >= 40) return 'border-yellow-500/50';
    if (score >= 20) return 'border-orange-500/50';
    return 'border-red-500/50';
  };

  const getCrackTimeColor = (seconds) => {
    if (seconds < 3600) return 'from-red-500 to-pink-600';
    if (seconds < 86400) return 'from-orange-500 to-red-500';
    if (seconds < 31536000) return 'from-yellow-500 to-orange-500';
    if (seconds < 31536000 * 100) return 'from-blue-500 to-cyan-500';
    return 'from-emerald-500 to-green-600';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black text-white">
      {/* Header with Glassmorphism */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-gray-900/70 border-b border-gray-700/50 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl blur-xl opacity-50"></div>
                <Shield className="relative w-12 h-12 text-blue-400" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Password Security Lab
                </h1>
                <p className="text-sm text-gray-400">Advanced Password Analysis & Generation</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20">
              <Activity className="w-4 h-4 text-blue-400" />
              <span className="text-sm text-gray-300">Team GA14</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Input Section with Glass Effect */}
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
          <div className="relative backdrop-blur-xl bg-gray-800/50 rounded-2xl border border-gray-700/50 p-8 shadow-2xl">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-white mb-2 flex items-center">
                <Lock className="w-6 h-6 mr-2 text-blue-400" />
                Enter Password to Analyze
              </h2>
              <p className="text-gray-400">Analyzed locally • Never stored • Privacy focused</p>
            </div>

            <div className="space-y-4">
              <div className="relative group">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && analyzePassword()}
                  placeholder="Enter your password..."
                  className="w-full px-6 py-4 text-lg bg-gray-900/50 border-2 border-gray-700 rounded-xl focus:outline-none focus:border-blue-500 transition-all duration-300 text-white placeholder-gray-500 pr-12"
                />
                <button
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => analyzePassword()}
                  disabled={loading || !password}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg hover:shadow-blue-500/50"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Analyzing...</span>
                    </>
                  ) : (
                    <>
                      <BarChart3 className="w-5 h-5" />
                      <span>Analyze</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => setShowGenerator(!showGenerator)}
                  className="px-6 py-3 rounded-xl font-semibold transition-all duration-300 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white flex items-center space-x-2 shadow-lg"
                >
                  <Sparkles className="w-5 h-5" />
                  <span>Generate</span>
                </button>

                {password && (
                  <button
                    onClick={getImprovements}
                    className="px-6 py-3 rounded-xl font-semibold transition-all duration-300 bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white flex items-center space-x-2 shadow-lg"
                  >
                    <Wand2 className="w-5 h-5" />
                    <span>Improve</span>
                  </button>
                )}
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/50 rounded-xl p-4 flex items-start space-x-3 animate-pulse">
                  <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                  <p className="text-red-300">{error}</p>
                </div>
              )}
            </div>

            {/* Password Generator */}
            {showGenerator && (
              <div className="mt-6 p-6 bg-gray-900/50 rounded-xl border border-purple-500/30 animate-slideDown">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                  <Sparkles className="w-5 h-5 mr-2 text-purple-400" />
                  Password Generator
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Length: {genLength}
                    </label>
                    <input
                      type="range"
                      min="8"
                      max="32"
                      value={genLength}
                      onChange={(e) => setGenLength(parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {Object.entries(genOptions).map(([key, value]) => (
                      <label key={key} className="flex items-center space-x-3 cursor-pointer group">
                        <input
                          type="checkbox"
                          checked={value}
                          onChange={(e) => setGenOptions({...genOptions, [key]: e.target.checked})}
                          className="w-5 h-5 rounded bg-gray-700 border-gray-600 text-blue-600 focus:ring-blue-500 focus:ring-offset-gray-900"
                        />
                        <span className="text-sm text-gray-300 group-hover:text-white transition-colors">
                          {key.replace('include_', '').replace('_', ' ').charAt(0).toUpperCase() + key.replace('include_', '').replace('_', ' ').slice(1)}
                        </span>
                      </label>
                    ))}
                  </div>

                  <button
                    onClick={generatePassword}
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center space-x-2"
                  >
                    <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                    <span>Generate Strong Password</span>
                  </button>
                </div>
              </div>
            )}

            {/* Example Passwords */}
            {examples.length > 0 && !analysis && (
              <div className="mt-6">
                <h3 className="text-sm font-semibold text-gray-400 mb-3">Quick Test Examples:</h3>
                <div className="flex flex-wrap gap-2">
                  {examples.map((example, index) => (
                    <button
                      key={index}
                      onClick={() => handleExampleClick(example.password)}
                      className="px-4 py-2 text-sm bg-gray-800/50 hover:bg-gray-700/50 border border-gray-700 hover:border-gray-600 rounded-lg transition-all duration-300 text-gray-300 hover:text-white"
                    >
                      {example.description}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Improvements Section */}
        {showImprovements && improvements.length > 0 && (
          <div className="relative group animate-slideDown">
            <div className="absolute -inset-1 bg-gradient-to-r from-green-600 to-teal-600 rounded-2xl blur opacity-25"></div>
            <div className="relative backdrop-blur-xl bg-gray-800/50 rounded-2xl border border-gray-700/50 p-8 shadow-2xl">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <Lightbulb className="w-6 h-6 mr-2 text-yellow-400" />
                Smart Password Improvements
              </h2>

              <div className="grid gap-4">
                {improvements.map((imp, index) => (
                  <div
                    key={index}
                    className="p-4 bg-gray-900/50 rounded-xl border border-gray-700/50 hover:border-green-500/50 transition-all duration-300 group"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <span className="px-3 py-1 rounded-lg bg-gradient-to-r from-green-500/20 to-teal-500/20 text-green-400 text-sm font-semibold border border-green-500/30">
                            {imp.level}
                          </span>
                          <span className="text-2xl font-bold text-white">
                            {imp.score}/100
                          </span>
                        </div>
                        <p className="text-sm text-gray-400 mb-1">{imp.strategy}</p>
                        <p className="text-xs text-gray-500">{imp.description}</p>
                      </div>
                      <button
                        onClick={() => {
                          setPassword(imp.password);
                          analyzePassword(imp.password);
                          setShowImprovements(false);
                        }}
                        className="px-4 py-2 bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 rounded-lg text-white text-sm font-semibold transition-all duration-300 flex items-center space-x-2"
                      >
                        <span>Use This</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <div className="flex items-center space-x-3 p-3 bg-gray-800/50 rounded-lg font-mono text-sm">
                      <code className="flex-1 text-gray-300">{imp.password}</code>
                      <button
                        onClick={() => copyToClipboard(imp.password)}
                        className="text-gray-400 hover:text-white transition-colors"
                      >
                        {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Analysis Results */}
        {analysis && (
          <div className="space-y-6 animate-fadeIn">
            {/* Strength Overview with Glassmorphism */}
            <div className="relative group">
              <div className={`absolute -inset-1 bg-gradient-to-r ${getStrengthColor(analysis.strength.score)} rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000`}></div>
              <div className="relative backdrop-blur-xl bg-gray-800/50 rounded-2xl border border-gray-700/50 p-8 shadow-2xl">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                  <TrendingUp className="w-6 h-6 mr-2 text-blue-400" />
                  Password Strength Assessment
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  {[
                    { label: 'Score', value: `${analysis.strength.score}/100`, sublabel: analysis.strength.level, icon: Award, color: 'blue' },
                    { label: 'Length', value: analysis.strength.length, sublabel: 'characters', icon: Activity, color: 'purple' },
                    { label: 'Entropy', value: analysis.strength.entropy, sublabel: 'bits', icon: Zap, color: 'green' },
                    { label: 'Status', value: analysis.strength.is_common ? 'Common' : 'Unique', sublabel: '', icon: analysis.strength.is_common ? AlertTriangle : CheckCircle, color: analysis.strength.is_common ? 'red' : 'emerald' }
                  ].map((metric, idx) => (
                    <div key={idx} className="relative group/card">
                      <div className={`absolute -inset-0.5 bg-gradient-to-r from-${metric.color}-600 to-${metric.color}-400 rounded-xl blur opacity-20 group-hover/card:opacity-40 transition duration-300`}></div>
                      <div className="relative bg-gray-900/80 rounded-xl p-6 border border-gray-700/50">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-400">{metric.label}</span>
                          <metric.icon className="w-5 h-5 text-gray-400" />
                        </div>
                        <div className={`text-3xl font-bold bg-gradient-to-r ${getStrengthColor(analysis.strength.score)} bg-clip-text text-transparent`}>
                          {metric.value}
                        </div>
                        {metric.sublabel && (
                          <div className="mt-2 text-sm text-gray-500">{metric.sublabel}</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Strength Bar */}
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm font-medium text-gray-300">Overall Strength</span>
                    <span className={`text-sm font-bold bg-gradient-to-r ${getStrengthColor(analysis.strength.score)} bg-clip-text text-transparent`}>
                      {analysis.strength.level}
                    </span>
                  </div>
                  <div className="relative w-full h-4 bg-gray-700/50 rounded-full overflow-hidden backdrop-blur-sm">
                    <div
                      className={`h-full bg-gradient-to-r ${getStrengthColor(analysis.strength.score)} transition-all duration-1000 ease-out rounded-full shadow-lg`}
                      style={{ width: `${analysis.strength.score}%` }}
                    >
                      <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                    </div>
                  </div>
                </div>

                {/* Character Sets */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Object.entries(analysis.strength.char_sets).map(([key, value]) => (
                    <div
                      key={key}
                      className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                        value
                          ? 'border-green-500/50 bg-green-500/10'
                          : 'border-gray-700 bg-gray-800/30'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-300 capitalize">{key}</span>
                        {value ? (
                          <CheckCircle className="w-5 h-5 text-green-400" />
                        ) : (
                          <div className="w-5 h-5 rounded-full border-2 border-gray-600"></div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="backdrop-blur-xl bg-gray-800/50 rounded-2xl border border-gray-700/50 shadow-2xl overflow-hidden">
              <div className="border-b border-gray-700/50 bg-gray-900/30">
                <div className="flex space-x-1 p-2">
                  {[
                    { id: 'crack-times', label: 'Crack Times', icon: Clock },
                    { id: 'algorithms', label: 'Algorithms', icon: Database },
                    { id: 'suggestions', label: 'Tips', icon: TrendingUp },
                    { id: 'hashes', label: 'Hashes', icon: Lock }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                        activeTab === tab.id
                          ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                          : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
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
                  <div className="space-y-4">
                    <div className="mb-6">
                      <h3 className="text-xl font-bold text-white mb-2">Crack Time Analysis</h3>
                      <p className="text-gray-400">Estimated time using brute-force attack on modern GPU (NVIDIA RTX 3090)</p>
                    </div>

                    {analysis.crack_times.map((ct, index) => (
                      <div
                        key={index}
                        className={`relative group p-6 rounded-xl border-2 ${getCrackTimeColor(ct.time_seconds)} bg-gradient-to-r from-gray-900/80 to-gray-800/80 backdrop-blur-sm hover:scale-105 transition-all duration-300`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h4 className="text-xl font-bold uppercase text-white mb-2">{ct.algorithm}</h4>
                            <p className="text-sm text-gray-400 mb-3">
                              Attack Speed: {(ct.attack_speed >= 1e12) ? `${(ct.attack_speed / 1e12).toFixed(1)} trillion H/s` :
                                (ct.attack_speed >= 1e9) ? `${(ct.attack_speed / 1e9).toFixed(1)} billion H/s` :
                                (ct.attack_speed >= 1e6) ? `${(ct.attack_speed / 1e6).toFixed(1)} million H/s` :
                                `${(ct.attack_speed / 1e3).toFixed(1)} thousand H/s`}
                            </p>
                            <div className="text-3xl font-bold text-white">
                              {ct.time_human}
                            </div>
                          </div>
                          <Clock className="w-12 h-12 text-white/20" />
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Algorithms Tab */}
                {activeTab === 'algorithms' && (
                  <div className="space-y-4">
                    <div className="mb-6">
                      <h3 className="text-xl font-bold text-white mb-2">Algorithm Security Comparison</h3>
                      <p className="text-gray-400">Understanding different password storage methods</p>
                    </div>

                    {algorithms.map((algo, index) => {
                      const statusColors = {
                        insecure: 'from-red-500/20 to-pink-500/20 border-red-500/50',
                        deprecated: 'from-orange-500/20 to-red-500/20 border-orange-500/50',
                        weak: 'from-yellow-500/20 to-orange-500/20 border-yellow-500/50',
                        secure: 'from-green-500/20 to-teal-500/20 border-green-500/50',
                        most_secure: 'from-emerald-500/20 to-green-500/20 border-emerald-500/50'
                      };

                      return (
                        <div
                          key={index}
                          className={`p-6 rounded-xl border-2 bg-gradient-to-r ${statusColors[algo.status]} backdrop-blur-sm hover:scale-102 transition-all duration-300`}
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h4 className="text-xl font-bold text-white">{algo.name}</h4>
                              <p className="text-sm text-gray-400">{algo.year}</p>
                            </div>
                            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase bg-white/10 text-white backdrop-blur-sm">
                              {algo.speed}
                            </span>
                          </div>
                          <p className="text-gray-300 mb-2">{algo.description}</p>
                          <p className="text-sm font-semibold text-gray-400">
                            Use Case: {algo.use_case}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Suggestions Tab */}
                {activeTab === 'suggestions' && (
                  <div className="space-y-3">
                    <div className="mb-6">
                      <h3 className="text-xl font-bold text-white mb-2">Enhancement Recommendations</h3>
                      <p className="text-gray-400">Follow these tips to improve your password security</p>
                    </div>

                    {analysis.suggestions.map((suggestion, index) => {
                      const isCritical = suggestion.includes('CRITICAL');
                      const isGood = suggestion.includes('✅') || suggestion.includes('Excellent');
                      const isWarning = suggestion.includes('⚠️') || suggestion.includes('🔄') || suggestion.includes('🚫');

                      return (
                        <div
                          key={index}
                          className={`p-4 rounded-xl border-l-4 backdrop-blur-sm ${
                            isCritical
                              ? 'border-red-500 bg-red-500/10'
                              : isGood
                              ? 'border-green-500 bg-green-500/10'
                              : isWarning
                              ? 'border-yellow-500 bg-yellow-500/10'
                              : 'border-blue-500 bg-blue-500/10'
                          }`}
                        >
                          <p className="text-gray-200">{suggestion}</p>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Hashes Tab */}
                {activeTab === 'hashes' && (
                  <div>
                    <div className="mb-6">
                      <h3 className="text-xl font-bold text-white mb-2">Hash Examples</h3>
                      <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 flex items-start space-x-3">
                        <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-yellow-200">
                          <strong>Educational Only:</strong> Never log or display real password hashes in production!
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {Object.entries(analysis.hashes).map(([algo, hash], index) => (
                        <div key={index} className="bg-gray-900/50 rounded-xl p-4 border border-gray-700/50">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="text-sm font-bold uppercase text-gray-300">{algo}</h4>
                            <button
                              onClick={() => copyToClipboard(hash)}
                              className="text-xs text-blue-400 hover:text-blue-300 transition-colors flex items-center space-x-1"
                            >
                              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                              <span>Copy</span>
                            </button>
                          </div>
                          <code className="text-xs text-gray-400 break-all font-mono block p-3 bg-gray-800/50 rounded">
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
      <footer className="mt-12 border-t border-gray-800 bg-gray-900/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-400">
            <p className="mb-2">
              <strong className="text-white">Educational Tool</strong> • Password Security Lab by Team GA14
            </p>
            <p className="text-sm">
              Privacy-focused • Local analysis • Never stored • Open source
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
