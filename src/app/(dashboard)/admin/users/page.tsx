"use client";

import { AdminUserList } from "@/components/features/admin/users/AdminUserList";

export default function AdminUsersPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Users
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            A list of all users in your application including their name, email,
            role, and status.
          </p>
        </div>
      </div>
      <AdminUserList />
    </div>
  );
}
