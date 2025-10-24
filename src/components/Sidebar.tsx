import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Book, Folder, Layout, Settings, FileText, Activity, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '../contexts/AuthContext';

interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
}

interface SidebarProps {
  user: User | null;
}

const Sidebar: React.FC<SidebarProps> = ({ user }) => {
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="w-64 bg-white border-r border-slate-200 flex flex-col">
      <div className="p-4 border-b border-slate-200">
        <h1 className="text-xl font-bold text-indigo-600">AI Accelerator Admin</h1>
      </div>
      <ul className="flex-grow p-2">
        <li>
          <NavLink to="/" className="nav-link">
            <Home />
            <span>Dashboard</span>
          </NavLink>
        </li>
        <li className="mt-4 pt-4 border-t border-slate-200 text-xs font-semibold text-slate-400 uppercase px-3">Content</li>
        <li>
          <NavLink to="/courses" className="nav-link">
            <Book />
            <span>Courses & Lessons</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/resources" className="nav-link">
            <Folder />
            <span>Resources</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/landing-page" className="nav-link">
            <Layout />
            <span>Landing Page</span>
          </NavLink>
        </li>
        <li className="mt-4 pt-4 border-t border-slate-200 text-xs font-semibold text-slate-400 uppercase px-3">AI Tools</li>
        <li>
          <NavLink to="/ai-config" className="nav-link">
            <Settings />
            <span>AI Configuration</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/prompts" className="nav-link">
            <FileText />
            <span>Prompt Library</span>
          </NavLink>
        </li>
        <li className="mt-4 pt-4 border-t border-slate-200 text-xs font-semibold text-slate-400 uppercase px-3">Monitoring</li>
        <li>
          <NavLink to="/user-activity" className="nav-link">
            <Activity />
            <span>User Activity</span>
          </NavLink>
        </li>
      </ul>
      <div className="p-4 border-t border-slate-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <img src="https://placehold.co/40x40/E0E7FF/4F46E5?text=A" alt="Admin" className="w-10 h-10 rounded-full" />
            <div className="ml-3">
              <p className="font-semibold">
                {user ? `${user.first_name} ${user.last_name}` : 'Admin User'}
              </p>
              <p className="text-sm text-slate-500">
                {user?.email || 'admin@aiaccelerator.com'}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="text-slate-500 hover:text-slate-700"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Sidebar;