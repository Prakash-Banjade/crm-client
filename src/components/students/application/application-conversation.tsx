import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, ProfileAvatar } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowUpIcon, FileText, Paperclip, Send, X } from 'lucide-react';
import { useGetMessages } from '@/lib/data-access/application-data-hooks';
import { formatDistanceToNow } from 'date-fns';
import { TCurrentUser, useAuth } from '@/context/auth-provider';
import {
    InputGroup,
    InputGroupAddon,
    InputGroupButton,
    InputGroupInput,
    InputGroupText,
    InputGroupTextarea,
} from "@/components/ui/input-group"
import { Activity, ChangeEvent, useEffect, useState } from 'react';
import { EConversationType, TApplicationMessage, TSingleApplication } from '@/lib/types/application.type';
import { useFieldArray, useForm, useFormContext } from 'react-hook-form';
import { applicationMessageDefaultValues, applicationMessageSchema, TApplicationMessageSchema } from '@/lib/schema/application.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { useAxios } from '@/lib/axios-client';
import { TFileUploadResponse } from '@/lib/types';
import { useMutation } from '@tanstack/react-query';
import { QueryKey } from '@/lib/react-query/queryKeys';
import { extractErrorMessage, getObjectUrl, truncateFilename } from '@/lib/utils';
import { toast } from 'sonner';
import { useServerAction } from '@/hooks/use-server-action';
import { sendMessage } from '@/lib/actions/application.action';

type Props = {
    application: TSingleApplication;
}

export default function ApplicationConversation({ application }: Props) {
    return (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold">Comments & Activity</h3>
            <Tabs defaultValue="team" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="team">Amphlo Team</TabsTrigger>
                    <TabsTrigger value="student" disabled>Student</TabsTrigger>
                </TabsList>
                <div className="mt-4">
                    <TabsContent value="team" className="mt-0">
                        <AdminTypeConversation conversationId={application.conversations.find(conversation => conversation.type === EConversationType.Admin)?.id!} />
                    </TabsContent>
                    <TabsContent value="student" className="mt-0">
                        <div className="text-center text-muted-foreground py-8">
                            No comments from student yet.
                        </div>
                    </TabsContent>
                </div>
            </Tabs>
        </div>
    )
}

function AdminTypeConversation({ conversationId }: { conversationId: string }) {
    const { user } = useAuth();
    const { data: messages, isLoading } = useGetMessages({ conversationId: conversationId });

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (!user) return null;

    return (
        <RenderMessages messages={messages} user={user} conversationId={conversationId} />
    )
}



function RenderMessages({
    messages: defaultMessages,
    user,
    conversationId
}: {
    messages?: TApplicationMessage[]
    user: NonNullable<TCurrentUser>
    conversationId: string
}) {
    const [messages, setMessages] = useState<TApplicationMessage[]>(defaultMessages || []);
    const [isFileUploading, setIsFileUploading] = useState(false);

    const avatarName = user.firstName.charAt(0).toUpperCase() + user.lastName.charAt(0).toUpperCase();

    const form = useForm<TApplicationMessageSchema>({
        resolver: zodResolver(applicationMessageSchema),
        defaultValues: {
            conversationId: conversationId,
            content: "",
            files: [],
        },
    });

    const { isPending: isSending, mutate: send } = useServerAction({
        action: sendMessage,
        onSuccess: () => {
            form.reset();
        },
        onError: () => {
            // since last message was added to messages, remove it on error
            setMessages(prev => {
                const array = [...prev];
                array.pop();
                return array;
            })
        },
        toastOnSuccess: false,
    });


    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: 'files'
    });

    function onSubmit(data: TApplicationMessageSchema) {
        if (isFileUploading || isSending) return;

        // immediately add message to the list
        setMessages(prev => [
            ...prev,
            {
                id: crypto.randomUUID(),
                content: form.getValues('content') || "",
                files: form.getValues('files').map(f => f.fileName) || [],
                createdAt: new Date().toISOString(),
                sender: {
                    id: user.accountId,
                    lowerCasedFullName: user.firstName.toLowerCase() + ' ' + user.lastName.toLowerCase(),
                    role: user.role
                },
            }
        ]);

        send({ formData: data });
    }

    return (
        <div className='border'>
            <Activity mode={messages?.length ? 'visible' : 'hidden'}>
                <ScrollArea className='h-[500px] p-4'>
                    <div className="flex flex-col gap-4">
                        {messages?.map((message) => (
                            <div className="flex items-start gap-3 self-end" key={message.id}>
                                {
                                    message.sender.id !== user.accountId && (
                                        <ProfileAvatar
                                            src={undefined}
                                            name={message.sender.lowerCasedFullName}
                                        />
                                    )
                                }
                                <Card className="p-3 bg-secondary w-3/4 gap-2">
                                    <p className="text-sm font-semibold">
                                        {
                                            message.sender.id !== user.accountId ? (
                                                message.sender.lowerCasedFullName
                                            ) : (
                                                "You"
                                            )
                                        }
                                        <span className="text-xs text-muted-foreground font-normal ml-2">
                                            {formatDistanceToNow(new Date(message.createdAt))} ago
                                        </span>
                                    </p>
                                    <p className="text-sm mt-1">{message.content}</p>
                                </Card>
                            </div>
                        ))}
                    </div>
                </ScrollArea>
            </Activity>

            <Activity mode={(!messages || messages?.length === 0) ? 'visible' : 'hidden'}>
                <div className='py-20 text-center text-muted-foreground'>No comments yet !</div>
            </Activity>

            {/* Comment Input */}
            <div className="p-4 border-t bg-secondary flex gap-3 items-end">
                <Avatar title='You'>
                    <AvatarFallback className="text-white bg-orange-500">
                        {avatarName}
                    </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}>
                            <InputGroup>
                                <InputGroupTextarea
                                    placeholder="Write a comment..."
                                    {...form.register("content")}
                                />
                                <InputGroupAddon align="block-end">
                                    <div className='flex gap-1 flex-wrap'>
                                        {
                                            fields.map((f, i) => (
                                                <Badge variant={"secondary"} key={f.id}>
                                                    <Link href={getObjectUrl(f.fileName)} target="_blank">{truncateFilename(f.fileName.split("/").pop() || "", 20)}</Link>
                                                    <button type='button' onClick={() => remove(i)}>
                                                        <X size={14} />
                                                    </button>
                                                </Badge>
                                            ))
                                        }
                                    </div>

                                    <FormItem className='ml-auto'>
                                        <FormControl>
                                            <FileAttach
                                                currentFilesCount={fields.length}
                                                onFilesUploaded={(newFiles) => {
                                                    newFiles.forEach(f => append(f));
                                                }}
                                                setIsFileUploading={setIsFileUploading}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>

                                    <InputGroupButton
                                        type='submit'
                                        variant="default"
                                        className="size-8 rounded-full"
                                        disabled={isFileUploading}
                                    >
                                        <Send size={20} />
                                        <span className="sr-only">Send</span>
                                    </InputGroupButton>
                                </InputGroupAddon>
                            </InputGroup>
                        </form>
                    </Form>
                </div>
            </div>
        </div>
    )
}

