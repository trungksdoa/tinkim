"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { Employee, createInitialEmployee } from "@/types/employee";
import { useCreateEmployee } from "@/services/employeeService";
import { useNavigate } from 'react-router-dom';
import BasicInfo from "../[id]/components/BasicInfo";
import UserTabs, { UserTabsRef } from "../[id]/components/UserTabs";
import { isNull } from "util";

export default function CreateEmployee() {
  const navigate = useNavigate();
  const userTabsRef = useRef<UserTabsRef>(null);
  const [isLoading, setIsLoading] = useState(false);

  const createEmployee = useCreateEmployee();

  const handleSaveChanges = useCallback(
    async (data: Partial<Employee>) => {
      try {
        setIsLoading(true);
        await createEmployee.mutateAsync(data as Employee);
        navigate("/employees");
      } catch (error) {
        console.error("Lỗi khi tạo nhân viên:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [createEmployee, navigate]
  );

  return (
    <div className="container mx-auto p-4 max-w-7xl h-[calc(100vh-4rem)] overflow-y-auto relative">
      {isLoading && (
        <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}
      <div className="flex flex-col h-full space-y-6 overflow-y-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-black mb-4">
            Thông tin cơ bản
          </h2>
          <BasicInfo
            isCreatable={true}
            employee={createInitialEmployee()}
            isEditable={true}
            onSave={handleSaveChanges}
            onModeChange={() => {}}
            userTabsRef={userTabsRef as React.RefObject<UserTabsRef>}
          />
        </div>
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-black mb-4">
            Thông tin chi tiết
          </h2>
          <UserTabs
            ref={userTabsRef}
            employee={createInitialEmployee()}
            isEditable={true}
            onSave={handleSaveChanges}
          />
        </div>
      </div>
    </div>
  );
}
