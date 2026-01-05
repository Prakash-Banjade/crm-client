import { ChangeEvent, useState } from "react";
import { Input } from "../ui/input";
import { cn, extractErrorMessage, truncateFilename } from "@/lib/utils";
import { LoaderCircle, Trash } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { QueryKey } from "@/lib/react-query/queryKeys";
import { TFileUploadResponse } from "@/lib/types";
import { useAxios } from "@/lib/axios-client";

type FileUploadProps = {
    name: string;
    multiple?: boolean;
    maxLimit?: number,
    value: string[] | string | undefined;
    onValueChange: (value: string[]) => void;
    onError?: (error: string) => void;
    accept?: string;
}

export function FileUpload({
    name,
    multiple = false,
    value,
    onValueChange,
    onError,
    maxLimit = 10,
    accept
}: FileUploadProps) {
    const axios = useAxios();
    const [uploadProgress, setUploadProgress] = useState(0)
    const [inputVal, setInputVal] = useState('')

    const [uploaded, setUploaded] = useState<TFileUploadResponse>(() => {
        if (!value) return [];

        const fileUrlArray = typeof value === 'string' ? [value] : value;

        return fileUrlArray?.map(url => {
            const filename = url.split('/').pop() || '';
            const originalName = truncateFilename(filename, 10);

            return ({
                filename,
                originalName,
                url,
            })
        })
    });

    const { mutateAsync, isPending } = useMutation<TFileUploadResponse, Error, FormData>({
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
                onValueChange(multiple ? [...data.map(f => f.url)] : [data[0].url])
                setUploaded(prev => [...prev, ...data]);
            } else {
                setUploadProgress(0);
            }
        },
        onError: (error) => {
            setUploadProgress(0);
            onError?.(extractErrorMessage(error).message || 'Failed to upload file');
        },
    });

    const handleChange = async (e: ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;

        const formData = new FormData();

        if (files instanceof FileList) {
            if (files.length > maxLimit || uploaded.length > maxLimit || ((files.length + uploaded.length) > maxLimit)) {
                onError?.(`You can only upload a maximum of ${maxLimit} files`);
                return;
            }

            for (const file of files) {
                formData.append('files', file);
            }

            await mutateAsync(formData);
        }
    };

    const handleRemoveFile = (url: string) => {
        const newState = uploaded.filter(file => file.url !== url);
        setUploaded(newState);
        onValueChange(multiple ? newState.map(file => file.url) : [newState[0]?.url || ""]);
    };

    return (
        <div>
            <label
                htmlFor={'file_' + (name as string)}
                role="button"
                className={cn(
                    "text-sm p-3 py-2 border rounded-md w-full inline-block",
                    (isPending || uploaded.length >= maxLimit) && "cursor-not-allowed! pointer-events-none opacity-80 flex items-center gap-2"
                )}
                aria-disabled={isPending}
            >
                {
                    isPending
                        ? <>
                            <LoaderCircle className="h-4 w-4 animate-spin" />
                            Uploading...
                            <span className="ml-auto">{uploadProgress}%</span>
                        </>
                        : "Click to upload file"
                }
            </label>

            <Input
                type="file"
                id={'file_' + (name as string)}
                disabled={isPending}
                multiple={multiple}
                value={inputVal}
                onChange={handleChange}
                accept={accept}
                className={cn("sr-only -left-[100000px]")} // negative positioning is to fix overflow scroll issue
            />

            {
                uploaded.length > 0 && (
                    <div>
                        <span className="text-xs text-muted-foreground">Uploaded:</span>
                        <div className="flex flex-col">
                            {
                                uploaded.map((file) => (
                                    <div className="flex items-center gap-2 justify-between hover:bg-secondary/50 p-2 rounded-md transition-all" key={file.url}>
                                        <a href={file.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline text-sm wrap-break-word w-fit">
                                            {truncateFilename(file.filename.replace('temp/', ''), 40)}
                                        </a>

                                        <button type="button" onClick={() => handleRemoveFile(file.url)} aria-label="Remove file" title="Remove file">
                                            <Trash className="h-4 w-4 text-destructive" />
                                        </button>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                )
            }
        </div>
    );
};
