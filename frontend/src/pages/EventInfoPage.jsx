import axios from "axios"
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import EventGallery from "../EventGallery";
export default function EventInfoPage(){
    const [event,setEvent] = useState(null);
    const {id} = useParams();
    useEffect(()=>{
    if(!id){
        return;
    }
    axios.get(`/events/${id}`).then(response=>{
       setEvent(response.data);
    });
    },[id]);
    if(!event) return '';
    return(
    <div className="mt-4 bg-gray-100 -mx-8 px-8 pt-4 py-8">
        <h1 className="text-3xl">{event.title}</h1>
        <h2 className="my-2 block bold font-semibold underline">{event.address}</h2>
        <EventGallery event={event} />
    </div>
    );
}