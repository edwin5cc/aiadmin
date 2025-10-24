import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { useAuth } from '../contexts/AuthContext';

const Layout = () => {
  const { user } = useAuth();

  return (
    <div className="flex h-screen bg-slate-100 text-slate-800">
      <Sidebar user={user} />
      <main className="flex-grow p-8 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;