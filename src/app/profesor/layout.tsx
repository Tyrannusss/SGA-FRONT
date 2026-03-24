import Navbar from '@/components/layout/Navbar';

export default function ProfesorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="app-layout">
      <Navbar role="profesor" user={{ name: 'Profesor', avatar: 'PR' }} />
      <div className="app-main">
        <main className="app-content">
          {children}
        </main>
      </div>
    </div>
  );
}
