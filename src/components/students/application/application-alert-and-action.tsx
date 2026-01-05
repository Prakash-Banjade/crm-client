import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { CreditCard, Eye, FileCheck, MoreVertical, Trash, Upload } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { EApplicationPriority, EApplicationStatus, TSingleApplication } from '@/lib/types/application.type';
import { updateApplication, verifyPaymentDocument } from '@/lib/actions/application.action';
import { useServerAction } from '@/hooks/use-server-action';
import { QueryKey } from '@/lib/react-query/queryKeys';
import { createQueryString, extractErrorMessage, getObjectUrl } from '@/lib/utils';
import { useParams } from 'next/navigation';
import { useAuth } from '@/context/auth-provider';
import { Role, TFileUploadResponse } from '@/lib/types';
import { Spinner } from '@/components/ui/spinner';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Activity, ChangeEvent, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useAxios } from '@/lib/axios-client';
import { toast } from 'sonner';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

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
        <CardHeader className='flex gap-4 justify-between'>
          <section className='flex gap-4'>
            <CreditCard className='text-blue-500' />
            <div>
              <CardTitle>
                Fee Status
              </CardTitle>
              <CardDescription>
                <p className='text-base'>
                  {
                    application.course.applicationFee === 0 ? (
                      "No Application Fee"
                    ) : (
                      application.course.applicationFee + " " + application.course.currency
                    )
                  }
                </p>
              </CardDescription>
            </div>
          </section>
          {
            application.paymentDocument && (
              <section>
                {
                  application.paymentVerifiedAt ? (
                    <Badge variant="success">
                      Verified
                    </Badge>
                  ) : (
                    <Badge variant="destructive">
                      Not Verified
                    </Badge>
                  )
                }
              </section>
            )
          }
        </CardHeader>
        <Activity mode={application.course.applicationFee > 0 && !application.paymentDocument && user?.role !== Role.SUPER_ADMIN ? "visible" : "hidden"}>
          <CardContent>
            <UploadPaymentDocumentButton applicationId={application.id} />
          </CardContent>
        </Activity>
        {
          application.paymentDocument && (
            <CardContent className='flex gap-2'>
              <Button variant={'outline'} asChild className='grow'>
                <Link
                  href={getObjectUrl(application.paymentDocument)}
                  target="_blank"
                >
                  <Eye />
                  View Payment Document
                </Link>
              </Button>
              <Activity mode={!application.paymentVerifiedAt ? "visible" : "hidden"}>
                <PaymentDocumentSuperAdminAction applicationId={application.id} />
              </Activity>
            </CardContent>
          )
        }
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

function UploadPaymentDocumentButton({ applicationId }: { applicationId: string }) {
  const axios = useAxios();
  const [inputVal, setInputVal] = useState('')

  const { isPending: isUpdating, mutate: update } = useServerAction({
    action: updateApplication,
    invalidateTags: [QueryKey.APPLICATIONS, applicationId],
    toastOnSuccess: false,
    onSuccess: () => {
      toast.success("Payment document uploaded successfully")
    }
  });

  const { mutateAsync, isPending: isUploading } = useMutation<TFileUploadResponse, Error, FormData>({
    mutationFn: async (data) => {
      const files = data.get('files');

      if (!files) return;

      const response = await axios.post(
        `/${QueryKey.FILES_UPLOAD}`,
        data,
      );
      return response.data;
    },
    onSuccess: (data) => {
      if (data && !!data?.length) {
        update({
          id: applicationId,
          formData: {
            paymentDocument: data[0].filename,
          }
        })
      }
      setInputVal('')
    },
    onError: (error) => {
      toast.error(extractErrorMessage(error).message || 'Failed to upload')
    },
  });

  const handleChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const inputFiles = e.target.files;

    const formData = new FormData();

    if (inputFiles instanceof FileList) {
      for (const file of inputFiles) {
        formData.append('files', file);
      }

      await mutateAsync(formData);
    }
  };

  return (
    <div className='ml-auto'>
      <Button
        variant={'outline'}
        className='w-full'
        asChild
        disabled={isUploading || isUpdating}
      >
        <label
          htmlFor={'payment_doc_attach'}
          role="button"
        >
          {
            isUploading || isUpdating ? (
              <><Spinner /> Uploading...</>
            ) : (
              <>
                <Upload size={20} />
                Upload Payment Document
              </>
            )
          }

        </label>
      </Button>

      <input
        type="file"
        id={'payment_doc_attach'}
        disabled={isUploading}
        multiple
        value={inputVal}
        onChange={handleChange}
        accept="image/*,application/pdf"
        className="sr-only -left-[100000px]" // negative positioning is to fix overflow scroll issue
      />
    </div>
  )
}

function PaymentDocumentSuperAdminAction({ applicationId }: { applicationId: string }) {
  const { user } = useAuth();

  const { isPending: isUpdating, mutate: verify } = useServerAction({
    action: verifyPaymentDocument,
    invalidateTags: [QueryKey.APPLICATIONS, applicationId],
  });

  const { isPending: isRemoving, mutate: remove } = useServerAction({
    action: updateApplication,
    invalidateTags: [QueryKey.APPLICATIONS, applicationId],
    toastOnSuccess: false,
    onSuccess: () => {
      toast.success("Payment document removed")
    }
  });

  if (user?.role !== Role.SUPER_ADMIN) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size={'icon'} disabled={isUpdating || isRemoving}>
          {
            (isUpdating || isRemoving) ? <Spinner /> : (
              <>
                <span className="sr-only">Open menu</span>
                <MoreVertical className="h-4 w-4" />
              </>
            )
          }
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem
          onClick={() => {
            verify({ id: applicationId })
          }}
        >
          <FileCheck />
          Verify
        </DropdownMenuItem>
        <DropdownMenuItem
          variant="destructive"
          onClick={() => {
            remove({
              id: applicationId,
              formData: {
                paymentDocument: null,
              }
            })
          }}
        >
          <Trash />
          Remove
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}