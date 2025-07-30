import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import EmployeeForm from "../../../components/Employee/EmployeeForm";

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selected, setSelected] = useState(null);

  const fetchEmployees = async () => {
    const res = await api.get("?page=0&size=20");
    setEmployees(res.data.content);
  };

  const handleEdit = (emp) => {
    setSelected(emp);
    setDialogOpen(true);
  };

  const handleSubmit = async (formData) => {
    if (selected) {
      await api.put(`/${selected.id}`, formData);
    } else {
      await api.post("/", formData);
    }
    setDialogOpen(false);
    setSelected(null);
    fetchEmployees();
  };

  const handleCancel = () => {
    setDialogOpen(false);
    setSelected(null);
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  return (
    <div className="p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Employees</h2>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setSelected(null)}>+ Add Employee</Button>
          </DialogTrigger>
          <DialogContent>
            <EmployeeForm
              defaultValues={selected || {}}
              onSubmit={handleSubmit}
              onCancel={handleCancel}
            />
          </DialogContent>
        </Dialog>
      </div>

      <ul className="space-y-2">
        {employees.map((emp) => (
          <li
            key={emp.id}
            className="p-4 rounded border flex justify-between items-center"
          >
            <div>
              <div className="font-medium">
                {emp.firstName} {emp.lastName}
              </div>
              <div className="text-sm text-muted-foreground">{emp.email}</div>
            </div>
            <Button size="sm" onClick={() => handleEdit(emp)}>
              Edit
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EmployeeList;
