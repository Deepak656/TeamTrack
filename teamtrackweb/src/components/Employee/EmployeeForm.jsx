import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const EmployeeForm = ({ defaultValues = {}, onSubmit, onCancel }) => {
  const { register, handleSubmit, reset } = useForm({ defaultValues });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label>First Name</Label>
        <Input {...register("firstName", { required: true })} />
      </div>
      <div>
        <Label>Last Name</Label>
        <Input {...register("lastName", { required: true })} />
      </div>
      <div>
        <Label>Email</Label>
        <Input type="email" {...register("email", { required: true })} />
      </div>
      <div>
        <Label>Username</Label>
        <Input {...register("username", { required: true })} />
      </div>
      <div className="flex justify-end gap-2">
        <Button variant="ghost" type="button" onClick={onCancel}>Cancel</Button>
        <Button type="submit">Save</Button>
      </div>
    </form>
  );
};

export default EmployeeForm;
