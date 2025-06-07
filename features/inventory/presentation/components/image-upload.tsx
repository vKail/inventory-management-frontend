import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Image as ImageIcon, X } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface ImageUploadProps {
    value?: string;
    onChange: (value: string | null) => void;
    disabled?: boolean;
}

export const ImageUpload = ({ value, onChange, disabled }: ImageUploadProps) => {
    const [preview, setPreview] = useState(value);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) {
            const file = acceptedFiles[0];
            const reader = new FileReader();

            reader.onloadend = () => {
                const base64String = reader.result as string;
                setPreview(base64String);
                onChange(base64String);
            };

            reader.readAsDataURL(file);
        }
    }, [onChange]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/*': ['.jpeg', '.jpg', '.png']
        },
        maxFiles: 1,
        disabled
    });

    const handleRemove = (e: React.MouseEvent) => {
        e.stopPropagation();
        setPreview(undefined);
        onChange(null);
    };

    return (
        <div
            {...getRootProps()}
            className={cn(
                "relative flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer transition-colors",
                isDragActive ? "border-primary bg-primary/5" : "border-gray-300 hover:bg-gray-50",
                disabled && "opacity-50 cursor-not-allowed"
            )}
        >
            <input {...getInputProps()} />

            {preview ? (
                <div className="relative w-full h-full">
                    <Image
                        src={preview}
                        alt="Preview"
                        fill
                        style={{ objectFit: "contain" }}
                        className="p-2"
                    />
                    {!disabled && (
                        <button
                            onClick={handleRemove}
                            className="absolute top-2 right-2 p-1 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    )}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <ImageIcon className="w-12 h-12 text-gray-400 mb-3" />
                    <p className="mb-2 text-sm text-gray-500">
                        <span className="font-semibold">Haz clic para subir</span> o arrastra y suelta
                    </p>
                    <p className="text-xs text-gray-500">PNG, JPG o GIF (Max. 5MB)</p>
                </div>
            )}
        </div>
    );
}; 