import { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate,Navigate } from "react-router-dom";
import { UserContext } from "../UserContex";
import axios from "axios"

export default function AttendeeFormPage() {
  const { event_id } = useParams();
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [studyField, setStudyField] = useState('');
  const [yearOfStudy, setYearOfStudy] = useState('');
  const [redirect,setRedirect] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name);
    } else {
      setShowPopup(true);
    }
  }, [user]);

  function inputHeader(text) {
    return (
      <h2 className="text-2xl mt-4">{text}</h2>
    );
  }

  function inputDescription(text) {
    return (
      <p className="text-gray-500 text-sm">{text}</p>
    );
  }

  function preInput(header, description) {
    return (
      <>
        {inputHeader(header)}
        {inputDescription(description)}
      </>
    );
  }

  function Popup({ message, redirectPath }) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white p-4 rounded shadow-lg">
          <p>{message}</p>
          <button 
            onClick={() => navigate(redirectPath)} 
            className="gap-2 py-2 px-6 rounded-full bg-primary text-white mb-4 mt-5"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }
  async function handleSubmit() {
    try {
      const response = await axios.post('/attendees', {
        eventId: event_id,
        name,
        phoneNumber,
        studyField,
        yearOfStudy,
      });
      alert('Attendee registered!');
      setRedirect('/');
    } catch (error) {
      console.error('Error registering attendee:', error);
      alert('Failed to register attendee.');
    }
  }
  
  if(redirect){
    return <Navigate to={redirect} />
}
  return (
    <div>
      <div className='text-2xl mt-4 flex justify-center font-bold'>Attendee Form</div>
      <div>
        {preInput('Name', 'Full name')}
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={ev => setName(ev.target.value)}
          disabled
        />
        {preInput('Phone Number', 'Write your phone number')}
        <input
          type="text"
          placeholder="xxxx-xxxx-xxxx"
          value={phoneNumber}
          onChange={ev => setPhoneNumber(ev.target.value)}
        />
        {preInput('Study Field', 'Ex..Computer Engineering')}
        <input
          type="text"
          value={studyField}
          onChange={ev => setStudyField(ev.target.value)}
        />
        {preInput('Year of Study')}
        <input className='p-2 border  border-gray-300 rounded-md'
          type="number"
          value={yearOfStudy}
          onChange={ev => setYearOfStudy(ev.target.value)}
        />
      </div>
      <div>
        <button  onClick={handleSubmit} className='inline-flex gap-1 bg-primary text-white py-3 px-7 rounded-full mt-10'>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
           <path strokeLinecap="round" strokeLinejoin="round" d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z" />
        </svg>
        Register
        </button>
      </div>
   {showPopup && <Popup message="User is not logged in" redirectPath="/login" />}
    </div>
  );
}



