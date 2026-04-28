import React from "react";

const Formfieldview = ({fieldName , fieldValue , required}) => {
  return (
    <div className="bg-gray-200 rounded-xl px-4 py-2 w-full max-w-md m-2">
      <div className="flex flex-col">
        <span className="text-sm text-gray-600">
        {fieldName}<span className="text-red-500"> {required ? "*" : ""} </span>
        </span>
        <span className="text-base font-medium text-gray-900">
        {fieldValue}
        </span>
      </div>
    </div>
  );
};

export default Formfieldview;