import { useState, useEffect, useMemo } from "react";
import { Employee } from "@/types/employee";
import { UserTabsRef } from "./UserTabs";
import { useDepartments } from "@/services/departmentService";
import { useGroups } from "@/services/groupService";

interface BasicInfoProps {
  employee: Employee | null;
  isEditable: boolean;
  isCreatable: boolean;
  onSave: (data: Partial<Employee>) => void;
  onModeChange: (mode: string) => void;
  userTabsRef: React.RefObject<UserTabsRef>;
}

export default function BasicInfo({
  employee,
  isEditable,
  onSave,
  isCreatable,
  onModeChange,
  userTabsRef,
}: BasicInfoProps) {
  const { data: departmentsResponse } = useDepartments();
  const { data: groupsResponse } = useGroups();
  const [formData, setFormData] = useState<Partial<Employee>>({});
  // Remove console.logs and optimize with useMemo
  const initialFormData = useMemo(
    () => ({
      code: employee?.code || "",
      username: employee?.username || "",
      email: employee?.email || "",
      password: employee?.password || "",
      roleId: 8,
      Role: {
        id: 8,
        name: employee?.Role?.name || "",
      },
      Department: {
        id: employee?.Department?.id || 0,
        name: employee?.Department?.name || "",
      },
      MemberOf: [
        {
          id: Number(employee?.MemberOf?.[0]?.id) || 0,
          name: employee?.MemberOf?.[0]?.name || "",
        },
      ] as [{ id: number; name: string }], // Type assertion to match expected type
      expertise: employee?.expertise || "",
    }),
    [employee]
  );

  useEffect(() => {
    if (employee) {
      setFormData(initialFormData);
    }
  }, [employee, initialFormData]);

  // Also update the handleSelectChange to handle nested objects
  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === "departmentId") {
      const selectedDept = departmentsResponse?.data.find(
        (d) => d.id === Number(value)
      );
      setFormData((prev) => ({
        ...prev,
        departmentId: Number(value),
        Department: {
          id: Number(value),
          name: selectedDept?.name || "",
        },
      }));
    } else if (name === "groupId") {
      const selectedGroup = groupsResponse?.data.find(
        (g) => g.id === Number(value)
      );
      setFormData((prev) => ({
        ...prev,
        groupId:Number(value),
        MemberOf: [
          {
            id: Number(value),
            name: selectedGroup?.name || "",
          },
        ] as [{ id: Number; name: string }],
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    const userTabsData = userTabsRef.current?.getFormData() || {};
    onSave({
      ...employee,
      ...formData,
      ...userTabsData,
    });
  };

  // Update your existing JSX, add these fields after the email input:
  return (
    <div className="space-y-4">
      <div className="flex justify-end space-x-4">
        {!isEditable && (
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
            onClick={() => onModeChange("edit")}
          >
            Chỉnh sửa
          </button>
        )}
        {isEditable && (
          <>
            <button
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
              onClick={() => onModeChange("view")}
            >
              Hủy
            </button>
            <button
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg"
              onClick={handleSubmit}
            >
              Lưu
            </button>
          </>
        )}
      </div>
      <div className="grid grid-cols-3 gap-3 overflow-y-auto h-[17rem]">
        <div className="col-span-2 grid grid-cols-2 gap-2">
          {isEditable ? (
            <>
              {isCreatable ? (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mật khẩu
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password || ""}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-gray-700"
                  />
                </div>
              ) : (
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Mã nhân viên
                  </label>
                  <input
                    type="text"
                    name="code"
                    value={formData.code || ""}
                    disabled={true}
                    onChange={handleChange}
                    className="w-full px-2 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 text-gray-900"
                  />
                </div>
              )}

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Họ tên
                </label>
                <input
                  type="text"
                  name="username"
                  value={formData.username || ""}
                  onChange={handleChange}
                  className="w-full px-2 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 text-gray-900"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email || ""}
                  onChange={handleChange}
                  className="w-full px-2 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 text-gray-900"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Chuyên môn
                </label>
                <input
                  type="text"
                  name="expertise"
                  value={formData.expertise || ""}
                  onChange={handleChange}
                  className="w-full px-2 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 text-gray-900"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Phòng ban
                </label>
                <select
                  name="departmentId"
                  value={formData.Department?.id || ""}
                  onChange={handleSelectChange}
                  className="w-full px-2 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 text-gray-900"
                >
                  <option value="">Chọn phòng ban</option>
                  {departmentsResponse?.data.map((dept) => (
                    <option key={dept.id} value={dept.id}>
                      {dept.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Nhóm
                </label>
                <select
                  name="groupId"
                  value={String(formData.MemberOf?.[0]?.id) || ""}
                  onChange={handleSelectChange}
                  className="w-full px-2 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 text-gray-900"
                >
                  <option value="">Chọn nhóm</option>
                  {groupsResponse?.data.map((group) => (
                    <option key={group.id} value={group.id}>
                      {group.name}
                    </option>
                  ))}
                </select>
              </div>
            </>
          ) : (
            <>
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">
                  Mã nhân viên
                </label>
                <p className="px-2 py-1 text-gray-900">
                  {formData.code || "-"}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Họ tên
                </label>
                <p className="text-gray-900 px-2 py-1.5">
                  {formData.username || "-"}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <p className="text-gray-900 px-2 py-1.5">
                  {formData.email || "-"}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phòng ban
                </label>
                <p className="text-gray-900 px-2 py-1.5">
                  {departmentsResponse?.data.find(
                    (d) => d.id === Number(formData.Department?.name)
                  )?.name || "-"}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nhóm
                </label>
                <p className="text-gray-900 px-2 py-1.5">
                  {groupsResponse?.data.find(
                    (g) => g.id === Number(formData.groupId)
                  )?.name || "-"}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ngày sinh
                </label>
                <p className="text-gray-900 px-2 py-1.5">
                  {formData.birthDate || "-"}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Học vấn
                </label>
                <p className="text-gray-900 px-2 py-1.5">
                  {formData.education || "-"}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Chuyên môn
                </label>
                <p className="text-gray-900 px-2 py-1.5">
                  {formData.expertise || "-"}
                </p>
              </div>
            </>
          )}
        </div>
        <div className="h-[15rem]">
          <div className="relative w-full h-full border border-gray-200 shadow-sm">
            {employee?.avatar ? (
              <img
                src={employee.avatar}
                alt="Avatar"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-50 flex items-center justify-center">
                <span className="text-gray-300 text-3xl">👤</span>
              </div>
            )}
            {isEditable && (
              <label className="absolute bottom-0 left-0 right-0 bg-black/40 text-white text-xs py-0.5 cursor-pointer text-center">
                <input type="file" accept="image/*" className="hidden" />
                Tải ảnh
              </label>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
