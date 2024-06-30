import { useState } from "react";
import {Link, useParams} from "react-router-dom";
import Features from "../Features";
export default function EventPage(){
    const {action} = useParams();
    const [title,setTitle] = useState('');
    const [address,setAddress] = useState('');
    const [addedPhotos,setAddedPhotos] = useState([]);
    const [photoLink,setPhotoLink] = useState('');
    const [description,setDescription] = useState('');
    const [features,setFeatures] = useState([]);
    function inputHeader(text){
        return(
            <h2 className="text-2xl mt-4">{text}</h2>
        );
    }
    function inputDescription(text){
        return(
            <p className="text-gray-500 text-sm">{text}</p>
        );
    }
    function preInput(header,description){
        return(
            <>
             {inputHeader(header)}
             {inputDescription(description)}
            </>
        );
    }
    return(
        <div>
            {action != 'new' && (
                   <div className="text-center">
                   <Link className=" inline-flex gap-1 bg-primary text-white py-2 px-5 rounded-full" to={'/account/events/new'}>
                       <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                       <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                       </svg>
                   Add new event
                   </Link>
                   </div>
            )}
            {action === 'new' && (
                <div>
                    <form>
                        {preInput('Title','Title of the event')}
                        <input type="text" value={title} 
                        onChange={ev=>setTitle(ev.target.value)} 
                        placeholder="title"/>
                        {preInput('Address','Address to the event')}
                        <input type="text" 
                         value={address} onChange={ev=>setAddress(ev.target.value)}
                          placeholder="address"/>
                        <h2 className="text-2xl mt-4">Photos</h2>
                        <div className="flex gap-2">
                            <input type="text"
                             value={photoLink} onChange={ev=>setPhotoLink(ev.target.value)} 
                             placeholder={"Add using link ...jpg"}/>
                            <button className="bg-gray-200 px-4 rounded-2xl">Add&nbsp;photo</button>
                        </div>
                        <div className="mt-2 grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                          <button className=" flex gap-1 justify-center border bg-transparent rounded-2xl p-8 text-2xl text-gray-600">
                             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-8">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
                             </svg>
                            Upload
                          </button>
                        </div>
                        {preInput('Description','Description of the event')} 
                        <textarea value={description} onChange={ev=>setDescription(ev.target.value)}/>
                        {preInput('Features','Select the features of the event')} 
                        <Features selected={features} onChange={setFeatures}/>
                        <div>
                            <button className="primary my-4">Save</button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}