import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/Navbar';
import { FaSave, FaArrowLeft } from 'react-icons/fa';

const PigmentaryDisordersForm = () => {
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
    maritalStatus: '',
    occupation: '',
    hrsOfSunExposure: '',

    // Chief Complaints
    duration: '',
    atopyRubbingScrubbing: '',
    drugsOCPEyeDrops: '',
    cosmeticsHistory: '',
    previousTreatment: '',
    usageOfSteroids: '',
    associatedConditions: '',
    gynaecHistory: '',

    // H/O Presenting Illness
    onset: '',
    progression: '',
    factors: '',
    initialSite: '',

    // General Examination
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
    dermoscopyDefinition: '',
    typeOfPigmentation: '',
    atrophy: '',
    telangiectasia: '',
    perifollicularFeatures: '',
    areasOfPigmentClearance: '',
    otherDermoscopyFindings: '',

    // Woods Lamp
    accentuation: '',
    changeInColour: '',

    // Diagnosis and Treatment
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
            formType: 'Pigmentary Disorders',
            data: formData,
            createdBy: currentUser.email,
            createdAt: new Date().toISOString(),
            lastModifiedBy: currentUser.email,
            lastModifiedAt: new Date().toISOString()
          });
        } else {
          await setDoc(newDocRef, {
            formType: 'Pigmentary Disorders',
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
              PIGMENTARY DISORDERS
            </h1>
            <p className="text-center text-gray-600 text-sm mt-2">
              Department of Dermatology, Venereology & Leprosy
            </p>
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
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
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

              <div className="lg:col-span-3">
                <label className="label">Hours of Sun Exposure</label>
                <input
                  type="text"
                  name="hrsOfSunExposure"
                  value={formData.hrsOfSunExposure}
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
                <label className="label">H/O, Atopy / Rubbing / Scrubbing / Refractive Error</label>
                <textarea
                  name="atopyRubbingScrubbing"
                  value={formData.atopyRubbingScrubbing}
                  onChange={handleInputChange}
                  className="input min-h-[60px]"
                  disabled={!canEdit}
                  rows="2"
                />
              </div>

              <div>
                <label className="label">Drugs / OCP / Eye Drops</label>
                <textarea
                  name="drugsOCPEyeDrops"
                  value={formData.drugsOCPEyeDrops}
                  onChange={handleInputChange}
                  className="input min-h-[60px]"
                  disabled={!canEdit}
                  rows="2"
                />
              </div>

              <div>
                <label className="label">H/O Cosmetics (Zandu Balm, Hair Dye, Mehendi, Fair n lovely etc.)</label>
                <textarea
                  name="cosmeticsHistory"
                  value={formData.cosmeticsHistory}
                  onChange={handleInputChange}
                  className="input min-h-[60px]"
                  disabled={!canEdit}
                  rows="2"
                />
              </div>

              <div>
                <label className="label">H/O Previous Treatment</label>
                <textarea
                  name="previousTreatment"
                  value={formData.previousTreatment}
                  onChange={handleInputChange}
                  className="input min-h-[60px]"
                  disabled={!canEdit}
                  rows="2"
                />
              </div>

              <div>
                <label className="label">H/O Usage of - Steroids / Kligmens / Hydroquinone</label>
                <textarea
                  name="usageOfSteroids"
                  value={formData.usageOfSteroids}
                  onChange={handleInputChange}
                  className="input min-h-[60px]"
                  disabled={!canEdit}
                  rows="2"
                />
              </div>

              <div>
                <label className="label">Associated Conditions</label>
                <textarea
                  name="associatedConditions"
                  value={formData.associatedConditions}
                  onChange={handleInputChange}
                  className="input min-h-[60px]"
                  disabled={!canEdit}
                  rows="2"
                />
              </div>

              <div>
                <label className="label">Gynaec History</label>
                <textarea
                  name="gynaecHistory"
                  value={formData.gynaecHistory}
                  onChange={handleInputChange}
                  className="input min-h-[60px]"
                  disabled={!canEdit}
                  rows="2"
                />
              </div>
            </div>
          </div>

          {/* H/O Presenting Illness */}
          <div className="card">
            <h3 className="form-section-title">H/O Presenting Illness</h3>
            <div className="space-y-4">
              <div>
                <label className="label">Onset</label>
                <input
                  type="text"
                  name="onset"
                  value={formData.onset}
                  onChange={handleInputChange}
                  className="input"
                  disabled={!canEdit}
                  placeholder="Slow / Sudden / with pruritus / with erythema/post-traumatic/post - vaccine / hypopigmented / depigmented / from birth / from early childhood"
                />
              </div>

              <div>
                <label className="label">Progression</label>
                <input
                  type="text"
                  name="progression"
                  value={formData.progression}
                  onChange={handleInputChange}
                  className="input"
                  disabled={!canEdit}
                  placeholder="Stationary / Gradual spread / rapid spread / regression / remission / exacerbation"
                />
              </div>

              <div>
                <label className="label">Factors</label>
                <textarea
                  name="factors"
                  value={formData.factors}
                  onChange={handleInputChange}
                  className="input min-h-[60px]"
                  disabled={!canEdit}
                  placeholder="Emotional factor - normal strain / physical strain / Infection / Ill pregnancy / drug / Seasonal variation"
                  rows="2"
                />
              </div>

              <div>
                <label className="label">Initial Site</label>
                <input
                  type="text"
                  name="initialSite"
                  value={formData.initialSite}
                  onChange={handleInputChange}
                  className="input"
                  disabled={!canEdit}
                  placeholder="Exposed / Pressure points / other areas / around mole"
                />
              </div>
            </div>
          </div>

          {/* Physical Examination - General */}
          <div className="card">
            <h3 className="form-section-title">Physical Examination - General Examination</h3>
            <div className="space-y-4">
              <div>
                <label className="label">1. Distribution</label>
                <textarea
                  name="distribution"
                  value={formData.distribution}
                  onChange={handleInputChange}
                  className="input min-h-[60px]"
                  disabled={!canEdit}
                  placeholder="Localized / widespread / universal / unilateral / bilateral / symmetrical / asymmetrical / linear / zosteriform / acrofacial / scattered / confluent"
                  rows="2"
                />
              </div>

              <div>
                <label className="label">2. Mucous Membrane</label>
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
                <label className="label">5. Lymph Nodes</label>
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

          {/* Local Examination */}
          <div className="card">
            <h3 className="form-section-title">Local Examination</h3>
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
                  disabled={!canEdit}
                  placeholder="linear / gyrate / geographical / retiform / symmetrical / asymmetrical"
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
                  disabled={!canEdit}
                  placeholder="well defined / ill defined / regular / raised / flat / erythematous / hypopigmented"
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
                  disabled={!canEdit}
                  placeholder="smooth / dry / irregular / verrucous / dry / shiny"
                />
              </div>

              <div>
                <label className="label">5. Colour</label>
                <input
                  type="text"
                  name="colour"
                  value={formData.colour}
                  onChange={handleInputChange}
                  className="input"
                  disabled={!canEdit}
                  placeholder="depigmented / hypopigmented / hyperpigmented / erythematous / yellow / red / brown / dark brown / blue / green grey / black / violet / tinged"
                />
              </div>

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
                  <option value="normal">Normal</option>
                  <option value="impaired">Impaired</option>
                  <option value="lost">Lost</option>
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
                  <option value="normal">Normal</option>
                  <option value="raised">Raised</option>
                  <option value="low">Low</option>
                </select>
              </div>

              <div>
                <label className="label">8. Hair over Lesion</label>
                <input
                  type="text"
                  name="hairOverLesion"
                  value={formData.hairOverLesion}
                  onChange={handleInputChange}
                  className="input"
                  disabled={!canEdit}
                  placeholder="White / black / sparse / Intact"
                />
              </div>

              <div>
                <label className="label">9. Sweat Reaction</label>
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
                <label className="label">10. Blood Vessels in Lesion</label>
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

              <div>
                <label className="label">12. Reaction to Heat and Cold</label>
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

          {/* Systemic Examination */}
          <div className="card">
            <h3 className="form-section-title">Systemic Examination</h3>
            <div>
              <label className="label">Examination of Teeth, Tonsils, Sinuses, Ears, Eyes, etc</label>
              <textarea
                name="systemicExamination"
                value={formData.systemicExamination}
                onChange={handleInputChange}
                className="input min-h-[80px]"
                disabled={!canEdit}
                rows="3"
              />
            </div>
          </div>

          {/* Dermoscopy */}
          <div className="card">
            <h3 className="form-section-title">Dermoscopy</h3>
            <div className="space-y-4">
              <div>
                <label className="label">1. Colour of Pigmentation</label>
                <input
                  type="text"
                  name="colourOfPigmentation"
                  value={formData.colourOfPigmentation}
                  onChange={handleInputChange}
                  className="input"
                  disabled={!canEdit}
                  placeholder="light brown / brown / dark brown / blackish / blue / coppery / others"
                />
              </div>

              <div>
                <label className="label">2. Distribution</label>
                <input
                  type="text"
                  name="dermoscopyDistribution"
                  value={formData.dermoscopyDistribution}
                  onChange={handleInputChange}
                  className="input"
                  disabled={!canEdit}
                  placeholder="diffuse / localized"
                />
              </div>

              <div>
                <label className="label">Definition</label>
                <select
                  name="dermoscopyDefinition"
                  value={formData.dermoscopyDefinition}
                  onChange={handleInputChange}
                  className="input"
                  disabled={!canEdit}
                >
                  <option value="">Select</option>
                  <option value="Well defined">Well defined</option>
                  <option value="Ill defined">Ill defined</option>
                </select>
              </div>

              <div>
                <label className="label">3. Type of Pigmentation</label>
                <input
                  type="text"
                  name="typeOfPigmentation"
                  value={formData.typeOfPigmentation}
                  onChange={handleInputChange}
                  className="input"
                  disabled={!canEdit}
                  placeholder="blotchy / irregular / globular / reticular / ameboid / petaloid / nebular / feathering"
                />
              </div>

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
                <label className="label">6. Perifollicular Sparing / Erythema / Accentuation</label>
                <input
                  type="text"
                  name="perifollicularFeatures"
                  value={formData.perifollicularFeatures}
                  onChange={handleInputChange}
                  className="input"
                  disabled={!canEdit}
                />
              </div>

              <div>
                <label className="label">7. Areas of Pigment Clearance / Sparing</label>
                <input
                  type="text"
                  name="areasOfPigmentClearance"
                  value={formData.areasOfPigmentClearance}
                  onChange={handleInputChange}
                  className="input"
                  disabled={!canEdit}
                />
              </div>

              <div>
                <label className="label">8. Other Finding (Dermoscopy)</label>
                <textarea
                  name="otherDermoscopyFindings"
                  value={formData.otherDermoscopyFindings}
                  onChange={handleInputChange}
                  className="input min-h-[60px]"
                  disabled={!canEdit}
                  rows="2"
                />
              </div>
            </div>
          </div>

          {/* Woods Lamp */}
          <div className="card">
            <h3 className="form-section-title">Woods Lamp</h3>
            <div className="space-y-4">
              <div>
                <label className="label">Accentuation</label>
                <select
                  name="accentuation"
                  value={formData.accentuation}
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
                <label className="label">Change in Colour</label>
                <textarea
                  name="changeInColour"
                  value={formData.changeInColour}
                  onChange={handleInputChange}
                  className="input min-h-[60px]"
                  disabled={!canEdit}
                  rows="2"
                />
              </div>
            </div>
          </div>

          {/* Diagnosis and Treatment */}
          <div className="card">
            <h3 className="form-section-title">Diagnosis</h3>
            <div>
              <textarea
                name="diagnosis"
                value={formData.diagnosis}
                onChange={handleInputChange}
                className="input min-h-[80px]"
                disabled={!canEdit}
                rows="3"
              />
            </div>
          </div>

          <div className="card">
            <h3 className="form-section-title">Treatment</h3>
            <div>
              <textarea
                name="treatment"
                value={formData.treatment}
                onChange={handleInputChange}
                className="input min-h-[100px]"
                disabled={!canEdit}
                rows="4"
              />
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

export default PigmentaryDisordersForm;
