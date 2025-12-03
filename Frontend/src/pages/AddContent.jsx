// import { useState } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { contentAPI } from '../services/api';

// export default function AddContent() {
//   const { id } = useParams(); // tutorial id
//   const navigate = useNavigate();

//   const [form, setForm] = useState({
//     title: '',
//     description: '',
//     order: 0,
//     content_type: 'text',
//     file: null,
//     text: '',
//     duration: '',
//   });
//   const [submitting, setSubmitting] = useState(false);

//   const onChange = (e) => {
//     const { name, value, type, files } = e.target;
//     if (type === 'file') {
//       setForm((s) => ({ ...s, [name]: files[0] }));
//     } else {
//       setForm((s) => ({ ...s, [name]: value }));
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setSubmitting(true);
//     try {
//       const data = {
//         order: form.order,
//         title: form.title,
//         description: form.description,
//         content_type: form.content_type,
//       };
//       if (form.content_type === 'text') {
//         data.text = form.text;
//       } else {
//         data.file = form.file;
//       }
//       if (form.duration) data.duration = form.duration;

//       await contentAPI.create(id, data);
//       // after create, redirect to instructor dashboard or tutorial edit
//       navigate('/instructor/dashboard');
//     } catch (err) {
//       console.error(err);
//       alert('Create content failed');
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   return (
//     <div className="max-w-3xl mx-auto py-8 px-4">
//       <h1 className="text-2xl font-bold mb-4">Add Content</h1>

//       <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded shadow">
//         <div>
//           <label className="block text-sm font-medium text-gray-700">Order</label>
//           <input type="number" name="order" value={form.order} onChange={onChange} className="mt-1 p-2 border rounded w-full" required />
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-gray-700">Title</label>
//           <input name="title" value={form.title} onChange={onChange} className="mt-1 p-2 border rounded w-full" required />
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-gray-700">Description</label>
//           <textarea name="description" value={form.description} onChange={onChange} className="mt-1 p-2 border rounded w-full" rows="2" />
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-gray-700">Content Type</label>
//           <select name="content_type" value={form.content_type} onChange={onChange} className="mt-1 p-2 border rounded w-full">
//             <option value="text">Text</option>
//             <option value="video">Video</option>
//             <option value="audio">Audio</option>
//           </select>
//         </div>

//         {form.content_type === 'text' ? (
//           <div>
//             <label className="block text-sm font-medium text-gray-700">Text</label>
//             <textarea name="text" value={form.text} onChange={onChange} className="mt-1 p-2 border rounded w-full" rows="6" required />
//           </div>
//         ) : (
//           <div>
//             <label className="block text-sm font-medium text-gray-700">File (video/audio)</label>
//             <input type="file" name="file" accept={form.content_type === 'video' ? 'video/*' : 'audio/*'} onChange={onChange} className="mt-1" required />
//           </div>
//         )}

//         <div>
//           <label className="block text-sm text-gray-700">Duration (seconds, optional)</label>
//           <input name="duration" value={form.duration} onChange={onChange} className="mt-1 p-2 border rounded w-full" />
//         </div>

//         <div className="pt-3">
//           <button type="submit" disabled={submitting} className="px-4 py-2 bg-indigo-600 text-white rounded">
//             {submitting ? 'Adding...' : 'Add Content'}
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// }


// frontend/src/pages/AddContent.jsx
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { contentAPI } from '../services/api';

export default function AddContent() {
  const { id } = useParams(); // tutorial id
  const navigate = useNavigate();
  const [form, setForm] = useState({
    order: 1,
    title: '',
    description: '',
    content_type: 'text',
    file: null,
    text: '',
    duration: '',
  });
  const [loading, setLoading] = useState(false);

  const onChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === 'file') setForm((s) => ({ ...s, [name]: files[0] }));
    else setForm((s) => ({ ...s, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return alert('Title required.');
    if (form.content_type === 'text' && !form.text.trim()) return alert('Text content required for text type.');
    if ((form.content_type === 'video' || form.content_type === 'audio') && !form.file) return alert('File required for media content.');

    setLoading(true);
    try {
      const payload = {
        order: form.order,
        title: form.title,
        description: form.description,
        content_type: form.content_type,
        file: form.file,
        text: form.content_type === 'text' ? form.text : undefined,
        duration: form.duration || undefined,
      };
      await contentAPI.create(id, payload);
      navigate('/instructor/dashboard');
    } catch (err) {
      console.error(err);
      if (err.response?.status === 403) alert('You are not authorized to add content (pending admin approval).');
      else alert('Create content failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-4">Add Content</h1>

      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded shadow">
        <div>
          <label className="block text-sm font-medium">Order</label>
          <input type="number" name="order" value={form.order} onChange={onChange} min={0} className="mt-1 p-2 border rounded w-full" required />
        </div>

        <div>
          <label className="block text-sm font-medium">Title</label>
          <input name="title" value={form.title} onChange={onChange} className="mt-1 p-2 border rounded w-full" required />
        </div>

        <div>
          <label className="block text-sm font-medium">Description</label>
          <textarea name="description" value={form.description} onChange={onChange} rows="2" className="mt-1 p-2 border rounded w-full" />
        </div>

        <div>
          <label className="block text-sm font-medium">Content Type</label>
          <select name="content_type" value={form.content_type} onChange={onChange} className="mt-1 p-2 border rounded w-full">
            <option value="text">Text</option>
            <option value="video">Video</option>
            <option value="audio">Audio</option>
          </select>
        </div>

        {form.content_type === 'text' ? (
          <div>
            <label className="block text-sm font-medium">Text</label>
            <textarea name="text" value={form.text} onChange={onChange} rows="6" className="mt-1 p-2 border rounded w-full" required />
          </div>
        ) : (
          <div>
            <label className="block text-sm font-medium">File</label>
            <input type="file" name="file" accept={form.content_type === 'video' ? 'video/*' : 'audio/*'} onChange={onChange} className="mt-1" required />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium">Duration (seconds, optional)</label>
          <input name="duration" value={form.duration} onChange={onChange} className="mt-1 p-2 border rounded w-full" />
        </div>

        <div className="pt-3">
          <button className="px-4 py-2 bg-indigo-600 text-white rounded" disabled={loading}>
            {loading ? 'Adding...' : 'Add Content'}
          </button>
        </div>
      </form>
    </div>
  );
}
