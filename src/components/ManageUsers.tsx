"use client";
import { useEffect, useState } from "react";

interface User {
  id: number;
  name: string;
  email: string;
  password?: string;
  role: string;
}

export default function ManageUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newUser, setNewUser] = useState({ name: "", email: "", password: "", role: "employee" });

  useEffect(() => {
    fetch("/api/users")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setUsers(data);
        } else {
          setError("Failed to load users");
        }
        setLoading(false);
      })
      .catch(() => {
        setError("Error fetching users");
        setLoading(false);
      });
  }, []);

  const updateUserRole = async (id: number, newRole: string) => {
    const res = await fetch(`/api/users/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role: newRole }),
    });

    if (res.ok) {
      setUsers((prev) =>
        prev.map((user) => (user.id === id ? { ...user, role: newRole } : user))
      );
    } else {
      alert("Failed to update role");
    }
  };

  const deleteUser = async (id: number) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
  
    const res = await fetch(`/api/users/${id}`, { method: "DELETE" });
  
    if (res.ok) {
      setUsers((prev) => prev.filter((user) => user.id !== id));
    } else {
      alert("Failed to delete user");
    }
  };
  
  const addUser = async () => {
    if (!newUser.name || !newUser.email) {
      alert("Name and email are required");
      return;
    }

    const res = await fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newUser),
    });

    if (res.ok) {
      const addedUser = await res.json();
      setUsers((prev) => [...prev, addedUser]);
      setNewUser({ name: "", email: "", password: "", role: "employee"});
    } else {
      alert("Failed to add user");
    }
  };

  return (
    <div className="p-4 sm:p-6 bg-white shadow-md rounded-md">
      <h2 className="text-xl text-black font-semibold mb-4">Manage Users</h2>

      {/* Add User Form */}
      <div className="mb-6">
        <h3 className="text-lg text-black font-medium mb-2">Add New User</h3>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-5">
          <input
            type="text"
            placeholder="Name"
            value={newUser.name}
            onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
            className="border text-black border-gray-300 rounded-md p-2 w-full"
          />
          <input
            type="email"
            placeholder="Email"
            value={newUser.email}
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
            className="border text-black border-gray-300 rounded-md p-2 w-full"
          />
          <input
            type="text"
            placeholder="Password"
            value={newUser.password}
            onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
            className="border text-black border-gray-300 rounded-md p-2 w-full"
          />
          <select
            value={newUser.role}
            onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
            className="border text-black border-gray-300 rounded-md p-2 w-full"
          >
            <option value="employee">Employee</option>
            <option value="admin">Admin</option>
          </select>
          <button
            onClick={addUser}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 w-full"
          >
            Add User
          </button>
        </div>
      </div>

      {/* User List */}
      {loading && <p>Loading users...</p>}
      {error && <p className="text-red-500">{error}</p>}
      
      {/* Table view for medium and larger screens */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border text-black border-gray-300 px-4 py-2">Name</th>
              <th className="border text-black border-gray-300 px-4 py-2">Email</th>
              <th className="border text-black border-gray-300 px-4 py-2">Role</th>
              <th className="border text-black border-gray-300 px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="text-center">
                <td className="border text-black border-gray-300 px-4 py-2">{user.name}</td>
                <td className="border text-black border-gray-300 px-4 py-2">{user.email}</td>
                <td className="border text-black border-gray-300 px-4 py-2">
                  <select
                    className="border text-black border-gray-300 rounded-md p-1 w-auto"
                    value={user.role}
                    onChange={(e) => updateUserRole(user.id, e.target.value)}
                  >
                    <option value="employee">Employee</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
                <td className="border text-black border-gray-300 px-4 py-2">
                  <button
                    className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600"
                    onClick={() => deleteUser(user.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Card view for mobile */}
      <div className="md:hidden space-y-4">
        {users.map((user) => (
          <div key={user.id} className="border text-black border-gray-300 rounded-lg p-4 space-y-3">
            <div className="flex justify-between items-center">
              <h3 className="font-medium text-black">{user.name}</h3>
              <button
                className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600"
                onClick={() => deleteUser(user.id)}
              >
                Delete
              </button>
            </div>
            <div className="text-black">{user.email}</div>
            <div className="flex items-center space-x-2">
              <span className="text-black">Role:</span>
              <select
                className="border text-black border-gray-300 rounded-md p-1 flex-grow"
                value={user.role}
                onChange={(e) => updateUserRole(user.id, e.target.value)}
              >
                <option value="employee">Employee</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
