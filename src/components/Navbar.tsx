"use client";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import { usePathname } from 'next/navigation';

interface NavLink {
  href: string;
  label: string;
  roles: string[];
}

export default function Navbar() {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const navLinks: NavLink[] = [
    {
      href: "/complaintentry",
      label: "Complaint Entry",
      roles: ["employee", "admin"]
    },
    {
      href: "/reports",
      label: "Reports",
      roles: ["owner", "admin"]
    },
    {
      href: "/manageuser",
      label: "Manage Users",
      roles: ["admin"]
    },
    {
      href: "/managecomplainttype",
      label: "Manage Complaint Types",
      roles: ["admin"]
    },
    {
      href: "/manageareas",
      label: "Manage Complaint Areas",
      roles: ["admin"]
    },
    {
      href: "/complaintsaction",
      label: "Complaints Actions",
      roles: ["admin", "manager", "it_manager"]
    }
  ];

  const userRole = session?.user?.role;

  // Filter links based on user role
  const authorizedLinks = navLinks.filter(link => 
    link.roles.includes(userRole as string)
  );

  // Get current page label
  const getCurrentPageLabel = () => {
    const currentLink = navLinks.find(link => link.href === pathname);
    return currentLink ? ` | ${currentLink.label}` : '';
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0
          w-64
          bg-gray-800 text-white
          transform transition-transform duration-200 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0
          z-40
          h-screen
        `}
      >
        <div className="p-4">
          <h1 className="text-xl font-bold mb-8">CMS</h1>
          <ul className="space-y-2">
            {authorizedLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="block p-2 hover:bg-gray-700 rounded transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 md:ml-64">
        {/* Navbar */}
        <nav className="bg-blue-600 text-white p-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            {/* Hamburger Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 hover:bg-blue-700 rounded md:hidden"
              aria-label="Toggle menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
            <h1 className="text-xl font-bold">
              Brick School CMS
              <span className="text-lg font-normal">
                {getCurrentPageLabel()}
              </span>
            </h1>
          </div>
          <div className="flex items-center gap-4">
            {session?.user?.name && (
              <span className="font-medium hidden sm:inline">
                Welcome, {session.user.name}
              </span>
            )}
            <button
              onClick={() => signOut()}
              className="bg-red-500 px-3 py-1 rounded hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        </nav>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}
