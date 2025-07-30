import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import EditEmployeeModal from '@/components/EditEmployeeModal';
import EmployeeForm from '@/components/EmployeeForm';

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [editOpen, setEditOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);

  const fetchEmployees = async () => {
    try {
      const res = await axios.get('/api/employees/all');
      setEmployees(res.data);
    } catch (err) {
      console.error('Error fetching employees:', err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.put(`/api/employees/${id}/soft-delete`);
      fetchEmployees();
    } catch (err) {
      console.error('Failed to delete employee:', err);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  return (
    <div className="p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Employee List</h2>

        <Dialog open={addOpen} onOpenChange={setAddOpen}>
          <DialogTrigger asChild>
            <Button>Add Employee</Button>
          </DialogTrigger>
          <DialogContent>
            <EmployeeForm
              onSuccess={() => {
                setAddOpen(false);
                fetchEmployees();
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Employee Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {employees.map((emp) => (
            <TableRow key={emp.id}>
              <TableCell>{emp.name}</TableCell>
              <TableCell>{emp.email}</TableCell>
              <TableCell>{emp.role}</TableCell>
              <TableCell>{emp.active ? 'Active' : 'Deleted'}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => {
                      setSelectedEmployee(emp);
                      setEditOpen(true);
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(emp.id)}
                  >
                    Delete
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Edit Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <EditEmployeeModal
            employee={selectedEmployee}
            onSuccess={() => {
              setEditOpen(false);
              fetchEmployees();
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EmployeeList;
