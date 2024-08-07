import './App.css'
import {Route, Routes} from "react-router-dom";
import IndexPage from './pages/IndexPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AccountPage from './pages/AccountPage';
import EventPage from './pages/EventPage';
import EventsFormPage from './pages/EventsFormPage';
import EventInfoPage from './pages/EventInfoPage';
import AttendeeFormPage from './pages/AttendeeFormPage';
import JoinedEventsPage from './pages/JoinedEventsPage';
import AdminDashboard from './adminPages/AdminDashboard';
import ManageUsersPage from './adminPages/ManageUsersPage';
import CreateAdmin from './adminPages/CreateAdmin';
import ListingEventsPage from './adminPages/ListingEventsPage';
import UpdateEvents from './adminPages/UpdateEvents';
import Layout from './Layout';
import axios from "axios";
import { UserContextProvider } from './UserContex';


axios.defaults.baseURL='http://localhost:4000';
axios.defaults.withCredentials=true; //the axios api call always sends jwt tokens
function App() {
  return (
    <UserContextProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<IndexPage />}/>  
          <Route path="/login" element={<LoginPage />}/>
          <Route path="/register" element={<RegisterPage />}/>
          <Route path="/account/" element={<AccountPage />}/>
          <Route path="/account/events"  element={<EventPage />}/>
          <Route path="/account/events/new"  element={<EventsFormPage />}/>
          <Route path="/account/events/:id"  element={<EventsFormPage />}/>
          <Route path="/event/:id" element={<EventInfoPage />}/>
          <Route path="/event/:event_id/form" element={<AttendeeFormPage />}/>
          <Route path="/account/joinedEvents"  element={<JoinedEventsPage />}/>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/manage-users" element={<ManageUsersPage />} />
          <Route path="/admin/new" element={<CreateAdmin />} />
          <Route path="/admin/update-events" element={<ListingEventsPage />} />
          <Route path="/admin/update-events/:id" element={<UpdateEvents />} />
        </Route>
      </Routes>
  </UserContextProvider>
      
  )
}

export default App
