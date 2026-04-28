import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const CORE_URL = "http://192.168.1.37:9092";

const PublicFormPage = () => {
  const { formId } = useParams();

  const [step, setStep] = useState(1);           // 1 = entity, 2 = form fields
  const [formDef, setFormDef] = useState(null);
  const [entityId, setEntityId] = useState(null);
  const [entityType, setEntityType] = useState("Person");

  // Entity fields state
  const [entityData, setEntityData] = useState({
    firstName: "", lastName: "", email: "", gov_id: "", dob:"",         // Person
    companyName: "", registrationNumber: "", contactEmail: "", // Company
  });

  // Form fields state
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle");
  const [errorMsg, setErrorMsg] = useState("");

  // Fetch form definition
  useEffect(() => {
    axios
      .get(`${CORE_URL}/form/${formId}`)
      .then((res) => {
        setFormDef(res.data);
        setEntityType(res.data.entityType); // Person or Company from form config
        const initial = {};
        res.data.fields.forEach((f) => (initial[f.fieldName] = ""));
        setFormData(initial);
      })
      .catch(() => setErrorMsg("Failed to load form. Please check the link."));
  }, [formId]);

  // ── Step 1: Save Entity ──────────────────────────────────
  const handleEntitySubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    const newErrors = {};
    if (entityType === "Person") {
      if (!entityData.firstName.trim()) newErrors.firstName = "Required";
      if (!entityData.lastName.trim()) newErrors.lastName = "Required";
      if (!entityData.email.trim()) newErrors.email = "Required";
    } else {
      if (!entityData.companyName.trim()) newErrors.companyName = "Required";
      if (!entityData.contactEmail.trim()) newErrors.contactEmail = "Required";
    }
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setStatus("submitting");
      // const payload = entityType === "Person"
      //   ? { type: "Person", firstName: entityData.firstName, lastName: entityData.lastName, email: entityData.email, phone: entityData.phone }
      //   : { type: "Company", companyName: entityData.companyName, registrationNumber: entityData.registrationNumber, contactEmail: entityData.contactEmail };
      const entityPayload =  entityType === "Person"  ? { type: "Person", name: entityData.firstName}:{ type: "Company", name: entityData.companyName};
      const creareEntity = await axios.post(`${CORE_URL}/create`, payload);
      setEntityId(creareEntity.data.id);  // ← save the returned entityId
      //upadate the entity ID
      const payload = entityType === "Person"
        ? { type: "Person", firstName: entityData.firstName,middleName:"", lastName: entityData.lastName, email: entityData.email, gov_id: entityData.gov_id , dob:entityData.dob }
        : { type: "Company", companyName: entityData.companyName, registrationNumber: entityData.registrationNumber, contactEmail: entityData.contactEmail };
      
      const updateE = await axios.put(`${CORE_URL}/update/indi/${entityId}`,payload);
      console.log(updateE.data);
      
      setErrors({});
      setStatus("idle");
      setStep(2);                // ← move to form step
    } catch (err) {
      setErrorMsg("Failed to save entity. Please try again.");
      setStatus("idle");
    }
  };

  // ── Step 2: Submit Form ──────────────────────────────────
  const handleFormSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    const newErrors = {};
    formDef.fields.forEach((field) => {
      if (field.required && !formData[field.fieldName]?.toString().trim()) {
        newErrors[field.fieldName] = `${field.fieldName} is required`;
      }
    });
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setStatus("submitting");
      await axios.post(`${CORE_URL}/app/${formId}/submit`, {
        entityId: entityId,      // ← link submission to entity
        formData: formData,
      });
      setStatus("success");
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Submission failed.");
      setStatus("idle");
    }
  };

  // ── Render States ────────────────────────────────────────
  if (errorMsg) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <p className="text-red-500 text-lg">{errorMsg}</p>
    </div>
  );

  if (!formDef) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <p className="text-gray-500">Loading form...</p>
    </div>
  );

  if (status === "success") return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-10 rounded-2xl shadow text-center">
        <h2 className="text-3xl font-bold text-green-600 mb-2">✅ Submitted!</h2>
        <p className="text-gray-500">Your application has been submitted successfully.</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow p-8">

        {/* Header */}
        <h1 className="text-2xl font-bold text-[#335294] mb-1">{formDef.name}</h1>
        <p className="text-gray-500 mb-6">{formDef.description}</p>

        {/* Step Indicator */}
        <div className="flex items-center gap-3 mb-8">
          <div className={`flex items-center gap-2 text-sm font-medium ${step === 1 ? "text-[#335294]" : "text-green-500"}`}>
            <span className={`w-7 h-7 rounded-full flex items-center justify-center text-white text-xs ${step === 1 ? "bg-[#335294]" : "bg-green-500"}`}>
              {step > 1 ? "✓" : "1"}
            </span>
            Entity Details
          </div>
          <div className="flex-1 h-px bg-gray-300" />
          <div className={`flex items-center gap-2 text-sm font-medium ${step === 2 ? "text-[#335294]" : "text-gray-400"}`}>
            <span className={`w-7 h-7 rounded-full flex items-center justify-center text-white text-xs ${step === 2 ? "bg-[#335294]" : "bg-gray-300"}`}>
              2
            </span>
            Application Form
          </div>
        </div>

        {/* ── STEP 1: Entity Form ── */}
        {step === 1 && (
          <form onSubmit={handleEntitySubmit} className="flex flex-col gap-4">
            <h2 className="text-lg font-semibold text-gray-700">
              {entityType === "Person" ? "👤 Personal Details" : "🏢 Company Details"}
            </h2>

            {entityType === "Person" ? (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium">First Name <span className="text-red-500">*</span></label>
                    <input className={inputClass} value={entityData.firstName}
                      onChange={(e) => setEntityData(p => ({ ...p, firstName: e.target.value }))} />
                    {errors.firstName && <span className="text-red-500 text-xs">{errors.firstName}</span>}
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium">Last Name <span className="text-red-500">*</span></label>
                    <input className={inputClass} value={entityData.lastName}
                      onChange={(e) => setEntityData(p => ({ ...p, lastName: e.target.value }))} />
                    {errors.lastName && <span className="text-red-500 text-xs">{errors.lastName}</span>}
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium">Email <span className="text-red-500">*</span></label>
                  <input className={inputClass} type="email" value={entityData.email}
                    onChange={(e) => setEntityData(p => ({ ...p, email: e.target.value }))} />
                  {errors.email && <span className="text-red-500 text-xs">{errors.email}</span>}
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium">gov_id</label>
                  <input className={inputClass} type="tel" value={entityData.gov_id}
                    onChange={(e) => setEntityData(p => ({ ...p, gov_id: e.target.value }))} />
                </div>
              </>
            ) : (
              <>
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium">Company Name <span className="text-red-500">*</span></label>
                  <input className={inputClass} value={entityData.companyName}
                    onChange={(e) => setEntityData(p => ({ ...p, companyName: e.target.value }))} />
                  {errors.companyName && <span className="text-red-500 text-xs">{errors.companyName}</span>}
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium">Registration Number</label>
                  <input className={inputClass} value={entityData.registrationNumber}
                    onChange={(e) => setEntityData(p => ({ ...p, registrationNumber: e.target.value }))} />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium">Contact Email <span className="text-red-500">*</span></label>
                  <input className={inputClass} type="email" value={entityData.contactEmail}
                    onChange={(e) => setEntityData(p => ({ ...p, contactEmail: e.target.value }))} />
                  {errors.contactEmail && <span className="text-red-500 text-xs">{errors.contactEmail}</span>}
                </div>
              </>
            )}

            <button type="submit" disabled={status === "submitting"}
              className="mt-2 bg-[#335294] text-white py-2 rounded-xl font-medium active:scale-95 disabled:opacity-60">
              {status === "submitting" ? "Saving..." : "Next →"}
            </button>
          </form>
        )}

        {/* ── STEP 2: Application Form ── */}
        {step === 2 && (
          <form onSubmit={handleFormSubmit} className="flex flex-col gap-4">
            <h2 className="text-lg font-semibold text-gray-700">📋 Application Details</h2>

            {formDef.fields.map((field, index) => (
              <div key={index} className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">
                  {field.fieldName}
                  {field.required && <span className="text-red-500 ml-1">*</span>}
                </label>
                {renderField(field, formData[field.fieldName], (name, val) =>
                  setFormData(p => ({ ...p, [name]: val }))
                )}
                {errors[field.fieldName] && (
                  <span className="text-red-500 text-xs">{errors[field.fieldName]}</span>
                )}
              </div>
            ))}

            <div className="flex gap-3 mt-2">
              <button type="button" onClick={() => setStep(1)}
                className="flex-1 border border-[#335294] text-[#335294] py-2 rounded-xl font-medium active:scale-95">
                ← Back
              </button>
              <button type="submit" disabled={status === "submitting"}
                className="flex-1 bg-[#335294] text-white py-2 rounded-xl font-medium active:scale-95 disabled:opacity-60">
                {status === "submitting" ? "Submitting..." : "Submit"}
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};

// ── Input class ──────────────────────────────────────────────
const inputClass = "h-10 border p-2 rounded-xl bg-gray-100 w-full focus:outline-none focus:ring-2 focus:ring-[#335294]";

// ── Dynamic field renderer ───────────────────────────────────
const renderField = (field, value, onChange) => {
  switch (field.fieldType?.toLowerCase()) {
    case "text": case "string":
      return <input type="text" className={inputClass} value={value}
        onChange={(e) => onChange(field.fieldName, e.target.value)} />;
    case "number":
      return <input type="number" className={inputClass} value={value}
        onChange={(e) => onChange(field.fieldName, e.target.value)} />;
    case "email":
      return <input type="email" className={inputClass} value={value}
        onChange={(e) => onChange(field.fieldName, e.target.value)} />;
    case "date":
      return <input type="date" className={inputClass} value={value}
        onChange={(e) => onChange(field.fieldName, e.target.value)} />;
    case "boolean":
      return (
        <select className={inputClass} value={value}
          onChange={(e) => onChange(field.fieldName, e.target.value)}>
          <option value="">-- Select --</option>
          <option value="true">Yes</option>
          <option value="false">No</option>
        </select>
      );
    case "textarea":
      return <textarea className="border p-2 rounded-xl bg-gray-100 w-full focus:outline-none focus:ring-2 focus:ring-[#335294]"
        rows={3} value={value} onChange={(e) => onChange(field.fieldName, e.target.value)} />;
    default:
      return <input type="text" className={inputClass} value={value}
        onChange={(e) => onChange(field.fieldName, e.target.value)} />;
  }
};

export default PublicFormPage;