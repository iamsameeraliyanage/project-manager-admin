import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActionArea,
  IconButton,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Avatar,
  Breadcrumbs,
  Link,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  ToggleButton,
  ToggleButtonGroup,
  Container,
  Stack,
  InputAdornment,
  Tooltip,
  lighten,
} from "@mui/material";
import {
  Upload as UploadIcon,
  Download as DownloadIcon,
  Folder as FolderIcon,
  ArrowBack as ArrowBackIcon,
  ViewModule as ViewModuleIcon,
  ViewList as ViewListIcon,
  Business as BusinessIcon,
  Visibility as VisibilityIcon,
  Search as SearchIcon,
} from "@mui/icons-material";
import { useProjects, useWorkPackages } from "../../hooks/api/use-project.tsx";
import {
  useProjectDocuments,
  useDownloadProjectDocument,
  useDownloadWorkPackageDocument,
  formatFileSize,
  getFileIcon,
  type UploadProjectDocumentRequest,
  type UploadWorkPackageDocumentRequest,
} from "../../hooks/api/use-project-documents.tsx";
import { useTranslation } from "react-i18next";
import { useMainLayout } from "../../context/main-layout-provider.tsx";
import { acceptedFileTypes } from "../../utils/allowed-file-types.ts";
import FileDropzone from "../../components/FileDropzone/FileDropzone.tsx";
import API from "../../services/axios-client";
import type { Project } from "../../types/user.ts";

interface UniversalUploadDialogProps {
  open: boolean;
  onClose: () => void;
  onUpload: (
    data: UploadProjectDocumentRequest | UploadWorkPackageDocumentRequest,
    uploadType: "project" | "workpackage",
    projectId: number,
    workPackageId?: number
  ) => Promise<void>;
  uploading: boolean;
  projects: any[];
}

