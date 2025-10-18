import { BrowserRouter, Routes, Route } from "react-router-dom";
// import Home from "./Workspace/pages/Home/Home";
//import Auth from "./Workspace/Pages/Auth/Auth";
// import Register from "./Workspace/pages/Register/Register"; 
import Profile from "./Workspace/Pages/Profile/Profile"; 
import EventDetail from "./Workspace/Pages/EventDetail/EventDetail";
// import Operation from "./Workspace/pages/Operation/Operation";
import EventEdit from "./Workspace/Pages/EventEdit/EventEdit";
import Event from "./Workspace/Pages/Event/Event"; 
// import Login from "./Workspace/pages/Login/Login"; 
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<EventEdit />}/>
        <Route path="/Profile" element={<Profile />}/>
        <Route path="/Event" element={<Event />}/>
        <Route path="/Home/Even/EventDetail" element={<EventDetail />}/>
        <Route path="/Home/Event/Operation/EventEdit" element={<EventEdit />}/>
        {/* <Route path="/Home" element={<Home />}/>
        <Route path="/Login" element={<Login />}/>
        <Route path="/Register" element={<Register />}/>
        <Route path="/Home/Event/Operation/Operation" element={<Operation />}/> */}
      </Routes>
    </BrowserRouter>
  );
}
export default App;
