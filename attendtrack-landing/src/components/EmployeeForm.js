import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const EmployeeForm = ({ defaultValues, onSubmit, onCancel }) => {
  const { register, handleSubmit, reset } = useForm({
    defaultValues,
  });

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label>Name</Label>
        <Input {...register('name', { required: true })} />
      </div>
      <div>
        <Label>Email</Label>
        <Input type="email" {...register('email', { required: true })} />
      </div>
      <div>
        <Label>Role</Label>
        <Input {...register('role')} />
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>
        <Button type="submit">Save</Button>
      </div>
    </form>
  );
};

export default EmployeeForm;
