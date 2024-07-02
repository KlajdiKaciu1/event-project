import { useState } from "react";
import axios from "axios";
import { Navigate } from "react-router-dom";
import Features from "../Features";
import PhotosUploader from "../PhotosUploader";
import AccountNav from "./AccountNav";
export default function EventsFormPage(){
  const [title, setTitle] = useState('');
  const [address, setAddress] = useState('');
  const [description, setDescription] = useState('');
  const [features, setFeatures] = useState([]);
  const [addedPhotos, setAddedPhotos] = useState([]);
  const [redirect,setRedirect] = useState(false);
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
  async function addNewEvent(ev){
    ev.preventDefault();
    await axios.post('/events', {
      title, address, addedPhotos, description,features
    });
    setRedirect(true);
  }
   if(redirect){
    return <Navigate to={'/account/events'} />
   }
    return(
         <div>
          <AccountNav />
        <form onSubmit={addNewEvent}>
          {preInput('Title', 'Title of the event')}
          <input type="text" value={title}
            onChange={ev => setTitle(ev.target.value)}
            placeholder="title" />
          {preInput('Address', 'Address to the event')}
          <input type="text"
            value={address} onChange={ev => setAddress(ev.target.value)}
            placeholder="address" />

          <h2 className="text-2xl mt-4">Photos</h2>
          <PhotosUploader addedPhotos={addedPhotos} onChange={setAddedPhotos} />
          {preInput('Description', 'Description of the event')}
          <textarea value={description} onChange={ev => setDescription(ev.target.value)} />
          {preInput('Features', 'Select the features of the event')}
          <Features selected={features} onChange={setFeatures} />
          <div>
            <button className="primary my-4">Save</button>
          </div>
        </form>
      </div>
      );
    
}