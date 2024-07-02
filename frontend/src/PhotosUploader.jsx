import axios from "axios";
export default function PhotosUploader({addedPhotos,onChange}){
    function uploadPhoto(ev) {
        const files = ev.target.files;
        const data = new FormData();
        for (let i = 0; i < files.length; i++) {
          data.append('photos', files[i]);
        }
        axios.post('/upload', data, {
          headers: { 'Content-type': 'multipart/form-data' }
        }).then(response => {
          const { data: filenames } = response;
          onChange(prev => [...prev,...filenames]);
        });
      }
    
    return(
        <>
         <div className="mt-2 grid gap-2 grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
              {addedPhotos.length > 0 && addedPhotos.map((link, index) => (
                <div key={index} className="h-32 flex">
                  <img className="rounded-2xl w-full object-cover" src={'http://localhost:4000/' + link} alt="" />
                </div>
              ))}
              <label className=" h-32 cursor-pointer flex items-center gap-1 justify-center border bg-transparent rounded-2xl p-2 text-2xl text-gray-600">
                <input type="file" multiple className="hidden" onChange={uploadPhoto} />
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
                </svg>
                Upload
              </label>
            </div>
        </>
    );
}