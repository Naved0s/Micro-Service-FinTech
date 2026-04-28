import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const UiRenderpage = () => {
  const [step, setStep] = useState(1);
  const [entityId, setEntityId] = useState(null);
  const { formId } = useParams();

  const [basicData, setBasicData] = useState({
    name: "",
    type: "Person",
  });

  const [PersonData, setPersonData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    email: "",
    gov_id: "",
    dob: "",
  });

  const [companyData, setCompanyData] = useState({
    name: "",
    email: "",
    tax_id: "",
    reg_no: "",
    industry: "",
  });

  const [formDef, setFormDef] = useState(null);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    // setStep(2)
    axios.get(`http://192.168.1.37:9092/form/${formId}`).then((res) => {
      console.log("This is res data", res.data);
    
      setFormDef(res.data);
      //  setEntityType(res.data.entityType); // Person or Company from form config
      // const initial = {};
      // res.data.fields.forEach((f) => (initial[f.fieldName] = ""));
      // setFormData(initial);
    });
    
  }, [formId]);

  const handleCreateEntity = () => {
    console.log("Making api call");
  //  setStep(2);
    // axios.post(`http://192.168.1.37:9092/create`,basicData).then((response)=>{
    //   console.log("This is response",response.data);
    //   setEntityId(response.data);
      setStep(2);
    // })
  };

  // const handleUpdate = async () => {
  //   console.log(PersonData);
  //   // setStep(3);
  //    axios.put(`http://192.168.1.37:9092/update/indi/${entityId}`,PersonData).then((response)=>{
  //     console.log("Entity Updated Successfully!");
  //     setStep(3);
  //    })
  //   //  setStep(3)
  // };

  const handlePersonSubmit = async () => {
  try {
    const res = await axios.post(
      "http://192.168.1.37:9092/person",
      {
        name: basicData.name,
        type: basicData.type,
        firstName: PersonData.firstName,
        middleName: PersonData.middleName,
        lastName: PersonData.lastName,
        email: PersonData.email,
        gov_id: PersonData.gov_id,
        dob: PersonData.dob,
      }
    );

    const id = res.data;

    setEntityId(id);
    setStep(3);

  } catch (err) {
    console.error(err);
  }
};

  const handleSubmit = async (e) => {
    // e.preventDefault();
    const fieldValues = Object.entries(formData).map(([fieldId,value]) => ({
      fieldId:Number(fieldId),
      value:value
    }));
    const payload = {
    applicationDto: {
      formid: Number(formId),
      entityid: entityId,
      status: "Submitted"
    },
    fieldValues: fieldValues
  };

  console.log("FINAL PAYLOAD 👉", payload);
    //formId
    axios.put(`http://192.168.1.37:9092/app/${formId}/submit`,payload
  
    ).then((response)=>{

    })
  //  / console.log(formData,"This is e id",entityId,formId);

   
  };
  const inputClass =
    "h-10 border p-2 rounded-xl bg-gray-100 w-full focus:outline-none focus:ring-2 focus:ring-[#335294]";
  return (
    <div className="h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-6 bg-white rounded-xl shadow-sm">
        {/* Step Indicator */}
        <p className="text-xs text-gray-400 mb-4">Step {step} of 3</p>

        {/* STEP 1 */}
        {step === 1 && (
          <div className="flex flex-col gap-4">
            <h2 className="text-lg font-medium text-gray-800">Create Entity</h2>

            <input
              type="text"
              placeholder="Name"
              value={basicData.name}
              onChange={(e) =>
                setBasicData({ ...basicData, name: e.target.value })
              }
              className="border border-gray-200 focus:border-black outline-none p-2 rounded-md text-sm"
            />

            <select
              value={basicData.type}
              onChange={(e) =>  
                setBasicData({ ...basicData, type: e.target.value })
              }
              className="border border-gray-200 focus:border-black outline-none p-2 rounded-md text-sm"
            >
              <option value="Person">Person</option>
              <option value="Company">Company</option>
            </select>

            <button
              onClick={handleCreateEntity}
              className="mt-2 bg-black text-white py-2 rounded-md text-sm hover:opacity-90"
            >
              Continue
            </button>
          </div>
        )}

        {/* STEP 2 - Person */}
        {step === 2 && basicData.type === "Person" && (
          <div className="flex flex-col gap-4">
            <h2 className="text-lg font-medium text-gray-800">
              Person Details
            </h2>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium">
                  First Name <span className="text-red-500">*</span>
                </label>
                <input
                  className={inputClass}
                  value={PersonData.firstName}
                  onChange={(e) =>
                    setPersonData((p) => ({ ...p, firstName: e.target.value }))
                  }
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium">
                  Middle Name <span className="text-red-500">*</span>
                </label>
                <input
                  className={inputClass}
                  value={PersonData.middleName}
                  onChange={(e) =>
                    setPersonData((p) => ({ ...p, middleName: e.target.value }))
                  }
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium">
                  Last Name <span className="text-red-500">*</span>
                </label>
                <input
                  className={inputClass}
                  value={PersonData.lastName}
                  onChange={(e) =>
                    setPersonData((p) => ({ ...p, lastName: e.target.value }))
                  }
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium">
                  Email Id <span className="text-red-500">*</span>
                </label>
                <input
                  className={inputClass}
                  value={PersonData.email}
                  onChange={(e) =>
                    setPersonData((p) => ({ ...p, email: e.target.value }))
                  }
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium">
                  Gov Id<span className="text-red-500">*</span>
                </label>
                <input
                  className={inputClass}
                  value={PersonData.gov_id}
                  onChange={(e) =>
                    setPersonData((p) => ({ ...p, gov_id: e.target.value }))
                  }
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium">
                  Date Of birth <span className="text-red-500">*</span>
                </label>
                <input
                  className={inputClass}
                  value={PersonData.dob}
                  type="date"
                  onChange={(e) =>
                    setPersonData((p) => ({ ...p, dob: e.target.value }))
                  }
                />
              </div>
            </div>

            <button
              onClick={ handlePersonSubmit}//handleUpdate}
              className="bg-black text-white py-2 rounded-md text-sm"
            >
              Create Profile
            </button>
          </div>
        )}

        {/* STEP 2 - COMPANY */}
        {step === 3 && (
          <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
            <div>
              <h2 className="text-lg font-medium text-gray-800">
                Application Details
              </h2>
            </div>

            {formDef.fields.map((field, index) => (
              <div key={index} className="flex flex-col gap-1.5">
                <label className="text-sm text-gray-600">
                  {field.fieldName}
                  {field.required && (
                    <span className="text-gray-400 ml-1">*</span>
                  )}
                </label>

                {renderField(
                  field,
                  formData[field.id], // ✅ use id here also
                  (_, val) => setFormData((p) => ({ ...p, [field.id]: val })),
                )}
              </div>
            ))}

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="flex-1 border border-gray-200 text-gray-600 py-2 rounded-md text-sm hover:bg-gray-50"
              >
                Back
              </button>

              <button
                type="submit"
                disabled={status === "submitting"}
                className="flex-1 bg-black text-white py-2 rounded-md text-sm hover:opacity-90 disabled:opacity-50"
              >
                {status === "submitting" ? "Submitting..." : "Submit"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

// ── Dynamic field renderer ───────────────────────────────────
const renderField = (field, value, onChange) => {
  const inputClass =
    "h-10 border p-2 rounded-xl bg-gray-100 w-full focus:outline-none focus:ring-2 focus:ring-[#335294]";
  switch (field.fieldType?.toLowerCase()) {
    case "text":
    case "string":
      return (
        <input
          type="text"
          className={inputClass}
          value={value}
          onChange={(e) => onChange(field.fieldid, e.target.value)}
        />
      );
    case "number":
      return (
        <input
          type="number"
          className={inputClass}
          value={value}
          onChange={(e) => onChange(field.fieldid, e.target.value)}
        />
      );
    case "email":
      return (
        <input
          type="email"
          className={inputClass}
          value={value}
          onChange={(e) => onChange(field.fieldid, e.target.value)}
        />
      );
    case "date":
      return (
        <input
          type="date"
          className={inputClass}
          value={value}
          onChange={(e) => onChange(field.fieldid, e.target.value)}
        />
      );
    case "boolean":
      return (
        <select
          className={inputClass}
          value={value}
          onChange={(e) => onChange(field.fieldid, e.target.value)}
        >
          <option value="">-- Select --</option>
          <option value="true">Yes</option>
          <option value="false">No</option>
        </select>
      );
    case "textarea":
      return (
        <textarea
          className="border p-2 rounded-xl bg-gray-100 w-full focus:outline-none focus:ring-2 focus:ring-[#335294]"
          rows={3}
          value={value}
          onChange={(e) => onChange(field.fieldid, e.target.value)}
        />
      );
    default:
      return (
        <input
          type="text"
          className={inputClass}
          value={value}
          onChange={(e) => onChange(field.fieldid, e.target.value)}
        />
      );
  }
};
export default UiRenderpage;
