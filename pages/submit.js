import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { 
  PlusIcon, 
  DocumentTextIcon, 
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  BoltIcon,
  CodeBracketIcon
} from '@heroicons/react/24/outline';

export default function SubmitPage() {
  const [formData, setFormData] = useState({
    name: '',
    website: '',
    trustCenter: '',
    description: '',
    iconUrl: ''
  });

  const [step, setStep] = useState(1);
  const [submissionMethod, setSubmissionMethod] = useState(null); // 'auto' or 'manual'
  const [generatedCode, setGeneratedCode] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [showCopySuccess, setShowCopySuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState(null);

  // Load dark mode preference from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('darkMode');
    setDarkMode(saved === 'true');
  }, []);

  // Save dark mode preference and apply to document
  useEffect(() => {
    localStorage.setItem('darkMode', darkMode.toString());
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 5000);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateFormData = () => {
    const errors = [];
    
    if (!formData.name.trim()) errors.push('Company name is required');
    if (!formData.website.trim()) errors.push('Website URL is required');
    if (!formData.trustCenter.trim()) errors.push('Trust Center URL is required');
    if (!formData.description.trim()) errors.push('Description is required');
    
    // Validate URLs
    try {
      if (formData.website && !formData.website.startsWith('http')) {
        errors.push('Website URL must start with http:// or https://');
      }
      if (formData.trustCenter && !formData.trustCenter.startsWith('http')) {
        errors.push('Trust Center URL must start with http:// or https://');
      }
      if (formData.iconUrl && formData.iconUrl.trim() && !formData.iconUrl.startsWith('http')) {
        errors.push('Logo URL must start with http:// or https://');
      }
    } catch (e) {
      errors.push('Invalid URL format');
    }
    
    // Check for reasonable length limits
    if (formData.name.length > 100) errors.push('Company name too long (max 100 characters)');
    if (formData.description.length > 500) errors.push('Description too long (max 500 characters)');
    
    return errors;
  };

  const handleSubmissionChoice = (method) => {
    const errors = validateFormData();
    if (errors.length > 0) {
      showNotification(`Please fix the following: ${errors.join(', ')}`, 'error');
      return;
    }
    
    setSubmissionMethod(method);
    
    if (method === 'manual') {
      generateCode();
    } else if (method === 'auto') {
      handleAutoSubmission();
    }
  };

  const generateCode = () => {
    const code = `export default ${JSON.stringify({
      name: formData.name,
      website: formData.website,
      trustCenter: formData.trustCenter,
      description: formData.description,
      iconUrl: formData.iconUrl
    }, null, 2)};`;

    setGeneratedCode(code);
    setStep(2);
  };

  const handleAutoSubmission = async () => {
    setIsSubmitting(true);
    
    try {
      // GitHub Pages doesn't support API routes, so we'll use GitHub Issues as a workaround
      // Create a GitHub Issue that will trigger our workflow
      const issueTitle = `Auto-Submit: ${formData.name}`;
      const issueBody = `**Auto-Submission Request**

**Company Information:**
- **Name:** ${formData.name}
- **Website:** ${formData.website}
- **Trust Center:** ${formData.trustCenter}
- **Description:** ${formData.description}
- **Logo URL:** ${formData.iconUrl || 'Not provided'}

---

**Instructions for Repository Owner:**
This is an automated submission. To add this company:

1. Create file: \`constants/trustCenterRegistry/${formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.js\`
2. Content:
\`\`\`javascript
export default {
  "name": "${formData.name}",
  "website": "${formData.website}",
  "trustCenter": "${formData.trustCenter}",
  "description": "${formData.description}",
  "iconUrl": "${formData.iconUrl || ''}"
};
\`\`\`

**Auto-generated from TrustList submission form**`;

      // Use GitHub Issues API directly
      const response = await fetch('https://api.github.com/repos/FelixMichaels/TrustLists/issues', {
        method: 'POST',
        headers: {
          'Authorization': `token ${process.env.NEXT_PUBLIC_GITHUB_TOKEN}`,
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: issueTitle,
          body: issueBody,
          labels: ['auto-submission', 'trust-center', 'needs-review']
        })
      });

      if (response.ok) {
        const issue = await response.json();
        showNotification(`🚀 Submission successful! Created issue #${issue.number}. You'll be notified when it's processed.`, 'success');
        
        // Reset form
        setFormData({
          name: '',
          website: '',
          trustCenter: '',
          description: '',
          iconUrl: ''
        });
        setStep(3); // Success step
      } else {
        const errorData = await response.json();
        throw new Error(`GitHub API error: ${errorData.message || response.status}`);
      }
    } catch (error) {
      console.error('Auto-submission error:', error);
      showNotification(`Auto-submission failed: ${error.message}. Switching to manual method.`, 'error');
      // Fallback to manual method
      setSubmissionMethod('manual');
      generateCode();
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = () => {
    return formData.name && 
           formData.website &&
           formData.trustCenter && 
           formData.description;
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedCode);
      setShowCopySuccess(true);
      // Hide notification after 3 seconds
      setTimeout(() => {
        setShowCopySuccess(false);
      }, 3000);
    } catch (err) {
      console.error('Failed to copy:', err);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = generatedCode;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setShowCopySuccess(true);
      setTimeout(() => {
        setShowCopySuccess(false);
      }, 3000);
    }
  };

  return (
    <>
      <Head>
        <title>Submit Trust Center - TrustList</title>
        <meta name="description" content="Submit your company's trust center to TrustList. Help others discover your security and compliance information." />
      </Head>

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
        {/* Notification System */}
        {(showCopySuccess || notification) && (
          <div className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg flex items-center space-x-2 transform transition-all duration-300 ease-in-out max-w-md ${
            showCopySuccess ? 'bg-green-500 text-white' :
            notification?.type === 'success' ? 'bg-green-500 text-white' :
            notification?.type === 'info' ? 'bg-blue-500 text-white' :
            notification?.type === 'error' ? 'bg-red-500 text-white' :
            'bg-gray-500 text-white'
          }`}>
            {(showCopySuccess || notification?.type === 'success') && (
              <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            )}
            {notification?.type === 'info' && (
              <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
            {notification?.type === 'error' && (
              <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
            <span className="font-medium text-sm">
              {showCopySuccess ? 'Code copied to clipboard!' : notification?.message}
            </span>
          </div>
        )}

        <div className="lg:flex lg:h-screen lg:overflow-hidden">
          {/* Left Sidebar - Fixed on desktop, stacked on mobile */}
          <div className="lg:w-96 bg-white dark:bg-gray-800 shadow-sm lg:flex-shrink-0">
            <div className="p-4 sm:p-6 lg:p-8">
              {/* Logo and Title */}
              <div className="mb-8">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
                    <span className="text-white font-bold text-xl">T</span>
                  </div>
                  <Link href="/" className="text-3xl font-bold text-gray-900 dark:text-white hover:text-blue-600">TrustList</Link>
                </div>
                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
                  Submit a Trust Center
                </h2>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  Help the community by adding your company's trust center to our curated directory. 
                  We review all submissions to ensure quality and accuracy.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="mb-8">
                <Link 
                  href="/" 
                  className="w-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-6 py-4 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200 flex items-center justify-center font-medium text-lg"
                >
                  <span className="mr-2 text-xl">←</span>
                  Back to Companies
                </Link>
              </div>

              {/* Links */}
              <div className="space-y-4">
                <a 
                  href="https://github.com/FelixMichaels/TrustLists" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-lg"
                >
                  <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C5.374 0 0 5.373 0 12 0 17.302 3.438 21.8 8.207 23.387c.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
                  </svg>
                  View Code
                </a>
                <a 
                  href="https://trustlists.org/trust-centers.json" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-lg"
                >
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  API
                </a>
                <button 
                  onClick={toggleDarkMode}
                  className="flex items-center text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-lg"
                >
                  {darkMode ? (
                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z"/>
                    </svg>
                  )}
                  Toggle Theme
                </button>
              </div>
            </div>
          </div>

          {/* Right Content Area - Scrollable */}
          <div className="flex-1 lg:overflow-y-auto lg:h-screen">
            <div className="p-4 sm:p-6 lg:p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <PlusIcon className="w-16 h-16 text-blue-600 mx-auto mb-4" />
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">Submit a Trust Center</h1>
              <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Help the community by adding your company's trust center to our directory. 
                We review all submissions to ensure quality and accuracy.
              </p>
            </div>

            {/* Progress Steps */}
            <div className="flex items-center justify-center mb-8">
              <div className="flex items-center space-x-4">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-400'}`}>
                  1
                </div>
                <div className={`w-16 h-1 ${step >= 2 ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'}`}></div>
                <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-400'}`}>
                  2
                </div>
                {step === 3 && (
                  <>
                    <div className="w-16 h-1 bg-blue-600"></div>
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white">
                      ✓
                    </div>
                  </>
                )}
              </div>
            </div>

            {step === 1 ? (
              <div className="flex justify-center">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8 max-w-2xl w-full">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Company Information</h2>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Company Name *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                      placeholder="e.g., Stripe"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Company Website *
                    </label>
                    <input
                      type="url"
                      value={formData.website}
                      onChange={(e) => handleInputChange('website', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                      placeholder="https://stripe.com"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Trust Center URL *
                    </label>
                    <input
                      type="url"
                      value={formData.trustCenter}
                      onChange={(e) => handleInputChange('trustCenter', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                      placeholder="https://stripe.com/privacy-center/legal"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Company Description *
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                      placeholder="Brief description of the company and its services..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Company Logo URL
                    </label>
                    <input
                      type="url"
                      value={formData.iconUrl}
                      onChange={(e) => handleInputChange('iconUrl', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                      placeholder="https://stripe.com/img/logos/logo-stripe.png"
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Direct URL to your company's logo (PNG, JPG, or SVG)</p>
                  </div>

                  {/* Submission Method Choice */}
                  <div className="pt-6 border-t border-gray-200 dark:border-gray-600">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Choose Submission Method</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Auto Submission */}
                      <button
                        onClick={() => handleSubmissionChoice('auto')}
                        disabled={!isFormValid() || isSubmitting}
                        className="group relative p-6 bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:from-gray-300 disabled:to-gray-400 dark:disabled:from-gray-600 dark:disabled:to-gray-700 disabled:cursor-not-allowed text-white rounded-xl transition-all duration-200 transform hover:scale-105 disabled:hover:scale-100 shadow-lg hover:shadow-xl"
                      >
                        <div className="flex items-center justify-center w-12 h-12 bg-white/20 rounded-lg mb-4 mx-auto">
                          <BoltIcon className="w-6 h-6" />
                        </div>
                        <h4 className="text-lg font-semibold mb-2">Auto Submit</h4>
                        <p className="text-sm text-blue-100">One-click submission! We'll create the PR for you automatically.</p>
                        {isSubmitting && (
                          <div className="absolute inset-0 bg-black/20 rounded-xl flex items-center justify-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                          </div>
                        )}
                      </button>

                      {/* Manual Submission */}
                      <button
                        onClick={() => handleSubmissionChoice('manual')}
                        disabled={!isFormValid() || isSubmitting}
                        className="group p-6 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:cursor-not-allowed border-2 border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500 rounded-xl transition-all duration-200 transform hover:scale-105 disabled:hover:scale-100"
                      >
                        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 dark:bg-gray-600 group-hover:bg-blue-100 dark:group-hover:bg-blue-600 rounded-lg mb-4 mx-auto transition-colors">
                          <CodeBracketIcon className="w-6 h-6 text-gray-600 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-300" />
                        </div>
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Manual Submit</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300">Traditional method. Generate code and create PR yourself.</p>
                      </button>
                    </div>
                    
                    <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                      <div className="flex items-start space-x-3">
                        <InformationCircleIcon className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                        <div className="text-sm text-blue-800 dark:text-blue-200">
                          <p className="font-medium mb-1">🆕 New Auto-Submit Feature!</p>
                          <p>Try our new one-click submission! If it doesn't work, we'll automatically fall back to the manual method.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            ) : step === 2 ? (
              <div className="flex justify-center">
                <div className="space-y-8 max-w-4xl w-full">
                {/* Generated Code */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Generated Code</h2>
                    <button
                      onClick={copyToClipboard}
                      className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm"
                    >
                      Copy to Clipboard
                    </button>
                  </div>
                  
                  <div className="bg-gray-900 dark:bg-gray-950 rounded-lg p-4 overflow-x-auto">
                    <pre className="text-green-400 text-sm">{generatedCode}</pre>
                  </div>
                </div>

                {/* Instructions */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                    <DocumentTextIcon className="w-8 h-8 mr-3 text-blue-600" />
                    Submission Instructions
                  </h2>
                
                  <div className="space-y-6">
                    <div className="flex items-start space-x-3">
                      <span className="flex items-center justify-center w-6 h-6 bg-blue-600 text-white rounded-full text-sm font-medium">1</span>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">Fork the Repository</h3>
                        <p className="text-gray-600 dark:text-gray-300">Fork the TrustList repository on GitHub to your account.</p>
                        <a 
                          href="https://github.com/FelixMichaels/TrustLists/fork" 
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-block mt-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                          Fork Repository →
                        </a>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <span className="flex items-center justify-center w-6 h-6 bg-blue-600 text-white rounded-full text-sm font-medium">2</span>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">Create the File</h3>
                        <p className="text-gray-600 dark:text-gray-300">
                          Create a new file in the <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-gray-900 dark:text-gray-100">constants/trustCenterRegistry/</code> folder 
                          named <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-gray-900 dark:text-gray-100">{formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}.js</code> and paste the generated code.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <span className="flex items-center justify-center w-6 h-6 bg-blue-600 text-white rounded-full text-sm font-medium">3</span>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">Submit Pull Request</h3>
                        <p className="text-gray-600 dark:text-gray-300">
                          Commit your changes and create a pull request with the title: 
                          <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-gray-900 dark:text-gray-100">Add {formData.name} trust center</code>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Guidelines */}
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
                  <div className="flex items-start space-x-3">
                    <InformationCircleIcon className="w-6 h-6 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Submission Guidelines</h3>
                      <ul className="text-blue-800 dark:text-blue-200 space-y-1 text-sm">
                        <li>• Ensure all URLs are publicly accessible</li>
                        <li>• Only submit companies you represent or have permission to add</li>
                        <li>• Provide accurate and up-to-date information</li>
                        <li>• Follow the naming conventions for consistency</li>
                        <li>• Keep it simple - only 4 fields required</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between">
                  <button
                    onClick={() => setStep(1)}
                    className="px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    Back to Form
                  </button>
                  
                  <a
                    href="https://github.com/FelixMichaels/TrustLists/compare"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Create Pull Request
                  </a>
                </div>
              </div>
            </div>
            ) : (
              // Step 3: Success (Auto-submission)
              <div className="flex justify-center">
                <div className="max-w-2xl w-full text-center">
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8">
                    <div className="w-20 h-20 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
                      <CheckCircleIcon className="w-12 h-12 text-green-600 dark:text-green-400" />
                    </div>
                    
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                      🎉 Submission Successful!
                    </h2>
                    
                    <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
                      Your trust center submission has been received and a GitHub issue has been created for review.
                    </p>
                    
                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 mb-6">
                      <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-3">What happens next?</h3>
                      <ul className="text-left text-blue-800 dark:text-blue-200 space-y-2 text-sm">
                        <li className="flex items-start space-x-2">
                          <span className="text-blue-600 dark:text-blue-400 mt-0.5">•</span>
                          <span>A GitHub issue has been created with your submission details</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <span className="text-blue-600 dark:text-blue-400 mt-0.5">•</span>
                          <span>Our team will review your submission (usually within 24-48 hours)</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <span className="text-blue-600 dark:text-blue-400 mt-0.5">•</span>
                          <span>Once approved, your company will appear on TrustList automatically</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <span className="text-blue-600 dark:text-blue-400 mt-0.5">•</span>
                          <span>You can track progress via the GitHub issue notifications</span>
                        </li>
                      </ul>
                    </div>
                    
                    <div className="space-y-4">
                      <button
                        onClick={() => {
                          setStep(1);
                          setSubmissionMethod(null);
                          setFormData({
                            name: '',
                            website: '',
                            trustCenter: '',
                            description: '',
                            iconUrl: ''
                          });
                        }}
                        className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                      >
                        Submit Another Company
                      </button>
                      
                      <Link
                        href="/"
                        className="block w-full px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors font-medium text-center"
                      >
                        Back to TrustList
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
