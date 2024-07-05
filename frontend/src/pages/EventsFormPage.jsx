import { useEffect, useState } from "react";
import axios from "axios";
import { Navigate,useParams } from "react-router-dom";
import Features from "../Features";
import PhotosUploader from "../PhotosUploader";
import AccountNav from "./AccountNav";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
export default function EventsFormPage(){
  const {id} = useParams();
  const [title, setTitle] = useState('');
  const [address, setAddress] = useState('');
  const [description, setDescription] = useState('');
  const [features, setFeatures] = useState([]);
  const [addedPhotos, setAddedPhotos] = useState([]);
  const [redirect,setRedirect] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  useEffect(()=>{
   if(!id){
    return;
   }
   axios.get('/events/'+id).then (response => {
   const {data} = response;
   setTitle(data.title);
   setAddress(data.address);
   setAddedPhotos(data.photos);
   setDescription(data.description);
   setFeatures(data.features);
   setSelectedDate(data.selectedDate)
   });
  }, [id]);
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
  async function saveEvent(ev) {
    ev.preventDefault();
    const eventData = { title, address, addedPhotos, description, features, selectedDate };
    if (id) {
        await axios.put(`/events/${id}`, eventData);
        setRedirect(true);
    } else {
        await axios.post('/events', eventData);
        setRedirect(true);
    }
}

   if(redirect){
    return <Navigate to={'/account/events'} />
   }
    return(
         <div>
          <AccountNav />
        <form onSubmit={saveEvent}>
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
          <h2 className="text-2xl mt-4">Date</h2>
          <DatePicker
           selected={selectedDate}
           onChange={date => setSelectedDate(date)}
           dateFormat="yyyy/MM/dd"
         />
          <div>
            <button className="primary my-4">Save</button>
          </div>
        </form>
      </div>
      );
    
}