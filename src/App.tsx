import { BrowserRouter } from "react-router-dom";
import { AppRoutes } from "./routes/AppRoutes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ThemeProvider from "./theme/ThemeProvider";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import PWABadge from "./components/PWABadge/PWABadge";

const queryClient = new QueryClient();

function App() {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <AppRoutes />
          <PWABadge />
        </ThemeProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
}

export default App;
