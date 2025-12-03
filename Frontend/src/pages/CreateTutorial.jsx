// import { useState } from 'react';
// import { tutorialsAPI } from '../services/api';
// import { useNavigate } from 'react-router-dom';

// export default function CreateTutorial() {
//   const [form, setForm] = useState({
//     title: '',
//     description: '',
//     is_featured: false,
//     thumbnail: null,
//   });
//   const [submitting, setSubmitting] = useState(false);
//   const navigate = useNavigate();

//   const onChange = (e) => {
//     const { name, value, type, checked, files } = e.target;
//     if (type === 'file') {
//       setForm((s) => ({ ...s, [name]: files[0] }));
//     } else if (type === 'checkbox') {
//       setForm((s) => ({ ...s, [name]: checked }));
//     } else {
//       setForm((s) => ({ ...s, [name]: value }));
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setSubmitting(true);
//     try {
//       const data = {
//         title: form.title,
//         description: form.description,
//         is_featured: form.is_featured,
//         thumbnail: form.thumbnail,
//       };
//       const res = await tutorialsAPI.create(data);
//       const created = res.data;
//       // redirect to add content for created tutorial
//       navigate(`/instructor/tutorials/${created.id}/add-content`);
//     } catch (err) {
//       console.error(err);
//       alert('Create failed');
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   return (
//     <div className="max-w-3xl mx-auto py-8 px-4">
//       <h1 className="text-2xl font-bold mb-4">Create Tutorial</h1>

//       <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded shadow">
//         <div>
//           <label className="block text-sm font-medium text-gray-700">Title</label>
//           <input name="title" value={form.title} onChange={onChange} required className="mt-1 p-2 border rounded w-full" />
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-gray-700">Description</label>
//           <textarea name="description" value={form.description} onChange={onChange} required className="mt-1 p-2 border rounded w-full" rows="4" />
//         </div>

//         <div className="flex items-center space-x-4">
//           <label className="flex items-center space-x-2">
//             <input type="checkbox" name="is_featured" checked={form.is_featured} onChange={onChange} />
//             <span className="text-sm">Featured</span>
//           </label>

//           <label className="text-sm">
//             Thumbnail
//             <input type="file" name="thumbnail" onChange={onChange} accept="image/*" className="block mt-1" />
//           </label>
//         </div>

//         <div className="pt-3">
//           <button type="submit" disabled={submitting} className="px-4 py-2 bg-indigo-600 text-white rounded">
//             {submitting ? 'Creating...' : 'Create Tutorial'}
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// }

// frontend/src/pages/CreateTutorial.jsx
import { useState, useEffect } from 'react';
import { tutorialsAPI } from '../services/api';
import { useNavigate, useParams } from 'react-router-dom';

export default function CreateTutorial() {
  const { id } = useParams(); // optional edit id
  const [form, setForm] = useState({
    title: '',
    description: '',
    is_featured: false,
    thumbnail: null,
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (id) loadTutorial();
    // eslint-disable-next-line
  }, [id]);

  const loadTutorial = async () => {
    setLoading(true);
    try {
      const res = await tutorialsAPI.getById(id);
      const t = res.data;
      setForm({
        title: t.title || '',
        description: t.description || '',
        is_featured: !!t.is_featured,
        thumbnail: null, // can't prepopulate file input
      });
    } catch (err) {
      console.error(err);
      alert('Failed to load tutorial');
    } finally {
      setLoading(false);
    }
  };

  const onChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === 'file') setForm((s) => ({ ...s, [name]: files[0] }));
    else if (type === 'checkbox') setForm((s) => ({ ...s, [name]: checked }));
    else setForm((s) => ({ ...s, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.description.trim()) return alert('Title and description required.');
    setLoading(true);
    try {
      const payload = {
        title: form.title,
        description: form.description,
        is_featured: form.is_featured,
        thumbnail: form.thumbnail,
      };
      let res;
      if (id) res = await tutorialsAPI.update(id, payload);
      else res = await tutorialsAPI.create(payload);
      const created = res.data;
      navigate(id ? '/instructor/dashboard' : `/instructor/tutorials/${created.id}/add-content`);
    } catch (err) {
      console.error(err);
      if (err.response?.status === 403) alert('You are not authorized to create tutorials yet (pending admin approval).');
      else alert('Save failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-4">{id ? 'Edit Tutorial' : 'Create Tutorial'}</h1>

      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded shadow">
        <div>
          <label className="block text-sm font-medium">Title</label>
          <input name="title" value={form.title} onChange={onChange} className="mt-1 p-2 border rounded w-full" required />
        </div>

        <div>
          <label className="block text-sm font-medium">Description</label>
          <textarea name="description" value={form.description} onChange={onChange} rows="4" className="mt-1 p-2 border rounded w-full" required />
        </div>

        <div className="flex items-center space-x-4">
          <label className="flex items-center space-x-2">
            <input type="checkbox" name="is_featured" checked={form.is_featured} onChange={onChange} />
            <span className="text-sm">Featured</span>
          </label>

          <label className="text-sm">
            Thumbnail
            <input type="file" name="thumbnail" onChange={onChange} accept="image/*" className="block mt-1" />
          </label>
        </div>

        <div className="pt-3">
          <button className="px-4 py-2 bg-indigo-600 text-white rounded" disabled={loading}>
            {loading ? 'Saving...' : id ? 'Save Changes' : 'Create Tutorial'}
          </button>
        </div>
      </form>
    </div>
  );
}

