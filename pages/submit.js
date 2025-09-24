import { useState } from 'react';
import Head from 'next/head';
import Header from '../components/Header';
import { 
  PlusIcon, 
  DocumentTextIcon, 
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';
import { INDUSTRIES, CERTIFICATIONS, FRAMEWORKS, COMPANY_SIZES } from '../constants/industries';

export default function SubmitPage() {
  const [formData, setFormData] = useState({
    name: '',
    trustCenter: '',
    description: '',
    icon: ''
  });

  const [step, setStep] = useState(1);
  const [generatedCode, setGeneratedCode] = useState('');

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
      // Auto-generate icon from name
      ...(field === 'name' && { icon: value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') })
    }));
  };

  const generateCode = () => {
    const code = `export default ${JSON.stringify({
      name: formData.name,
      trustCenter: formData.trustCenter,
      description: formData.description,
      icon: formData.icon
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
      alert('Code copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <>
      <Head>
        <title>Submit Trust Center - TrustList</title>
        <meta name="description" content="Submit your company's trust center to TrustList. Help others discover your security and compliance information." />
      </Head>

      <div className="min-h-screen bg-gray-50">
        <Header />
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="text-center mb-8">
            <PlusIcon className="w-16 h-16 text-primary-600 mx-auto mb-4" />
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Submit a Trust Center</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Help the community by adding your company's trust center to our directory. 
              We review all submissions to ensure quality and accuracy.
            </p>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center space-x-4">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 1 ? 'bg-primary-600 text-white' : 'bg-gray-300 text-gray-600'}`}>
                1
              </div>
              <div className={`w-16 h-1 ${step >= 2 ? 'bg-primary-600' : 'bg-gray-300'}`}></div>
              <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 2 ? 'bg-primary-600 text-white' : 'bg-gray-300 text-gray-600'}`}>
                2
              </div>
            </div>
          </div>

          {step === 1 ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Company Information</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., Stripe"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Trust Center URL *
                  </label>
                  <input
                    type="url"
                    value={formData.trustCenter}
                    onChange={(e) => handleInputChange('trustCenter', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="https://stripe.com/privacy-center/legal"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company Description *
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Brief description of the company and its services..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Icon Name
                  </label>
                  <input
                    type="text"
                    value={formData.icon}
                    onChange={(e) => handleInputChange('icon', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., stripe (auto-generated from name)"
                  />
                  <p className="text-xs text-gray-500 mt-1">Used for visual identification</p>
                </div>

                <div className="flex justify-end pt-6">
                  <button
                    onClick={generateCode}
                    disabled={!isFormValid()}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                  >
                    Generate Code
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Generated Code */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-gray-900">Generated Code</h2>
                  <button
                    onClick={copyToClipboard}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                  >
                    Copy to Clipboard
                  </button>
                </div>
                
                <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                  <pre className="text-green-400 text-sm">{generatedCode}</pre>
                </div>
              </div>

              {/* Instructions */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <DocumentTextIcon className="w-8 h-8 mr-3 text-primary-600" />
                  Submission Instructions
                </h2>
                
                <div className="space-y-6">
                  <div className="flex items-start space-x-3">
                    <span className="flex items-center justify-center w-6 h-6 bg-primary-600 text-white rounded-full text-sm font-medium">1</span>
                    <div>
                      <h3 className="font-semibold text-gray-900">Fork the Repository</h3>
                      <p className="text-gray-600">Fork the TrustList repository on GitHub to your account.</p>
                      <a 
                        href="https://github.com/FelixMichaels/trustlists/fork" 
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block mt-2 text-primary-600 hover:text-primary-700"
                      >
                        Fork Repository →
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <span className="flex items-center justify-center w-6 h-6 bg-primary-600 text-white rounded-full text-sm font-medium">2</span>
                    <div>
                      <h3 className="font-semibold text-gray-900">Create the File</h3>
                      <p className="text-gray-600">
                        Create a new file in the <code className="bg-gray-100 px-2 py-1 rounded">constants/trustCenterRegistry/</code> folder 
                        named <code className="bg-gray-100 px-2 py-1 rounded">{formData.icon}.js</code> and paste the generated code.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <span className="flex items-center justify-center w-6 h-6 bg-primary-600 text-white rounded-full text-sm font-medium">3</span>
                    <div>
                      <h3 className="font-semibold text-gray-900">Submit Pull Request</h3>
                      <p className="text-gray-600">
                        Commit your changes and create a pull request with the title: 
                        <code className="bg-gray-100 px-2 py-1 rounded">Add {formData.name} trust center</code>
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Guidelines */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <div className="flex items-start space-x-3">
                  <InformationCircleIcon className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-blue-900 mb-2">Submission Guidelines</h3>
                    <ul className="text-blue-800 space-y-1 text-sm">
                      <li>• Ensure all URLs are publicly accessible</li>
                      <li>• Only submit companies you represent or have permission to add</li>
                      <li>• Provide accurate and up-to-date information</li>
                      <li>• Follow the naming conventions for consistency</li>
                      <li>• Include relevant certifications and compliance frameworks</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="flex justify-between">
                <button
                  onClick={() => setStep(1)}
                  className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Back to Form
                </button>
                
                <a
                  href="https://github.com/FelixMichaels/trustlists/compare"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 bg-trust-600 text-white rounded-lg hover:bg-trust-700 transition-colors"
                >
                  Create Pull Request
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
