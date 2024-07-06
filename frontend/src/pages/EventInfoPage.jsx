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
    return (
        <div className="mt-4 bg-gray-100 -mx-8 px-8 pt-4 py-8">
            <h1 className="text-3xl">{event.title}</h1>
            <div className="my-3 flex gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                </svg>
                <h2 className="font-semibold underline">{event.address}</h2>
            </div>
            
            <div className="grid gap-8 grid-cols-1 md:grid-cols-[3fr_2fr]">
                <div>
                    <EventGallery event={event} />
                </div>
                <div>
                    <div className="my-4">
                        <h2 className="font-semibold text-2xl">Description</h2>
                        <p>{event.description}</p>
                    </div>
                    <div className="my-4 flex flex-col md:flex-row gap-8">
                        <div className="md:w-1/2">
                            <h2 className="font-semibold text-2xl">Features</h2>
                            <ul className="list-disc pl-5">
                                {event.features.map((feature, index) => (
                                    <li key={index} className="mt-2">{feature}</li>
                                ))}
                            </ul>
                            <button className="inline-flex gap-1 bg-primary text-white py-2 px-5 rounded-full mt-6">Join Event</button>
                        </div>
                        <div className="md:w-1/2">
                            <h2 className="font-semibold text-2xl">Attendees</h2>
                            <div>Attendees</div>
                            <div>Attendees</div>
                            <div>Attendees</div>
                            <div>Attendees</div>
                            <div>Attendees</div>
                            <div>Attendees</div>
                            <div>Attendees</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}    