const MAX_LIMIT = 3

function FileAttach({
    currentFilesCount,
    onFilesUploaded,
    setIsFileUploading,
}: {
    currentFilesCount: number
    onFilesUploaded: (files: { fileName: string }[]) => void
    setIsFileUploading: (value: boolean) => void
}) {
    const axios = useAxios();
    const [uploadProgress, setUploadProgress] = useState(0)
    const [inputVal, setInputVal] = useState('')

    const { mutateAsync, isPending: isUploading } = useMutation<TFileUploadResponse, Error, FormData>({
        mutationFn: async (data) => {
            const files = data.get('files');

            if (!files) return;

            const response = await axios.post(
                `/${QueryKey.FILES_UPLOAD}`,
                data,
                {
                    onUploadProgress(progressEvent) {
                        const progress = progressEvent.total ? Math.round((progressEvent.loaded / progressEvent.total) * 100) : 0;
                        setUploadProgress(progress);
                    },
                }
            );
            return response.data;
        },
        onSuccess: (data) => {
            if (data && !!data?.length) {
                onFilesUploaded(data.map(f => ({ fileName: f.filename })));
            }
            setUploadProgress(0);
        },
        onError: (error) => {
            setUploadProgress(0);
            toast.error(extractErrorMessage(error).message || 'Failed to upload file')
        },
    });

    const handleChange = async (e: ChangeEvent<HTMLInputElement>) => {
        const inputFiles = e.target.files;

        const formData = new FormData();

        if (inputFiles instanceof FileList) {
            if (inputFiles.length > MAX_LIMIT || (currentFilesCount + inputFiles.length) > MAX_LIMIT) {
                toast.error(`You can only upload a maximum of ${MAX_LIMIT} files`);
                return;
            }

            for (const file of inputFiles) {
                formData.append('files', file);
            }

            await mutateAsync(formData);
        }
    };

    useEffect(() => {
        setIsFileUploading(isUploading);
    }, [isUploading]);

    return (
        <div className='ml-auto'>
            <InputGroupButton
                variant="ghost"
                className="size-8 rounded-full"
                asChild
            >
                <label
                    htmlFor={'file_attach'}
                    role="button"
                >
                    {
                        isUploading ? (
                            `${uploadProgress}%`
                        ) : (
                            <Paperclip size={20} />
                        )
                    }
                    <span className="sr-only">Attach File</span>
                </label>
            </InputGroupButton>

            <input
                type="file"
                id={'file_attach'}
                disabled={isUploading}
                multiple
                value={inputVal} // no need to track the value else throws error since the value will be registered by react-hook-form
                onChange={handleChange}
                accept="image/*,application/pdf"
                className="sr-only -left-[100000px]" // negative positioning is to fix overflow scroll issue
            />
        </div>
    )
}