"use client";

import {
  useMemo,
  useState,
  useImperativeHandle,
  forwardRef,
  useEffect,
} from "react";
import { useQuery } from "@tanstack/react-query";
import { Employee } from "@/types/employee";
interface UserTabsProps {
  employee: Employee;
  isEditable: boolean;
  onSave: (data: Partial<Employee>) => void;
}

export interface UserTabsRef {
  getFormData: () => Partial<Employee>;
}

const UserTabs = forwardRef<UserTabsRef, UserTabsProps>(
  ({ employee, isEditable, onSave }, ref) => {
    const [activeTab, setActiveTab] = useState("personal");
    const [formData, setFormData] = useState<Partial<Employee>>({});
    useImperativeHandle(ref, () => ({
      getFormData: () => formData,
    }));

    // Add a new tab for financial information
    const tabs = useMemo(
      () => [
        { id: "personal", label: "Thông tin cá nhân" },
        { id: "identity", label: "CMND/CCCD" },
        { id: "employment", label: "Thông tin công việc" },
        { id: "financial", label: "Thông tin lương" }, // Add this tab
        { id: "bank", label: "Thông tin ngân hàng" },
        { id: "insurance", label: "Bảo hiểm xã hội" },
      ],
      []
    );

    // Add the financial tab content
    {
      activeTab === "financial" && (
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Lương cơ bản
            </label>
            <input
              type="number"
              value={formData?.FinancialInformation?.basicSalary || ""}
              onChange={(e) =>
                handleChange(
                  "FinancialInformation",
                  "basicSalary",
                  e.target.value
                )
              }
              disabled={!isEditable}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phụ cấp
            </label>
            <input
              type="number"
              value={formData?.FinancialInformation?.allowance || ""}
              onChange={(e) =>
                handleChange(
                  "FinancialInformation",
                  "allowance",
                  e.target.value
                )
              }
              disabled={!isEditable}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
            />
          </div>
        </div>
      );
    }

    useEffect(() => {
      if (employee) {
        setFormData({
          PrivateInformation: employee.PrivateInformation,
          EmploymentInformation: employee.EmploymentInformation,
          FinancialInformation: employee.FinancialInformation,
          gender: employee.gender,
          birthDate: employee.birthDate,
          education: employee.education,
        });
      }
    }, [employee]);

    const handleChange = (
      section:
        | keyof Employee
        | "PrivateInformation"
        | "EmploymentInformation"
        | "FinancialInformation",
      field: string,
      value: string
    ) => {
      if (
        section === "PrivateInformation" ||
        section === "EmploymentInformation" ||
        section === "FinancialInformation"
      ) {
        setFormData((prev) => ({
          ...prev,
          [section]: {
            ...prev[section],
            [field]: value,
          },
        }));
      } else {
        setFormData((prev) => ({
          ...prev,
          [field]: value,
        }));
      }
    };

    // Add these constants for select options
    const genderOptions = [
      { value: "male", label: "Nam" },
      { value: "female", label: "Nữ" },
      { value: "other", label: "Khác" },
    ];

    const employmentStatusOptions = [
      { value: "active", label: "Đang làm việc" },
      { value: "terminated", label: "Đã nghỉ việc" },
      { value: "suspended", label: "Tạm nghỉ" },
    ];

    const bankOptions = [
      { value: "vcb", label: "Vietcombank" },
      { value: "tcb", label: "Techcombank" },
      { value: "acb", label: "ACB" },
      { value: "bidv", label: "BIDV" },
      { value: "other", label: "Khác" },
    ];

    return (
      <div className="max-h-[calc(100vh-20rem)] overflow-y-auto">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`whitespace-nowrap py-4 px-3 border-b-2 font-medium text-sm
                ${
                  activeTab === tab.id
                    ? "border-indigo-500 text-indigo-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="mt-6 space-y-6">
          {activeTab === "personal" && (
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Giới tính
                </label>
                <select
                  value={formData.gender || ""}
                  name="gender"
                  onChange={(e) => handleChange("gender", "gender", e.target.value)}
                  disabled={!isEditable}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
                >
                  <option value="">Chọn giới tính</option>
                  {genderOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ngày sinh
                </label>
                <input
                  type="date"
                  name="birthDate"
                  value={formData?.birthDate || ""}
                  onChange={(e) =>
                    handleChange("birthDate", "birthDate", e.target.value)
                  }
                  disabled={!isEditable}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Học vấn
                </label>
                <input
                  type="text"
                  name="education"
                  value={formData?.education || ""}
                  onChange={(e) =>
                    handleChange("education", "education", e.target.value)
                  }
                  disabled={!isEditable}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Địa chỉ
                </label>
                <input
                  type="text"
                  value={formData.PrivateInformation?.address || ""}
                  onChange={(e) =>
                    handleChange(
                      "PrivateInformation",
                      "address",
                      e.target.value
                    )
                  }
                  disabled={!isEditable}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Số điện thoại
                </label>
                <input
                  type="text"
                  value={formData.PrivateInformation?.phoneNumber || ""}
                  onChange={(e) =>
                    handleChange(
                      "PrivateInformation",
                      "phoneNumber",
                      e.target.value
                    )
                  }
                  disabled={!isEditable}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mã số thuế
                </label>
                <input
                  type="text"
                  value={formData?.PrivateInformation?.taxNumber || ""}
                  onChange={(e) =>
                    handleChange(
                      "PrivateInformation",
                      "taxNumber",
                      e.target.value
                    )
                  }
                  disabled={!isEditable}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
                />
              </div>
            </div>
          )}

          {activeTab === "identity" && (
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  CMND/CCCD 1
                </label>
                <input
                  type="text"
                  value={formData?.PrivateInformation?.idCard1 || ""}
                  onChange={(e) =>
                    handleChange(
                      "PrivateInformation",
                      "idCard1",
                      e.target.value
                    )
                  }
                  disabled={!isEditable}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ngày cấp
                </label>
                <input
                  type="date"
                  value={
                    formData?.PrivateInformation?.idCard1IssueDate?.toString() ||
                    ""
                  }
                  onChange={(e) =>
                    handleChange(
                      "PrivateInformation",
                      "idCard1IssueDate",
                      e.target.value
                    )
                  }
                  disabled={!isEditable}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nơi cấp
                </label>
                <input
                  type="text"
                  value={formData?.PrivateInformation?.idCard1IssuePlace || ""}
                  onChange={(e) =>
                    handleChange(
                      "PrivateInformation",
                      "idCard1IssuePlace",
                      e.target.value
                    )
                  }
                  disabled={!isEditable}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
                />
              </div>

              <div className="col-span-2 border-t pt-4">
                <h3 className="text-lg font-medium mb-4">CMND/CCCD 2</h3>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  CMND/CCCD 2
                </label>
                <input
                  type="text"
                  value={formData?.PrivateInformation?.idCard2 || ""}
                  onChange={(e) =>
                    handleChange(
                      "PrivateInformation",
                      "idCard2",
                      e.target.value
                    )
                  }
                  disabled={!isEditable}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ngày cấp
                </label>
                <input
                  type="date"
                  value={
                    formData?.PrivateInformation?.idCard2IssueDate?.toString() ||
                    ""
                  }
                  onChange={(e) =>
                    handleChange(
                      "PrivateInformation",
                      "idCard2IssueDate",
                      e.target.value
                    )
                  }
                  disabled={!isEditable}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nơi cấp
                </label>
                <input
                  type="text"
                  value={formData?.PrivateInformation?.idCard2IssuePlace || ""}
                  onChange={(e) =>
                    handleChange(
                      "PrivateInformation",
                      "idCard2IssuePlace",
                      e.target.value
                    )
                  }
                  disabled={!isEditable}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
                />
              </div>
            </div>
          )}

          {activeTab === "employment" && (
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ngày nhận việc
                </label>
                <input
                  type="date"
                  value={
                    formData?.EmploymentInformation?.startDate?.toString() || ""
                  }
                  onChange={(e) =>
                    handleChange(
                      "EmploymentInformation",
                      "startDate",
                      e.target.value
                    )
                  }
                  disabled={!isEditable}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Người giới thiệu
                </label>
                <input
                  type="text"
                  value={formData?.EmploymentInformation?.referrer || ""}
                  onChange={(e) =>
                    handleChange(
                      "EmploymentInformation",
                      "referrer",
                      e.target.value
                    )
                  }
                  disabled={!isEditable}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ngày ký hợp đồng
                </label>
                <input
                  type="date"
                  value={
                    formData?.EmploymentInformation?.contractSignDate?.toString() ||
                    ""
                  }
                  onChange={(e) =>
                    handleChange(
                      "EmploymentInformation",
                      "contractSignDate",
                      e.target.value
                    )
                  }
                  disabled={!isEditable}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tình trạng
                </label>
                <select
                  value={formData.EmploymentInformation?.employmentStatus || ""}
                  onChange={(e) =>
                    handleChange(
                      "EmploymentInformation",
                      "employmentStatus",
                      e.target.value
                    )
                  }
                  disabled={!isEditable}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
                >
                  <option value="">Chọn tình trạng</option>
                  {employmentStatusOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {activeTab === "bank" && (
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Số tài khoản
                </label>
                <input
                  type="text"
                  value={formData?.PrivateInformation?.bankAccountNumber || ""}
                  onChange={(e) =>
                    handleChange(
                      "PrivateInformation",
                      "bankAccountNumber",
                      e.target.value
                    )
                  }
                  disabled={!isEditable}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tên ngân hàng
                </label>
                <select
                  value={formData.PrivateInformation?.bankName || ""}
                  onChange={(e) =>
                    handleChange(
                      "PrivateInformation",
                      "bankName",
                      e.target.value
                    )
                  }
                  disabled={!isEditable}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
                >
                  <option value="">Chọn ngân hàng</option>
                  {bankOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Chi nhánh
                </label>
                <input
                  type="text"
                  value={formData?.PrivateInformation?.bankBranch || ""}
                  onChange={(e) =>
                    handleChange(
                      "PrivateInformation",
                      "bankBranch",
                      e.target.value
                    )
                  }
                  disabled={!isEditable}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
                />
              </div>
            </div>
          )}

          {activeTab === "insurance" && (
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Số BHXH
                </label>
                <input
                  type="text"
                  value={
                    formData?.PrivateInformation?.socialInsuranceNumber || ""
                  }
                  onChange={(e) =>
                    handleChange(
                      "PrivateInformation",
                      "socialInsuranceNumber",
                      e.target.value
                    )
                  }
                  disabled={!isEditable}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
);

export default UserTabs;
