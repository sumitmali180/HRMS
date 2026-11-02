import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import Login from "../pages/auth/Login";
import Dashboard from "../pages/dashboard/Dashboard";
import Unauthorized from "../pages/Unauthorized";
import MainLayout from "../components/layout/MainLayout";
import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";
import RoleRoute from "./RoleRoute";

// Master Management Pages
import Company from "../pages/company/Company";
import Branch from "../pages/branch/Branch";
import Department from "../pages/department/Department";
import Designation from "../pages/designation/Designation";
import Employee from "../pages/employee/Employee";

// Attendance Pages
import MyAttendance from "../pages/attendance/MyAttendance";
import AttendanceList from "../pages/attendance/AttendanceList";

// Leave Pages
import ApplyLeave from "../pages/leave/ApplyLeave";
import LeaveApproval from "../pages/leave/LeaveApproval";
import LeaveTypeManagement from "../pages/leave/LeaveTypeManagement";

// Payroll Pages
import Payroll from "../pages/payroll/Payroll";
import MyPayroll from "../pages/payroll/MyPayroll";

// Reports & Profile
import Reports from "../pages/reports/Reports";
import Profile from "../pages/profile/Profile";

// Enterprise Phases 9 - 15 Pages
import MyExpenses from "../pages/expense/MyExpenses";
import ExpenseApproval from "../pages/expense/ExpenseApproval";
import AssetInventory from "../pages/asset/AssetInventory";
import MyAssets from "../pages/asset/MyAssets";
import ResignationManagement from "../pages/exit/ResignationManagement";
import FnFSettlement from "../pages/exit/FnFSettlement";
import OnboardingTracker from "../pages/exit/OnboardingTracker";
import ShiftManagement from "../pages/shift/ShiftManagement";
import RosterPlanner from "../pages/shift/RosterPlanner";
import GoalsAndOKRs from "../pages/pms/GoalsAndOKRs";
import AppraisalForm from "../pages/pms/AppraisalForm";
import JobOpenings from "../pages/ats/JobOpenings";
import CandidatePipeline from "../pages/ats/CandidatePipeline";
import DocumentTemplates from "../pages/document/DocumentTemplates";
import MyDocuments from "../pages/document/MyDocuments";
import AuditLog from "../pages/document/AuditLog";

const AppRoutes = () => {
    return (
        <BrowserRouter>
            <Routes>
                {/* PUBLIC ROUTES */}
                <Route element={<PublicRoute />}>
                    <Route path="/login" element={<Login />} />
                </Route>

                {/* PROTECTED ROUTES */}
                <Route element={<ProtectedRoute />}>
                    <Route element={<MainLayout />}>
                        {/* COMMON LOGGED IN PAGES */}
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/unauthorized" element={<Unauthorized />} />
                        <Route path="/profile" element={<Profile />} />

                        {/* SELF-SERVICE ESS (ALL ROLES) */}
                        <Route path="/my-attendance" element={<MyAttendance />} />
                        <Route path="/attendance/my" element={<MyAttendance />} />
                        <Route path="/apply-leave" element={<ApplyLeave />} />
                        <Route path="/leave/apply" element={<ApplyLeave />} />
                        <Route path="/my-payroll" element={<MyPayroll />} />
                        <Route path="/payroll/my" element={<MyPayroll />} />
                        <Route path="/my-expenses" element={<MyExpenses />} />
                        <Route path="/my-assets" element={<MyAssets />} />
                        <Route path="/my-documents" element={<MyDocuments />} />
                        <Route path="/goals" element={<GoalsAndOKRs />} />
                        <Route path="/appraisal" element={<AppraisalForm />} />
                        <Route path="/resignation" element={<ResignationManagement />} />

                        {/* ADMIN MASTER DATA (Super Admin, HR Admin, Admin) */}
                        <Route
                            element={
                                <RoleRoute
                                    allowedRoles={["Super Admin", "HR Admin", "Admin"]}
                                />
                            }
                        >
                            <Route path="/company" element={<Company />} />
                            <Route path="/branch" element={<Branch />} />
                            <Route path="/department" element={<Department />} />
                            <Route path="/designation" element={<Designation />} />
                            <Route path="/employee" element={<Employee />} />
                            <Route path="/leave" element={<LeaveTypeManagement />} />
                            <Route path="/leave/types" element={<LeaveTypeManagement />} />
                            <Route path="/payroll" element={<Payroll />} />
                            <Route path="/assets" element={<AssetInventory />} />
                            <Route path="/shifts" element={<ShiftManagement />} />
                            <Route path="/fnf-settlement" element={<FnFSettlement />} />
                            <Route path="/onboarding" element={<OnboardingTracker />} />
                            <Route path="/job-openings" element={<JobOpenings />} />
                            <Route path="/audit-logs" element={<AuditLog />} />
                        </Route>

                        {/* WORKFORCE & ATTENDANCE MANAGEMENT (Admin, HR Admin, Manager) */}
                        <Route
                            element={
                                <RoleRoute
                                    allowedRoles={["Super Admin", "HR Admin", "Admin", "Manager"]}
                                />
                            }
                        >
                            <Route path="/attendance" element={<AttendanceList />} />
                            <Route path="/attendance/list" element={<AttendanceList />} />
                            <Route path="/leave-approval" element={<LeaveApproval />} />
                            <Route path="/leave/approval" element={<LeaveApproval />} />
                            <Route path="/reports" element={<Reports />} />
                            <Route path="/team" element={<Employee />} />
                            <Route path="/expense-approval" element={<ExpenseApproval />} />
                            <Route path="/roster" element={<RosterPlanner />} />
                            <Route path="/candidate-pipeline" element={<CandidatePipeline />} />
                            <Route path="/document-templates" element={<DocumentTemplates />} />
                        </Route>
                    </Route>
                </Route>

                {/* DEFAULT REDIRECT */}
                <Route path="/" element={<Navigate to="/dashboard" replace />} />

                {/* FALLBACK */}
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
        </BrowserRouter>
    );
};

export default AppRoutes;