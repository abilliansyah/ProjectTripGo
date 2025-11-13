// components/admin/Sidebar.tsx

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { name: 'Dashboard', href: '/admin/dashboard' },
  { name: 'Kelola Users', href: '/admin/users' },
  { name: 'Kelola Trips', href: '/admin/trips' },
  // Tambahkan item lain di sini
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex flex-col w-64 bg-gray-800 text-white h-full p-4 fixed">
      <div className="text-2xl font-bold mb-8 text-blue-400">Admin Panel</div>
      <nav className="flex-grow">
        <ul>
          {navItems.map((item) => (
            <li key={item.href} className="mb-2">
              <Link href={item.href} legacyBehavior>
                <a
                  className={`block p-2 rounded-md transition-colors 
                    ${pathname === item.href 
                      ? 'bg-blue-600 font-semibold' 
                      : 'hover:bg-gray-700'
                    }`}
                >
                  {item.name}
                </a>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}