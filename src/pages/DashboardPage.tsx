import React from 'react';

const DashboardPage = () => {
  return (
    <section id="dashboard-view">
      <h2 className="text-3xl font-bold mb-6">Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-slate-500">Business Owner Portal</h3>
          <p className="text-3xl font-bold mt-2">12 Courses</p>
          <p className="text-sm text-slate-400 mt-1">105 Lessons</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-slate-500">Founder Portal</h3>
          <p className="text-3xl font-bold mt-2">8 Courses</p>
          <p className="text-sm text-slate-400 mt-1">72 Lessons</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-slate-500">Total Resources</h3>
          <p className="text-3xl font-bold mt-2">45</p>
          <p className="text-sm text-slate-400 mt-1">Links & Files</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-slate-500">Active AI Tools</h3>
          <p className="text-3xl font-bold mt-2">3</p>
          <p className="text-sm text-slate-400 mt-1">Profit Radar, etc.</p>
        </div>
      </div>

      <div className="mt-8 bg-white p-6 rounded-lg shadow">
        <h3 className="font-semibold mb-4">Recent Activity (Audit Log)</h3>
        <ul className="space-y-3">
          <li className="flex items-center justify-between text-sm">
            <p><span className="font-medium">Admin User</span> edited the prompt for <span className="font-medium text-indigo-600">PROFIT_RADAR</span>.</p>
            <span className="text-slate-400">5 minutes ago</span>
          </li>
          <li className="flex items-center justify-between text-sm">
            <p><span className="font-medium">Admin User</span> uploaded a new video for lesson <span className="font-medium text-indigo-600">"Intro to Marketing"</span>.</p>
            <span className="text-slate-400">1 hour ago</span>
          </li>
          <li className="flex items-center justify-between text-sm">
            <p><span className="font-medium">Editor User</span> created a new course: <span className="font-medium text-indigo-600">"Advanced Sales Funnels"</span>.</p>
            <span className="text-slate-400">3 hours ago</span>
          </li>
        </ul>
      </div>
    </section>
  );
};

export default DashboardPage;