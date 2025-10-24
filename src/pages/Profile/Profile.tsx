import { Container, Stack, Typography, Paper } from "@mui/material";
import ComingSoonCard from "../../widgets/CardWidgets/ComingSoon/ComingSoonCard";
import { useMainLayout } from "../../context/main-layout-provider";
import { useEffect, useState } from "react";
import { useAuthContext } from "../../context/auth-provider";
import { MyTimeLoggingRequests } from "../../components/TimeLoggingRequest/MyTimeLoggingRequests";
import { TimeLoggingRequestDetailsDialog } from "../../components/TimeLoggingRequest/TimeLoggingRequestDetailsDialog";
import type { TimeLoggingRequest } from "../../types/time-logging-request";
import { useTranslation } from "react-i18next";

const Profile = () => {
  const { t } = useTranslation();
  const { setMainTitle } = useMainLayout();
  const { user } = useAuthContext();
  const [selectedRequest, setSelectedRequest] =
    useState<TimeLoggingRequest | null>(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);

  useEffect(() => {
    setMainTitle(t("profile", "Profile"));

    return () => {
      setMainTitle("");
    };
  }, []);

  const handleViewRequest = (request: TimeLoggingRequest) => {
    setSelectedRequest(request);
    setDetailsDialogOpen(true);
  };

  const handleEditRequest = (request: TimeLoggingRequest) => {
    // TODO: Implement edit functionality
    console.log("Edit request:", request);
  };

  return (
    <Stack py={3}>
      <Container maxWidth="xl">
        <Stack spacing={3}>
          <Typography variant="h4">{t("profile", "Profile")}</Typography>

          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              {t("myTimeLoggingRequests", "My Time Logging Requests")}
            </Typography>
            {user?.id && (
              <MyTimeLoggingRequests
                employeeId={user.id}
                onViewRequest={handleViewRequest}
                onEditRequest={handleEditRequest}
              />
            )}
          </Paper>

          <ComingSoonCard />
        </Stack>

        <TimeLoggingRequestDetailsDialog
          open={detailsDialogOpen}
          onClose={() => setDetailsDialogOpen(false)}
          request={selectedRequest}
        />
      </Container>
    </Stack>
  );
};

export default Profile;
