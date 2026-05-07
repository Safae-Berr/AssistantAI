import HeroSection from "../../components/layout/HeroSection";
import StatCard from "../../components/dashboard/StatCard";
import RecentReportsTable from "../../components/dashboard/RecentReportsTable";

function Dashboard() {
  return (
    <div style={{ backgroundColor: "#f8fafc", minHeight: "100vh" }}>
      <main className="mx-auto max-w-7xl px-8 py-10">
        <HeroSection />  
        <StatCard />
        <RecentReportsTable />
      </main>
    </div>
  );
}

export default Dashboard;