const UniversalUploadDialog: React.FC<UniversalUploadDialogProps> = ({
  open,
  onClose,
  onUpload,
  uploading: externalUploading,
  projects,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [name, setName] = useState("");
  const [documentType, setDocumentType] = useState("");
  const [uploadType, setUploadType] = useState<"project" | "workpackage">(
    "project"
  );
  const [selectedProject, setSelectedProject] = useState<number | "">("");
  const [selectedWorkPackage, setSelectedWorkPackage] = useState<number | "">(
    ""
  );
  const [internalUploading, setInternalUploading] = useState(false);

  const { t } = useTranslation();
  const { data: selectedProjectWorkPackages = [] } = useWorkPackages(
    typeof selectedProject === "number" ? selectedProject : 0
  );

  const uploading = internalUploading || externalUploading;

  const handleSubmit = async () => {
    if (!file) return;

    // Validation
    const maxSize = 100 * 1024 * 1024; // 100MB
    if (file.size > maxSize) {
      alert("File size must be less than 100MB");
      return;
    }

    if (!name.trim()) {
      alert("Document name is required");
      return;
    }

    if (!documentType) {
      alert("Document type is required");
      return;
    }

    if (!selectedProject) {
      alert("Please select a project");
      return;
    }

    if (uploadType === "workpackage" && !selectedWorkPackage) {
      alert("Please select a work package");
      return;
    }

    try {
      setInternalUploading(true);
      const uploadData = {
        file,
        name: name.trim(),
        type: documentType,
      };

      await onUpload(
        uploadData,
        uploadType,
        selectedProject as number,
        uploadType === "workpackage"
          ? (selectedWorkPackage as number)
          : undefined
      );

      // Reset form on successful upload
      handleClose();
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Upload failed. Please try again.");
    } finally {
      setInternalUploading(false);
    }
  };

  const handleClose = () => {
    setFile(null);
    setName("");
    setDocumentType("");
    setUploadType("project");
    setSelectedProject("");
    setSelectedWorkPackage("");
    onClose();
  };

  const allowedExtensionsRegex =
    /\.(pdf|doc|docx|xls|xlsx|ppt|pptx|txt|jpg|jpeg|png|gif|zip|rar)$/i;

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle
        sx={{
          mt: 1,
        }}
      >
        {t("upload_document", "Upload Document")}
      </DialogTitle>
      <DialogContent>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
          {/* Upload Type Selection */}
          <FormControl fullWidth>
            <InputLabel>{t("upload_to", "Upload To")}</InputLabel>
            <Select
              value={uploadType}
              onChange={(e) => {
                setUploadType(e.target.value as "project" | "workpackage");
                setSelectedWorkPackage(""); // Reset work package selection
              }}
              label={t("upload_to", "Upload To")}
            >
              <MenuItem value="project">
                {t("project_documents", "Project Documents")}
              </MenuItem>
              <MenuItem value="workpackage">
                {t("work_package_documents", "Work Package Documents")}
              </MenuItem>
            </Select>
          </FormControl>

          {/* Project Selection */}
          <FormControl fullWidth>
            <InputLabel>{t("select_project", "Select Project")}</InputLabel>
            <Select
              value={selectedProject}
              onChange={(e) => {
                setSelectedProject(e.target.value);
                setSelectedWorkPackage(""); // Reset work package when project changes
              }}
              label={t("select_project", "Select Project")}
            >
              {projects.map((project) => (
                <MenuItem key={project.id} value={project.id}>
                  {project.name || `Project #${project.id}`}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Work Package Selection (only if uploadType is workpackage) */}
          {uploadType === "workpackage" && selectedProject && (
            <FormControl fullWidth>
              <InputLabel>
                {t("select_work_package", "Select Work Package")}
              </InputLabel>
              <Select
                value={selectedWorkPackage}
                onChange={(e) => setSelectedWorkPackage(e.target.value)}
                label={t("select_work_package", "Select Work Package")}
              >
                {selectedProjectWorkPackages.map((workPackage: any) => (
                  <MenuItem key={workPackage.id} value={workPackage.id}>
                    {workPackage.name || `Work Package #${workPackage.id}`}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}

          {/* File Upload */}
          <Box>
            <FileDropzone
              onFileSelect={(file) => {
                setFile(file);
              }}
              acceptedFileTypes={acceptedFileTypes}
              allowedExtensionsRegex={allowedExtensionsRegex}
              errorMessage={t(
                "invalid_file_type",
                "Invalid file type. Please upload a valid file."
              )}
              label={t(
                "drag_drop_file_here_click_select_file",
                "Drag and drop a file here, or click to select a file."
              )}
            />
            {file && (
              <p>
                {t("selectedFile", "Selected File")}: {file.name}
              </p>
            )}
          </Box>

          <TextField
            label={t("documentName", "Document Name")}
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            placeholder={t(
              "enterCustomNameOrLeaveBlank",
              "Enter custom name or leave blank to use filename"
            )}
          />

          <FormControl fullWidth>
            <InputLabel>{t("documentType", "Document Type")}</InputLabel>
            <Select
              value={documentType}
              onChange={(e) => setDocumentType(e.target.value)}
              label={t("documentType", "Document Type")}
            >
              <MenuItem value="general">{t("general", "General")}</MenuItem>
              <MenuItem value="specification">
                {t("specification", "Specification")}
              </MenuItem>
              <MenuItem value="design">{t("design", "Design")}</MenuItem>
              <MenuItem value="contract">{t("contract", "Contract")}</MenuItem>
              <MenuItem value="invoice">{t("invoice", "Invoice")}</MenuItem>
              <MenuItem value="report">{t("report", "Report")}</MenuItem>
              <MenuItem value="other">{t("other", "Other")}</MenuItem>
            </Select>
          </FormControl>

          {file && (
            <Alert severity="info">
              {t("selectedFile", "Selected File")}: {file.name} (
              {formatFileSize(file.size)})
            </Alert>
          )}
        </Box>
      </DialogContent>
      <DialogContent>
        <DialogActions>
          <Button
            onClick={handleClose}
            disabled={uploading}
            color="primary"
            variant="outlined"
          >
            {t("button_text.cancel", "Cancel")}
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={
              !file ||
              !name.trim() ||
              !documentType ||
              !selectedProject ||
              (uploadType === "workpackage" && !selectedWorkPackage) ||
              uploading
            }
            variant="contained"
            startIcon={
              uploading ? <CircularProgress size={20} /> : <UploadIcon />
            }
          >
            {uploading
              ? t("button_text.uploading", "Uploading")
              : t("button_text.upload", "Upload")}
          </Button>
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
};

interface DocumentViewerDialogProps {
  open: boolean;
  onClose: () => void;
  url: string;
  fileName: string;
  mimeType: string;
}

const DocumentViewerDialog: React.FC<DocumentViewerDialogProps> = ({
  open,
  onClose,
  url,
  fileName,
  mimeType,
}) => {
  const { t } = useTranslation();
  const isPDF = mimeType.includes("pdf");
  const isImage = mimeType.startsWith("image/");

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      sx={{
        "& .MuiDialog-paper": { height: "90vh" },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <span>{getFileIcon(mimeType)}</span>
          <Typography variant="h6">{fileName}</Typography>
        </Box>
        <IconButton onClick={onClose} size="small">
          <ArrowBackIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent
        sx={{ p: 0, display: "flex", flexDirection: "column", height: "100%" }}
      >
        {isPDF && (
          <iframe
            src={url}
            style={{
              width: "100%",
              height: "100%",
              border: "none",
              flexGrow: 1,
            }}
            title={fileName}
          />
        )}
        {isImage && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
              p: 2,
              bgcolor: "grey.100",
            }}
          >
            <img
              src={url}
              alt={fileName}
              style={{
                maxWidth: "100%",
                maxHeight: "100%",
                objectFit: "contain",
              }}
            />
          </Box>
        )}
        {!isPDF && !isImage && (
          <Box sx={{ p: 3, textAlign: "center" }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              {t("previewNotAvailable", "Preview not available")}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t(
                "fileTypeCannotBePreviewed",
                "This file type cannot be previewed in the browser. Please download to view."
              )}
            </Typography>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
};

const Gallery: React.FC = () => {
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [viewMode, setViewMode] = useState<"card" | "list">("card");
  const [universalUploadDialog, setUniversalUploadDialog] = useState(false);
  const [viewDialog, setViewDialog] = useState<{
    open: boolean;
    url: string;
    fileName: string;
    mimeType: string;
  }>({ open: false, url: "", fileName: "", mimeType: "" });

  const { setMainTitle } = useMainLayout();

  const { t } = useTranslation();

  const { data: projects = [], isLoading: projectsLoading } = useProjects();
  const downloadProjectDoc = useDownloadProjectDocument();
  const downloadWorkPackageDoc = useDownloadWorkPackageDocument();

  // Note: For universal uploads, we use direct API calls instead of hooks to avoid hook dependencies

  const handleDownload = async (
    type: "project" | "workpackage",
    documentId: number,
    fileName: string,
    projectId?: number,
    workPackageId?: number
  ) => {
    try {
      let blob: Blob;
      if (type === "project" && projectId) {
        blob = await downloadProjectDoc.mutateAsync({ projectId, documentId });
      } else if (type === "workpackage" && projectId && workPackageId) {
        blob = await downloadWorkPackageDoc.mutateAsync({
          projectId,
          workPackageId,
          documentId,
        });
      } else {
        throw new Error("Invalid download parameters");
      }

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  const handleView = async (
    type: "project" | "workpackage",
    documentId: number,
    fileName: string,
    mimeType: string,
    projectId?: number,
    workPackageId?: number
  ) => {
    try {
      let blob: Blob;
      if (type === "project" && projectId) {
        blob = await downloadProjectDoc.mutateAsync({ projectId, documentId });
      } else if (type === "workpackage" && projectId && workPackageId) {
        blob = await downloadWorkPackageDoc.mutateAsync({
          projectId,
          workPackageId,
          documentId,
        });
      } else {
        throw new Error("Invalid view parameters");
      }

      const url = window.URL.createObjectURL(blob);
      setViewDialog({ open: true, url, fileName, mimeType });
    } catch (error) {
      console.error("View failed:", error);
    }
  };

  const handleUniversalUpload = async (
    data: UploadProjectDocumentRequest | UploadWorkPackageDocumentRequest,
    uploadType: "project" | "workpackage",
    projectId: number,
    workPackageId?: number
  ) => {
    try {
      const formData = new FormData();
      formData.append("file", data.file);
      formData.append("name", data.name);
      formData.append("type", data.type);

      if (uploadType === "project") {
        // Use direct API call for project documents
        await API.post(
          `/admin-service/projects/${projectId}/documents/upload`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
      } else if (uploadType === "workpackage" && workPackageId) {
        // Use direct API call for workpackage documents
        await API.post(
          `/admin-service/projects/${projectId}/workpackages/${workPackageId}/documents/upload`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
      }

      setUniversalUploadDialog(false);
      // Optionally refresh projects or show success message
    } catch (error) {
      console.error("Universal upload failed:", error);
      throw error; // Re-throw so dialog can handle it
    }
  };

  useEffect(() => {
    setMainTitle(t("project_gallery"));
    return () => {
      setMainTitle("");
    };
  }, []);

  if (projectsLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "50vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // If a project is selected, show detailed view
  if (selectedProject) {
    return (
      <ProjectDetailView
        project={selectedProject}
        onBack={() => setSelectedProject(null)}
        onDownload={handleDownload}
        onView={handleView}
        viewDialog={viewDialog}
        setViewDialog={setViewDialog}
      />
    );
  }

  return (
    <Stack pt={5}>
      <Container maxWidth="xl">
        <Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 3,
            }}
          >
            <Box>
              <Typography variant="h4" gutterBottom>
                {t("project_gallery")}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {t("browse_and_manage_docs_all_projects")}
              </Typography>
            </Box>

            <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
              <Button
                variant="contained"
                startIcon={<UploadIcon />}
                onClick={() => setUniversalUploadDialog(true)}
                color="primary"
              >
                {t("button_text.upload_document", "Upload Document")}
              </Button>

              <ToggleButtonGroup
                value={viewMode}
                exclusive
                onChange={(_, newView) => newView && setViewMode(newView)}
                size="small"
              >
                <ToggleButton value="card">
                  <ViewModuleIcon />
                </ToggleButton>
                <ToggleButton value="list">
                  <ViewListIcon />
                </ToggleButton>
              </ToggleButtonGroup>
            </Box>
          </Box>

          {viewMode === "card" ? (
            <Grid container spacing={3}>
              {projects.map((project) => (
                <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={project.id}>
                  <ProjectCard
                    project={project}
                    onClick={() => setSelectedProject(project)}
                  />
                </Grid>
              ))}
            </Grid>
          ) : (
            <ProjectTable
              projects={projects}
              onProjectClick={(project) => setSelectedProject(project)}
            />
          )}

          {projects.length === 0 && (
            <Box sx={{ textAlign: "center", py: 8 }}>
              <FolderIcon
                sx={{ fontSize: 64, color: "text.secondary", mb: 2 }}
              />
              <Typography variant="h6" color="text.secondary">
                {t("noProjectsFound", "No projects found")}
              </Typography>
            </Box>
          )}
        </Box>

        {/* Universal Upload Dialog */}
        <UniversalUploadDialog
          open={universalUploadDialog}
          onClose={() => setUniversalUploadDialog(false)}
          onUpload={handleUniversalUpload}
          uploading={false} // We'll handle loading state within the dialog
          projects={projects}
        />
      </Container>
    </Stack>
  );
};

interface ProjectCardProps {
  project: Project;
  onClick: () => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onClick }) => {
  // Generate avatar text from first two letters of project name
  const getAvatarText = (name: string) => {
    if (!name) return "PR";
    const words = name.trim().split(" ");
    if (words.length >= 2) {
      return (words[0][0] + words[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  // Generate a consistent color based on project name/id
  const getAvatarColor = (projectId: number) => {
    const colors = [
      "#1976d2",
      "#388e3c",
      "#f57c00",
      "#d32f2f",
      "#7b1fa2",
      "#0288d1",
      "#00796b",
      "#f9a825",
    ];
    return colors[projectId % colors.length];
  };

  const projectName = project.name || `Project #${project.id}`;

  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: lighten(
          project.metadata?.color || getAvatarColor(project.id),
          0.975
        ),
        borderColor: project.metadata?.color || getAvatarColor(project.id),
        borderWidth: 1,
      }}
      variant="outlined"
    >
      <CardActionArea
        onClick={onClick}
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          p: 3,
          pt: 5,
        }}
      >
        <Avatar
          sx={{
            bgcolor: project.metadata?.color || getAvatarColor(project.id),
            width: 64,
            height: 64,
            fontSize: "1.5rem",
            mb: 2,
          }}
        >
          {getAvatarText(projectName)}
        </Avatar>
        <Typography variant="h6" align="center" sx={{ mb: 1 }}>
          {projectName}
        </Typography>
        <Typography variant="body2" color="text.secondary" align="center">
          ID: {project.id}
        </Typography>
      </CardActionArea>
    </Card>
  );
};

interface ProjectTableProps {
  projects: any[];
  onProjectClick: (project: any) => void;
}

const ProjectTable: React.FC<ProjectTableProps> = ({
  projects,
  onProjectClick,
}) => {
  const { t } = useTranslation();
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>{t("project", "Project")}</TableCell>
            <TableCell>{t("id", "ID")}</TableCell>
            <TableCell>{t("project_documents", "Project Documents")}</TableCell>
            <TableCell>{t("work_package", "Work Packages")}</TableCell>
            <TableCell>{t("created", "Created")}</TableCell>
            <TableCell>{t("actions", "Actions")}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {projects.map((project) => (
            <ProjectTableRow
              key={project.id}
              project={project}
              onProjectClick={onProjectClick}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

interface ProjectTableRowProps {
  project: any;
  onProjectClick: (project: any) => void;
}

const ProjectTableRow: React.FC<ProjectTableRowProps> = ({
  project,
  onProjectClick,
}) => {
  const { data: projectDocuments = [] } = useProjectDocuments(project.id);
  const { data: workPackages = [] } = useWorkPackages(project.id);
  const { t } = useTranslation();

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "on_track":
        return "success";
      case "at_risk":
        return "error";
      case "keep_attention":
        return "warning";
      default:
        return "default";
    }
  };

  const formatStatus = (status: string) => {
    switch (status?.toLowerCase()) {
      case "on_track":
        return "On Track";
      case "at_risk":
        return "At Risk";
      case "keep_attention":
        return "Keep Attention";
      case "no_insight":
        return "No Insight";
      default:
        return status || "Unknown";
    }
  };

  return (
    <TableRow
      hover
      sx={{ cursor: "pointer" }}
      onClick={() => onProjectClick(project)}
    >
      <TableCell>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Avatar sx={{ bgcolor: "primary.main", width: 40, height: 40 }}>
            <BusinessIcon />
          </Avatar>
          <Box>
            <Typography variant="subtitle1">
              {project.name || t("project_fallback_name", { id: project.id })}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t("project_documents_count", { count: projectDocuments.length })}
            </Typography>
          </Box>
        </Box>
      </TableCell>
      <TableCell>{project.id}</TableCell>
      <TableCell>
        <Chip
          label={formatStatus(project.status)}
          size="small"
          color={getStatusColor(project.status)}
        />
      </TableCell>
      <TableCell>
        <Chip label={workPackages.length} size="small" variant="outlined" />
      </TableCell>
      <TableCell>
        {project.created_at
          ? new Date(project.created_at).toLocaleDateString()
          : "N/A"}
      </TableCell>
      <TableCell>
        <Button
          variant="outlined"
          size="small"
          onClick={(e) => {
            e.stopPropagation();
            onProjectClick(project);
          }}
        >
          {t("button_text.view_details")}
        </Button>
      </TableCell>
    </TableRow>
  );
};

interface CombinedDocument {
  id: number;
  name: string;
  type: string;
  originalFileName: string;
  mimeType: string;
  fileSize: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  source: "project" | "workpackage";
  projectId: number;
  projectName?: string;
  workPackageName?: string;
  workPackageId?: number;
}

interface ProjectDetailViewProps {
  project: any;
  onBack: () => void;
  onDownload: (
    type: "project" | "workpackage",
    documentId: number,
    fileName: string,
    projectId?: number,
    workPackageId?: number
  ) => void;
  onView: (
    type: "project" | "workpackage",
    documentId: number,
    fileName: string,
    mimeType: string,
    projectId?: number,
    workPackageId?: number
  ) => void;
  viewDialog: any;
  setViewDialog: any;
}

const ProjectDetailView: React.FC<ProjectDetailViewProps> = ({
  project,
  onBack,
  onDownload,
  onView,
  viewDialog,
  setViewDialog,
}) => {
  const { t } = useTranslation();
  const [documents, setDocuments] = useState<CombinedDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [uploadDialog, setUploadDialog] = useState(false);
  const [workPackages, setWorkPackages] = useState<any[]>([]);

  // Fetch all documents for this specific project
  const fetchProjectDocuments = async () => {
    try {
      setLoading(true);
      const allDocuments: CombinedDocument[] = [];

      // Fetch project documents
      const projectDocsResponse = await API.get(
        `/admin-service/projects/${project.id}/documents`
      );

      // Transform project documents
      const projectDocs = projectDocsResponse.data.map((doc: any) => ({
        ...doc,
        source: "project" as const,
        projectId: project.id,
        projectName: project.name || `Project #${project.id}`,
      }));
      allDocuments.push(...projectDocs);

      // Fetch work packages for the project
      const workPackagesResponse = await API.get(
        `/admin-service/projects/${project.id}/packages`
      );
      setWorkPackages(workPackagesResponse.data);

      // Fetch documents for each work package
      for (const workPackage of workPackagesResponse.data) {
        try {
          const wpDocsResponse = await API.get(
            `/admin-service/projects/${project.id}/workpackages/${workPackage.id}/documents?includeArchived=true`
          );

          // Transform work package documents
          const wpDocs = wpDocsResponse.data.map((doc: any) => ({
            ...doc,
            source: "workpackage" as const,
            projectId: project.id,
            projectName: project.name || `Project #${project.id}`,
            workPackageName:
              workPackage.name || `Work Package #${workPackage.id}`,
            workPackageId: workPackage.id,
          }));
          allDocuments.push(...wpDocs);
        } catch (wpErr) {
          console.warn(
            `Failed to fetch documents for work package ${workPackage.id}:`,
            wpErr
          );
        }
      }

      // Sort by creation date (newest first)
      allDocuments.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      setDocuments(allDocuments);
    } catch (error) {
      console.error("Failed to fetch project documents:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjectDocuments();
  }, [project.id]);

  const handleUpload = async (
    data: UploadProjectDocumentRequest | UploadWorkPackageDocumentRequest,
    uploadType: "project" | "workpackage",
    projectId: number,
    workPackageId?: number
  ) => {
    try {
      const formData = new FormData();
      formData.append("file", data.file);
      formData.append("name", data.name);
      formData.append("type", data.type);

      if (uploadType === "project") {
        await API.post(
          `/admin-service/projects/${projectId}/documents/upload`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
      } else if (uploadType === "workpackage" && workPackageId) {
        await API.post(
          `/admin-service/projects/${projectId}/workpackages/${workPackageId}/documents/upload`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
      }

      setUploadDialog(false);
      // Refresh documents
      await fetchProjectDocuments();
    } catch (error) {
      console.error("Upload failed:", error);
      throw error; // Re-throw so dialog can handle it
    }
  };

  const filteredDocuments = documents.filter(
    (doc) =>
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.originalFileName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (doc.workPackageName &&
        doc.workPackageName.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "active":
        return "success";
      case "archived":
        return "default";
      default:
        return "default";
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header with breadcrumb and back button */}
      <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
        <IconButton onClick={onBack} sx={{ mr: 2 }}>
          <ArrowBackIcon />
        </IconButton>
        <Box sx={{ flexGrow: 1 }}>
          <Breadcrumbs aria-label="breadcrumb">
            <Link
              underline="hover"
              color="inherit"
              onClick={onBack}
              sx={{ cursor: "pointer" }}
            >
              {t("gallery")}
            </Link>
            <Typography color="text.primary">
              {project.name || `Project #${project.id}`}
            </Typography>
          </Breadcrumbs>
        </Box>
      </Box>

      {/* Project Info */}
      <Card sx={{ mb: 3 }} variant="outlined">
        <Box
          sx={{
            p: 3,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box>
            <Typography variant="h5" gutterBottom>
              {project.name || `Project #${project.id}`}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t(
                "all_project_and_work_package_documents",
                "All Project & Work Package Documents"
              )}{" "}
              ({documents.length})
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<UploadIcon />}
            onClick={() => setUploadDialog(true)}
            color="primary"
          >
            {t("button_text.upload_document", "Upload Document")}
          </Button>
        </Box>
      </Card>

      {/* Search Bar */}
      <Card sx={{ mb: 3 }} variant="outlined">
        <CardContent>
          <TextField
            size="small"
            placeholder={t(
              "search_documents_placeholder",
              "Search documents, types, or work packages..."
            )}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            fullWidth
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              },
            }}
          />
        </CardContent>
      </Card>

      {/* Documents Table */}
      <Card variant="outlined">
        <CardContent>
          {loading ? (
            <Box display="flex" justifyContent="center" p={4}>
              <CircularProgress />
            </Box>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>{t("document_name", "Document Name")}</TableCell>
                    <TableCell>{t("type", "Type")}</TableCell>
                    <TableCell>{t("source", "Source")}</TableCell>
                    <TableCell>{t("file_size", "File Size")}</TableCell>
                    <TableCell>{t("status", "Status")}</TableCell>
                    <TableCell>{t("uploaded", "Uploaded")}</TableCell>
                    <TableCell align="right">
                      {t("actions", "Actions")}
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredDocuments.map((document) => (
                    <TableRow key={`${document.source}-${document.id}`} hover>
                      <TableCell>
                        <Box>
                          <Typography variant="subtitle2" fontWeight="medium">
                            {document.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {document.originalFileName}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={document.type}
                          size="small"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>
                        <Box>
                          <Chip
                            label={
                              document.source === "project"
                                ? "Project"
                                : "Work Package"
                            }
                            size="small"
                            color={
                              document.source === "project"
                                ? "primary"
                                : "secondary"
                            }
                            variant="outlined"
                          />
                          {document.workPackageName && (
                            <Typography
                              variant="caption"
                              color="text.secondary"
                              display="block"
                            >
                              {document.workPackageName}
                            </Typography>
                          )}
                        </Box>
                      </TableCell>
                      <TableCell>{formatFileSize(document.fileSize)}</TableCell>
                      <TableCell>
                        <Chip
                          label={document.status || "active"}
                          color={getStatusColor(document.status) as any}
                          size="small"
                          sx={{ textTransform: "capitalize" }}
                        />
                      </TableCell>
                      <TableCell>
                        {new Date(document.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell align="right">
                        <Stack
                          direction="row"
                          spacing={1}
                          justifyContent="flex-end"
                        >
                          {(document.mimeType.startsWith("image/") ||
                            document.mimeType === "application/pdf") && (
                            <Tooltip title={t("view", "View")}>
                              <IconButton
                                size="small"
                                onClick={() =>
                                  onView(
                                    document.source,
                                    document.id,
                                    document.originalFileName,
                                    document.mimeType,
                                    document.projectId,
                                    document.workPackageId
                                  )
                                }
                                color="primary"
                              >
                                <VisibilityIcon />
                              </IconButton>
                            </Tooltip>
                          )}
                          <Tooltip title={t("download", "Download")}>
                            <IconButton
                              size="small"
                              onClick={() =>
                                onDownload(
                                  document.source,
                                  document.id,
                                  document.originalFileName,
                                  document.projectId,
                                  document.workPackageId
                                )
                              }
                              color="primary"
                            >
                              <DownloadIcon />
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          {!loading && filteredDocuments.length === 0 && (
            <Box p={4} textAlign="center">
              <Typography variant="h6" color="text.secondary" gutterBottom>
                {documents.length === 0
                  ? t("no_documents_uploaded", "No documents uploaded")
                  : t(
                      "no_documents_match_search",
                      "No documents match your search"
                    )}
              </Typography>
              <Typography variant="body2" color="text.disabled">
                {documents.length === 0
                  ? t(
                      "upload_documents_to_start",
                      "Upload documents to get started."
                    )
                  : t(
                      "try_adjusting_search",
                      "Try adjusting your search criteria."
                    )}
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Upload Dialog */}
      <ProjectUploadDialog
        open={uploadDialog}
        onClose={() => setUploadDialog(false)}
        onUpload={handleUpload}
        uploading={false}
        project={project}
        workPackages={workPackages}
      />

      {/* Document Viewer Dialog */}
      <DocumentViewerDialog
        open={viewDialog.open}
        onClose={() => {
          setViewDialog({ open: false, url: "", fileName: "", mimeType: "" });
          if (viewDialog.url) {
            window.URL.revokeObjectURL(viewDialog.url);
          }
        }}
        url={viewDialog.url}
        fileName={viewDialog.fileName}
        mimeType={viewDialog.mimeType}
      />
    </Box>
  );
};

interface ProjectUploadDialogProps {
  open: boolean;
  onClose: () => void;
  onUpload: (
    data: UploadProjectDocumentRequest | UploadWorkPackageDocumentRequest,
    uploadType: "project" | "workpackage",
    projectId: number,
    workPackageId?: number
  ) => Promise<void>;
  uploading: boolean;
  project: any;
  workPackages: any[];
}

const ProjectUploadDialog: React.FC<ProjectUploadDialogProps> = ({
  open,
  onClose,
  onUpload,
  uploading: externalUploading,
  project,
  workPackages,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [name, setName] = useState("");
  const [documentType, setDocumentType] = useState("");
  const [uploadType, setUploadType] = useState<"project" | "workpackage">(
    "project"
  );
  const [selectedWorkPackage, setSelectedWorkPackage] = useState<number | "">(
    ""
  );
  const [internalUploading, setInternalUploading] = useState(false);

  const { t } = useTranslation();

  const uploading = internalUploading || externalUploading;

  const handleSubmit = async () => {
    if (!file) return;

    // Validation
    const maxSize = 100 * 1024 * 1024; // 100MB
    if (file.size > maxSize) {
      alert("File size must be less than 100MB");
      return;
    }

    if (!name.trim()) {
      alert("Document name is required");
      return;
    }

    if (!documentType) {
      alert("Document type is required");
      return;
    }

    if (uploadType === "workpackage" && !selectedWorkPackage) {
      alert("Please select a work package");
      return;
    }

    try {
      setInternalUploading(true);
      const uploadData = {
        file,
        name: name.trim(),
        type: documentType,
      };

      await onUpload(
        uploadData,
        uploadType,
        project.id,
        uploadType === "workpackage"
          ? (selectedWorkPackage as number)
          : undefined
      );

      // Reset form on successful upload
      handleClose();
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Upload failed. Please try again.");
    } finally {
      setInternalUploading(false);
    }
  };

  const handleClose = () => {
    setFile(null);
    setName("");
    setDocumentType("");
    setUploadType("project");
    setSelectedWorkPackage("");
    onClose();
  };

  const allowedExtensionsRegex =
    /\.(pdf|doc|docx|xls|xlsx|ppt|pptx|txt|jpg|jpeg|png|gif|zip|rar)$/i;

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {t("upload_document_to_project", "Upload Document to Project")}
      </DialogTitle>
      <DialogContent>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
          {/* Upload Type Selection */}
          <FormControl fullWidth>
            <InputLabel>{t("upload_to", "Upload To")}</InputLabel>
            <Select
              value={uploadType}
              onChange={(e) => {
                setUploadType(e.target.value as "project" | "workpackage");
                setSelectedWorkPackage(""); // Reset work package selection
              }}
              label={t("upload_to", "Upload To")}
            >
              <MenuItem value="project">
                {t("project_documents", "Project Documents")}
              </MenuItem>
              <MenuItem value="workpackage">
                {t("work_package_documents", "Work Package Documents")}
              </MenuItem>
            </Select>
          </FormControl>

          {/* Work Package Selection (only if uploadType is workpackage) */}
          {uploadType === "workpackage" && (
            <FormControl fullWidth>
              <InputLabel>
                {t("select_work_package", "Select Work Package")}
              </InputLabel>
              <Select
                value={selectedWorkPackage}
                onChange={(e) => setSelectedWorkPackage(e.target.value)}
                label={t("select_work_package", "Select Work Package")}
              >
                {workPackages.map((workPackage: any) => (
                  <MenuItem key={workPackage.id} value={workPackage.id}>
                    {workPackage.name ||
                      `${t("work_package", "Work Package")} #${workPackage.id}`}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}

          {/* File Upload */}
          <Box>
            <FileDropzone
              onFileSelect={(file) => {
                setFile(file);
                console.log("File selected:", file);
              }}
              acceptedFileTypes={acceptedFileTypes}
              allowedExtensionsRegex={allowedExtensionsRegex}
            />
            {file && (
              <p>
                {t("selectedFile", "Selected File")}: {file.name}
              </p>
            )}
          </Box>

          <TextField
            label={t("documentName", "Document Name")}
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            placeholder={t(
              "enterCustomNameOrLeaveBlank",
              "Enter custom name or leave blank to use filename"
            )}
          />

          <FormControl fullWidth>
            <InputLabel>{t("documentType", "Document Type")}</InputLabel>
            <Select
              value={documentType}
              onChange={(e) => setDocumentType(e.target.value)}
              label={t("documentType", "Document Type")}
            >
              <MenuItem value="general">{t("general", "General")}</MenuItem>
              <MenuItem value="specification">
                {t("specification", "Specification")}
              </MenuItem>
              <MenuItem value="design">{t("design", "Design")}</MenuItem>
              <MenuItem value="contract">{t("contract", "Contract")}</MenuItem>
              <MenuItem value="invoice">{t("invoice", "Invoice")}</MenuItem>
              <MenuItem value="report">{t("report", "Report")}</MenuItem>
              <MenuItem value="other">{t("other", "Other")}</MenuItem>
            </Select>
          </FormControl>

          {file && (
            <Alert severity="info">
              {t("selectedFile", "Selected File")}: {file.name} (
              {formatFileSize(file.size)})
            </Alert>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={uploading}>
          {t("button_text.cancel", "Cancel")}
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={
            !file ||
            !name.trim() ||
            !documentType ||
            (uploadType === "workpackage" && !selectedWorkPackage) ||
            uploading
          }
          variant="contained"
          startIcon={
            uploading ? <CircularProgress size={20} /> : <UploadIcon />
          }
        >
          {uploading
            ? t("button_text.uploading", "Uploading")
            : t("button_text.upload", "Upload")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default Gallery;
