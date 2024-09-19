'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Navbar = () => {
  const pathname = usePathname();

  const routes = [
    { path: '/', name: '首页' },
    { path: '/drawing', name: '绘图' },
    // 在这里添加更多路由
  ];

  return (
    <nav className="bg-blue-500 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-white text-2xl font-bold">
          我的应用
        </Link>
        <ul className="flex space-x-4">
          {routes.map((route) => (
            <li key={route.path}>
              <Link
                href={route.path}
                className={`text-white hover:text-blue-200 ${
                  pathname === route.path ? 'font-bold' : ''
                }`}
              >
                {route.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <style jsx>{`
        nav {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 1000;
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
