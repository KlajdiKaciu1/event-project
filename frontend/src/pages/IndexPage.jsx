import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function IndexPage() {
    const [events, setEvents] = useState([]);
    useEffect(() => {
        axios.get('/events').then(response => {
            setEvents(response.data);
        });
    }, []);

    const formatDate= (dateString) => {
        const date = new Date(dateString);
        const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
        return formattedDate;
      };
    return (
        <div className=" mt-8 grid gap-6 gap-x-6 gap-y-8 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {events.length > 0 && events.map(event => (
                <Link key={event.id} to={'/event/'+event._id}>
                    <div className="bg-gray-500 rounded-2xl flex mb-2">
                        {event.photos?.[0] && (
                        <img className="rounded-2xl object-cover aspect-square" src={'http://localhost:4000/'+ event.photos?.[0]} alt="" />
                        )}
                     </div>
                     <h2 className="font-bold">{event.title}</h2>
                    <h3 className="text-sm leading-4 text-gray-800">{event.address}</h3>
                    <h2 className=" font-bold text-sm leading-4 text-gray-600">Date: {formatDate(event.selectedDate)}</h2>
                </Link>
            ))}
        </div>
    );
}
