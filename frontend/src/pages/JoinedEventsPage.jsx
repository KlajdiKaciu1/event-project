import { useEffect, useState } from "react";
import AccountNav from "./AccountNav";
import axios from "axios";

export default function JoinedEventsPage() {
    const [joinedEvents, setJoinedEvents] = useState([]);

    useEffect(() => {
        axios.get('/joinedEvents').then(response => {
            setJoinedEvents(response.data);
        }).catch(error => {
            console.error('Error fetching joined events:', error);
        });
    }, []);
    const formatDate= (dateString) => {
        const date = new Date(dateString);
        const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
        return formattedDate;
      };
    return (
      <div>
           <AccountNav />
            <div>
              {joinedEvents.length > 0 && joinedEvents.map(event => (
                <div key={event._id} className="flex gap-4 bg-gray-200 rounded-2xl overflow-hidden mb-8">
                    <div className="w-48">
                     {event.photos.length > 0 && (
                       <img className="object-cover" src={'http://localhost:4000/'+event.photos[0]} alt="" />
                       )}
                    </div>
                     <div className="py-3 pr-3 grow">
                         <h2 className="text-xl">{event.title} </h2>
                              <div className="my-3 flex gap-1">
                                     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                                      </svg>
                                   <h2 className="font-semibold underline">{event.address}</h2>
                             </div>
                          <div className="mb-2 mt-4 text-gray-500">
                             {formatDate(event.selectedDate)}
                          </div>
                    </div>
                </div> 
              ))}
         </div>
     </div>
    );
}