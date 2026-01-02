import { useServerAction } from "@/hooks/use-server-action";
import { updateStudent } from "@/lib/actions/student.action";
import { QueryKey } from "@/lib/react-query/queryKeys";
import { StudentSchema, TStudentSchema } from "@/lib/schema/student.schema";
import { TSingleStudent } from "@/lib/types/student.types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

export default function StudentAcademicQualificationForm({ student }: { student: TSingleStudent }) {
    const form = useForm<TStudentSchema>({
        resolver: zodResolver(StudentSchema),
        defaultValues: student,
    });

    const { isPending: isUpdating, mutate: update } = useServerAction({
        action: updateStudent,
        invalidateTags: [QueryKey.STUDENTS],
    });

    const onSubmit = (data: TStudentSchema) => {
        update({ id: student.id, formData: data });
    };
    return (
        <div>AcademicQualificationForm</div>
    )
}