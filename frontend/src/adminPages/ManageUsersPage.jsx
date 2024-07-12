import { useState, useEffect } from "react";
import axios from "axios";
import AdminNav from "./AdminNav";

export default function ManageUsersPage() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios.get('/admin/users').then(({ data }) => {
      setUsers(data);
    });
  }, []);

  const deleteUser = async (userId) => {
    await axios.delete(`/admin/users/${userId}`);
    setUsers(users.filter(user => user._id !== userId));
  };

  return (
  <div>
      <AdminNav />
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-3xl">
          <h1 className="font-semibold text-2xl mb-6 text-center">Manage Users</h1>
          <ul className="list-disc pl-5">
            {users.map(user => (
              <li key={user._id} className="flex justify-between items-center mb-4">
                <span>
                  {user.name} ({user.email})
                </span>
                <button 
                  className="inline-flex gap-2 py-2 px-6 rounded-full bg-primary text-white" 
                  onClick={() => deleteUser(user._id)}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
       </div>
     </div>
  </div>
  );
  
  
  
}
