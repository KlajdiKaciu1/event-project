import {Link, Navigate} from "react-router-dom";
import axios from "axios";
import  {useContext} from 'react';
import React, { useState } from 'react';
import { UserContext } from "../UserContex";
export default function LoginPage()
{
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [redirectUser,setRedirectUser] = useState(false);
    const [redirectAdmin,setRedirectAdmin] = useState(false);
    const {setUser} = useContext(UserContext);

    async function handleLoginSubmit(ev){
        ev.preventDefault(); 
        try{
        const {data}= await axios.post('/login',{email,password});
        setUser(data);
        alert('Login successful!');
        if (data.isAdmin){
        setRedirectAdmin(true);
        }
        else{
        setRedirectUser(true);
        }
        } catch(e){
            alert('Login failed!');
        }
    }
    if(redirectUser){
       return <Navigate to={'/'} />
        }
        if(redirectAdmin){
            return <Navigate to={'/admin'} />
             }
    return(
    <div className="mt-4 grow flex items-center justify-around">
        <div className="mb-64">
        <h1 className="text-4xl text-center mb-4">Login</h1>
        <form className="max-w-md mx-auto " onSubmit={handleLoginSubmit}>
            <input type="email" placeholder={"your@email.com"} 
             value={email} 
            onChange={ev =>setEmail(ev.target.value)}/>

            <input type="password" placeholder="password" 
            value={password} 
            onChange={ev =>setPassword(ev.target.value)}/>

            <button className="primary">Login</button>
            <div className="text-center py-2 text-gray-500">
                I don't have an account! {"\t"}
                <Link className="underline text-black" to={'/register'}>Register</Link>
            </div>
        </form>
        </div>
    </div>
    );
}