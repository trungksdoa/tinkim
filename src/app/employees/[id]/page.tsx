"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { Employee } from "@/types/employee";
import {
  useEmployee,
  useUpdateEmployee,
  useCreateEmployee,
} from "@/services/employeeService";
import BasicInfo from "./components/BasicInfo";
import UserTabs, { UserTabsRef } from "./components/UserTabs";
import { decodeData } from "@/utils/dataHash";
export default function EmployeeDetail() {
  const params = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const userTabsRef = useRef<UserTabsRef>(null);

  const [isEditable, setIsEditable] = useState(
    searchParams.get("mode") === "edit"
  );

  const employee = useMemo(
    () =>
      searchParams.get("data") ? decodeData(searchParams.get("data")!) : null,
    [searchParams]
  );

  const updateEmployee = useUpdateEmployee();
  const createEmployee = useCreateEmployee();

  const handleModeChange = useCallback((mode: string) => {
    setIsEditable(mode === "edit");
  }, []);

  const handleSaveChanges = useCallback(
    async (data: Partial<Employee>) => {
      // console.log(data);
      try {
        if (params.id === "new") {
          await createEmployee.mutateAsync(data as Employee);
          navigate('/employees');
        } else {
          const res = await updateEmployee.mutateAsync({
            ...data,
            id: Number(params.id),
          } as Employee);

          //display message success
          alert(res?.message);
          handleModeChange("view");
        }
      } catch (error) {
        console.error("Lỗi khi lưu thay đổi:", error);
      }
    },
    [params.id, createEmployee, updateEmployee, navigate]
  );

  return (
    <div className="container mx-auto p-4 max-w-7xl h-[calc(100vh-4rem)] overflow-y-auto">
      <div className="flex flex-col h-full space-y-6 overflow-y-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-black mb-4">
            Thông tin cơ bản
          </h2>
          <BasicInfo
            isCreatable={false}
            employee={employee || null}
            isEditable={isEditable}
            onSave={handleSaveChanges}
            onModeChange={handleModeChange}
            userTabsRef={userTabsRef as React.RefObject<UserTabsRef>}
          />
        </div>
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-black mb-4">
            Thông tin chi tiết
          </h2>
          <UserTabs
            ref={userTabsRef}
            employee={employee || null}
            isEditable={isEditable}
            onSave={handleSaveChanges}
          />
        </div>
      </div>
    </div>
  );
}
