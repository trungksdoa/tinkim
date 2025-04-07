'use client';

import { Employee } from '@/types/employee';
import { useEmployees, useDeleteEmployee } from '@/services/employeeService';
import { useNavigate } from 'react-router-dom';
import { encodeData } from '@/utils/dataHash';

export default function EmployeeList() {
  const navigate = useNavigate();
  const { data: employeeRes, isLoading, error } = useEmployees();
  const deleteEmployee = useDeleteEmployee();

  const employees = employeeRes?.data || [];

  const handleViewEmployee = (id: number) => {
    const employee = employees.find(emp => emp.id === id);
    if (!employee) return;
    navigate(`/employees/${id}?data=${encodeData(employee)}`);
  };

  const handleEditEmployee = (id: number) => {
    const employee = employees.find(emp => emp.id === id);
    if (!employee) return;
    navigate(`/employees/${id}?mode=edit&data=${encodeData(employee)}`);
  };

  const handleAddEmployee = () => {
    navigate('/employees/create');
  };

  const handleDeleteEmployee = async (id: number) => {
    if (confirm('Bạn có chắc chắn muốn xóa nhân viên này?')) {
      try {
        await deleteEmployee.mutateAsync(id);
      } catch (error) {
        console.error('Lỗi khi xóa nhân viên:', error);
      }
    }
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Đang tải...</div>;
  }

  if (error) {
    return <div className="text-red-500">Lỗi khi tải danh sách nhân viên</div>;
  }

    return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-semibold text-gray-800">Danh sách nhân viên</h1>
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2"
            onClick={handleAddEmployee}
          >
            <i className="fas fa-plus text-sm"></i>
            Thêm nhân viên
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider bg-gray-50">Mã NV</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider bg-gray-50">Họ tên</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider bg-gray-50">Email</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider bg-gray-50">Phòng ban</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider bg-gray-50">Khối</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider bg-gray-50">Chức vụ</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider bg-gray-50">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {employees.map((employee: Employee) => (
                  <tr key={employee.id} className="hover:bg-gray-50 transition-colors duration-150">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{employee.code}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{employee.username}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{employee.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{employee.Department?.name || 'N/A'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{employee.MemberOf?.[0]?.name || 'N/A'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{employee.Role?.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm space-x-3">
                      <button
                        className="inline-flex items-center px-3 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-md transition-colors duration-150"
                        onClick={() => handleViewEmployee(employee.id)}
                      >
                        <i className="fas fa-eye mr-1.5"></i>
                        Xem
                      </button>
                      <button
                        className="inline-flex items-center px-3 py-1.5 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded-md transition-colors duration-150"
                        onClick={() => handleEditEmployee(employee.id)}
                      >
                        <i className="fas fa-edit mr-1.5"></i>
                        Sửa
                      </button>
                      <button
                        className="inline-flex items-center px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-md transition-colors duration-150"
                        onClick={() => handleDeleteEmployee(employee.id)}
                      >
                        <i className="fas fa-trash mr-1.5"></i>
                        Xóa
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}