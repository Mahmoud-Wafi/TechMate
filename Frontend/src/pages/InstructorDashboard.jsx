// import { useEffect, useState } from 'react';
// import { tutorialsAPI } from '../services/api';
// import { Link, useNavigate } from 'react-router-dom';
// import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';

// export default function InstructorDashboard() {
//   const [tutorials, setTutorials] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();

//   useEffect(() => {
//     fetchMyTutorials();
//   }, []);

//   const fetchMyTutorials = async () => {
//     try {
//       setLoading(true);
//       // endpoint to get logged-in instructor's tutorials
//       const res = await tutorialsAPI.getAll({ me: 'true' });
//       setTutorials(res.data);
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDelete = async (id) => {
//     if (!confirm('Delete this tutorial?')) return;
//     try {
//       await tutorialsAPI.delete(id);
//       setTutorials((t) => t.filter((tt) => tt.id !== id));
//     } catch (err) {
//       console.error(err);
//       alert('Delete failed');
//     }

//  // If the user is an instructor but not approved:
//   const isInstructorRole = user?.profile?.role === 'instructor';
//   if (isInstructorRole && !isInstructorApproved) {
//     return (
//       <div className="max-w-3xl mx-auto py-12 px-4 text-center">
//         <h2 className="text-2xl font-bold mb-4">Instructor Access Pending</h2>
//         <p className="text-gray-700 mb-4">
//           Your account is registered as an instructor but is pending admin approval.
//         </p>
//         <p className="text-gray-600">
//           An admin must approve your account before you can create tutorials. You will be notified after approval.
//         </p>
//       </div>
//     );
//   }
//   };

//   return (
//     <div className="max-w-6xl mx-auto py-8 px-4">
//       <div className="flex items-center justify-between mb-6">
//         <h1 className="text-2xl font-bold">Instructor Dashboard</h1>
//         <div className="space-x-3">
//           <button
//             onClick={() => navigate('/instructor/tutorials/create')}
//             className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
//           >
//             <FaPlus className="mr-2" /> Create Tutorial
//           </button>
//         </div>
//       </div>

//       {loading ? (
//         <div className="py-20 text-center">Loading...</div>
//       ) : tutorials.length === 0 ? (
//         <div className="py-20 text-center">
//           <p className="text-gray-600">You have no tutorials yet.</p>
//         </div>
//       ) : (
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           {tutorials.map((t) => (
//             <div key={t.id} className="bg-white shadow rounded-lg p-4">
//               <div className="flex justify-between items-start">
//                 <div>
//                   <h2 className="text-lg font-semibold">{t.title}</h2>
//                   <p className="text-sm text-gray-600 mt-1">{t.description}</p>
//                   <div className="text-xs text-gray-500 mt-2">
//                     {t.content_count || 0} lessons • created on {new Date(t.created_at).toLocaleDateString()}
//                   </div>
//                 </div>

//                 <div className="flex flex-col items-end space-y-2">
//                   <Link to={`/instructor/tutorials/${t.id}/edit`} className="text-indigo-600 hover:underline">
//                     <FaEdit /> Edit
//                   </Link>
//                   <Link to={`/instructor/tutorials/${t.id}/add-content`} className="text-green-600 hover:underline">
//                     + Add Content
//                   </Link>
//                   <button onClick={() => handleDelete(t.id)} className="text-red-600 hover:underline text-left">
//                     <FaTrash /> Delete
//                   </button>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }
// frontend/src/pages/InstructorDashboard.jsx
import { useEffect, useState } from 'react';
import { tutorialsAPI } from '../services/api';
import { Link, useNavigate } from 'react-router-dom';
import { FaPlus, FaEdit, FaTrash, FaPlay } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

export default function InstructorDashboard() {
  const [tutorials, setTutorials] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, isInstructorApproved } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && (user.profile.role === 'admin' || (user.profile.role === 'instructor' && isInstructorApproved))) {
      fetchMyTutorials();
    }
  }, [user, isInstructorApproved]);

  const fetchMyTutorials = async () => {
    try {
      setLoading(true);
      const res = await tutorialsAPI.getAll({ me: 'true' });
      setTutorials(res.data);
    } catch (err) {
      console.error('Failed to fetch tutorials', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this tutorial?')) return;
    try {
      await tutorialsAPI.delete(id);
      setTutorials((t) => t.filter((tt) => tt.id !== id));
    } catch (err) {
      console.error(err);
      alert('Delete failed');
    }
  };

  // if instructor not approved, show pending message
  if (user?.profile?.role === 'instructor' && !isInstructorApproved) {
    return (
      <div className="max-w-3xl mx-auto py-16 px-4 text-center">
        <h2 className="text-2xl font-bold mb-4">Instructor Access Pending</h2>
        <p className="text-gray-700 mb-4">Your instructor account is awaiting admin approval. You will be notified when it is approved.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Instructor Dashboard</h1>
        <div className="space-x-3">
          <button
            onClick={() => navigate('/instructor/tutorials/create')}
            className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            <FaPlus className="mr-2" /> Create Tutorial
          </button>
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center">Loading…</div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {tutorials.map((t) => (
              <div key={t.id} className="bg-white shadow rounded-lg p-4 flex flex-col">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold">{t.title}</h3>
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">{t.description}</p>
                    <div className="text-xs text-gray-500 mt-2">
                      {t.content_count || 0} lessons • {new Date(t.created_at).toLocaleDateString()}
                    </div>
                  </div>

                  <div className="ml-4 flex flex-col items-end space-y-2">
                    <Link to={`/tutorials/${t.id}`} className="text-indigo-600 hover:underline flex items-center">
                      <FaPlay className="mr-2" /> View
                    </Link>
                    <Link to={`/instructor/tutorials/${t.id}/edit`} className="text-indigo-600 hover:underline flex items-center">
                      <FaEdit className="mr-2" /> Edit
                    </Link>
                    <Link to={`/instructor/tutorials/${t.id}/add-content`} className="text-green-600 hover:underline">
                      + Add Content
                    </Link>
                    <button onClick={() => handleDelete(t.id)} className="text-red-600 hover:underline">
                      <FaTrash className="mr-2 inline" /> Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {tutorials.length === 0 && (
            <div className="py-20 text-center bg-white rounded-lg shadow p-8">
              <p className="text-gray-600">No tutorials yet. Click "Create Tutorial" to get started.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
