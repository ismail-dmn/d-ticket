import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import CustomersPage from "./pages/CustomersPage";
import NewCustomerPage from "./pages/NewCustomerPage";
import TicketsPage from "./pages/TicketsPage";
import NewTicketPage from "./pages/NewTicketPage";
import ProposalsPage from "./pages/ProposalsPage";
import NewProposalPage from "./pages/NewProposalPage";
import CompanyVaultPage from "./pages/CompanyVaultPage";
import TicketDetailPage from "./pages/TicketDetailPage";
import ProposalDetailPage from "./pages/ProposalDetailPage";
import CustomerDetailPage from "./pages/CustomerDetailPage";
import ReportsPage from "./pages/ReportsPage";

function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/customers"} component={CustomersPage} />
      <Route path={"/customers/new"} component={NewCustomerPage} />
      <Route path={"/tickets"} component={TicketsPage} />
      <Route path={"/tickets/new"} component={NewTicketPage} />
      <Route path={"/proposals"} component={ProposalsPage} />
      <Route path={"/proposals/new"} component={NewProposalPage} />
      <Route path={"/vault"} component={CompanyVaultPage} />
      <Route path={"/tickets/:id"} component={TicketDetailPage} />
      <Route path={"/proposals/:id"} component={ProposalDetailPage} />
      <Route path={"/customers/:id"} component={CustomerDetailPage} />
      <Route path={"/reports"} component={ReportsPage} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
        // switchable
      >
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
