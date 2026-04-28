import React from "react";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import { EntityPage } from "./pages/EntityPage";
import CreateEntityPage from "./pages/CreateEntityPage";
import Custompopup from "./components/Custompopup";
import { Route, Routes } from "react-router-dom";
import CreateCompanypage from "./pages/CreateCompanypage";
import FormPage from "./pages/FormPage";
import Createformpage from "./pages/Createformpage";
import CreateDatamodelpage from "./pages/CreateDatamodelpage";
import EditformPage from "./pages/EditformPage";
import ApplicationPage from "./pages/ApplicationPage";
import ViewApplication from "./pages/ViewApplication";
import PublicFormPage from "./pages/Publicformpage";
import UiRenderpage from "./pages/UiRenderpage";


const App = () => {
  return (
    <div >
      <Routes>
        <Route path="/submit/:formId" element={<UiRenderpage />} />
      </Routes>
      <div className="h-screen flex flex-col">
<Navbar />
     {/* <EntityPage/> */}
     {/* <CreateEntityPage/> */}
    {/* <Custompopup isOpen={true} onClose={false}/> */}
    <Routes>
      <Route path="/" element={<EntityPage/>} />
      <Route path="/create" element={<CreateEntityPage/>}/>
      <Route path="/createCompany" element={<CreateCompanypage/>}/>
      <Route path="/forms" element={<FormPage/>}/>
      <Route path="/forms/create" element={<Createformpage/>}/>
      <Route path="/forms/edit/:id" element={<EditformPage />}/>
      <Route path="/datamodel/create" element={<CreateDatamodelpage/>}/>
      <Route path="/applications" element={<ApplicationPage/>}/>
      <Route path="/applications/view/:id" element={<ViewApplication/>}/>
    
    </Routes>
      </div>
      
    
    </div>
  );
};

export default App;
