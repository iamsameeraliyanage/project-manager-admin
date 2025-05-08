import {
  Container,
  Stack,
  Card,
  Link,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { useMainLayout } from "../../context/MainLayoutContext";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiService } from "../../services/apiService";
import type { User } from "../../types/User";

export default function Organization() {
  const { setMainTitle } = useMainLayout();

  const {
    data: users,
    isLoading,
    error,
  } = useQuery<User[]>({
    queryKey: ["users"],
    queryFn: apiService.getUsers,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    setMainTitle("Organization");
  }, []);

  if (isLoading) {
    return (
      <Stack py={3}>
        <Container>
          <Card variant="outlined">
            <Stack minHeight={"100vh"} p={3}>
              <h2>Users</h2>
              <div>Loading todos...</div>
            </Stack>
          </Card>
        </Container>
      </Stack>
    );
  }

  if (error) {
    return (
      <Stack py={3}>
        <Container>
          <Card variant="outlined">
            <Stack minHeight={"100vh"} p={3}>
              <h2>Users</h2>
              <div>Error: {error.message || "Failed to fetch todos"}</div>
            </Stack>
          </Card>
        </Container>
      </Stack>
    );
  }

  return (
    <Stack py={3}>
      <Container>
        <Card variant="outlined">
          <Stack px={3}>
            <h2>Users</h2>
            <TableContainer component={Paper} variant="outlined">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Username</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Phone</TableCell>
                    <TableCell>Company</TableCell>
                    <TableCell>Website</TableCell>
                    <TableCell>Address</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users?.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>{user.id}</TableCell>
                      <TableCell>{user.name}</TableCell>
                      <TableCell>{user.username}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.phone}</TableCell>
                      <TableCell>{user.company.name}</TableCell>
                      <TableCell>
                        <Link
                          href={`https://${user.website}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          color="primary"
                        >
                          {user.website}
                        </Link>
                      </TableCell>
                      <TableCell>
                        {user.address.street}, {user.address.suite}
                        <br />
                        {user.address.city}, {user.address.zipcode}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Stack>
        </Card>
      </Container>
    </Stack>
  );
}
