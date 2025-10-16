import { ChangeEvent, DragEvent, useEffect, useState } from 'react';
import { validateFile } from '../utils/validators.ts';

interface UploadType {
  file: File;
  preview: string;
  name: string;
  size: number;
}

export const useImageUpload = () => {
  const [selectedFile, setSelectedFile] = useState<UploadType | undefined>(
    undefined
  );
  const [dragActive, setDragActive] = useState(false);
  const [isValidationError, setIsValidationError] = useState<boolean>(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const handleCancel = () => {
    setSelectedFile(undefined);
    setIsValidationError(false);
    setValidationErrors([]);
  };

  const handleFile = async (file: File) => {
    const validationResult = await validateFile(file);

    if (validationResult.result) {
      handleCancel();
      const selectedFile: UploadType = {
        file: file,
        preview: URL.createObjectURL(file),
        name: file.name,
        size: file.size,
      };
      setSelectedFile(selectedFile);
    } else {
      handleCancel();
      setIsValidationError(true);
      setValidationErrors(validationResult.errors);
    }
  };

  const handleChange = async (event: ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    if (event.currentTarget.files?.[0]) {
      await handleFile(event.currentTarget.files[0]);
    }
  };

  const handleDrag = (event: DragEvent<HTMLInputElement>) => {
    event.preventDefault();
    event.stopPropagation();

    if (event.type === 'dragenter' || event.type === 'dragover') {
      setDragActive(true);
    }
    if (event.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = async (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setDragActive(false);

    if (event.dataTransfer.files.length > 0) {
      await handleFile(event.dataTransfer.files[0]);
    }
  };

  useEffect(() => {
    return () => {
      if (selectedFile?.preview) {
        URL.revokeObjectURL(selectedFile.preview);
      }
    };
  }, [selectedFile?.preview]);

  return {
    selectedFile,
    dragActive,
    isValidationError,
    validationErrors,
    handleChange,
    handleDrag,
    handleDrop,
    handleCancel,
  };
};
