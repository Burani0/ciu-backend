import React, { useEffect, useState } from "react";
import axios from "axios";

interface AdminData {
  first_name: string;
  last_name: string;
  username: string;
  email: string;
}

interface EditAdminModalProps {
  adminId: string;
  onClose: () => void;
  onSuccess: () => void;
}

const EditAdminModal: React.FC<EditAdminModalProps> = ({ adminId, onClose, onSuccess }) => {
  const [formData, setFormData] = useState<AdminData>({
    first_name: "",
    last_name: "",
    username: "",
    email: "",
  });

  const [loading, setLoading] = useState(true);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/api/admin/admin/${adminId}`
        );
        console.log("Fetched admin data:", response.data);
        setFormData({
          first_name: response.data.first_name || "",
          last_name: response.data.last_name || "",
          username: response.data.username || "",
          email: response.data.email || "",
        });
      } catch (error: any) {
        console.error("Error fetching admin data:", error);
        setSubmitError("Failed to load admin data.");
      } finally {
        setLoading(false);
      }
    };

    if (adminId) fetchAdmin();
  }, [adminId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    try {
      console.log("Submitting updated admin data:", formData);

      const response = await axios.put(
        `http://localhost:3001/api/admin/admin/${adminId}`,
        formData
      );

      console.log("Admin update successful:", response.data);
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error("Error updating admin:", error);
      const message =
        error.response?.data?.message || "An error occurred while updating.";
      setSubmitError(message);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md max-h-[90vh] relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-teal-700 hover:text-red-500 text-xl"
          aria-label="Close modal"
        >
          &times;
        </button>

        <h2 className="text-xl font-bold text-teal-700 text-center mt-8 mb-2">Edit Admin</h2>

        <div className="overflow-y-auto max-h-[75vh] px-6 pb-4 rounded-b-xl">
          {loading ? (
            <p className="text-center text-gray-500">Loading admin data...</p>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {submitError && (
                <div className="text-red-500 bg-red-100 px-4 py-2 rounded">{submitError}</div>
              )}

              <div>
                <label className="block text-sm font-semibold text-teal-700 mb-1">First Name</label>
                <input
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 ring-teal-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-teal-700 mb-1">Last Name</label>
                <input
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 ring-teal-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-teal-700 mb-1">Username</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 ring-teal-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-teal-700 mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 ring-teal-500"
                  required
                />
              </div>

              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 border border-gray-400 rounded hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-teal-700 text-white font-semibold rounded hover:bg-teal-800"
                >
                  Save Changes
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditAdminModal;
