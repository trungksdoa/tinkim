import { Link } from 'react-router-dom';

export default function Sidebar() {
  return (
    <aside className="bg-white w-64 min-h-screen border-r border-gray-200">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800">Admin Panel</h2>
      </div>
      <nav className="p-4">
        <ul className="space-y-2">
          <li>
            <Link to="/employees" className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-150">
              <i className="fas fa-users"></i>
              <span>Nhân viên</span>
            </Link>
          </li>
          <li>
            <Link to="/departments" className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-150">
              <i className="fas fa-building"></i>
              <span>Phòng ban</span>
            </Link>
          </li>
          <li>
            <Link to="/roles" className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-150">
              <i className="fas fa-user-tag"></i>
              <span>Chức vụ</span>
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
}