import {
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";

const UserTable = () => {
  // const {
  //   data: users,
  //   isLoading,
  //   error,
  // } = useQuery<JsonPlaceHolderUser[]>({
  //   queryKey: ["users"],
  //   queryFn: getJsonPlaceholderUsersQueryFn,
  //   staleTime: 5 * 60 * 1000,
  //   refetchOnWindowFocus: false,
  // });

  // if (isLoading) {
  //   return (
  //     <Stack py={3}>
  //       <Container>
  //         <Card variant="outlined">
  //           <Stack minHeight={"100vh"} p={3}>
  //             <h2>Users</h2>
  //             <div>Loading todos...</div>
  //           </Stack>
  //         </Card>
  //       </Container>
  //     </Stack>
  //   );
  // }

  // if (error) {
  //   return (
  //     <Stack py={3}>
  //       <Container>
  //         <Card variant="outlined">
  //           <Stack minHeight={"100vh"} p={3}>
  //             <h2>Users</h2>
  //             <div>Error: {error.message || "Failed to fetch todos"}</div>
  //           </Stack>
  //         </Card>
  //       </Container>
  //     </Stack>
  //   );
  // }

  return (
    <Stack>
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
            <TableRow>
              <TableCell>1</TableCell>
              <TableCell>Leanne Graham</TableCell>
              <TableCell>Leanne Graham</TableCell>
              <TableCell>Leanne Graham</TableCell>
              <TableCell>Leanne Graham</TableCell>
              <TableCell>Leanne Graham</TableCell>
              <TableCell>Leanne Graham</TableCell>
              <TableCell>Leanne Graham</TableCell>
              <TableCell>Leanne Graham</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Stack>
  );
};

export default UserTable;
