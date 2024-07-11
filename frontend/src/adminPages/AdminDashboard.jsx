import { Link } from "react-router-dom";
import AdminNav from "./AdminNav";

export default function AdminDashboard() {
  return (
    <div>
      <AdminNav />
      <h1 className="text-4xl text-center mb-4">Admin Dashboard</h1>
      <div className="text-center">
        <br />
        <Link className="inline-flex gap-1 bg-primary text-white py-2 px-5 rounded-full" to={'/admin/new'}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Add new admin
        </Link>
    </div>
    </div>
  );
}
