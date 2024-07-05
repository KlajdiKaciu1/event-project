import { Link } from "react-router-dom";
import axios from "axios";
import AccountNav from "./AccountNav";
import { useEffect, useState } from "react";

export default function EventPage() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    axios.get('/user-events').then(({ data }) => {
      setEvents(data);
    });
  }, []);
  
  function deleteEvent(eventId) {
    axios.delete(`/events/${eventId}`)
      .then(() => {
        setEvents(events.filter(event => event._id !== eventId));
      })
      .catch(error => {
        console.error("Error deleting event:", error);
      });
  }
  return (
    <div>
      <AccountNav />
      <div className="text-center">
        <br />
        <Link className="inline-flex gap-1 bg-primary text-white py-2 px-5 rounded-full" to={'/account/events/new'}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Add new event
        </Link>
    </div>
      <div className="mt-4">
        {events.length > 0 && events.map(event => (
        <div key={event._id} >    
          <Link
            to={'/account/events/' + event._id}
            className="flex cursor-pointer gap-4 bg-gray-100 p-4 rounded-2xl mb-4"
          >
            <div className="flex w-32 h-32 bg-gray-300  shrink-0">
              {event.photos.length > 0 && (
                <img className="object-cover" src={'http://localhost:4000/'+event.photos[0]} alt="" />
              )}
            </div>
            <div className="grow-0 shrink">
              <h2 className="text-xl">{event.title}</h2>
              <p className="text-sm mt-2">{event.description}</p>
            </div>
          </Link>
          <button onClick={() => deleteEvent(event._id)} 
             className="inline-flex gap-2 py-2 px-6 rounded-full bg-primary text-white mb-4">
             Delete Event
          </button>
        </div>
        ))}
      </div>
    </div>
  );
}

