import { Routes, Route } from "react-router-dom";
import { SidebarProvider } from "./context/SidebarContext";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AddExpense from "./pages/AddExpense";
import Transactions from "./components/Transaction";
import CategoryAnalytics from "./components/CategoryAnalyzer";

import AuthProvider from "./context/UserContext";
import ProtectedRoute from "./routes/ProtectedRoute";
import DashboardLayout from "./layouts/DashboardLayout";
import ChartSection from "./components/ChartSection";
import AddIncome from "./pages/AddIncome";
import Calendar from "./components/Calendar";
import ExpenseList from "./pages/ExpenseList";
import MyWallet from "./pages/MyWallet";
import MonthlyExpense from "./pages/MonthlyExpense";
import DailyExpense from "./pages/DailyExpense";
import LandingPage from "./pages/LandingPage";
import Analytics from "./pages/Analytics";
import KhataBook from "./pages/KhataBook";
import Settings from "./pages/Settings";
import HelpAndSupport from "./pages/HelpAndSupport";

export default function App() {
  return (
    <AuthProvider>
      <SidebarProvider>
        <Routes>
          {/* -------- PUBLIC -------- */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* -------- PROTECTED -------- */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <Home />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/add-expense"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <AddExpense />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/transactions"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <Transactions />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/analytics"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <CategoryAnalytics />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/chart-section"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <ChartSection />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

            <Route
            path="/add-income"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <AddIncome />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/calender"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <Calendar />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/expense-list"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <ExpenseList />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
           <Route
            path="/my-wallet"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <MyWallet />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
           <Route
            path="/monthly"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <MonthlyExpense />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
           <Route
            path="/daily"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <DailyExpense />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/landing-page"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <LandingPage />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/analytics-all"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <Analytics />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
           <Route
            path="/payments"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <KhataBook />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <Settings />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/help"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <HelpAndSupport/>
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </SidebarProvider>
    </AuthProvider>
  );
}
