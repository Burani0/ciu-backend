import React, { useEffect, useState } from "react";

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

  useEffect(() => {
    console.log("Fetching admin for ID:", adminId);
    const fetchAdmin = async () => {
      try {
        const response = await fetch(`https://ciu-backend.onrender.com/api/admin/admins/${adminId}`);
        if (!response.ok) throw new Error("Failed to fetch admin");
        const data = await response.json();
        console.log("Fetched admin data:", data); 
      

        setFormData({
          first_name: data.first_name || "",
          last_name: data.last_name || "",
          username: data.username || "",
          email: data.email || "",
        });
      } catch (error) {
        console.error("Error fetching admin data:", error);
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
    try {
      const response = await fetch(`https://ciu-backend.onrender.com/api/admin/admins/${adminId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to update admin");

      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error updating admin:", error);
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
          <form onSubmit={handleSubmit} className="space-y-4">
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
        </div>
      </div>
    </div>
  );
};

export default EditAdminModal;
