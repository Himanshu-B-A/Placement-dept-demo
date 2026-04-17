import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/Navbar';
import { FaSave, FaArrowLeft } from 'react-icons/fa';

const ContactDermatitisForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser, userRole } = useAuth();
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const canEdit = userRole === 'faculty' || userRole === 'hod' || !id;

  const [formData, setFormData] = useState({
    // Basic Information
    caseNo: '',
    name: '',
    age: '',
    address: '',
    sex: '',
    phone: '',
    occupation: '',

    // Clinical History
    presentingComplaints: '',
    durationOfOnset: '',
    sitePredominantlyInvolved: '',
    currentlyOnTreatment: '',
    
    // Eczema Characteristics
    eczemaCharacteristics: {
      pruritic: false,
      painful: false,
      burningSensation: false,
      asymptomatic: false
    },

    evolutionAndProgression: '',
    aggravationOnSunlight: '',
    atopyHistory: '',

    // Exposure Table
    exposureTable: {
      partheniumPlant: '',
      printingPhotographyWork: '',
      cement: '',
      topicalMedication: '',
      detergent: '',
      antibacterialAgents: '',
      newFootwear: '',
      bleach: '',
      shampooNailPolish: '',
      lesionAround: '',
      textileIndustry: '',
      earringsBangles: '',
      rubberIndustry: '',
      polishPaintInk: '',
      leatherIndustry: '',
      antiperspirantDeodorant: '',
      fungicidesInsecticides: '',
      pharmaceuticals: '',
      hairDyeCosmetics: ''
    },

    // Additional History
    othersIfAny: '',
    pastHistory: '',
    treatmentTakenPreviously: '',

    // Cutaneous Examination
    morphology: '',
    configuration: '',
    distribution: '',

    // Diagnosis
    provisionalDiagnosis: '',
    expectedAllergens: ''
  });

  useEffect(() => {
    if (id) {
      setEditMode(true);
      fetchPatientData();
    }
  }, [id]);

  const fetchPatientData = async () => {
    try {
      const docRef = demoMode ? mockDoc('patients', id) : doc(db, 'patients', id);
      const docSnap = demoMode ? await mockDb.getDoc(docRef) : await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        setFormData(data.data);
      } else {
        alert('Patient record not found');
        navigate(-1);
      }
    } catch (error) {
      console.error('Error fetching patient data:', error);
      alert('Error loading patient data');
    }
  };

  const handleInputChange = (e, section = null) => {
    const { name, value, type, checked } = e.target;
    const inputValue = type === 'checkbox' ? checked : value;
    
    if (section) {
      setFormData(prev => ({
        ...prev,
        [section]: {
          ...(prev[section] || {}),
          [name]: inputValue
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: inputValue
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editMode && id) {
        const docRef = demoMode ? mockDoc('patients', id) : doc(db, 'patients', id);
        if (demoMode) {
          await mockDb.updateDoc(docRef, {
            data: formData,
            lastModifiedBy: currentUser.email,
            lastModifiedAt: new Date().toISOString()
          });
        } else {
          await updateDoc(docRef, {
            data: formData,
            lastModifiedBy: currentUser.email,
            lastModifiedAt: new Date().toISOString()
          });
        }
        alert('Patient record updated successfully!');
      } else {
        const newId = `patient-${Date.now()}`;
        const newDocRef = demoMode ? mockDoc('patients', newId) : doc(db, 'patients', newId);
        if (demoMode) {
          await mockDb.setDoc(newDocRef, {
            formType: 'Contact Dermatitis',
            data: formData,
            createdBy: currentUser.email,
            createdAt: new Date().toISOString(),
            lastModifiedBy: currentUser.email,
            lastModifiedAt: new Date().toISOString()
          });
        } else {
          await setDoc(newDocRef, {
            formType: 'Contact Dermatitis',
            data: formData,
            createdBy: currentUser.email,
            createdAt: new Date().toISOString(),
            lastModifiedBy: currentUser.email,
            lastModifiedAt: new Date().toISOString()
          });
        }
        alert('Patient record created successfully!');
      }
      
      navigate(-1);
    } catch (error) {
      console.error('Error saving patient data:', error);
      alert('Error saving patient data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        <div className="mb-4 sm:mb-6">
          <button
            onClick={() => navigate(-1)}
            className="btn btn-secondary mb-3 sm:mb-4 flex items-center space-x-2 text-sm sm:text-base"
          >
            <FaArrowLeft /> <span>Back</span>
          </button>
          
          <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 border-l-4 border-primary-600">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 text-center">
              CONTACT DERMATITIS PROFORMA
            </h1>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          {/* Basic Information */}
          <div className="card">
            <h3 className="form-section-title">Basic Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="label">Case No.</label>
                <input
                  type="text"
                  name="caseNo"
                  value={formData.caseNo}
                  onChange={handleInputChange}
                  className="input"
                  disabled={!canEdit}
                />
              </div>
              
              <div className="lg:col-span-2">
                <label className="label">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="input"
                  disabled={!canEdit}
                  required
                />
              </div>

              <div>
                <label className="label">Age</label>
                <input
                  type="text"
                  name="age"
                  value={formData.age}
                  onChange={handleInputChange}
                  className="input"
                  disabled={!canEdit}
                />
              </div>

              <div>
                <label className="label">Sex</label>
                <select
                  name="sex"
                  value={formData.sex}
                  onChange={handleInputChange}
                  className="input"
                  disabled={!canEdit}
                >
                  <option value="">Select</option>
                  <option value="M">M</option>
                  <option value="F">F</option>
                </select>
              </div>

              <div>
                <label className="label">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="input"
                  disabled={!canEdit}
                />
              </div>

              <div className="lg:col-span-2">
                <label className="label">Address</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="input"
                  disabled={!canEdit}
                />
              </div>

              <div className="lg:col-span-1">
                <label className="label">Occupation</label>
                <input
                  type="text"
                  name="occupation"
                  value={formData.occupation}
                  onChange={handleInputChange}
                  className="input"
                  disabled={!canEdit}
                />
              </div>
            </div>
          </div>

          {/* Clinical History */}
          <div className="card">
            <h3 className="form-section-title">Clinical History</h3>
            <div className="space-y-4">
              <div>
                <label className="label">Presenting Complaints</label>
                <textarea
                  name="presentingComplaints"
                  value={formData.presentingComplaints}
                  onChange={handleInputChange}
                  className="input min-h-[80px]"
                  disabled={!canEdit}
                  rows="3"
                />
              </div>

              <div>
                <label className="label">Duration of Onset of Illness</label>
                <input
                  type="text"
                  name="durationOfOnset"
                  value={formData.durationOfOnset}
                  onChange={handleInputChange}
                  className="input"
                  disabled={!canEdit}
                />
              </div>

              <div>
                <label className="label">Site Predominantly Involved</label>
                <input
                  type="text"
                  name="sitePredominantlyInvolved"
                  value={formData.sitePredominantlyInvolved}
                  onChange={handleInputChange}
                  className="input"
                  disabled={!canEdit}
                />
              </div>

              <div>
                <label className="label">Currently on (Treatment)</label>
                <input
                  type="text"
                  name="currentlyOnTreatment"
                  value={formData.currentlyOnTreatment}
                  onChange={handleInputChange}
                  className="input"
                  disabled={!canEdit}
                />
              </div>
            </div>
          </div>

          {/* Eczema Characteristics */}
          <div className="card">
            <h3 className="form-section-title">Eczema</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="checkbox-group">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name="pruritic"
                    checked={formData.eczemaCharacteristics.pruritic}
                    onChange={(e) => handleInputChange(e, 'eczemaCharacteristics')}
                    className="checkbox"
                    disabled={!canEdit}
                  />
                  <span className="label">Pruritic</span>
                </label>
              </div>

              <div className="checkbox-group">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name="painful"
                    checked={formData.eczemaCharacteristics.painful}
                    onChange={(e) => handleInputChange(e, 'eczemaCharacteristics')}
                    className="checkbox"
                    disabled={!canEdit}
                  />
                  <span className="label">Painful</span>
                </label>
              </div>

              <div className="checkbox-group">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name="burningSensation"
                    checked={formData.eczemaCharacteristics.burningSensation}
                    onChange={(e) => handleInputChange(e, 'eczemaCharacteristics')}
                    className="checkbox"
                    disabled={!canEdit}
                  />
                  <span className="label">Burning Sensation</span>
                </label>
              </div>

              <div className="checkbox-group">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name="asymptomatic"
                    checked={formData.eczemaCharacteristics.asymptomatic}
                    onChange={(e) => handleInputChange(e, 'eczemaCharacteristics')}
                    className="checkbox"
                    disabled={!canEdit}
                  />
                  <span className="label">Asymptomatic</span>
                </label>
              </div>
            </div>
          </div>

          {/* Additional Clinical Details */}
          <div className="card">
            <h3 className="form-section-title">Additional Clinical Details</h3>
            <div className="space-y-4">
              <div>
                <label className="label">Evolution and Progression of Lesions</label>
                <textarea
                  name="evolutionAndProgression"
                  value={formData.evolutionAndProgression}
                  onChange={handleInputChange}
                  className="input min-h-[60px]"
                  disabled={!canEdit}
                  rows="2"
                />
              </div>

              <div>
                <label className="label">Aggravation on Exposure to Sunlight</label>
                <input
                  type="text"
                  name="aggravationOnSunlight"
                  value={formData.aggravationOnSunlight}
                  onChange={handleInputChange}
                  className="input"
                  disabled={!canEdit}
                />
              </div>

              <div>
                <label className="label">Atopy History</label>
                <textarea
                  name="atopyHistory"
                  value={formData.atopyHistory}
                  onChange={handleInputChange}
                  className="input min-h-[60px]"
                  disabled={!canEdit}
                  rows="2"
                />
              </div>
            </div>
          </div>

          {/* Exposure Table */}
          <div className="card">
            <h3 className="form-section-title">Exposure To</h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 px-4 py-2 text-left">Substance/Industry</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Details/Notes</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2 font-medium">Parthenium plant</td>
                    <td className="border border-gray-300 px-4 py-2">
                      <input
                        type="text"
                        name="partheniumPlant"
                        value={formData.exposureTable.partheniumPlant}
                        onChange={(e) => handleInputChange(e, 'exposureTable')}
                        className="input"
                        disabled={!canEdit}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2 font-medium">Printing and photography work</td>
                    <td className="border border-gray-300 px-4 py-2">
                      <input
                        type="text"
                        name="printingPhotographyWork"
                        value={formData.exposureTable.printingPhotographyWork}
                        onChange={(e) => handleInputChange(e, 'exposureTable')}
                        className="input"
                        disabled={!canEdit}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2 font-medium">Cement</td>
                    <td className="border border-gray-300 px-4 py-2">
                      <input
                        type="text"
                        name="cement"
                        value={formData.exposureTable.cement}
                        onChange={(e) => handleInputChange(e, 'exposureTable')}
                        className="input"
                        disabled={!canEdit}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2 font-medium">Topical medication</td>
                    <td className="border border-gray-300 px-4 py-2">
                      <input
                        type="text"
                        name="topicalMedication"
                        value={formData.exposureTable.topicalMedication}
                        onChange={(e) => handleInputChange(e, 'exposureTable')}
                        className="input"
                        disabled={!canEdit}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2 font-medium">Detergent</td>
                    <td className="border border-gray-300 px-4 py-2">
                      <input
                        type="text"
                        name="detergent"
                        value={formData.exposureTable.detergent}
                        onChange={(e) => handleInputChange(e, 'exposureTable')}
                        className="input"
                        disabled={!canEdit}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2 font-medium">Antibacterial agents, mouth wash</td>
                    <td className="border border-gray-300 px-4 py-2">
                      <input
                        type="text"
                        name="antibacterialAgents"
                        value={formData.exposureTable.antibacterialAgents}
                        onChange={(e) => handleInputChange(e, 'exposureTable')}
                        className="input"
                        disabled={!canEdit}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2 font-medium">New footwear</td>
                    <td className="border border-gray-300 px-4 py-2">
                      <input
                        type="text"
                        name="newFootwear"
                        value={formData.exposureTable.newFootwear}
                        onChange={(e) => handleInputChange(e, 'exposureTable')}
                        className="input"
                        disabled={!canEdit}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2 font-medium">Bleach</td>
                    <td className="border border-gray-300 px-4 py-2">
                      <input
                        type="text"
                        name="bleach"
                        value={formData.exposureTable.bleach}
                        onChange={(e) => handleInputChange(e, 'exposureTable')}
                        className="input"
                        disabled={!canEdit}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2 font-medium">Shampoo, nail polish</td>
                    <td className="border border-gray-300 px-4 py-2">
                      <input
                        type="text"
                        name="shampooNailPolish"
                        value={formData.exposureTable.shampooNailPolish}
                        onChange={(e) => handleInputChange(e, 'exposureTable')}
                        className="input"
                        disabled={!canEdit}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2 font-medium">Lesion around</td>
                    <td className="border border-gray-300 px-4 py-2">
                      <input
                        type="text"
                        name="lesionAround"
                        value={formData.exposureTable.lesionAround}
                        onChange={(e) => handleInputChange(e, 'exposureTable')}
                        className="input"
                        disabled={!canEdit}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2 font-medium">Textile industry</td>
                    <td className="border border-gray-300 px-4 py-2">
                      <input
                        type="text"
                        name="textileIndustry"
                        value={formData.exposureTable.textileIndustry}
                        onChange={(e) => handleInputChange(e, 'exposureTable')}
                        className="input"
                        disabled={!canEdit}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2 font-medium">Earrings, bangles, hooks, pin</td>
                    <td className="border border-gray-300 px-4 py-2">
                      <input
                        type="text"
                        name="earringsBangles"
                        value={formData.exposureTable.earringsBangles}
                        onChange={(e) => handleInputChange(e, 'exposureTable')}
                        className="input"
                        disabled={!canEdit}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2 font-medium">Rubber industry</td>
                    <td className="border border-gray-300 px-4 py-2">
                      <input
                        type="text"
                        name="rubberIndustry"
                        value={formData.exposureTable.rubberIndustry}
                        onChange={(e) => handleInputChange(e, 'exposureTable')}
                        className="input"
                        disabled={!canEdit}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2 font-medium">Polish, paint, ink</td>
                    <td className="border border-gray-300 px-4 py-2">
                      <input
                        type="text"
                        name="polishPaintInk"
                        value={formData.exposureTable.polishPaintInk}
                        onChange={(e) => handleInputChange(e, 'exposureTable')}
                        className="input"
                        disabled={!canEdit}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2 font-medium">Leather industry</td>
                    <td className="border border-gray-300 px-4 py-2">
                      <input
                        type="text"
                        name="leatherIndustry"
                        value={formData.exposureTable.leatherIndustry}
                        onChange={(e) => handleInputChange(e, 'exposureTable')}
                        className="input"
                        disabled={!canEdit}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2 font-medium">Antiperspirant, deodorant</td>
                    <td className="border border-gray-300 px-4 py-2">
                      <input
                        type="text"
                        name="antiperspirantDeodorant"
                        value={formData.exposureTable.antiperspirantDeodorant}
                        onChange={(e) => handleInputChange(e, 'exposureTable')}
                        className="input"
                        disabled={!canEdit}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2 font-medium">Fungicides, insecticides</td>
                    <td className="border border-gray-300 px-4 py-2">
                      <input
                        type="text"
                        name="fungicidesInsecticides"
                        value={formData.exposureTable.fungicidesInsecticides}
                        onChange={(e) => handleInputChange(e, 'exposureTable')}
                        className="input"
                        disabled={!canEdit}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2 font-medium">Pharmaceuticals</td>
                    <td className="border border-gray-300 px-4 py-2">
                      <input
                        type="text"
                        name="pharmaceuticals"
                        value={formData.exposureTable.pharmaceuticals}
                        onChange={(e) => handleInputChange(e, 'exposureTable')}
                        className="input"
                        disabled={!canEdit}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2 font-medium">Hair dye, cosmetics</td>
                    <td className="border border-gray-300 px-4 py-2">
                      <input
                        type="text"
                        name="hairDyeCosmetics"
                        value={formData.exposureTable.hairDyeCosmetics}
                        onChange={(e) => handleInputChange(e, 'exposureTable')}
                        className="input"
                        disabled={!canEdit}
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Past History and Treatment */}
          <div className="card">
            <h3 className="form-section-title">Past History and Treatment</h3>
            <div className="space-y-4">
              <div>
                <label className="label">Others (if any)</label>
                <textarea
                  name="othersIfAny"
                  value={formData.othersIfAny}
                  onChange={handleInputChange}
                  className="input min-h-[60px]"
                  disabled={!canEdit}
                  rows="2"
                />
              </div>

              <div>
                <label className="label">Past History</label>
                <textarea
                  name="pastHistory"
                  value={formData.pastHistory}
                  onChange={handleInputChange}
                  className="input min-h-[80px]"
                  disabled={!canEdit}
                  rows="3"
                />
              </div>

              <div>
                <label className="label">Treatment Taken Previously</label>
                <textarea
                  name="treatmentTakenPreviously"
                  value={formData.treatmentTakenPreviously}
                  onChange={handleInputChange}
                  className="input min-h-[80px]"
                  disabled={!canEdit}
                  rows="3"
                />
              </div>
            </div>
          </div>

          {/* Cutaneous Examination */}
          <div className="card">
            <h3 className="form-section-title">Cutaneous Examination</h3>
            <div className="space-y-4">
              <div>
                <label className="label">Morphology</label>
                <textarea
                  name="morphology"
                  value={formData.morphology}
                  onChange={handleInputChange}
                  className="input min-h-[60px]"
                  disabled={!canEdit}
                  rows="2"
                />
              </div>

              <div>
                <label className="label">Configuration</label>
                <textarea
                  name="configuration"
                  value={formData.configuration}
                  onChange={handleInputChange}
                  className="input min-h-[60px]"
                  disabled={!canEdit}
                  rows="2"
                />
              </div>

              <div>
                <label className="label">Distribution</label>
                <textarea
                  name="distribution"
                  value={formData.distribution}
                  onChange={handleInputChange}
                  className="input min-h-[60px]"
                  disabled={!canEdit}
                  rows="2"
                />
              </div>
            </div>
          </div>

          {/* Diagnosis */}
          <div className="card">
            <h3 className="form-section-title">Diagnosis</h3>
            <div className="space-y-4">
              <div>
                <label className="label">Provisional Diagnosis</label>
                <textarea
                  name="provisionalDiagnosis"
                  value={formData.provisionalDiagnosis}
                  onChange={handleInputChange}
                  className="input min-h-[60px]"
                  disabled={!canEdit}
                  rows="2"
                />
              </div>

              <div>
                <label className="label">Expected Allergens</label>
                <textarea
                  name="expectedAllergens"
                  value={formData.expectedAllergens}
                  onChange={handleInputChange}
                  className="input min-h-[80px]"
                  disabled={!canEdit}
                  rows="3"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          {canEdit && (
            <div className="flex justify-center pb-6">
              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary flex items-center space-x-2 px-8 py-3"
              >
                <FaSave />
                <span>{loading ? 'Saving...' : (editMode ? 'Update Patient' : 'Save Patient')}</span>
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default ContactDermatitisForm;
