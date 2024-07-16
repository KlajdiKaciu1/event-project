import { Link, Navigate } from "react-router-dom";
import axios from "axios";
import { useState } from "react";

export default function RegisterPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isAdmin] = useState(true);
    const [redirect,setRedirect] = useState(false);

   async  function registerUser(ev) {
        ev.preventDefault();
    try{
        await axios.post('/register', {
            name,
            email,
            password,
            isAdmin
        });
        alert('Registration completed!');
        setRedirect(true);
    }catch(e)
    {
        alert('Registration failed!');
    }
}
if (redirect){
    return <Navigate to={'/admin'} />
}

    return (
        <div className="mt-4 grow flex items-center min-h-screen  justify-center bg-gray-100">
            <div className="mb-64">
                <h1 className="text-4xl text-center mb-4">Create new Admin</h1>
                <form className="max-w-md mx-auto" onSubmit={registerUser}>
                    <input type="text" placeholder="Name Surname" 
                           value={name} 
                           onChange={ev => setName(ev.target.value)} />
                    
                    <input type="email" placeholder="your@email.com"
                           value={email} 
                           onChange={ev => setEmail(ev.target.value)} />
                    
                    <input type="password" placeholder="password"
                           value={password} 
                           onChange={ev => setPassword(ev.target.value)} />
             
                    <button className="primary">SignUp</button>
                </form>
            </div>
        </div>
    );
}