'use client';
import EmployeeModal from './EmployeeModal';
import React, { useState, useEffect } from 'react';
import Loading from '@/components/Loading/page';
import { Employee } from '@/types/types';
import Image from 'next/image';
import AddEmployee from './AddEmployee';
import {
  IconSearch,
  IconUser,
  IconEdit,
  IconTrash,
  // IconEye,
} from '@tabler/icons-react';
// import { ShowerHead } from 'lucide-react';
import DeleteConfirm from '@/components/dashboard/product/DeleteConfirm';

const Page = () => {
  const [employee, setEmployee] = useState([{} as Employee]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [clickToDeleteId, setClickToDeleteId] = useState<number | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [filteredEmployees, setFilteredEmployees] = useState([{} as Employee]);
  const [selectedEmployee, setSelectedEmployee] = useState({} as Employee);
  const [addEmployeeModal, setAddEmployeeModal] = useState(false);
  // const [isShowAddEmployeeModal, setIsShowAddEmployeeModal] = useState(false); // [addEmployeeModal];

  useEffect(() => {
    getEmployee();
    setFilteredEmployees(employee);
  }, []);

  //get admin user
  const getEmployee = async () => {
    const res = await fetch('/api/admin');
    const data = await res.json();
    console.log('data><', data);
    setEmployee(data.data);
  };

  const handleEditClick = (employee: Employee) => {
    setSelectedEmployee(employee);
    setModalOpen(true);
  };

  const handleSave = (updatedEmployee: Employee) => {
    // Logic to update the employee data (e.g., API call)
    console.log('Updated Employee:', updatedEmployee);
    setModalOpen(false); // Close modal after saving
  };

  //delete employee
  const deleteEmployee = async (id: number) => {
    const res = await fetch(`/api/admin`, {
      method: 'DELETE',
      body: JSON.stringify({ id }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (res.ok) {
      // getEmployee();
      setDeleteConfirm(false);
    }
    const data = await res.json();
    console.log('data><', data);
    getEmployee();
  };

  const [uniqueRole, setUniqueRole] = useState<string[]>([]);
  //find and set unique role
  useEffect(() => {
    const uniqueRoles = employee
      ?.map((employee) => employee.role)
      .filter((role, index, self) => self.indexOf(role) === index);
    setUniqueRole(uniqueRoles);
    setFilteredEmployees(employee);
  }, [employee]);

  const ShowAllEmployees = () => {
    setFilteredEmployees(employee);
  };

  const filteremployeeByRole = (role: string) => {
    const filteredEmployees = employee.filter(
      (employee) => employee.role === role,
    );
    setFilteredEmployees(filteredEmployees);
    // const availableProducts = filteredProducts.filter(
    //   (employee) => employee.available,
    // );
    // setAvailableItems(availableProducts);
    // setActiveCategory(categoryId);
  };
  // Filter search products
  const filteredData = filteredEmployees
    ?.filter((employee) =>
      employee.first_name?.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    .sort((a, b) => {
      return a.id === b.id ? 0 : a.id ? -1 : 1;
    });
  if (!employee) return <Loading />;
  return (
    <div className="min-h-screen bg-gray-50 flex p-4 flex-col">
      <span className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold mb-4">Employees</h2>
        <button
          onClick={() => setAddEmployeeModal(true)}
          className="bg-violet-500 text-white px-4 py-2 rounded-md"
        >
          add employee
        </button>
      </span>
      <div className="mb-6 flex items-center gap-4">
        <div className="flex gap-4 border-b w-full relative  overflow-x-auto">
          <button
            onClick={() => ShowAllEmployees()}
            className={` text-sm sm:text-gray-600 text-gray-900 font-medium pb-1 sm:bg-gray-100 hover:bg-gray-200 bg-violet-300 rounded-md ${
              // activeCategory === null ? 'border-b-2 border-blue-500 pb-1' : ''
              ''
            }
            `}
          >
            <span className="px-4 sm:px-1">All </span>
            <span className="hidden sm:inline"> employees</span>
          </button>
          {uniqueRole?.map((role) => (
            <div className="flex items-center justify-center ">
              <button
                onClick={() => filteremployeeByRole(role)}
                key={role}
                className="text-sm  sm:text-gray-600 font-medium text-gray-900 pb-1 bg-violet-300  sm:bg-gray-100 hover:bg-gray-200 rounded-md items-center flex justify-center"
              >
                <p className="text-center px-1">{role}</p>
              </button>
            </div>
          ))}
        </div>
        <div className="relative ml-auto rounded-md">
          <input
            onChange={(e) => setSearchTerm(e.target.value)}
            type="search"
            placeholder="Search"
            className="ml-auto w-full border rounded-md p-1 pl-10  focus:ring-0 focus:outline-none"
          />
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <IconSearch className="h-5 w-5 text-gray-400" />
          </div>
        </div>
      </div>

      <div className="overflow-x-auto w-full shadow-md rounded-2xl">
        {/* <h2 className="text-xl font-semibold m-2">Employees</h2> */}
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 text-left">First Name</th>
              <th className="px-4 py-2 text-left">Last Name</th>
              <th className="px-4 py-2 text-left">Email</th>
              <th className="px-4 py-2 text-left">Phone</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredData?.map((employe) => (
              <tr key={employe.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-2 flex items-center">
                  <span className="mr-2">
                    {employe.photo_url ? (
                      <Image
                        src={employe.photo_url}
                        alt={employe.first_name}
                        width={50}
                        height={50}
                        className="rounded-full w-10 h-10 border border-gray-300"
                      />
                    ) : (
                      <IconUser className="w-10 text-gray-400 h-10 border rounded-full p-1" />
                    )}
                  </span>
                  <span>
                    <h2 className="text-md font-medium">
                      {employe.first_name}
                    </h2>
                    <p className="text-sm text-gray-500">{employe.role}</p>
                  </span>
                </td>
                <td className="px-4 py-2">{employe.last_name}</td>
                <td className="px-4 py-2">{employe.email}</td>
                <td className="px-4 py-2">{employe.phone}</td>
                <td className="px-4 py-2 flex items-center gap-2">
                  <button
                    className="text-blue-500 hover:underline"
                    onClick={() => handleEditClick(employe)}
                  >
                    <IconEdit />
                  </button>
                  <button
                    className="text-red-500 hover:underline"
                    onClick={() => {
                      // deleteEmployee(employe.id);
                      setDeleteConfirm(true);
                      setClickToDeleteId(employe.id);
                    }}
                  >
                    <IconTrash />
                  </button>
                  {/* details icon */}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <EmployeeModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        employeeData={selectedEmployee}
        onSave={() => handleSave(selectedEmployee)}
      />
      {deleteConfirm && (
        <DeleteConfirm
          setDeleteConfirm={setDeleteConfirm}
          handleDelete={async () => {
            if (clickToDeleteId) {
              await deleteEmployee(clickToDeleteId);
            }
          }}
        />
      )}

      {addEmployeeModal && (
        <AddEmployee
          setAddEmployeeModal={setAddEmployeeModal}
          // employeeData={selectedEmployee}
          // onSave={() => handleSave(selectedEmployee)}
        />
      )}
      {/* </div> */}
    </div>
  );
};

export default Page;
