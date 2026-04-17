import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/Navbar';
import { FaSave, FaArrowLeft } from 'react-icons/fa';

const MelasmaForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser, userRole } = useAuth();
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const canEdit = userRole === 'faculty' || userRole === 'hod' || !id;

  const [formData, setFormData] = useState({
    // Basic Information
    name: '',
    age: '',
    sex: '',
    date: '',
    ph: '',
    occupation: '',
    religion: '',
    maritalStatus: '',
    hrsOfSunExposure: '',
    ses: '',

    // Chief Complaints
    duration: '',
    hoAtopyRubbingScrubbing: '',
    drugOcpEyeDrops: '',
    hoCosmetics: '',
    hoPreviousTreatment: '',
    hoUsageOfSteroids: '',

    // Associated Conditions
    associatedConditions: '',

    // Gynaec History
    gynaecHistory: '',

    // H/O Presenting Illness
    onset: '',
    progression: '',
    factors: '',
    initialSite: '',

    // Physical Examination - General
    distribution: '',
    mucousMembrane: '',
    hair: '',
    nails: '',
    lymphNodes: '',

    // Local Examination
    site: '',
    arrangement: '',
    borders: '',
    surface: '',
    colour: '',
    sensations: '',
    temperature: '',
    hairOverLesion: '',
    sweatReaction: '',
    bloodVesselsInLesion: '',
    reactionToSunlight: '',
    reactionToHeatCold: '',

    // Systemic Examination
    systemicExamination: '',

    // Dermoscopy
    colourOfPigmentation: '',
    dermoscopyDistribution: '',
    dermoscopyDistributionDetail: '',
    typeOfPigmentation: '',
    atrophy: '',
    telangiectasia: '',
    perifollicularSparing: '',
    areasOfPigmentClearance: '',
    otherFinding: '',

    // Woods Lamp
    woodsLampAccentuation: '',
    woodsLampColourChange: '',

    // Diagnosis & Treatment
    diagnosis: '',
    treatment: ''
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
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
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
            formType: 'Melasma',
            data: formData,
            createdBy: currentUser.email,
            createdAt: new Date().toISOString(),
            lastModifiedBy: currentUser.email,
            lastModifiedAt: new Date().toISOString()
          });
        } else {
          await setDoc(newDocRef, {
            formType: 'Melasma',
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
            <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">
              Department of Dermatology, Venereology & Leprosy
            </h1>
            <h2 className="text-sm sm:text-base lg:text-lg text-gray-600">J.J.M. Medical College, Davangere - 577004</h2>
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-primary-600 mt-2 text-center">MELASMA</h3>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          {/* Basic Information */}
          <div className="card">
            <h3 className="form-section-title">Basic Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="lg:col-span-2">
                <label className="label">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="input"
                  disabled={!canEdit}
                />
              </div>
              <div>
                <label className="label">Date</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  className="input"
                  disabled={!canEdit}
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
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
              <div>
                <label className="label">Ph</label>
                <input
                  type="text"
                  name="ph"
                  value={formData.ph}
                  onChange={handleInputChange}
                  className="input"
                  disabled={!canEdit}
                />
              </div>
              <div>
                <label className="label">Married / Single / Widow</label>
                <select
                  name="maritalStatus"
                  value={formData.maritalStatus}
                  onChange={handleInputChange}
                  className="input"
                  disabled={!canEdit}
                >
                  <option value="">Select</option>
                  <option value="Married">Married</option>
                  <option value="Single">Single</option>
                  <option value="Widow">Widow</option>
                </select>
              </div>
              <div>
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
              <div>
                <label className="label">Religion</label>
                <input
                  type="text"
                  name="religion"
                  value={formData.religion}
                  onChange={handleInputChange}
                  className="input"
                  disabled={!canEdit}
                />
              </div>
              <div>
                <label className="label">Hrs of Sun exposure</label>
                <input
                  type="text"
                  name="hrsOfSunExposure"
                  value={formData.hrsOfSunExposure}
                  onChange={handleInputChange}
                  className="input"
                  disabled={!canEdit}
                />
              </div>
              <div>
                <label className="label">S E S</label>
                <input
                  type="text"
                  name="ses"
                  value={formData.ses}
                  onChange={handleInputChange}
                  className="input"
                  disabled={!canEdit}
                />
              </div>
            </div>
          </div>

          {/* Chief Complaints */}
          <div className="card">
            <h3 className="form-section-title">Chief Complaints</h3>
            <div className="space-y-4">
              <div>
                <label className="label">Duration</label>
                <input
                  type="text"
                  name="duration"
                  value={formData.duration}
                  onChange={handleInputChange}
                  className="input"
                  disabled={!canEdit}
                />
              </div>
              <div>
                <label className="label">H/O Atopy / Rubbing / Scrubbing / Refractive error</label>
                <input
                  type="text"
                  name="hoAtopyRubbingScrubbing"
                  value={formData.hoAtopyRubbingScrubbing}
                  onChange={handleInputChange}
                  className="input"
                  disabled={!canEdit}
                />
              </div>
              <div>
                <label className="label">Drugs / OCP / Eye drops</label>
                <input
                  type="text"
                  name="drugOcpEyeDrops"
                  value={formData.drugOcpEyeDrops}
                  onChange={handleInputChange}
                  className="input"
                  disabled={!canEdit}
                />
              </div>
              <div>
                <label className="label">H/O Cosmetics (Zandu Balm, Hair Dye, Mehendi, Fair n lovely etc.)</label>
                <input
                  type="text"
                  name="hoCosmetics"
                  value={formData.hoCosmetics}
                  onChange={handleInputChange}
                  className="input"
                  disabled={!canEdit}
                />
              </div>
              <div>
                <label className="label">H/O Previous treatment</label>
                <input
                  type="text"
                  name="hoPreviousTreatment"
                  value={formData.hoPreviousTreatment}
                  onChange={handleInputChange}
                  className="input"
                  disabled={!canEdit}
                />
              </div>
              <div>
                <label className="label">H/O usage of - steroids / Kligmen's / hydroquinone</label>
                <input
                  type="text"
                  name="hoUsageOfSteroids"
                  value={formData.hoUsageOfSteroids}
                  onChange={handleInputChange}
                  className="input"
                  disabled={!canEdit}
                />
              </div>
            </div>
          </div>

          {/* Associated Conditions & Gynaec History */}
          <div className="card">
            <h3 className="form-section-title">Associated Conditions & History</h3>
            <div className="space-y-4">
              <div>
                <label className="label">Associated Conditions</label>
                <textarea
                  name="associatedConditions"
                  value={formData.associatedConditions}
                  onChange={handleInputChange}
                  className="input"
                  rows="2"
                  disabled={!canEdit}
                />
              </div>
              <div>
                <label className="label">Gynaec History :-</label>
                <textarea
                  name="gynaecHistory"
                  value={formData.gynaecHistory}
                  onChange={handleInputChange}
                  className="input"
                  rows="2"
                  disabled={!canEdit}
                />
              </div>
            </div>
          </div>

          {/* H/O Presenting Illness */}
          <div className="card">
            <h3 className="form-section-title">H/O PRESENTING ILLNESS</h3>
            <div className="space-y-4">
              <div>
                <label className="label">Onset</label>
                <textarea
                  name="onset"
                  value={formData.onset}
                  onChange={handleInputChange}
                  className="input"
                  rows="2"
                  placeholder="Slow / Sudden / with pruritus / with erythema/post-traumatic/post - vaccine / hypopigmented / depigmented / from birth / from early childhood"
                  disabled={!canEdit}
                />
              </div>
              <div>
                <label className="label">Progression</label>
                <textarea
                  name="progression"
                  value={formData.progression}
                  onChange={handleInputChange}
                  className="input"
                  rows="2"
                  placeholder="Stationary / Gradual spread / rapid spread / regression / remission / exacerbation"
                  disabled={!canEdit}
                />
              </div>
              <div>
                <label className="label">Factors</label>
                <textarea
                  name="factors"
                  value={formData.factors}
                  onChange={handleInputChange}
                  className="input"
                  rows="2"
                  placeholder="Emotional or mental factor - normal strain / physical strain / infection / pregnancy / drug / Seasonal variation / any other illness"
                  disabled={!canEdit}
                />
              </div>
              <div>
                <label className="label">Initial site</label>
                <input
                  type="text"
                  name="initialSite"
                  value={formData.initialSite}
                  onChange={handleInputChange}
                  className="input"
                  placeholder="Exposed / Pressure points / other areas / around mole."
                  disabled={!canEdit}
                />
              </div>
            </div>
          </div>

          {/* Physical Examination - General */}
          <div className="card">
            <h3 className="form-section-title">PHYSICAL EXAMINATION - GENERAL EXAMINATION</h3>
            <div className="space-y-4">
              <div>
                <label className="label">1. Distribution</label>
                <textarea
                  name="distribution"
                  value={formData.distribution}
                  onChange={handleInputChange}
                  className="input"
                  rows="2"
                  placeholder="Localized / widespread / universal / unilateral / bilateral / symmetrical / asymmetrical / linear / zosteriform / acrofacial / scattered / confluent"
                  disabled={!canEdit}
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="label">2. Mucous membrane</label>
                  <input
                    type="text"
                    name="mucousMembrane"
                    value={formData.mucousMembrane}
                    onChange={handleInputChange}
                    className="input"
                    disabled={!canEdit}
                  />
                </div>
                <div>
                  <label className="label">3. Hair</label>
                  <input
                    type="text"
                    name="hair"
                    value={formData.hair}
                    onChange={handleInputChange}
                    className="input"
                    disabled={!canEdit}
                  />
                </div>
                <div>
                  <label className="label">4. Nails</label>
                  <input
                    type="text"
                    name="nails"
                    value={formData.nails}
                    onChange={handleInputChange}
                    className="input"
                    disabled={!canEdit}
                  />
                </div>
                <div>
                  <label className="label">5. Lymph nodes</label>
                  <input
                    type="text"
                    name="lymphNodes"
                    value={formData.lymphNodes}
                    onChange={handleInputChange}
                    className="input"
                    disabled={!canEdit}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Local Examination */}
          <div className="card">
            <h3 className="form-section-title">LOCAL EXAMINATION</h3>
            <div className="space-y-4">
              <div>
                <label className="label">1. Site</label>
                <input
                  type="text"
                  name="site"
                  value={formData.site}
                  onChange={handleInputChange}
                  className="input"
                  disabled={!canEdit}
                />
              </div>
              <div>
                <label className="label">2. Arrangement</label>
                <input
                  type="text"
                  name="arrangement"
                  value={formData.arrangement}
                  onChange={handleInputChange}
                  className="input"
                  placeholder="linear / gyrate / geographical / retiform / symmetrical / asymmetrical"
                  disabled={!canEdit}
                />
              </div>
              <div>
                <label className="label">3. Borders</label>
                <input
                  type="text"
                  name="borders"
                  value={formData.borders}
                  onChange={handleInputChange}
                  className="input"
                  placeholder="well defined / ill defined / regular / raised / flat / erythematous / hypopigmented"
                  disabled={!canEdit}
                />
              </div>
              <div>
                <label className="label">4. Surface</label>
                <input
                  type="text"
                  name="surface"
                  value={formData.surface}
                  onChange={handleInputChange}
                  className="input"
                  placeholder="smooth / dry / irregular / verrucous / dry / shiny"
                  disabled={!canEdit}
                />
              </div>
              <div>
                <label className="label">5. Colour</label>
                <textarea
                  name="colour"
                  value={formData.colour}
                  onChange={handleInputChange}
                  className="input"
                  rows="2"
                  placeholder="depigmented / hypopigmented / hyperpigmented / erythematous / yellow / red / brown / dark brown / blue / green grey / black / violet / tinged"
                  disabled={!canEdit}
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="label">6. Sensations</label>
                  <select
                    name="sensations"
                    value={formData.sensations}
                    onChange={handleInputChange}
                    className="input"
                    disabled={!canEdit}
                  >
                    <option value="">Select</option>
                    <option value="Normal">Normal</option>
                    <option value="Impaired">Impaired</option>
                    <option value="Lost">Lost</option>
                  </select>
                </div>
                <div>
                  <label className="label">7. Temperature</label>
                  <select
                    name="temperature"
                    value={formData.temperature}
                    onChange={handleInputChange}
                    className="input"
                    disabled={!canEdit}
                  >
                    <option value="">Select</option>
                    <option value="Normal">Normal</option>
                    <option value="Raised">Raised</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
                <div>
                  <label className="label">8. Hair over lesion</label>
                  <input
                    type="text"
                    name="hairOverLesion"
                    value={formData.hairOverLesion}
                    onChange={handleInputChange}
                    className="input"
                    placeholder="White / black / sparse / intact"
                    disabled={!canEdit}
                  />
                </div>
                <div>
                  <label className="label">9. Sweat reaction</label>
                  <input
                    type="text"
                    name="sweatReaction"
                    value={formData.sweatReaction}
                    onChange={handleInputChange}
                    className="input"
                    disabled={!canEdit}
                  />
                </div>
                <div>
                  <label className="label">10. Blood Vessels in lesion</label>
                  <input
                    type="text"
                    name="bloodVesselsInLesion"
                    value={formData.bloodVesselsInLesion}
                    onChange={handleInputChange}
                    className="input"
                    disabled={!canEdit}
                  />
                </div>
                <div>
                  <label className="label">11. Reaction to Sunlight</label>
                  <input
                    type="text"
                    name="reactionToSunlight"
                    value={formData.reactionToSunlight}
                    onChange={handleInputChange}
                    className="input"
                    disabled={!canEdit}
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="label">12. Reaction to heat and cold</label>
                  <input
                    type="text"
                    name="reactionToHeatCold"
                    value={formData.reactionToHeatCold}
                    onChange={handleInputChange}
                    className="input"
                    disabled={!canEdit}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Systemic Examination */}
          <div className="card">
            <h3 className="form-section-title">SYSTEMIC EXAMINATION</h3>
            <div>
              <label className="label">Examination of teeth, tonsils, sinuses, ears, eyes, etc</label>
              <textarea
                name="systemicExamination"
                value={formData.systemicExamination}
                onChange={handleInputChange}
                className="input"
                rows="3"
                disabled={!canEdit}
              />
            </div>
          </div>

          {/* Dermoscopy */}
          <div className="card">
            <h3 className="form-section-title">DERMOSCOPY</h3>
            <div className="space-y-4">
              <div>
                <label className="label">1. Colour of pigmentation</label>
                <input
                  type="text"
                  name="colourOfPigmentation"
                  value={formData.colourOfPigmentation}
                  onChange={handleInputChange}
                  className="input"
                  placeholder="light brown / brown / dark brown / blackish / blue / coppery / others"
                  disabled={!canEdit}
                />
              </div>
              <div>
                <label className="label">2. Distribution</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <select
                    name="dermoscopyDistribution"
                    value={formData.dermoscopyDistribution}
                    onChange={handleInputChange}
                    className="input"
                    disabled={!canEdit}
                  >
                    <option value="">Select</option>
                    <option value="Diffuse">Diffuse</option>
                    <option value="Localized">Localized</option>
                  </select>
                  <select
                    name="dermoscopyDistributionDetail"
                    value={formData.dermoscopyDistributionDetail}
                    onChange={handleInputChange}
                    className="input"
                    disabled={!canEdit}
                  >
                    <option value="">Select</option>
                    <option value="Well defined">Well defined</option>
                    <option value="Ill defined">Ill defined</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="label">3. Type of pigmentation</label>
                <input
                  type="text"
                  name="typeOfPigmentation"
                  value={formData.typeOfPigmentation}
                  onChange={handleInputChange}
                  className="input"
                  placeholder="blotchy / irregular / globular / reticular / ameboid / petaloid / nebular / feathering"
                  disabled={!canEdit}
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="label">4. Atrophy</label>
                  <input
                    type="text"
                    name="atrophy"
                    value={formData.atrophy}
                    onChange={handleInputChange}
                    className="input"
                    disabled={!canEdit}
                  />
                </div>
                <div>
                  <label className="label">5. Telangiectasia</label>
                  <input
                    type="text"
                    name="telangiectasia"
                    value={formData.telangiectasia}
                    onChange={handleInputChange}
                    className="input"
                    disabled={!canEdit}
                  />
                </div>
                <div>
                  <label className="label">6. Perifollicular sparing / erythema / accentuation</label>
                  <input
                    type="text"
                    name="perifollicularSparing"
                    value={formData.perifollicularSparing}
                    onChange={handleInputChange}
                    className="input"
                    disabled={!canEdit}
                  />
                </div>
                <div>
                  <label className="label">7. Areas of pigment clearance / sparing</label>
                  <input
                    type="text"
                    name="areasOfPigmentClearance"
                    value={formData.areasOfPigmentClearance}
                    onChange={handleInputChange}
                    className="input"
                    disabled={!canEdit}
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="label">8. Other finding: Dermoscopy</label>
                  <textarea
                    name="otherFinding"
                    value={formData.otherFinding}
                    onChange={handleInputChange}
                    className="input"
                    rows="2"
                    disabled={!canEdit}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Woods Lamp */}
          <div className="card">
            <h3 className="form-section-title">WOODS LAMP</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="label">Accentuation</label>
                <select
                  name="woodsLampAccentuation"
                  value={formData.woodsLampAccentuation}
                  onChange={handleInputChange}
                  className="input"
                  disabled={!canEdit}
                >
                  <option value="">Select</option>
                  <option value="Present">Present</option>
                  <option value="Absent">Absent</option>
                </select>
              </div>
              <div>
                <label className="label">Change in colour</label>
                <input
                  type="text"
                  name="woodsLampColourChange"
                  value={formData.woodsLampColourChange}
                  onChange={handleInputChange}
                  className="input"
                  disabled={!canEdit}
                />
              </div>
            </div>
          </div>

          {/* Diagnosis */}
          <div className="card">
            <h3 className="form-section-title">DIAGNOSIS</h3>
            <textarea
              name="diagnosis"
              value={formData.diagnosis}
              onChange={handleInputChange}
              className="input"
              rows="3"
              disabled={!canEdit}
            />
          </div>

          {/* Treatment */}
          <div className="card">
            <h3 className="form-section-title">TREATMENT</h3>
            <textarea
              name="treatment"
              value={formData.treatment}
              onChange={handleInputChange}
              className="input"
              rows="3"
              disabled={!canEdit}
            />
          </div>

          {/* Submit Button */}
          {canEdit && (
            <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-4 sticky bottom-0 bg-gray-50 py-4 -mx-4 sm:-mx-6 px-4 sm:px-6 shadow-lg sm:shadow-none sm:static sm:bg-transparent sm:py-0">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="btn btn-secondary w-full sm:w-auto order-2 sm:order-1"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary flex items-center justify-center space-x-2 w-full sm:w-auto order-1 sm:order-2"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <FaSave />
                    <span>Save Record</span>
                  </>
                )}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default MelasmaForm;
