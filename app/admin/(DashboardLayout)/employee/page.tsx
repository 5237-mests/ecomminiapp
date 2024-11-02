'use client';
import EmployeeModal from './EmployeeModal';
import React, { useState, useEffect } from 'react';
import Loading from '@/components/Loading/page';

const Page = () => {
  const [employee, setEmployee] = useState([{} as Employee]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState({} as Employee);

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
  const deleteEmployee = async (id: string) => {
    const res = await fetch(`/api/admin`, {
      method: 'DELETE',
      body: JSON.stringify({ id }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data = await res.json();
    console.log('data><', data);
    getEmployee();
  };

  useEffect(() => {
    getEmployee();
  }, []);

  if (!employee) return <Loading />;
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Employee Dashboard</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          + Add Employee
        </button>
      </header>

      {/* Content */}
      <main className="flex-1 p-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {employee?.map((client) => (
            <div
              key={client.id}
              className="bg-white shadow-lg rounded-lg p-6 transition-transform transform hover:scale-105"
            >
              <h2 className="text-xl font-semibold text-gray-800">
                Name: {client.first_name} {client.last_name}
              </h2>
              <p className="text-gray-500">Username: {client.username}</p>
              <p className="text-gray-400">Phone: {client.phone}</p>
              <div className="mt-4 flex space-x-4">
                <button className="text-blue-600 hover:underline">View</button>
                <button
                  onClick={() => handleEditClick(client)}
                  className="text-green-600 hover:underline"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteEmployee(client.id.toString())}
                  className="text-red-600 hover:underline"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* <EmployeeDashboard /> */}
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Employee Dashboard</h1>
        <div className="bg-white shadow-md rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-2">Employees</h2>
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
              {employee?.map((employe) => (
                <tr key={employe.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-2">{employe.first_name}</td>
                  <td className="px-4 py-2">{employe.last_name}</td>
                  <td className="px-4 py-2">{employe.email}</td>
                  <td className="px-4 py-2">{employe.phone}</td>
                  <td className="px-4 py-2">
                    <button
                      className="text-blue-500 hover:underline"
                      onClick={() => handleEditClick(employe)}
                    >
                      Edit
                    </button>
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
      </div>
    </div>
  );
};

export default Page;

interface Employee {
  id: number;
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  phone: string;
}
