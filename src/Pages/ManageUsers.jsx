// src/Pages/ManageUsers.jsx
import { useState, useEffect } from "react";
import { db } from "../firebaseConfig";
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc } from "firebase/firestore";

export default function ManageUsers({ closeModal }) {
  const [users, setUsers] = useState([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("admin");
  const [editingUser, setEditingUser] = useState(null);

  // Fetch users
  const fetchUsers = async () => {
    try {
      const snapshot = await getDocs(collection(db, "users"));
      setUsers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Add/Edit User
  const handleAddUser = async (e) => {
    e.preventDefault();
    if (!username || !password) return alert("Fill all fields");
    try {
      if (editingUser) {
        await updateDoc(doc(db, "users", editingUser.id), { username, password, role });
        alert("User updated!");
        setEditingUser(null);
      } else {
        await addDoc(collection(db, "users"), { username, password, role, isLoggedIn: false }); // ✅ Add isLoggedIn
        alert("User added!");
      }
      setUsername(""); setPassword(""); setRole("admin");
      fetchUsers();
    } catch (err) {
      console.error(err);
      alert("Failed to save user");
    }
  };

  // Delete User
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this user?")) return;
    try {
      await deleteDoc(doc(db, "users", id));
      alert("User deleted");
      fetchUsers();
    } catch (err) {
      console.error(err);
      alert("Failed to delete user");
    }
  };

  // Edit User
  const handleEdit = (user) => {
    setEditingUser(user);
    setUsername(user.username);
    setPassword(user.password);
    setRole(user.role);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-5xl">
        <h2 className="text-3xl font-bold mb-6 text-blue-700">👤 User Management</h2>

        <div className="grid grid-cols-3 gap-6">
          {/* Left Side: Add/Edit Form */}
          <div className="col-span-1 bg-blue-50 rounded-xl p-6 shadow">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">
              {editingUser ? "✏️ Edit User" : "➕ Add User"}
            </h3>
            <form onSubmit={handleAddUser} className="flex flex-col space-y-3">
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={e => setUsername(e.target.value)}
                className="p-2 border rounded-lg focus:ring focus:ring-blue-300"
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="p-2 border rounded-lg focus:ring focus:ring-blue-300"
              />
              <select
                value={role}
                onChange={e => setRole(e.target.value)}
                className="p-2 border rounded-lg focus:ring focus:ring-blue-300"
              >
                <option value="admin">Admin</option>
                <option value="student">Student</option>
              </select>

              <button
                type="submit"
                className="px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700"
              >
                {editingUser ? "Update User" : "Add User"}
              </button>

              {editingUser && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingUser(null);
                    setUsername("");
                    setPassword("");
                    setRole("admin");
                  }}
                  className="px-4 py-2 bg-gray-400 text-white font-semibold rounded-lg hover:bg-gray-500"
                >
                  Cancel
                </button>
              )}
            </form>
          </div>

          {/* Right Side: User List */}
          <div className="col-span-2 bg-white rounded-xl shadow p-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">📋 User List</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 border rounded-lg">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2 text-left text-gray-700 font-medium">Username</th>
                    <th className="px-4 py-2 text-left text-gray-700 font-medium">Role</th>
                    <th className="px-4 py-2 text-center text-gray-700 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map(user => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-4 py-2">{user.username}</td>
                      <td className="px-4 py-2 capitalize">{user.role}</td>
                      <td className="px-4 py-2 flex justify-center space-x-2">
                        <button
                          onClick={() => handleEdit(user)}
                          className="px-3 py-1 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 text-sm"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(user.id)}
                          className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                  {users.length === 0 && (
                    <tr>
                      <td colSpan="3" className="text-center py-4 text-gray-500">
                        No users found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Close Button */}
        <div className="flex justify-end mt-6">
          <button
            onClick={closeModal}
            className="px-5 py-2 bg-gray-500 text-white font-semibold rounded-lg hover:bg-gray-600"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
