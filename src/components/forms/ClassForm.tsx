"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import InputField from "@/components/InputField";
import Image from "next/image";
import { classSchema, ClassSchema } from "@/lib/formValidationSchemas";
import { createClass, updateClass } from "@/actions/class";
import { Dispatch, SetStateAction, useActionState, useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Grade, Teacher } from "@prisma/client";

interface IClassForm {
  type: "create" | "update";
  setOpen: Dispatch<SetStateAction<boolean>>;
  data?: any;
  relatedData?: any;
}

const actionsMap = {
  create: createClass,
  update: updateClass,
};

const ClassForm = ({
  type, data, setOpen, relatedData,
}: IClassForm) => {
  const { teachers, grades } = relatedData
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ClassSchema>({
    resolver: zodResolver(classSchema),
  });
  
  const [state, formAction] = useActionState(
    actionsMap[type],
    { success: false, error: false }
  );
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  useEffect(() => {
    if(state.success) {
      toast.success(`Class has been ${type === "create" ? "created" : "updated"}!`);
      setOpen(false);
      router.refresh();
    }
  }, [state])
  

  const onSubmit = handleSubmit((data) => {
    // console.log(data);
    startTransition(() => {
      formAction(data)
    })
  });

  return (
    <form className="flex flex-col gap-8" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold">
        {type === "create" ? "Create a new class" : "Update the class"}
      </h1>
      
      <div className="flex justify-between flex-wrap gap-4">
        <InputField
          label="Name"
          name="name"
          defaultValue={data?.name}
          register={register}
          error={errors?.name}
        />
        <InputField
          label="Capacity"
          name="capacity"
          defaultValue={data?.capacity}
          register={register}
          error={errors?.capacity}
        />
        {data && <input hidden defaultValue={data?.id} {...register("id")} type="text | number"/>}

        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Supervisor</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register("supervisorId")}
            defaultValue={data?.supervisorId}
          >
            {teachers.map((teacher: Teacher) => (
              <option value={teacher.id} key={teacher.id}>{teacher.name + " " + teacher.surname}</option>
            ))}
          </select>
          {errors.supervisorId?.message && (
            <p className="text-xs text-red-400">
              {errors.supervisorId.message.toString()}
            </p>
          )}
        </div>
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Grade</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register("gradeId")}
            defaultValue={data?.gradeId}
          >
            {grades.map((grade: Grade) => (
              <option value={grade.id} key={grade.id}>{grade.level}</option>
            ))}
          </select>
          {errors.gradeId?.message && (
            <p className="text-xs text-red-400">
              {errors.gradeId.message.toString()}
            </p>
          )}
        </div>
      </div>
      
      {state.error && <span className="text-sm text-red-600">Something went wrong</span>}
      <button className="bg-blue-400 text-white p-2 rounded-md">
        {type === "create" ? "Create" : "Update"}
      </button>
    </form>
  );
}

export default ClassForm;