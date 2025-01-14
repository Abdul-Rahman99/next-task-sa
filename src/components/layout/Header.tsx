import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/hooks/store";
import { logout } from "@/store/slices/authSlice";
import { CartButton } from "@/components/features/cart/CartButton";

export function Header() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  return (
    <header className="bg-white shadow">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between">
          <div className="flex">
            <Link
              href="/"
              className="flex flex-shrink-0 items-center text-xl font-bold"
            >
              Store
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <CartButton />
            {user?.role === "admin" && (
              <Link href="/admin" className="text-gray-700 hover:text-gray-900">
                Admin
              </Link>
            )}
            <Link href="/orders" className="text-gray-700 hover:text-gray-900">
              Orders
            </Link>
            <button
              onClick={() => dispatch(logout())}
              className="text-gray-700 hover:text-gray-900"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
