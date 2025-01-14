"use client";

import { useEffect, useState } from "react";
import { UserService } from "@/lib/services/user.service";
import { User } from "@/types";
import toast from "react-hot-toast";

export function AdminUserList() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const response = await UserService.getUsers();
      setUsers(response.data);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to load users";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (userId: string, isActive: boolean) => {
    try {
      const response = await UserService.updateUserStatus(userId, isActive);
      setUsers(
        users.map((user) => (user.id === userId ? response.data : user))
      );
      toast.success("User status updated successfully");
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to update user status";
      toast.error(errorMessage);
    }
  };

  const handleRoleChange = async (userId: string, role: string) => {
    try {
      const response = await UserService.updateUserRole(userId, role);
      setUsers(
        users.map((user) => (user.id === userId ? response.data : user))
      );
      toast.success("User role updated successfully");
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to update user role";
      toast.error(errorMessage);
    }
  };

  if (isLoading) {
    return (
      <div className="mt-8 flow-root">
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full py-2 align-middle">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
              <div className="divide-y divide-gray-200 bg-white">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="animate-pulse h-20 px-6 py-4 bg-gray-50"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-8 flow-root">
      <div className="overflow-x-auto">
        <div className="inline-block min-w-full py-2 align-middle">
          <table className="min-w-full divide-y divide-gray-300">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900"
                >
                  Name
                </th>
                <th
                  scope="col"
                  className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                >
                  Email
                </th>
                <th
                  scope="col"
                  className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                >
                  Role
                </th>
                <th
                  scope="col"
                  className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                >
                  Status
                </th>
                <th
                  scope="col"
                  className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {users.map((user) => (
                <tr key={user.id}>
                  <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900">
                    {user.name}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    {user.email}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm">
                    <select
                      title="role"
                      value={user.role}
                      onChange={(e) =>
                        handleRoleChange(user.id, e.target.value)
                      }
                      className="rounded-md border-gray-300 text-sm focus:border-indigo-500 focus:ring-indigo-500"
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm">
                    <select
                      title="status"
                      value={user.isActive ? "active" : "inactive"}
                      onChange={(e) =>
                        handleStatusChange(user.id, e.target.value === "active")
                      }
                      className="rounded-md border-gray-300 text-sm focus:border-indigo-500 focus:ring-indigo-500"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm">
                    <button
                      onClick={() =>
                        handleStatusChange(user.id, !user.isActive)
                      }
                      className={`rounded-md px-2 py-1 text-xs font-semibold ${
                        user.isActive
                          ? "bg-red-100 text-red-700 hover:bg-red-200"
                          : "bg-green-100 text-green-700 hover:bg-green-200"
                      }`}
                    >
                      {user.isActive ? "Deactivate" : "Activate"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
