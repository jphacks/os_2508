import { BrowserRouter, Routes, Route } from "react-router-dom";
import Auth from "./Workspace/Pages/Auth/Auth";
import Home from "./Workspace/Pages/Home/Home";
import Register from "./Workspace/Pages/Register/Register";
// import Login from "./Workspace/Pages/Login/Login"; 
import Profile from "./Workspace/Pages/Profile/Profile";
import Event from "./Workspace/Pages/Event/Event";
import EventDetail from "./Workspace/Pages/EventDetail/EventDetail";
// import EventEdit from "./Workspace/Pages/EventEdit/EventEdit";
// import Operation from "./Workspace/pages/Operation/Operation";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Auth />}/>
        <Route path="/Home" element={<Home />}/>
        <Route path="/Register" element={<Register />}/>
        {/* <Route path="/Login" element={<Login />}/> */}
        <Route path="/Profile" element={<Profile />}/>
        <Route path="/Profile/:UserID" element={<Profile />} />
        <Route path="/Event" element={<Event />}/>
        <Route path="/Event/:EventID" element={<EventDetail />}/>
        {/* <Route path="/Event/:EventID/EditEvent" element={<EventEdit />}/> */}
        {/* <Route path="/Event/:EventID/AddEvent" element={<EventEdit />}/> */}
        {/*<Route path="/Event/:EventID/Operation" element={<Operation />}/> */}
      </Routes>
    </BrowserRouter>
  );
}
export default App;
