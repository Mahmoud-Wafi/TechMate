import { IoClose, IoDownload, IoCheckmarkCircle } from 'react-icons/io5';
import { useState } from 'react';
import api from '../services/api';

export default function CertificateModal({ isOpen, onClose, tutorial, user }) {
  const [loading, setLoading] = useState(false);
  const [certificate, setCertificate] = useState(null);

  if (!isOpen) return null;

  const issueCertificate = async () => {
    setLoading(true);
    try {
      const response = await api.post('/api/certificates/issue/', {
        tutorial_id: tutorial.id,
      });
      setCertificate(response.data);
    } catch (error) {
      console.error('Error issuing certificate:', error);
      alert('Error issuing certificate');
    } finally {
      setLoading(false);
    }
  };

  const downloadCertificate = async () => {
    try {
      const response = await api.get(`/api/certificates/${certificate.id}/download/`, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Certificate_${user.username}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentChild.removeChild(link);
    } catch (error) {
      console.error('Error downloading certificate:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-96 overflow-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold">Congratulations!</h2>
          <button onClick={onClose} className="text-2xl hover:opacity-80">
            <IoClose />
          </button>
        </div>

        {/* Content */}
        <div className="p-8 text-center">
          {!certificate ? (
            <div>
              <IoCheckmarkCircle className="w-24 h-24 mx-auto text-green-500 mb-6" />
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                You've Completed "{tutorial?.title}"!
              </h3>
              <p className="text-gray-600 mb-8">
                Thank you for completing this course with TechMate. Your dedication and hard work are appreciated by the TechMate team.
              </p>
              <button
                onClick={issueCertificate}
                disabled={loading}
                className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg transition disabled:opacity-50"
              >
                {loading ? 'Generating...' : 'Get Certificate'}
              </button>
            </div>
          ) : (
            <div>
              <div className="border-4 border-indigo-500 rounded-lg p-8 bg-gradient-to-br from-indigo-50 to-purple-50 mb-6">
                <h4 className="text-3xl font-bold text-indigo-600 mb-2">Certificate Earned!</h4>
                <p className="text-gray-700 mb-4">
                  <strong>{user?.username || 'Learner'}</strong>
                </p>
                <p className="text-gray-600 mb-4">Certificate #: {certificate.certificate_number}</p>
                <p className="text-gray-600">Issued: {certificate.issued_date_formatted}</p>
              </div>
              <button
                onClick={downloadCertificate}
                className="bg-green-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-600 flex items-center justify-center gap-2 w-full"
              >
                <IoDownload /> Download PDF
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 p-6 text-center text-sm text-gray-600">
          <p>Thank you for learning with <strong>TechMate</strong></p>
        </div>
      </div>
    </div>
  );
}
