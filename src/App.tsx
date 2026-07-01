import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { HomePage } from '@/routes/Home';
import { SectionPage } from '@/routes/SectionPage';
import { DashboardEarthwork } from '@/routes/DashboardEarthwork';
import { DashboardKeyEvents } from '@/routes/DashboardKeyEvents';
import { DashboardEquipment } from '@/routes/DashboardEquipment';
import { TeamPage } from '@/routes/Team';
import { MilestonesPage } from '@/routes/Milestones';
import { TasksPage } from '@/routes/Tasks';
import { DocumentsPage } from '@/routes/Documents';
import { RisksPage } from '@/routes/Risks';
import { DecisionsPage } from '@/routes/Decisions';
import { MapPage } from '@/routes/Map';
import { LoginPage } from '@/routes/admin/Login';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { AdminSections } from '@/routes/admin/Sections';
import { AdminContent } from '@/routes/admin/Content';
import { AdminEmbeds } from '@/routes/admin/Embeds';
import { AdminMembers } from '@/routes/admin/Members';
import { AdminMilestones } from '@/routes/admin/Milestones';
import { AdminRisks } from '@/routes/admin/Risks';
import { AdminDecisions } from '@/routes/admin/Decisions';
import { ConstructionStatusPage } from '@/routes/ConstructionStatus';
import { DocumentDashboardPage } from '@/routes/DocumentDashboard';
import { ProcurementPage } from '@/routes/Procurement';
import { TransmittalsPage } from '@/routes/Transmittals';
import { MilestoneDashboardPage } from '@/routes/MilestoneDashboard';
import { adminAuth } from '@/lib/adminAuth';

const Protected = ({ children }: { children: React.ReactNode }) => {
  if (!adminAuth.isLoggedIn()) return <Navigate to="/admin/login" replace />;
  return <>{children}</>;
};

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        {/* 5 大 dashboard 二级页 */}
        <Route path="/dashboard/construction" element={<ConstructionStatusPage />} />
        <Route path="/dashboard/document" element={<DocumentDashboardPage />} />
        <Route path="/dashboard/procurement" element={<ProcurementPage />} />
        <Route path="/dashboard/transmittals" element={<TransmittalsPage />} />
        <Route path="/dashboard/milestone" element={<MilestoneDashboardPage />} />
        {/* 11 板块二级页 */}
        <Route path="/section/overview" element={<DashboardEarthwork />} />
        <Route path="/section/earthwork" element={<DashboardEarthwork />} />
        <Route path="/section/key_events" element={<DashboardKeyEvents />} />
        <Route path="/section/equipment" element={<DashboardEquipment />} />
        <Route path="/section/team" element={<TeamPage />} />
        <Route path="/section/milestones" element={<MilestonesPage />} />
        <Route path="/section/tasks" element={<TasksPage />} />
        <Route path="/section/documents" element={<DocumentsPage />} />
        <Route path="/section/risks" element={<RisksPage />} />
        <Route path="/section/decisions" element={<DecisionsPage />} />
        <Route path="/section/map" element={<MapPage />} />
        <Route path="/section/:key" element={<SectionPage />} />

        <Route path="/admin" element={<Navigate to="/" replace />} />
        <Route path="/kz-secret-panel" element={<LoginPage />} />
        <Route path="/kz-secret-panel/*" element={
          <Protected>
            <AdminLayout />
          </Protected>
        }>
          <Route index element={<Navigate to="sections" replace />} />
          <Route path="sections" element={<AdminSections />} />
          <Route path="content" element={<AdminContent />} />
          <Route path="embeds" element={<AdminEmbeds />} />
          <Route path="members" element={<AdminMembers />} />
          <Route path="milestones" element={<AdminMilestones />} />
          <Route path="risks" element={<AdminRisks />} />
          <Route path="decisions" element={<AdminDecisions />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
