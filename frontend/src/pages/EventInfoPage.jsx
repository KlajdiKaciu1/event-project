import axios from "axios"
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import EventGallery from "../EventGallery";
import { Link } from "react-router-dom";
export default function EventInfoPage(){
    const [event,setEvent] = useState(null);
    const [attendee,setAttendee] = useState([]);
    const {id} = useParams();
    useEffect(()=>{
    if(!id){
        return;
    }
    axios.get(`/events/${id}`).then(response=>{
       setEvent(response.data);
    });
    axios.get(`/attendee/${id}`).then(response=>{
        setAttendee(response.data);
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
                        <Link to={'/event/'+event._id+'/form/'}  className="inline-flex gap-1 bg-primary text-white py-3 px-7 rounded-full mt-10">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z" />
                            </svg>
                          Join Event
                        </Link>
                        </div>
                        <div className="md:w-1/2">
                            <h2 className="font-semibold text-2xl">Attendees</h2>
                            <ul className="list-disc pl-5">
                                {attendee.map((att, index) => (
                                    <li key={index} className="mt-2">{att.name}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}    