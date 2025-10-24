import { Stack, Typography, Grid, Alert, Box, Avatar } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import type { Employee } from "../../types/user";
import { getEmployeesQueryFn } from "../../services/api";
import { useNavigate } from "react-router-dom";
import { getAvatarColorPair } from "../../utils/avatar-color-pairs";
import Loader from "../../components/Loader/Loader";
import Card from "../../components/Card/Card";

const UserGrid = () => {
  const navigate = useNavigate();
  const {
    data: users,
    isLoading,
    error,
  } = useQuery<Employee[]>({
    queryKey: ["users"],
    queryFn: getEmployeesQueryFn,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const handleUserClick = (userId: number) => {
    navigate(`/${userId}`);
  };

  if (isLoading) {
    return (
      <Stack
        py={3}
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
        }}
      >
        <Loader />
      </Stack>
    );
  }

  if (error) {
    return (
      <Stack py={3}>
        <Typography variant="h5" align="center">
          Users
        </Typography>
        <Alert severity="error">
          Error: {error.message || "Failed to fetch users"}
        </Alert>
      </Stack>
    );
  }
  const filteredEmployees = users?.filter(
    (user: Employee) => !user.isLocalAdmin
  );
  return (
    <Stack>
      <Grid container spacing={2}>
        {filteredEmployees?.map((user: Employee) => {
          const { bg, text } = getAvatarColorPair(filteredEmployees.length);
 
          return (
            <Grid key={user.id} size={{ xs: 6, md: 4, lg: 3 }}>
              <Card onClick={() => handleUserClick(user.id)} fullHeight>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "100%",
                  }}
                >
                  <Box>
                    <Avatar
                      sx={{
                        bgcolor: bg,
                        color: text,
                        width: "3.5rem",
                        height: "3.5rem",
                      }}
                    >
                      {user.firstname.charAt(0)}
                      {user.lastname.charAt(0)}
                    </Avatar>
                  </Box>
                  <Box mt={3}>
                    <Typography
                      variant="h4"
                      color="primary.main"
                      align="center"
                    >
                      {user.firstname} {user.lastname}
                    </Typography>
                  </Box>
                </Box>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Stack>
  );
};

export default UserGrid;
