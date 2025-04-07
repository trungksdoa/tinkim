export interface Departments {
    id: number;
    name: string;
    latitude: number;
    longitude: number;
    parentDepartmentId: number;
    locationId: number;
    isActive: boolean;
}