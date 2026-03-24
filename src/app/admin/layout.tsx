import Navbar from '@/components/layout/Navbar';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="app-layout">
      <Navbar role="admin" user={{ name: 'Admin Principal', avatar: 'AD' }} />
      <div className="app-main">
        <main className="app-content">
          {children}
        </main>
      </div>
    </div>
  );
}
