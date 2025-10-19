import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Workspace/Pages/Home/Home";
//import Auth from "./Workspace/Pages/Auth/Auth";
import Register from "./Workspace/Pages/Register/Register"; 
import Profile from "./Workspace/Pages/Profile/Profile"; 
import EventDetail from "./Workspace/Pages/EventDetail/EventDetail";
import EventManagement from "./Workspace/Pages/EventManagement/EventManagement";
import EventEdit from "./Workspace/Pages/EventEdit/EventEdit";
import Event from "./Workspace/Pages/Event/Event"; 
import EventAdd from "./Workspace/Pages/EventAdd/EventAdd"; 
import Login from "./Workspace/Pages/Login/Login"; 

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<EventManagement />}/>
        <Route path="/Home" element={<Home />}/>
        <Route path="/Register" element={<Register />}/>
        <Route path="/Login" element={<Login />}/>
        <Route path="/Profile" element={<Profile />}/>
        <Route path="/Event" element={<Event />}/>
        <Route path="/Home/Even/EventDetail" element={<EventDetail />}/>
        <Route path="/Home/Event/Operation/EventEdit" element={<EventEdit />}/>
        <Route path="/Home/Event/EventManagement/EventManagement" element={<EventManagement />}/> 
        <Route path="/Home/Event/EventAdd" element={<EventAdd />}/> 
      </Routes>
    </BrowserRouter>
  );
}
export default App;
