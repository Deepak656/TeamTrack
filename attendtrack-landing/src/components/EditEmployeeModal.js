import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import EmployeeForm from './EmployeeForm';

const EditEmployeeModal = ({ open, onClose, employee, onSubmit }) => {
  if (!employee) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Employee</DialogTitle>
        </DialogHeader>

        <EmployeeForm
          defaultValues={employee}
          onSubmit={(data) => {
            onSubmit(data);
            onClose();
          }}
          onCancel={onClose}
        />
      </DialogContent>
    </Dialog>
  );
};

export default EditEmployeeModal;
