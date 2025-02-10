import Login from "./components/Login/Login";
import SignUp from "./components/Signup/SignUp";
import EventDashboard from "./components/EventDashboard/EventDashboard";
import EventDetails from "./components/EventDetails/EventDetails";
import { Route, Routes } from "react-router-dom";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element = {<Login/>} />
        <Route path="/signup" element = {<SignUp/>} />
        <Route path="/event-dashboard" element = {<EventDashboard/>} />
        <Route path="/event-details/:eventId" element = {<EventDetails/>} />
      </Routes>   
    </div>
  )
}

export default App;