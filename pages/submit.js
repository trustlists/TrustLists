import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { 
  PlusIcon, 
  DocumentTextIcon, 
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';

export default function SubmitPage() {
  const [formData, setFormData] = useState({
    name: '',
    trustCenter: '',
    description: '',
    iconUrl: ''
  });

  const [step, setStep] = useState(1);
  const [generatedCode, setGeneratedCode] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [showCopySuccess, setShowCopySuccess] = useState(false);

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

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const generateCode = () => {
    const code = `export default ${JSON.stringify({
      name: formData.name,
      trustCenter: formData.trustCenter,
      description: formData.description,
      iconUrl: formData.iconUrl
    }, null, 2)};`;

    setGeneratedCode(code);
    setStep(2);
  };

  const isFormValid = () => {
    return formData.name && 
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
        {/* Custom Copy Success Notification */}
        {showCopySuccess && (
          <div className="fixed top-4 right-4 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-2 transform transition-all duration-300 ease-in-out">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="font-medium">Code copied to clipboard!</span>
          </div>
        )}

        <div className="flex h-screen overflow-hidden">
          {/* Left Sidebar - Fixed */}
          <div className="w-96 bg-white dark:bg-gray-800 shadow-sm flex-shrink-0">
            <div className="p-8">
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
                  Help the community by adding your company's trust center to our directory. 
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
                <button 
                  onClick={toggleDarkMode}
                  className="flex items-center text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-lg"
                >
                  <span className="mr-3 text-xl">{darkMode ? '☀️' : '🌙'}</span>
                  Toggle Theme
                </button>
              </div>
            </div>
          </div>

          {/* Right Content Area - Scrollable */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <PlusIcon className="w-16 h-16 text-blue-600 mx-auto mb-4" />
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Submit a Trust Center</h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
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

                  <div className="flex justify-end pt-6">
                    <button
                      onClick={generateCode}
                      disabled={!isFormValid()}
                      className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 dark:disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
                    >
                      Generate Code
                    </button>
                  </div>
                </div>
              </div>
            </div>
            ) : (
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
            )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
