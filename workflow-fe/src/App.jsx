import HomePage from "./pages/HomePage";
import WorkflowPage from "./pages/WorkflowPage";
import Navbar from "./components/Navbar";
import JflowPage from "./pages/JflowPage";
import JhomePage from "./pages/JhomePage";
import { Route, Routes } from "react-router-dom";
import ViewWorkflowPage from "./pages/ViewWorkflowPage";
import ViewJflowPage from "./pages/ViewJflowPage";
const App = () => {
  return (
    <div className="h-screen flex flex-col">
      <Navbar />
      {/* <HomePage/> */}
      {/* <WorkflowPage/> */}
      {/* <JflowPage/> */}
      {/* <JhomePage/> */}

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/workflow" element={<WorkflowPage />} />
         <Route path="/workflow/:id" element={<ViewWorkflowPage />} />
        <Route path="/Jflow" element={<JhomePage />} />
                <Route path="/Jflow/:id" element={<ViewJflowPage />} />
        <Route path="/create-jflow" element={<JflowPage />} />
      </Routes>
    </div>
  );
};

export default App;
