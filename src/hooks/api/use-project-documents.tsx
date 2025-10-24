import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import API from "../../services/axios-client";
import { ENV_API_BASE_URL } from "../../services/base-url";

const API_BASE_URL = `${ENV_API_BASE_URL}/api/admin-service`;

export interface ProjectDocument {
  id: number;
  name: string;
  fileName: string;
  originalFileName: string;
  fileSize: number;
  mimeType: string;
  type: string;
  projectId: number;
  createdAt: string;
  updatedAt: string;
  isArchived: boolean;
}

export interface WorkPackageDocument {
  id: number;
  name: string;
  fileName: string;
  originalFileName: string;
  fileSize: number;
  mimeType: string;
  type: string;
  workPackageId: number;
  projectId: number;
  createdAt: string;
  updatedAt: string;
  isArchived: boolean;
}

export interface UploadProjectDocumentRequest {
  file: File;
  name: string;
  type: string;
}

export interface UploadWorkPackageDocumentRequest {
  file: File;
  name: string;
  type: string;
}

// Get project documents
export const useProjectDocuments = (projectId: number) => {
  return useQuery({
    queryKey: ["projectDocuments", projectId],
    queryFn: async (): Promise<ProjectDocument[]> => {
      const response = await API.get(
        `${API_BASE_URL}/projects/${projectId}/documents`
      );
      return response.data;
    },
    enabled: !!projectId,
  });
};

// Get workpackage documents
export const useWorkPackageDocuments = (projectId: number, workPackageId: number) => {
  return useQuery({
    queryKey: ["workPackageDocuments", projectId, workPackageId],
    queryFn: async (): Promise<WorkPackageDocument[]> => {
      const response = await API.get(
        `${API_BASE_URL}/projects/${projectId}/workpackages/${workPackageId}/documents?includeArchived=true`
      );
      return response.data;
    },
    enabled: !!projectId && !!workPackageId,
  });
};

// Upload project document
export const useUploadProjectDocument = (projectId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      data: UploadProjectDocumentRequest
    ): Promise<ProjectDocument> => {
      const formData = new FormData();
      formData.append("file", data.file);

      formData.append("name", data.name);
      formData.append("type", data.type);

      try {
        const response = await API.post(
          `${API_BASE_URL}/projects/${projectId}/documents/upload`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        return response.data;
      } catch (error: any) {
        // Provide more specific error messages
        if (error.response?.status === 413) {
          throw new Error("File size too large. Maximum size is 100MB.");
        } else if (error.response?.status === 415) {
          throw new Error("Unsupported file type.");
        } else if (error.response?.status === 400) {
          throw new Error(
            error.response?.data?.message || "Invalid file or parameters."
          );
        } else if (error.response?.status === 500) {
          throw new Error("Server error. Please try again later.");
        } else {
          throw new Error(
            error.response?.data?.message || error.message || "Upload failed"
          );
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["projectDocuments", projectId],
      });
    },
  });
};

// Upload workpackage document
export const useUploadWorkPackageDocument = (projectId: number, workPackageId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      data: UploadWorkPackageDocumentRequest
    ): Promise<WorkPackageDocument> => {
      const formData = new FormData();
      formData.append("file", data.file);

      formData.append("name", data.name);
      formData.append("type", data.type);

      try {
        const response = await API.post(
          `${API_BASE_URL}/projects/${projectId}/workpackages/${workPackageId}/documents/upload`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        return response.data;
      } catch (error: any) {
        // Provide more specific error messages
        if (error.response?.status === 413) {
          throw new Error("File size too large. Maximum size is 100MB.");
        } else if (error.response?.status === 415) {
          throw new Error("Unsupported file type.");
        } else if (error.response?.status === 400) {
          throw new Error(
            error.response?.data?.message || "Invalid file or parameters."
          );
        } else if (error.response?.status === 500) {
          throw new Error("Server error. Please try again later.");
        } else {
          throw new Error(
            error.response?.data?.message || error.message || "Upload failed"
          );
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["workPackageDocuments", projectId, workPackageId],
      });
    },
  });
};

// Download project document
export const useDownloadProjectDocument = () => {
  return useMutation({
    mutationFn: async ({
      projectId,
      documentId,
    }: {
      projectId: number;
      documentId: number;
    }): Promise<Blob> => {
      const response = await API.get(
        `${API_BASE_URL}/projects/${projectId}/documents/${documentId}/download`,
        {
          responseType: "blob",
        }
      );
      return response.data;
    },
  });
};

// Download workpackage document
export const useDownloadWorkPackageDocument = () => {
  return useMutation({
    mutationFn: async ({
      projectId,
      workPackageId,
      documentId,
    }: {
      projectId: number;
      workPackageId: number;
      documentId: number;
    }): Promise<Blob> => {
      const response = await API.get(
        `${API_BASE_URL}/projects/${projectId}/workpackages/${workPackageId}/documents/${documentId}/download`,
        {
          responseType: "blob",
        }
      );
      return response.data;
    },
  });
};

// Delete project document
export const useDeleteProjectDocument = (projectId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (documentId: number): Promise<void> => {
      await API.delete(`${API_BASE_URL}/projects/documents/${documentId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["projectDocuments", projectId],
      });
    },
  });
};

// Delete workpackage document
export const useDeleteWorkPackageDocument = (projectId: number, workPackageId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (documentId: number): Promise<void> => {
      await API.delete(`${API_BASE_URL}/projects/${projectId}/workpackages/${workPackageId}/documents/${documentId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["workPackageDocuments", projectId, workPackageId],
      });
    },
  });
};

// Helper function to format file size
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

// Helper function to get file icon based on mime type
export const getFileIcon = (mimeType: string): string => {
  if (mimeType.startsWith("image/")) return "🖼️";
  if (mimeType.includes("pdf")) return "📄";
  if (mimeType.includes("word") || mimeType.includes("document")) return "📝";
  if (mimeType.includes("excel") || mimeType.includes("spreadsheet"))
    return "📊";
  if (mimeType.includes("powerpoint") || mimeType.includes("presentation"))
    return "📽️";
  if (mimeType.includes("zip") || mimeType.includes("archive")) return "🗜️";
  return "📁";
};
