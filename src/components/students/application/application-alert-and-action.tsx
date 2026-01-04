import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { CreditCard } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { EApplicationPriority, EApplicationStatus, TSingleApplication } from '@/lib/types/application.type';
import { updateApplication } from '@/lib/actions/application.action';
import { useServerAction } from '@/hooks/use-server-action';
import { QueryKey } from '@/lib/react-query/queryKeys';
import { createQueryString } from '@/lib/utils';
import { useParams } from 'next/navigation';
import { useAuth } from '@/context/auth-provider';
import { Role } from '@/lib/types';
import { Spinner } from '@/components/ui/spinner';
import { useQueryClient } from '@tanstack/react-query';

type Props = {
  application: TSingleApplication;
}

export default function ApplicationAlertAndAction({ application }: Props) {
  const { studentId } = useParams();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { isPending: isUpdating, mutate: update } = useServerAction({
    action: updateApplication,
    invalidateTags: [
      QueryKey.APPLICATIONS,
      // same query string as in applications list of single student
      createQueryString({
        studentId: studentId as string,
        take: 50,
      })
    ],
    onSuccess: () => {
      if (user?.role !== Role.SUPER_ADMIN) return;
      queryClient.invalidateQueries({
        queryKey: [QueryKey.APPLICATIONS, application.id],
      });
    }
  });

  return (
    <div className="grid grid-cols-2 gap-6">
      <Card>
        <CardHeader className='flex gap-4'>
          <CreditCard className='text-blue-500' />
          <div>
            <CardTitle>
              Fee Status
            </CardTitle>
            <CardDescription>Not payed yet</CardDescription>
          </div>
        </CardHeader>
      </Card>

      <Card className="flex flex-col justify-center">
        {
          user?.role === Role.SUPER_ADMIN ? (
            <CardContent className="space-y-4">
              <Label htmlFor="status" className="whitespace-nowrap font-medium">Update Status:</Label>
              <Select
                defaultValue={application.status}
                disabled={isUpdating}
                onValueChange={val => {
                  update({
                    id: application.id,
                    formData: {
                      status: val as EApplicationStatus,
                    }
                  })
                }}
              >
                <SelectTrigger id="status" className="w-full">
                  <div className='flex items-center gap-2'>
                    {
                      isUpdating && <Spinner />
                    }
                    <SelectValue />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  {
                    Object.entries(EApplicationStatus).map(([key, value]) => (
                      <SelectItem key={key} value={value}>
                        {key.replace(/_/g, " ")}
                      </SelectItem>
                    ))
                  }
                </SelectContent>
              </Select>
            </CardContent>
          ) : user?.role === Role.ADMIN && (
            <CardContent className="space-y-4">
              <Label htmlFor="priority" className="whitespace-nowrap font-medium">Update Priority:</Label>
              <Select
                defaultValue={application.priority}
                disabled={isUpdating}
                onValueChange={val => {
                  update({
                    id: application.id,
                    formData: {
                      priority: val as EApplicationPriority,
                    }
                  })
                }}
              >
                <SelectTrigger id="priority" className="w-full">
                  <div className='flex items-center gap-2'>
                    {
                      isUpdating && <Spinner />
                    }
                    <SelectValue />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  {
                    Object.entries(EApplicationPriority).map(([key, value]) => (
                      <SelectItem key={key} value={value}>
                        {key}
                      </SelectItem>
                    ))
                  }
                </SelectContent>
              </Select>
            </CardContent>
          )
        }
      </Card>
    </div>
  )
}