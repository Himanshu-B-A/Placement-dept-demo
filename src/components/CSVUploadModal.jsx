import React, { useState } from 'react';
import { FaUpload, FaTimes, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';
import { collection, addDoc, setDoc, doc, query, where, getDocs } from 'firebase/firestore';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { db, auth } from '../config/firebase';

const CSVUploadModal = ({ isOpen, onClose, onSuccess }) => {
  const [step, setStep] = useState(1); // 1: Upload, 2: Preview, 3: Uploading, 4: Results
  const [csvData, setCsvData] = useState([]);
  const [file, setFile] = useState(null);
  const [results, setResults] = useState([]);
  const [error, setError] = useState('');

  const roleOptions = ['admin', 'student', 'faculty', 'hod'];

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const csv = event.target.result;
        const lines = csv.trim().split('\n');
        
        if (lines.length < 2) {
          setError('CSV must have header row and at least one data row');
          return;
        }

        const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
        const emailIndex = headers.indexOf('email');
        const nameIndex = headers.indexOf('name');
        const passwordIndex = headers.indexOf('password');
        const roleIndex = headers.indexOf('role');

        if (emailIndex === -1 || nameIndex === -1 || passwordIndex === -1) {
          setError('CSV must have columns: email, name, password, role');
          return;
        }

        const data = [];
        for (let i = 1; i < lines.length; i++) {
          if (lines[i].trim() === '') continue;
          
          const cols = lines[i].split(',').map(c => c.trim());
          const role = roleIndex !== -1 ? cols[roleIndex] : 'student';

          if (!roleOptions.includes(role.toLowerCase())) {
            setError(`Invalid role: ${role}. Must be one of: ${roleOptions.join(', ')}`);
            return;
          }

          data.push({
            email: cols[emailIndex],
            name: nameIndex !== -1 ? cols[nameIndex] : cols[emailIndex].split('@')[0],
            password: cols[passwordIndex],
            role: role.toLowerCase(),
            status: 'pending'
          });
        }

        if (data.length === 0) {
          setError('No valid data rows found in CSV');
          return;
        }

        setCsvData(data);
        setFile(selectedFile);
        setError('');
        setStep(2);
      } catch (err) {
        setError(`Error parsing CSV: ${err.message}`);
      }
    };
    reader.readAsText(selectedFile);
  };

  const handleRoleChange = (index, newRole) => {
    const updated = [...csvData];
    updated[index].role = newRole;
    setCsvData(updated);
  };

  const handleUpload = async () => {
    setStep(3);
    const uploadResults = [];

    for (let i = 0; i < csvData.length; i++) {
      const user = csvData[i];
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, user.email, user.password);
        
        await setDoc(doc(db, 'users', userCredential.user.uid), {
          email: user.email,
          name: user.name,
          role: user.role,
          createdAt: new Date().toISOString()
        });

        uploadResults.push({
          email: user.email,
          success: true,
          message: 'User created successfully'
        });
      } catch (err) {
        uploadResults.push({
          email: user.email,
          success: false,
          message: err.message || 'Failed to create user'
        });
      }
    }

    setResults(uploadResults);
    setStep(4);
    
    // Call success callback
    const successCount = uploadResults.filter(r => r.success).length;
    onSuccess(successCount, csvData.length);
  };

  const handleDownloadTemplate = () => {
    const template = 'email,name,password,role\nstudent@jjmc.edu,Student Name,password123,student\nfaculty@jjmc.edu,Faculty Name,faculty123,faculty';
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(template));
    element.setAttribute('download', 'user_template.csv');
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const reset = () => {
    setStep(1);
    setCsvData([]);
    setFile(null);
    setResults([]);
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Bulk User Registration</h2>
          <button onClick={reset} className="text-white hover:text-gray-200">
            <FaTimes size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Step 1: Upload */}
          {step === 1 && (
            <div className="space-y-4">
              <p className="text-gray-600">Upload a CSV file to register multiple users at once</p>
              
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start space-x-2">
                  <FaExclamationCircle className="mt-0.5 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-purple-500 transition">
                <FaUpload className="text-4xl text-gray-400 mx-auto mb-3" />
                <label className="cursor-pointer">
                  <input
                    type="file"
                    accept=".csv"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <span className="text-lg font-semibold text-purple-600 hover:text-purple-700">
                    Click to upload CSV
                  </span>
                </label>
                <p className="text-sm text-gray-500 mt-2">or drag and drop</p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-gray-700 mb-3"><strong>CSV Format Required:</strong></p>
                <p className="text-sm text-gray-600 font-mono bg-white p-2 rounded mb-3">
                  email,name,password,role
                </p>
                <p className="text-sm text-gray-700 mb-2"><strong>Roles:</strong> admin, student, faculty, hod</p>
                <button
                  onClick={handleDownloadTemplate}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  📥 Download Template
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Preview */}
          {step === 2 && (
            <div className="space-y-4">
              <p className="text-gray-600">Review users before uploading ({csvData.length} users)</p>
              
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left font-semibold">Email</th>
                      <th className="px-4 py-2 text-left font-semibold">Name</th>
                      <th className="px-4 py-2 text-left font-semibold">Password</th>
                      <th className="px-4 py-2 text-left font-semibold">Role</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {csvData.map((user, idx) => (
                      <tr key={idx} className="hover:bg-gray-50">
                        <td className="px-4 py-2">{user.email}</td>
                        <td className="px-4 py-2">{user.name}</td>
                        <td className="px-4 py-2 font-mono text-xs">
                          {user.password.length > 10 ? user.password.substring(0, 7) + '...' : user.password}
                        </td>
                        <td className="px-4 py-2">
                          <select
                            value={user.role}
                            onChange={(e) => handleRoleChange(idx, e.target.value)}
                            className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                          >
                            {roleOptions.map(role => (
                              <option key={role} value={role}>{role}</option>
                            ))}
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium"
                >
                  Back
                </button>
                <button
                  onClick={handleUpload}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:shadow-lg font-medium"
                >
                  Upload Users
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Uploading */}
          {step === 3 && (
            <div className="text-center py-8">
              <div className="animate-spin mb-4">
                <FaUpload className="text-4xl text-purple-600 mx-auto" />
              </div>
              <p className="text-lg font-semibold text-gray-700">Uploading users...</p>
            </div>
          )}

          {/* Step 4: Results */}
          {step === 4 && (
            <div className="space-y-4">
              <p className="text-lg font-semibold">Upload Complete</p>
              
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {results.map((result, idx) => (
                  <div
                    key={idx}
                    className={`flex items-start space-x-3 p-3 rounded-lg ${
                      result.success ? 'bg-green-50' : 'bg-red-50'
                    }`}
                  >
                    {result.success ? (
                      <FaCheckCircle className="text-green-600 mt-0.5 flex-shrink-0" />
                    ) : (
                      <FaExclamationCircle className="text-red-600 mt-0.5 flex-shrink-0" />
                    )}
                    <div>
                      <p className="font-medium text-sm">{result.email}</p>
                      <p className={`text-xs ${result.success ? 'text-green-700' : 'text-red-700'}`}>
                        {result.message}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={reset}
                className="w-full px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:shadow-lg font-medium"
              >
                Close
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CSVUploadModal;
