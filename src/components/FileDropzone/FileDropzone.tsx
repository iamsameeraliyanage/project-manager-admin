import React, { useCallback } from "react";
import { useDropzone, type Accept } from "react-dropzone";
import { Box, Typography, Button } from "@mui/material";
import { useTranslation } from "react-i18next";

type FileDropzoneProps = {
  onFileSelect: (file: File) => void;
  acceptedFileTypes: Accept;
  allowedExtensionsRegex: RegExp;
  errorMessage?: string;
  label?: string;
};

const FileDropzone: React.FC<FileDropzoneProps> = ({
  onFileSelect,
  acceptedFileTypes,
  allowedExtensionsRegex,
  errorMessage = "Invalid file type. Please upload a valid file.",
  label = "Drag and drop a file here, or click to select a file.",
}) => {
  const { t } = useTranslation();
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;

      const isAllowedType =
        file.type?.length > 0 || allowedExtensionsRegex.test(file.name);

      if (!isAllowedType) {
        alert(errorMessage);
        return;
      }

      onFileSelect(file);
    },
    [allowedExtensionsRegex, errorMessage, onFileSelect]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept: acceptedFileTypes,
  });

  return (
    <Box
      {...getRootProps()}
      sx={{
        border: "2px dashed #ccc",
        borderRadius: 2,
        p: 4,
        textAlign: "center",
        cursor: "pointer",
        backgroundColor: isDragActive ? "#f0f0f0" : "transparent",
        transition: "background-color 0.2s ease-in-out",
      }}
    >
      <input {...getInputProps()} />
      <Typography variant="body1">{label}</Typography>
      <Button variant="contained" sx={{ mt: 2 }}>
        {t("button_text.browse_files", "Browse Files")}
      </Button>
    </Box>
  );
};

export default FileDropzone;
