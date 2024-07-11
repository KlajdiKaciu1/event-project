import AdminNav from "./AdminNav";
import { Link } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
export default function ListingEventsPage() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    axios.get('/admin/events').then(({ data }) => {
      setEvents(data);
    });
  }, []);
  function deleteEvent(eventId) {
    axios.delete(`/admin/events/${eventId}`)
      .then(() => {
        setEvents(events.filter(event => event._id !== eventId));
      })
      .catch(error => {
        console.error("Error deleting event:", error);
      });
    }
  return (
    <div>
      <AdminNav />
      <div className="text-center">
    </div>
      <div className="mt-4">
        {events.length > 0 && events.map(event => (
        <div key={event._id} >    
          <Link
            to={'/admin/update-events/' + event._id}
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