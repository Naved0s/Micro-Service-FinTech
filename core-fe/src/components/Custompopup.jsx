import React, { useState } from 'react'

const Custompopup = ({ isOpen, onClose, onSave }) => {
const [name, setName] = useState("");
  const [type, setType] = useState("Person");

  if (!isOpen) return null;

  const handleSubmit = () => {
    const data = { name, type };
    onSave(data);
    setName("");
    setType("Person");
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      
      {/* Modal Box */}
      <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-lg">
        
        <h2 className="text-xl font-semibold mb-4">Create Entity</h2>

        {/* Name Input */}
        <input
          className="w-full border p-3 rounded-lg mb-4"
          placeholder="Enter Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        {/* Dropdown */}
        <select
          className="w-full border p-3 rounded-lg mb-6"
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          <option value="Person">Person</option>
          <option value="Company">Company</option>
        </select>

        {/* Buttons */}
        <div className="flex justify-end gap-4">
          <button
            className="px-4 py-2 rounded-lg bg-gray-300"
            onClick={onClose}
          >
            Cancel
          </button>

          <button
            className="px-4 py-2 rounded-lg bg-blue-600 text-white"
            onClick={handleSubmit}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default Custompopup