import { BrowserRouter, Routes, Route } from "react-router-dom";
import Auth from "./Workspace/Pages/Auth/Auth";
import Home from "./Workspace/Pages/Home/Home";
import Register from "./Workspace/Pages/Register/Register";
import Login from "./Workspace/Pages/Login/Login"; 
import Profile from "./Workspace/Pages/Profile/Profile";
import Event from "./Workspace/Pages/Event/Event";
import EventDetail from "./Workspace/Pages/EventDetail/EventDetail";
import EventEdit from "./Workspace/Pages/EventEdit/EventEdit";
import EventAdd from "./Workspace/Pages/EventAdd/EventAdd";
import EventManagement from "./Workspace/Pages/EventManagement/EventManagement";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Auth />}/>
        <Route path="/Home" element={<Home />}/>
        <Route path="/Register" element={<Register />}/>
        <Route path="/Login" element={<Login />}/>
        <Route path="/Profile" element={<Profile />}/>
        <Route path="/Profile/:UserID" element={<Profile />} />
        <Route path="/Event" element={<Event />}/>
        <Route path="/Event/:EventID" element={<EventDetail />}/>
        <Route path="/Event/:EventID/EventEdit" element={<EventEdit />}/>
        <Route path="/Event/AddEvent" element={<EventAdd />}/> 
        <Route path="/Event/:EventID/ManagementEvent" element={<EventManagement />}/>
      </Routes>
    </BrowserRouter>
  );
}
export default App;