import React, { useState } from 'react'

const DatamodelFormPopup = ({isopen, onclose, onsave} ) => {
 const [name, setName] = useState("");
 const [type, setType] = useState("");
   const [isrequired, setIsRequired] = useState(true);
  
  
   if (!isopen) return null;
 
   const handleSubmit = () => {
    const data = {
    fieldName: name,
    fieldType: type,
    required: isrequired
  };
      onsave(data);
  
    
     setName("");
     setType("");
     setIsRequired(true)
     onclose(); 
   };
 
   return (
     <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
       
       {/* Modal Box */}
       <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-lg">
         
         <h2 className="text-xl font-semibold mb-4">Create DataModel</h2>
 
         {/* Name Input */}
         <input
           className="w-full border p-3 rounded-lg mb-4"
           placeholder="FieldName"
           value={name}
           onChange={(e) => setName(e.target.value)}
         />
          <input
           className="w-full border p-3 rounded-lg mb-4"
           placeholder="FieldType"
           value={type}
           onChange={(e) => setType(e.target.value)}
         />
          <select
          className="w-full border p-3 rounded-lg mb-6"
          value={isrequired}
          onChange={(e) => setIsRequired(e.target.value ===true)}
        >
          <option value={true}>True</option>
          <option value={false}>False</option>
        </select>
 
       
 
         {/* Buttons */}
         <div className="flex justify-end gap-4">
           <button
             className="px-4 py-2 rounded-lg bg-gray-300"
             onClick={onclose}
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
}

export default DatamodelFormPopup;