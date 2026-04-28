import { Pen, Trash } from "lucide-react";
import React from "react";

const DatamodelTableRow = (props) => {
  return (
    <tr className="text-center">
      <td className="border border-slate-300 p-2 ">{props.index + 1}</td>
      <td className="border border-slate-300 p-2">{props.field.fieldName}</td>
      <td className="border border-slate-300 p-2">{props.field.fieldType}</td>
      <td className="border border-slate-300 p-2">
        {props.field.required.toString().toLocaleUpperCase()}
      </td>
      <td className="border border-slate-300 p-2">
        <div className="flex flex-row justify-center ">
          <Pen
            className="mr-6 active:scale-75"
            // onClick={() => {
            //   if (props.f_data.type === "Person") {
            //     navigateToScreen(props, "/create");
            //   } else {
            //     navigateToScreen(props, "/createCompany");
            //   }
            // }}
          />
          <Trash
            className="ml-6 active:scale-75 cursor-pointer"
            onClick={() => props.onDelete(props.field.id)}
          />
        </div>
      </td>
    </tr>
  );
};

export default DatamodelTableRow;
