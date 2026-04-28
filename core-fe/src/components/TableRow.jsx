import { Pen, Trash } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";

export const TableRow = (props) => {
  const navigate = useNavigate();
  const navigateToScreen = (props, page) => {
    console.log("This is send props ", props);

    navigate(`${page}`, {
      state: props.f_data,
    });
  };

  return (
    <tr className="text-center">
      <td className="border border-slate-300 p-2 ">{props.s_no}</td>
      <td className="border border-slate-300 p-2">{props.f_data.name}</td>
      <td className="border border-slate-300 p-2">{props.f_data.type}</td>
      <td className="border border-slate-300 p-2">
        <div className="flex flex-row justify-center ">
          <Pen
            className="mr-6 active:scale-75"
            onClick={() => {
              if (props.f_data.type === "Person") {
                navigateToScreen(props, "/create");
              } else {
                navigateToScreen(props, "/createCompany");
              }
            }}
          />
          <Trash className="ml-6 active:scale-75" />
        </div>
      </td>
    </tr>
  );
};
