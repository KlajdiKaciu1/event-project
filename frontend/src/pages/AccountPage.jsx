import { useContext, useState } from "react";
import { UserContext } from "../UserContex";
import { Navigate, useParams } from "react-router-dom";
import EventPage from './EventPage';
import axios from "axios";
import AccountNav from "./AccountNav";

export default function AccountPage(){
    const [redirect,setRedirect]= useState(null);
    const {ready,user,setUser} = useContext(UserContext);
    let {subpage}=useParams();
    if(subpage === undefined){
        subpage='profile';
    }
   
    if(ready && !user && !redirect){
        return <Navigate to={'/login'}></Navigate>
    }
    async function logout(){
        await axios.post('logout');
        setRedirect('/');
        setUser(null);
    }
    if(redirect){
        return <Navigate to={redirect} />
    }
    return(
        <div>
          <AccountNav />
            {subpage === 'profile' && (
                <div className="text-center max-w-lg mx-auto">
                    Logged in as {user.name} ({user.email})<br />
                    <button onClick={logout} className="primary max-w-sm mt-2">Logout</button>
                </div>
            )}
            {subpage === 'events' && (
                <EventPage />
            )}
        </div>
    );
}