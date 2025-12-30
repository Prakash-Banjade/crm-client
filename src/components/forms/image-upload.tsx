import { useState, useCallback } from 'react'
import { Trash, Upload } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { cn, extractErrorMessage } from '@/lib/utils'
import { useMutation } from '@tanstack/react-query'
import { useAxios } from '@/lib/axios-client'
import { TFileUploadResponse } from '@/lib/types'
import { QueryKey } from '@/lib/react-query/queryKeys'
import Image from 'next/image'

interface ImageUploaderProps {
    name: string;
    maxSize?: number // in bytes
    accept?: string;
    value?: string | null;
    onValueChange: (value: string | null) => void;
}

export default function ImageUpload({
    name,
    maxSize = 5 * 1024 * 1024, // 5MB default
    accept = 'image/*',
    value = null,
    onValueChange
}: ImageUploaderProps) {
    const axios = useAxios();

    const [isDragging, setIsDragging] = useState(false)
    const [uploadProgress, setUploadProgress] = useState(0)
    const [imageUrl, setImageUrl] = useState<string | null>(value)
    const [error, setError] = useState<string | null>(null)

    const { mutateAsync, isPending } = useMutation<TFileUploadResponse, Error, FormData>({
        mutationFn: async (data) => {
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
                const file = data[0];
                setImageUrl(file.url);
                onValueChange?.(file.url);
                setUploadProgress(100);
            } else {
                setUploadProgress(0);
            }
        },
        onError: (error) => {
            setUploadProgress(0);
            setError(extractErrorMessage(error).message || 'Failed to upload file');
        },
    });

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(true)
    }, [])

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(false)
    }, [])

    const handleUpload = useCallback(async (file: File) => {
        try {
            if (file.size > maxSize) {
                throw new Error(`File size must be less than ${maxSize / 1024 / 1024}MB`)
            }

            if (!file.type.startsWith('image/')) {
                throw new Error('File must be an image')
            }

            setError(null)
            setUploadProgress(0)

            const formData = new FormData();
            formData.append('images', file);

            await mutateAsync(formData);

            setUploadProgress(100)
        } catch (err) {
            if (err instanceof Error) {
                setError(extractErrorMessage(err).message || 'Failed to upload file')
            }
        } finally {
            setIsDragging(false)
        }
    }, [maxSize])

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        const file = e.dataTransfer.files[0]
        if (file) {
            handleUpload(file)
        }
    }, [handleUpload])

    const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            handleUpload(file)
        }
    }, [handleUpload])

    const handleRemove = useCallback(() => {
        setImageUrl(null); // reset local state value for image
        setUploadProgress(0); // reset progress
        setError(null); // reset error
        onValueChange(null);
    }, [])

    if (isPending) {
        return (
            <div className="p-8 border h-full flex flex-col justify-center">
                <div className="text-center space-y-4">
                    <Progress value={uploadProgress} className="w-full" />
                    <h3 className="font-semibold">Uploading Image: {uploadProgress}%</h3>
                    <p className="text-sm text-muted-foreground">
                        Do not refresh or perform any other action while the image is being uploaded
                    </p>
                </div>
            </div>
        )
    }

    return (
        <section className='size-full relative'>
            <label
                htmlFor={`file-upload-${name as string}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={cn(
                    "border border-dashed p-8 flex flex-col items-center justify-center transition-all cursor-pointer hover:bg-secondary/20",
                    isDragging ? 'border-primary bg-primary/10' : 'border-border',
                )}
                title={
                    imageUrl ? 'Click to change image' : 'Click to upload image'
                }
            >
                <input
                    type="file"
                    accept={accept}
                    onChange={handleFileInput}
                    className="hidden"
                    disabled={isPending}
                    id={`file-upload-${name as string}`}
                />
                {
                    imageUrl ? (
                        <>
                            <Image
                                src={imageUrl}
                                alt="Uploaded preview"
                                width={150}
                                height={150}
                                className="max-w-80 h-auto object-contain"
                            />
                        </>
                    ) : (
                        <>
                            <Upload className="h-10 w-10 text-gray-400 mb-4" />
                            <h3 className="font-semibold mb-2">Drag an image</h3>
                            <p className="text-sm text-center text-muted-foreground mb-4">
                                Select an image or drag here to upload directly
                            </p>
                        </>
                    )
                }
                {
                    error && (
                        <p className="text-destructive text-sm">{error}</p>
                    )
                }
            </label>

            {
                imageUrl && (
                    <div className='absolute top-2 right-2'>
                        <Button
                            aria-label='Remove image'
                            title='Remove image'
                            type='button'
                            size={'icon'}
                            onClick={handleRemove}
                            variant="destructive"
                        >
                            <Trash />
                        </Button>
                    </div>
                )
            }
        </section>
    )
}