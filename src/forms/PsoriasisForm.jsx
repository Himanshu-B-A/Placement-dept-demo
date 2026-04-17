import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/Navbar';
import { FaSave, FaArrowLeft } from 'react-icons/fa';

const PsoriasisForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser, userRole } = useAuth();
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const canEdit = userRole === 'faculty' || userRole === 'hod' || !id;

  const [formData, setFormData] = useState({
    // Basic Information
    dateOfAssessment: '',
    patientNumber: '',
    patientInitials: '',
    typeOfVisit: '',

    // A. Demographic Data
    gender: '',
    age: '',
    maritalStatus: '',
    occupation: '',

    // B. Case History
    psoriasisBeginAge: '',

    // C. Family History
    familyHistory: '',
    familyHistoryFather: false,
    familyHistoryMother: false,
    familyHistoryChildren: false,
    familyHistorySibling: '',
    familyHistoryOtherRelative: '',

    // D. Aggravating Factors
    aggravatingFactors: '',
    aggravatingStress: false,
    aggravatingStressDetails: '',
    aggravatingInfection: false,
    aggravatingInfectionDetails: '',
    aggravatingSmoking: false,
    aggravatingAlcohol: false,
    aggravatingTrauma: false,
    aggravatingDrugs: false,
    aggravatingDrugsDetails: '',
    aggravatingTopicalRx: false,
    aggravatingTopicalRxDetails: '',
    aggravatingOthersSpecify: '',

    // E. Disease Burden
    clinicalVisits0: false,
    clinicalVisits1: false,
    clinicalVisits2: false,
    clinicalVisits3: false,
    clinicalVisits4: false,
    clinicalVisitsGt4: false,
    
    hospitalAdmissions0: false,
    hospitalAdmissions1: false,
    hospitalAdmissions2: false,
    hospitalAdmissions3: false,
    hospitalAdmissions4: false,
    hospitalAdmissionsGt4: false,
    
    daysOffWork7: false,
    daysOffWork14: false,
    daysOffWork28: false,
    daysOffWork28Plus: false,

    // F. Co-morbid Diseases
    obesity: '',
    obesityDuration: '',
    hypertension: '',
    hypertensionDuration: '',
    dyslipidemia: '',
    dyslipidemiaDuration: '',
    ischaemicHeartDisease: '',
    ischaemicHeartDiseaseDuration: '',
    cerebrovascularDisease: '',
    cerebrovascularDiseaseDuration: '',
    nephropathy: '',
    nephropathyDuration: '',
    peripheralArterialDisease: '',
    peripheralArterialDiseaseDuration: '',
    otherComorbidSpecify: '',
    otherComorbidDuration: '',

    // G. Personal History
    smoking: '',
    smokingQuantityDuration: '',
    alcohol: '',
    alcoholQuantityDuration: '',

    // H. Type of Psoriasis
    typePlaque: false,
    typeFlexuralInverse: false,
    typePalmoplantar: false,
    typePsoriaticArthritis: false,
    typeGuttate: false,
    typeGeneralizedPustular: false,
    typeOthersSpecify: '',
    typeErythrodermic: false,
    typeLocalizedPustular: false,

    // I. PASI - Plaque Characteristics
    pasiErythemaHead: '',
    pasiErythemaUpperLimbs: '',
    pasiErythemaTrunk: '',
    pasiErythemaLowerLimbs: '',
    
    pasiIndurationHead: '',
    pasiIndurationUpperLimbs: '',
    pasiIndurationTrunk: '',
    pasiIndurationLowerLimbs: '',
    
    pasiDesquamationHead: '',
    pasiDesquamationUpperLimbs: '',
    pasiDesquamationTrunk: '',
    pasiDesquamationLowerLimbs: '',

    // J. PASI Area Score
    pasiAreaScoreHead: '',
    pasiAreaScoreUpperLimbs: '',
    pasiAreaScoreTrunk: '',
    pasiAreaScoreLowerLimbs: '',

    // K. Nail Involvement
    nailInvolvement: '',
    nailPitting: false,
    nailOnycholysis: false,
    nailDiscoloration: false,
    nailTypicalDystrophy: false,
    nailSubungalHyperkeratosis: false,

    // L. Topical Therapy
    topicalTarPreparation: '',
    topicalTarGenericName: '',
    topicalTarDosage: '',
    topicalTarDuration: '',
    
    topicalAnthralin: '',
    topicalAnthralinGenericName: '',
    topicalAnthralinDosage: '',
    topicalAnthralinDuration: '',
    
    topicalVitaminD3: '',
    topicalVitaminD3GenericName: '',
    topicalVitaminD3Dosage: '',
    topicalVitaminD3Duration: '',
    
    topicalCorticosteroid: '',
    topicalCorticosteroidGenericName: '',
    topicalCorticosteroidDosage: '',
    topicalCorticosteroidDuration: '',
    
    topicalVitaminDCorticosteroid: '',
    topicalVitaminDCorticosteroidGenericName: '',
    topicalVitaminDCorticosteroidDosage: '',
    topicalVitaminDCorticosteroidDuration: '',
    
    topicalKeratolytics: '',
    topicalKeratolyticsGenericName: '',
    topicalKeratolyticsDosage: '',
    topicalKeratolyticsDuration: '',
    
    topicalEmollient: '',
    topicalEmollientGenericName: '',
    topicalEmollientDosage: '',
    topicalEmollientDuration: '',
    
    topicalOthersSpecify: '',
    topicalOthersGenericName: '',
    topicalOthersDosage: '',
    topicalOthersDuration: '',

    // Systemic Therapy
    systemicMethotrexate: '',
    systemicMethotrexateGenericName: '',
    systemicMethotrexateDosage: '',
    systemicMethotrexateDuration: '',
    
    systemicAcitretin: '',
    systemicAcitretinGenericName: '',
    systemicAcitretinDosage: '',
    systemicAcitretinDuration: '',
    
    systemicSulphasalazine: '',
    systemicSulphasalazineGenericName: '',
    systemicSulphasalazineDosage: '',
    systemicSulphasalazineDuration: '',
    
    systemicCyclosporin: '',
    systemicCyclosporinGenericName: '',
    systemicCyclosporinDosage: '',
    systemicCyclosporinDuration: '',
    
    systemicHydroxyurea: '',
    systemicHydroxyureaGenericName: '',
    systemicHydroxyureaDosage: '',
    systemicHydroxyureaDuration: '',
    
    systemicCorticosteroids: '',
    systemicCorticosteroidsGenericName: '',
    systemicCorticosteroidsDosage: '',
    systemicCorticosteroidsDuration: '',
    
    systemicBiologicals: '',
    systemicBiologicalsGenericName: '',
    systemicBiologicalsDosage: '',
    systemicBiologicalsDuration: '',
    
    systemicLeflunomide: '',
    systemicLeflunomideGenericName: '',
    systemicLeflunomideDosage: '',
    systemicLeflunomideDuration: '',
    
    systemicMycophenolate: '',
    systemicMycophenolateGenericName: '',
    systemicMycophenolateDosage: '',
    systemicMycophenolateDuration: '',
    
    systemicOthersSpecify: '',
    systemicOthersGenericName: '',
    systemicOthersDosage: '',
    systemicOthersDuration: '',

    // Photo Therapy
    photoTherapy: '',
    photoBBUVB: false,
    photoNBUVB: false,
    photoOralPUVA: false,
    photoBathPUVA: false,
    photoTopicalPUVA: false,
    photoExcimerLaser: false,
    photoOthersSpecify: ''
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

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
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
            formType: 'Psoriasis Assessment',
            data: formData,
            createdBy: currentUser.email,
            createdAt: new Date().toISOString(),
            lastModifiedBy: currentUser.email,
            lastModifiedAt: new Date().toISOString()
          });
        } else {
          await setDoc(newDocRef, {
            formType: 'Psoriasis Assessment',
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
              NATIONAL PSORIASIS REGISTRY
            </h1>
            <p className="text-center text-gray-600 text-sm mt-2">
              Patient Registration Form
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          {/* Basic Information */}
          <div className="card">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="label">Date of Assessment</label>
                <input
                  type="date"
                  name="dateOfAssessment"
                  value={formData.dateOfAssessment}
                  onChange={handleInputChange}
                  className="input"
                  disabled={!canEdit}
                />
              </div>

              <div>
                <label className="label">Patient Number</label>
                <input
                  type="text"
                  name="patientNumber"
                  value={formData.patientNumber}
                  onChange={handleInputChange}
                  className="input"
                  disabled={!canEdit}
                />
              </div>

              <div>
                <label className="label">Patient Initials</label>
                <input
                  type="text"
                  name="patientInitials"
                  value={formData.patientInitials}
                  onChange={handleInputChange}
                  className="input"
                  disabled={!canEdit}
                  required
                />
              </div>
            </div>
          </div>

          {/* Type of Visit */}
          <div className="card">
            <h3 className="form-section-title">Type of Visit</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="typeOfVisit"
                  value="New Case of Psoriasis"
                  checked={formData.typeOfVisit === 'New Case of Psoriasis'}
                  onChange={handleInputChange}
                  className="radio"
                  disabled={!canEdit}
                />
                <span className="label">New Case of Psoriasis</span>
              </label>

              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="typeOfVisit"
                  value="Follow-Up of Psoriasis"
                  checked={formData.typeOfVisit === 'Follow-Up of Psoriasis'}
                  onChange={handleInputChange}
                  className="radio"
                  disabled={!canEdit}
                />
                <span className="label">Follow-Up of Psoriasis</span>
              </label>
            </div>
          </div>

          {/* A. Demographic Data */}
          <div className="card">
            <h3 className="form-section-title">A. Demographic Data</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="label">Gender</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className="input"
                  disabled={!canEdit}
                >
                  <option value="">Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>

              <div>
                <label className="label">Age (Years)</label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleInputChange}
                  className="input"
                  disabled={!canEdit}
                />
              </div>

              <div>
                <label className="label">Marital Status</label>
                <select
                  name="maritalStatus"
                  value={formData.maritalStatus}
                  onChange={handleInputChange}
                  className="input"
                  disabled={!canEdit}
                >
                  <option value="">Select</option>
                  <option value="Single">Single</option>
                  <option value="Married">Married</option>
                </select>
              </div>

              <div>
                <label className="label">Occupation</label>
                <select
                  name="occupation"
                  value={formData.occupation}
                  onChange={handleInputChange}
                  className="input"
                  disabled={!canEdit}
                >
                  <option value="">Select</option>
                  <option value="Student">Student</option>
                  <option value="Employed">Employed</option>
                  <option value="At Home">At Home</option>
                </select>
              </div>
            </div>
          </div>

          {/* B. Case History */}
          <div className="card">
            <h3 className="form-section-title">B. Case History: Psoriasis</h3>
            <div>
              <label className="label">At What Age did Psoriasis Begin? (Years)</label>
              <input
                type="number"
                name="psoriasisBeginAge"
                value={formData.psoriasisBeginAge}
                onChange={handleInputChange}
                className="input"
                disabled={!canEdit}
              />
            </div>
          </div>

          {/* C. Family History */}
          <div className="card">
            <h3 className="form-section-title">C. Family History of Psoriasis</h3>
            <div className="space-y-4">
              <div>
                <label className="label font-semibold">Do you have family history?</label>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="familyHistory"
                      value="Yes"
                      checked={formData.familyHistory === 'Yes'}
                      onChange={handleInputChange}
                      className="radio"
                      disabled={!canEdit}
                    />
                    <span>Yes</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="familyHistory"
                      value="No"
                      checked={formData.familyHistory === 'No'}
                      onChange={handleInputChange}
                      className="radio"
                      disabled={!canEdit}
                    />
                    <span>No</span>
                  </label>
                </div>
              </div>

              {formData.familyHistory === 'Yes' && (
                <div className="space-y-3 ml-4">
                  <p className="text-sm font-medium text-gray-700">If Yes Please tick One or Multiple of the following</p>
                  
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="familyHistoryFather"
                      checked={formData.familyHistoryFather}
                      onChange={handleInputChange}
                      className="checkbox"
                      disabled={!canEdit}
                    />
                    <span>Father</span>
                  </label>

                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="familyHistoryMother"
                      checked={formData.familyHistoryMother}
                      onChange={handleInputChange}
                      className="checkbox"
                      disabled={!canEdit}
                    />
                    <span>Mother</span>
                  </label>

                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="familyHistoryChildren"
                      checked={formData.familyHistoryChildren}
                      onChange={handleInputChange}
                      className="checkbox"
                      disabled={!canEdit}
                    />
                    <span>Children</span>
                  </label>

                  <div>
                    <label className="label">Sibling Specify</label>
                    <input
                      type="text"
                      name="familyHistorySibling"
                      value={formData.familyHistorySibling}
                      onChange={handleInputChange}
                      className="input"
                      disabled={!canEdit}
                    />
                  </div>

                  <div>
                    <label className="label">Other Relative Specify</label>
                    <input
                      type="text"
                      name="familyHistoryOtherRelative"
                      value={formData.familyHistoryOtherRelative}
                      onChange={handleInputChange}
                      className="input"
                      disabled={!canEdit}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* D. Aggravating Factors */}
          <div className="card">
            <h3 className="form-section-title">D. Aggravating Factors for Psoriasis</h3>
            <div className="space-y-4">
              <div>
                <div className="grid grid-cols-2 gap-4 mb-3">
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="aggravatingFactors"
                      value="Yes"
                      checked={formData.aggravatingFactors === 'Yes'}
                      onChange={handleInputChange}
                      className="radio"
                      disabled={!canEdit}
                    />
                    <span>Yes</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="aggravatingFactors"
                      value="No"
                      checked={formData.aggravatingFactors === 'No'}
                      onChange={handleInputChange}
                      className="radio"
                      disabled={!canEdit}
                    />
                    <span>No</span>
                  </label>
                </div>

                {formData.aggravatingFactors === 'Yes' && (
                  <div className="space-y-3 ml-4">
                    <p className="text-sm font-medium text-gray-700 mb-3">If Yes please tick One or Multiple of the Following</p>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            name="aggravatingStress"
                            checked={formData.aggravatingStress}
                            onChange={handleInputChange}
                            className="checkbox"
                            disabled={!canEdit}
                          />
                          <span>Stress</span>
                        </label>
                        {formData.aggravatingStress && (
                          <input
                            type="text"
                            name="aggravatingStressDetails"
                            value={formData.aggravatingStressDetails}
                            onChange={handleInputChange}
                            className="input mt-2 ml-6"
                            disabled={!canEdit}
                            placeholder="Details"
                          />
                        )}
                      </div>

                      <div>
                        <label className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            name="aggravatingSmoking"
                            checked={formData.aggravatingSmoking}
                            onChange={handleInputChange}
                            className="checkbox"
                            disabled={!canEdit}
                          />
                          <span>Smoking</span>
                        </label>
                      </div>

                      <div>
                        <label className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            name="aggravatingAlcohol"
                            checked={formData.aggravatingAlcohol}
                            onChange={handleInputChange}
                            className="checkbox"
                            disabled={!canEdit}
                          />
                          <span>Alcohol</span>
                        </label>
                      </div>

                      <div>
                        <label className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            name="aggravatingTrauma"
                            checked={formData.aggravatingTrauma}
                            onChange={handleInputChange}
                            className="checkbox"
                            disabled={!canEdit}
                          />
                          <span>Trauma</span>
                        </label>
                      </div>
                    </div>

                    <div>
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          name="aggravatingInfection"
                          checked={formData.aggravatingInfection}
                          onChange={handleInputChange}
                          className="checkbox"
                          disabled={!canEdit}
                        />
                        <span>Infection</span>
                      </label>
                      {formData.aggravatingInfection && (
                        <input
                          type="text"
                          name="aggravatingInfectionDetails"
                          value={formData.aggravatingInfectionDetails}
                          onChange={handleInputChange}
                          className="input mt-2 ml-6"
                          disabled={!canEdit}
                          placeholder="Details"
                        />
                      )}
                    </div>

                    <div>
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          name="aggravatingDrugs"
                          checked={formData.aggravatingDrugs}
                          onChange={handleInputChange}
                          className="checkbox"
                          disabled={!canEdit}
                        />
                        <span>Drugs</span>
                      </label>
                      {formData.aggravatingDrugs && (
                        <input
                          type="text"
                          name="aggravatingDrugsDetails"
                          value={formData.aggravatingDrugsDetails}
                          onChange={handleInputChange}
                          className="input mt-2 ml-6"
                          disabled={!canEdit}
                          placeholder="Details"
                        />
                      )}
                    </div>

                    <div>
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          name="aggravatingTopicalRx"
                          checked={formData.aggravatingTopicalRx}
                          onChange={handleInputChange}
                          className="checkbox"
                          disabled={!canEdit}
                        />
                        <span>Topical Rx</span>
                      </label>
                      {formData.aggravatingTopicalRx && (
                        <input
                          type="text"
                          name="aggravatingTopicalRxDetails"
                          value={formData.aggravatingTopicalRxDetails}
                          onChange={handleInputChange}
                          className="input mt-2 ml-6"
                          disabled={!canEdit}
                          placeholder="Details"
                        />
                      )}
                    </div>

                    <div>
                      <label className="label">Others Specify</label>
                      <input
                        type="text"
                        name="aggravatingOthersSpecify"
                        value={formData.aggravatingOthersSpecify}
                        onChange={handleInputChange}
                        className="input"
                        disabled={!canEdit}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* E. Disease Burden */}
          <div className="card">
            <h3 className="form-section-title">E. Disease Burden of Psoriasis in the Past Six Months</h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 px-4 py-2 text-left">Disease Burden</th>
                    <th className="border border-gray-300 px-4 py-2 text-center" colSpan="6">Number of Days</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2">Number of Clinical visits due to Psoriasis</td>
                    <td className="border border-gray-300 px-2 py-2 text-center">
                      <label className="flex items-center justify-center space-x-1">
                        <input type="checkbox" name="clinicalVisits0" checked={formData.clinicalVisits0} onChange={handleInputChange} className="checkbox" disabled={!canEdit} />
                        <span className="text-sm">0</span>
                      </label>
                    </td>
                    <td className="border border-gray-300 px-2 py-2 text-center">
                      <label className="flex items-center justify-center space-x-1">
                        <input type="checkbox" name="clinicalVisits1" checked={formData.clinicalVisits1} onChange={handleInputChange} className="checkbox" disabled={!canEdit} />
                        <span className="text-sm">1</span>
                      </label>
                    </td>
                    <td className="border border-gray-300 px-2 py-2 text-center">
                      <label className="flex items-center justify-center space-x-1">
                        <input type="checkbox" name="clinicalVisits2" checked={formData.clinicalVisits2} onChange={handleInputChange} className="checkbox" disabled={!canEdit} />
                        <span className="text-sm">2</span>
                      </label>
                    </td>
                    <td className="border border-gray-300 px-2 py-2 text-center">
                      <label className="flex items-center justify-center space-x-1">
                        <input type="checkbox" name="clinicalVisits3" checked={formData.clinicalVisits3} onChange={handleInputChange} className="checkbox" disabled={!canEdit} />
                        <span className="text-sm">3</span>
                      </label>
                    </td>
                    <td className="border border-gray-300 px-2 py-2 text-center">
                      <label className="flex items-center justify-center space-x-1">
                        <input type="checkbox" name="clinicalVisits4" checked={formData.clinicalVisits4} onChange={handleInputChange} className="checkbox" disabled={!canEdit} />
                        <span className="text-sm">4</span>
                      </label>
                    </td>
                    <td className="border border-gray-300 px-2 py-2 text-center">
                      <label className="flex items-center justify-center space-x-1">
                        <input type="checkbox" name="clinicalVisitsGt4" checked={formData.clinicalVisitsGt4} onChange={handleInputChange} className="checkbox" disabled={!canEdit} />
                        <span className="text-sm">&gt;4</span>
                      </label>
                    </td>
                  </tr>

                  <tr>
                    <td className="border border-gray-300 px-4 py-2">Number of Hospital admissions due to psoriasis</td>
                    <td className="border border-gray-300 px-2 py-2 text-center">
                      <label className="flex items-center justify-center space-x-1">
                        <input type="checkbox" name="hospitalAdmissions0" checked={formData.hospitalAdmissions0} onChange={handleInputChange} className="checkbox" disabled={!canEdit} />
                        <span className="text-sm">0</span>
                      </label>
                    </td>
                    <td className="border border-gray-300 px-2 py-2 text-center">
                      <label className="flex items-center justify-center space-x-1">
                        <input type="checkbox" name="hospitalAdmissions1" checked={formData.hospitalAdmissions1} onChange={handleInputChange} className="checkbox" disabled={!canEdit} />
                        <span className="text-sm">1</span>
                      </label>
                    </td>
                    <td className="border border-gray-300 px-2 py-2 text-center">
                      <label className="flex items-center justify-center space-x-1">
                        <input type="checkbox" name="hospitalAdmissions2" checked={formData.hospitalAdmissions2} onChange={handleInputChange} className="checkbox" disabled={!canEdit} />
                        <span className="text-sm">2</span>
                      </label>
                    </td>
                    <td className="border border-gray-300 px-2 py-2 text-center">
                      <label className="flex items-center justify-center space-x-1">
                        <input type="checkbox" name="hospitalAdmissions3" checked={formData.hospitalAdmissions3} onChange={handleInputChange} className="checkbox" disabled={!canEdit} />
                        <span className="text-sm">3</span>
                      </label>
                    </td>
                    <td className="border border-gray-300 px-2 py-2 text-center">
                      <label className="flex items-center justify-center space-x-1">
                        <input type="checkbox" name="hospitalAdmissions4" checked={formData.hospitalAdmissions4} onChange={handleInputChange} className="checkbox" disabled={!canEdit} />
                        <span className="text-sm">4</span>
                      </label>
                    </td>
                    <td className="border border-gray-300 px-2 py-2 text-center">
                      <label className="flex items-center justify-center space-x-1">
                        <input type="checkbox" name="hospitalAdmissionsGt4" checked={formData.hospitalAdmissionsGt4} onChange={handleInputChange} className="checkbox" disabled={!canEdit} />
                        <span className="text-sm">&gt;4</span>
                      </label>
                    </td>
                  </tr>

                  <tr>
                    <td className="border border-gray-300 px-4 py-2">Number of Days off Work / School due to psoriasis</td>
                    <td className="border border-gray-300 px-2 py-2 text-center" colSpan="2">
                      <label className="flex items-center justify-center space-x-1">
                        <input type="checkbox" name="daysOffWork7" checked={formData.daysOffWork7} onChange={handleInputChange} className="checkbox" disabled={!canEdit} />
                        <span className="text-sm">&lt;7</span>
                      </label>
                    </td>
                    <td className="border border-gray-300 px-2 py-2 text-center" colSpan="2">
                      <label className="flex items-center justify-center space-x-1">
                        <input type="checkbox" name="daysOffWork14" checked={formData.daysOffWork14} onChange={handleInputChange} className="checkbox" disabled={!canEdit} />
                        <span className="text-sm">7-14</span>
                      </label>
                    </td>
                    <td className="border border-gray-300 px-2 py-2 text-center">
                      <label className="flex items-center justify-center space-x-1">
                        <input type="checkbox" name="daysOffWork28" checked={formData.daysOffWork28} onChange={handleInputChange} className="checkbox" disabled={!canEdit} />
                        <span className="text-sm">14-28</span>
                      </label>
                    </td>
                    <td className="border border-gray-300 px-2 py-2 text-center">
                      <label className="flex items-center justify-center space-x-1">
                        <input type="checkbox" name="daysOffWork28Plus" checked={formData.daysOffWork28Plus} onChange={handleInputChange} className="checkbox" disabled={!canEdit} />
                        <span className="text-sm">&gt;28</span>
                      </label>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* F. Co-morbid Diseases */}
          <div className="card">
            <h3 className="form-section-title">F. Co-morbid Diseases</h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 px-4 py-2 text-left">Co-morbid Diseases</th>
                    <th className="border border-gray-300 px-4 py-2 text-center">Present</th>
                    <th className="border border-gray-300 px-4 py-2 text-center">Absent</th>
                    <th className="border border-gray-300 px-4 py-2 text-center">Not Known</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">If Present: Duration In Yrs</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { name: 'Obesity', field: 'obesity' },
                    { name: 'Hypertension', field: 'hypertension' },
                    { name: 'Dyslipidemia', field: 'dyslipidemia' },
                    { name: 'Ischaemic Heart Disease', field: 'ischaemicHeartDisease' },
                    { name: 'Cerebrovascular Disease', field: 'cerebrovascularDisease' },
                    { name: 'Nephropathy', field: 'nephropathy' },
                    { name: 'Peripheral Arterial Disease', field: 'peripheralArterialDisease' },
                    { name: 'Others Specify', field: 'otherComorbidSpecify' }
                  ].map((disease) => (
                    <tr key={disease.field}>
                      <td className="border border-gray-300 px-4 py-2">{disease.name}</td>
                      <td className="border border-gray-300 px-2 py-2 text-center">
                        <input
                          type="radio"
                          name={disease.field}
                          value="Present"
                          checked={formData[disease.field] === 'Present'}
                          onChange={handleInputChange}
                          className="radio"
                          disabled={!canEdit}
                        />
                      </td>
                      <td className="border border-gray-300 px-2 py-2 text-center">
                        <input
                          type="radio"
                          name={disease.field}
                          value="Absent"
                          checked={formData[disease.field] === 'Absent'}
                          onChange={handleInputChange}
                          className="radio"
                          disabled={!canEdit}
                        />
                      </td>
                      <td className="border border-gray-300 px-2 py-2 text-center">
                        <input
                          type="radio"
                          name={disease.field}
                          value="Not Known"
                          checked={formData[disease.field] === 'Not Known'}
                          onChange={handleInputChange}
                          className="radio"
                          disabled={!canEdit}
                        />
                      </td>
                      <td className="border border-gray-300 px-2 py-2">
                        <input
                          type="text"
                          name={`${disease.field}Duration`}
                          value={formData[`${disease.field}Duration`]}
                          onChange={handleInputChange}
                          className="input"
                          disabled={!canEdit}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* G. Personal History */}
          <div className="card">
            <h3 className="form-section-title">G. Personal History</h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 px-4 py-2 text-left">Personal (Tick appropriately)</th>
                    <th className="border border-gray-300 px-4 py-2 text-center">Yes</th>
                    <th className="border border-gray-300 px-4 py-2 text-center">No</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">If Yes: Quantity/Day & Duration in Years</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2">Smoking</td>
                    <td className="border border-gray-300 px-2 py-2 text-center">
                      <input
                        type="radio"
                        name="smoking"
                        value="Yes"
                        checked={formData.smoking === 'Yes'}
                        onChange={handleInputChange}
                        className="radio"
                        disabled={!canEdit}
                      />
                    </td>
                    <td className="border border-gray-300 px-2 py-2 text-center">
                      <input
                        type="radio"
                        name="smoking"
                        value="No"
                        checked={formData.smoking === 'No'}
                        onChange={handleInputChange}
                        className="radio"
                        disabled={!canEdit}
                      />
                    </td>
                    <td className="border border-gray-300 px-2 py-2">
                      <input
                        type="text"
                        name="smokingQuantityDuration"
                        value={formData.smokingQuantityDuration}
                        onChange={handleInputChange}
                        className="input"
                        disabled={!canEdit}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2">Alcohol</td>
                    <td className="border border-gray-300 px-2 py-2 text-center">
                      <input
                        type="radio"
                        name="alcohol"
                        value="Yes"
                        checked={formData.alcohol === 'Yes'}
                        onChange={handleInputChange}
                        className="radio"
                        disabled={!canEdit}
                      />
                    </td>
                    <td className="border border-gray-300 px-2 py-2 text-center">
                      <input
                        type="radio"
                        name="alcohol"
                        value="No"
                        checked={formData.alcohol === 'No'}
                        onChange={handleInputChange}
                        className="radio"
                        disabled={!canEdit}
                      />
                    </td>
                    <td className="border border-gray-300 px-2 py-2">
                      <input
                        type="text"
                        name="alcoholQuantityDuration"
                        value={formData.alcoholQuantityDuration}
                        onChange={handleInputChange}
                        className="input"
                        disabled={!canEdit}
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* H. Type of Psoriasis */}
          <div className="card">
            <h3 className="form-section-title">H. Type of Psoriasis</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="typePlaque"
                  checked={formData.typePlaque}
                  onChange={handleInputChange}
                  className="checkbox"
                  disabled={!canEdit}
                />
                <span>Plaque</span>
              </label>

              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="typeFlexuralInverse"
                  checked={formData.typeFlexuralInverse}
                  onChange={handleInputChange}
                  className="checkbox"
                  disabled={!canEdit}
                />
                <span>Flexural/Inverse</span>
              </label>

              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="typePalmoplantar"
                  checked={formData.typePalmoplantar}
                  onChange={handleInputChange}
                  className="checkbox"
                  disabled={!canEdit}
                />
                <span>Palmoplantar non-pustular</span>
              </label>

              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="typePsoriaticArthritis"
                  checked={formData.typePsoriaticArthritis}
                  onChange={handleInputChange}
                  className="checkbox"
                  disabled={!canEdit}
                />
                <span>Psoriatic Arthritis</span>
              </label>

              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="typeGuttate"
                  checked={formData.typeGuttate}
                  onChange={handleInputChange}
                  className="checkbox"
                  disabled={!canEdit}
                />
                <span>Guttate</span>
              </label>

              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="typeGeneralizedPustular"
                  checked={formData.typeGeneralizedPustular}
                  onChange={handleInputChange}
                  className="checkbox"
                  disabled={!canEdit}
                />
                <span>Generalized Pustular</span>
              </label>

              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="typeErythrodermic"
                  checked={formData.typeErythrodermic}
                  onChange={handleInputChange}
                  className="checkbox"
                  disabled={!canEdit}
                />
                <span>Erythrodermic</span>
              </label>

              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="typeLocalizedPustular"
                  checked={formData.typeLocalizedPustular}
                  onChange={handleInputChange}
                  className="checkbox"
                  disabled={!canEdit}
                />
                <span>Localized Pustular</span>
              </label>

              <div className="lg:col-span-2">
                <label className="label">Others Specify</label>
                <input
                  type="text"
                  name="typeOthersSpecify"
                  value={formData.typeOthersSpecify}
                  onChange={handleInputChange}
                  className="input"
                  disabled={!canEdit}
                />
              </div>
            </div>
          </div>

          {/* I. PASI - Plaque Characteristics */}
          <div className="card">
            <h3 className="form-section-title">I. Psoriasis Area and Severity Index Plaque Characteristic</h3>
            <p className="text-sm text-gray-600 mb-4">
              Kindy mention the Lesion score in the Plaque Characteristics based on plaque appearance<br />
              Lesion Score: 0 None - 1: Slight - 2: Moderate - 3: Severe - 4: Very Severe
            </p>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 px-4 py-2 text-left">Plaque Characteristic</th>
                    <th className="border border-gray-300 px-4 py-2 text-center">Head</th>
                    <th className="border border-gray-300 px-4 py-2 text-center">Upper Limbs</th>
                    <th className="border border-gray-300 px-4 py-2 text-center">Trunk</th>
                    <th className="border border-gray-300 px-4 py-2 text-center">Lower Limbs</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2">Erythema/Redness</td>
                    <td className="border border-gray-300 px-2 py-2">
                      <input type="text" name="pasiErythemaHead" value={formData.pasiErythemaHead} onChange={handleInputChange} className="input text-center" disabled={!canEdit} />
                    </td>
                    <td className="border border-gray-300 px-2 py-2">
                      <input type="text" name="pasiErythemaUpperLimbs" value={formData.pasiErythemaUpperLimbs} onChange={handleInputChange} className="input text-center" disabled={!canEdit} />
                    </td>
                    <td className="border border-gray-300 px-2 py-2">
                      <input type="text" name="pasiErythemaTrunk" value={formData.pasiErythemaTrunk} onChange={handleInputChange} className="input text-center" disabled={!canEdit} />
                    </td>
                    <td className="border border-gray-300 px-2 py-2">
                      <input type="text" name="pasiErythemaLowerLimbs" value={formData.pasiErythemaLowerLimbs} onChange={handleInputChange} className="input text-center" disabled={!canEdit} />
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2">Induration/Thickness</td>
                    <td className="border border-gray-300 px-2 py-2">
                      <input type="text" name="pasiIndurationHead" value={formData.pasiIndurationHead} onChange={handleInputChange} className="input text-center" disabled={!canEdit} />
                    </td>
                    <td className="border border-gray-300 px-2 py-2">
                      <input type="text" name="pasiIndurationUpperLimbs" value={formData.pasiIndurationUpperLimbs} onChange={handleInputChange} className="input text-center" disabled={!canEdit} />
                    </td>
                    <td className="border border-gray-300 px-2 py-2">
                      <input type="text" name="pasiIndurationTrunk" value={formData.pasiIndurationTrunk} onChange={handleInputChange} className="input text-center" disabled={!canEdit} />
                    </td>
                    <td className="border border-gray-300 px-2 py-2">
                      <input type="text" name="pasiIndurationLowerLimbs" value={formData.pasiIndurationLowerLimbs} onChange={handleInputChange} className="input text-center" disabled={!canEdit} />
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2">Desquamation/Scaling</td>
                    <td className="border border-gray-300 px-2 py-2">
                      <input type="text" name="pasiDesquamationHead" value={formData.pasiDesquamationHead} onChange={handleInputChange} className="input text-center" disabled={!canEdit} />
                    </td>
                    <td className="border border-gray-300 px-2 py-2">
                      <input type="text" name="pasiDesquamationUpperLimbs" value={formData.pasiDesquamationUpperLimbs} onChange={handleInputChange} className="input text-center" disabled={!canEdit} />
                    </td>
                    <td className="border border-gray-300 px-2 py-2">
                      <input type="text" name="pasiDesquamationTrunk" value={formData.pasiDesquamationTrunk} onChange={handleInputChange} className="input text-center" disabled={!canEdit} />
                    </td>
                    <td className="border border-gray-300 px-2 py-2">
                      <input type="text" name="pasiDesquamationLowerLimbs" value={formData.pasiDesquamationLowerLimbs} onChange={handleInputChange} className="input text-center" disabled={!canEdit} />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* J. PASI Area Score */}
          <div className="card">
            <h3 className="form-section-title">J. Psoriasis Area and Severity Index Score</h3>
            <p className="text-sm text-gray-600 mb-4">
              Kindly mention the Area score in the Percentage area affected based on plaque appearance<br />
              Area Score: 0:0% - 1:1-9% - 2:10-29% - 3:30-49% - 4:50-69% - 5:70-89% - 6:90-100%
            </p>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 px-4 py-2 text-left">Percentage Area Affected</th>
                    <th className="border border-gray-300 px-4 py-2 text-center">Head</th>
                    <th className="border border-gray-300 px-4 py-2 text-center">Upper Limbs</th>
                    <th className="border border-gray-300 px-4 py-2 text-center">Trunk</th>
                    <th className="border border-gray-300 px-4 py-2 text-center">Lower Limbs</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2">Area Score</td>
                    <td className="border border-gray-300 px-2 py-2">
                      <input type="text" name="pasiAreaScoreHead" value={formData.pasiAreaScoreHead} onChange={handleInputChange} className="input text-center" disabled={!canEdit} />
                    </td>
                    <td className="border border-gray-300 px-2 py-2">
                      <input type="text" name="pasiAreaScoreUpperLimbs" value={formData.pasiAreaScoreUpperLimbs} onChange={handleInputChange} className="input text-center" disabled={!canEdit} />
                    </td>
                    <td className="border border-gray-300 px-2 py-2">
                      <input type="text" name="pasiAreaScoreTrunk" value={formData.pasiAreaScoreTrunk} onChange={handleInputChange} className="input text-center" disabled={!canEdit} />
                    </td>
                    <td className="border border-gray-300 px-2 py-2">
                      <input type="text" name="pasiAreaScoreLowerLimbs" value={formData.pasiAreaScoreLowerLimbs} onChange={handleInputChange} className="input text-center" disabled={!canEdit} />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* K. Nail Involvement */}
          <div className="card">
            <h3 className="form-section-title">K. Nail Involvement</h3>
            <div className="space-y-4">
              <div>
                <div className="grid grid-cols-2 gap-4 mb-3">
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="nailInvolvement"
                      value="Yes"
                      checked={formData.nailInvolvement === 'Yes'}
                      onChange={handleInputChange}
                      className="radio"
                      disabled={!canEdit}
                    />
                    <span>Yes</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="nailInvolvement"
                      value="No"
                      checked={formData.nailInvolvement === 'No'}
                      onChange={handleInputChange}
                      className="radio"
                      disabled={!canEdit}
                    />
                    <span>No</span>
                  </label>
                </div>

                {formData.nailInvolvement === 'Yes' && (
                  <div className="ml-4 space-y-2">
                    <p className="text-sm font-medium text-gray-700 mb-3">If Yes, please tick One or Multiple of the following</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" name="nailPitting" checked={formData.nailPitting} onChange={handleInputChange} className="checkbox" disabled={!canEdit} />
                        <span>Pitting</span>
                      </label>

                      <label className="flex items-center space-x-2">
                        <input type="checkbox" name="nailOnycholysis" checked={formData.nailOnycholysis} onChange={handleInputChange} className="checkbox" disabled={!canEdit} />
                        <span>Onycholysis</span>
                      </label>

                      <label className="flex items-center space-x-2">
                        <input type="checkbox" name="nailDiscoloration" checked={formData.nailDiscoloration} onChange={handleInputChange} className="checkbox" disabled={!canEdit} />
                        <span>Discoloration</span>
                      </label>

                      <label className="flex items-center space-x-2">
                        <input type="checkbox" name="nailTypicalDystrophy" checked={formData.nailTypicalDystrophy} onChange={handleInputChange} className="checkbox" disabled={!canEdit} />
                        <span>Typical nail Dystrophy</span>
                      </label>

                      <label className="flex items-center space-x-2">
                        <input type="checkbox" name="nailSubungalHyperkeratosis" checked={formData.nailSubungalHyperkeratosis} onChange={handleInputChange} className="checkbox" disabled={!canEdit} />
                        <span>Subungal hyperkeratosis</span>
                      </label>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* L. Treatment - Topical Therapy */}
          <div className="card">
            <h3 className="form-section-title">L. Treatment Received For Psoriasis In The Past Six Months</h3>
            <h4 className="text-md font-semibold text-gray-800 mb-3">Topical Therapy</h4>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 px-4 py-2 text-left">Topical Therapy</th>
                    <th className="border border-gray-300 px-4 py-2 text-left" colSpan="2">Details of Treatment</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Duration</th>
                  </tr>
                  <tr className="bg-gray-50">
                    <th className="border border-gray-300 px-4 py-2"></th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Generic Name</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Dosage</th>
                    <th className="border border-gray-300 px-4 py-2"></th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { label: 'Tar preparation', prefix: 'topicalTarPreparation' },
                    { label: 'Anthralin', prefix: 'topicalAnthralin' },
                    { label: 'Vitamin D3 Analogue', prefix: 'topicalVitaminD3' },
                    { label: 'Topical Corticosteriod', prefix: 'topicalCorticosteroid' },
                    { label: 'Topical Vitamin D and Topical Corticosteroid', prefix: 'topicalVitaminDCorticosteroid' },
                    { label: 'Keratolytics', prefix: 'topicalKeratolytics' },
                    { label: 'Emollient', prefix: 'topicalEmollient' },
                    { label: 'Others Specify', prefix: 'topicalOthersSpecify' }
                  ].map((item) => (
                    <tr key={item.prefix}>
                      <td className="border border-gray-300 px-4 py-2">{item.label}</td>
                      <td className="border border-gray-300 px-2 py-2">
                        <input type="text" name={`${item.prefix}GenericName`} value={formData[`${item.prefix}GenericName`]} onChange={handleInputChange} className="input" disabled={!canEdit} />
                      </td>
                      <td className="border border-gray-300 px-2 py-2">
                        <input type="text" name={`${item.prefix}Dosage`} value={formData[`${item.prefix}Dosage`]} onChange={handleInputChange} className="input" disabled={!canEdit} />
                      </td>
                      <td className="border border-gray-300 px-2 py-2">
                        <input type="text" name={`${item.prefix}Duration`} value={formData[`${item.prefix}Duration`]} onChange={handleInputChange} className="input" disabled={!canEdit} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Systemic Therapy */}
          <div className="card">
            <h4 className="text-md font-semibold text-gray-800 mb-3">Systemic Therapy</h4>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 px-4 py-2 text-left">Systemic Therapy</th>
                    <th className="border border-gray-300 px-4 py-2 text-left" colSpan="2">Details of Treatment</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Duration</th>
                  </tr>
                  <tr className="bg-gray-50">
                    <th className="border border-gray-300 px-4 py-2"></th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Generic Name</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Dosage</th>
                    <th className="border border-gray-300 px-4 py-2"></th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { label: 'Methotrexate', prefix: 'systemicMethotrexate' },
                    { label: 'Acitretin', prefix: 'systemicAcitretin' },
                    { label: 'Sulphasalazine', prefix: 'systemicSulphasalazine' },
                    { label: 'Cyclosporin', prefix: 'systemicCyclosporin' },
                    { label: 'Hydroxyurea', prefix: 'systemicHydroxyurea' },
                    { label: 'Corticosteroids', prefix: 'systemicCorticosteroids' },
                    { label: 'Biologicals', prefix: 'systemicBiologicals' },
                    { label: 'Leflunomide', prefix: 'systemicLeflunomide' },
                    { label: 'Mycophenolate', prefix: 'systemicMycophenolate' },
                    { label: 'Others Specify', prefix: 'systemicOthersSpecify' }
                  ].map((item) => (
                    <tr key={item.prefix}>
                      <td className="border border-gray-300 px-4 py-2">{item.label}</td>
                      <td className="border border-gray-300 px-2 py-2">
                        <input type="text" name={`${item.prefix}GenericName`} value={formData[`${item.prefix}GenericName`]} onChange={handleInputChange} className="input" disabled={!canEdit} />
                      </td>
                      <td className="border border-gray-300 px-2 py-2">
                        <input type="text" name={`${item.prefix}Dosage`} value={formData[`${item.prefix}Dosage`]} onChange={handleInputChange} className="input" disabled={!canEdit} />
                      </td>
                      <td className="border border-gray-300 px-2 py-2">
                        <input type="text" name={`${item.prefix}Duration`} value={formData[`${item.prefix}Duration`]} onChange={handleInputChange} className="input" disabled={!canEdit} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Photo Therapy */}
          <div className="card">
            <h3 className="form-section-title">Photo Therapy</h3>
            <div className="space-y-4">
              <div>
                <div className="grid grid-cols-2 gap-4 mb-3">
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="photoTherapy"
                      value="Yes"
                      checked={formData.photoTherapy === 'Yes'}
                      onChange={handleInputChange}
                      className="radio"
                      disabled={!canEdit}
                    />
                    <span>Yes</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="photoTherapy"
                      value="No"
                      checked={formData.photoTherapy === 'No'}
                      onChange={handleInputChange}
                      className="radio"
                      disabled={!canEdit}
                    />
                    <span>No</span>
                  </label>
                </div>

                {formData.photoTherapy === 'Yes' && (
                  <div className="ml-4 space-y-2">
                    <p className="text-sm font-medium text-gray-700 mb-3">If Yes, please tick One or Multiple of the following</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" name="photoBBUVB" checked={formData.photoBBUVB} onChange={handleInputChange} className="checkbox" disabled={!canEdit} />
                        <span>BB-UVB</span>
                      </label>

                      <label className="flex items-center space-x-2">
                        <input type="checkbox" name="photoNBUVB" checked={formData.photoNBUVB} onChange={handleInputChange} className="checkbox" disabled={!canEdit} />
                        <span>NB-UVB</span>
                      </label>

                      <label className="flex items-center space-x-2">
                        <input type="checkbox" name="photoOralPUVA" checked={formData.photoOralPUVA} onChange={handleInputChange} className="checkbox" disabled={!canEdit} />
                        <span>Oral PUVA</span>
                      </label>

                      <label className="flex items-center space-x-2">
                        <input type="checkbox" name="photoBathPUVA" checked={formData.photoBathPUVA} onChange={handleInputChange} className="checkbox" disabled={!canEdit} />
                        <span>Bath PUVA</span>
                      </label>

                      <label className="flex items-center space-x-2">
                        <input type="checkbox" name="photoTopicalPUVA" checked={formData.photoTopicalPUVA} onChange={handleInputChange} className="checkbox" disabled={!canEdit} />
                        <span>Topical PUVA</span>
                      </label>

                      <label className="flex items-center space-x-2">
                        <input type="checkbox" name="photoExcimerLaser" checked={formData.photoExcimerLaser} onChange={handleInputChange} className="checkbox" disabled={!canEdit} />
                        <span>Excimer Laser</span>
                      </label>
                    </div>

                    <div className="mt-3">
                      <label className="label">Others, Specify</label>
                      <input
                        type="text"
                        name="photoOthersSpecify"
                        value={formData.photoOthersSpecify}
                        onChange={handleInputChange}
                        className="input"
                        disabled={!canEdit}
                      />
                    </div>
                  </div>
                )}
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

export default PsoriasisForm;
