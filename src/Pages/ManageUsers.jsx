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
        await addDoc(collection(db, "users"), { username, password, role });
        alert("User added!");
      }
      setUsername(""); setPassword(""); setRole("admin");
      fetchUsers();
    } catch (err) {
      console.error(err); alert("Failed to save user");
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
      console.error(err); alert("Failed to delete user");
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
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-3xl">
        <h2 className="text-2xl font-bold mb-4 text-blue-600">User Management</h2>

        {/* Add/Edit User Form */}
        <form onSubmit={handleAddUser} className="flex flex-col space-y-3 mb-4">
          <input
            type="text" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)}
            className="p-2 border rounded w-full"
          />
          <input
            type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)}
            className="p-2 border rounded w-full"
          />
          <select value={role} onChange={e => setRole(e.target.value)} className="p-2 border rounded w-full">
            <option value="admin">Admin</option>
            <option value="student">Student</option>
          </select>
          <div className="flex space-x-2">
            <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
              {editingUser ? "Update User" : "Add User"}
            </button>
            {editingUser && (
              <button type="button" onClick={() => { setEditingUser(null); setUsername(""); setPassword(""); setRole("admin"); }}
                className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
              >
                Cancel
              </button>
            )}
          </div>
        </form>

        {/* User List */}
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left">Username</th>
              <th className="px-4 py-2 text-left">Role</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map(user => (
              <tr key={user.id}>
                <td className="px-4 py-2">{user.username}</td>
                <td className="px-4 py-2">{user.role}</td>
                <td className="px-4 py-2 flex space-x-2">
                  <button onClick={() => handleEdit(user)} className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 text-sm">Edit</button>
                  <button onClick={() => handleDelete(user.id)} className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <button onClick={closeModal} className="mt-4 px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500">
          Close
        </button>
      </div>
    </div>
  );
}
