import BottomNav from '@/components/app/BottomNav';

export default function MemberLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ maxWidth: 480, margin: '0 auto', minHeight: '100vh', background: '#f8f9fa', position: 'relative' }}>
      <div style={{ paddingBottom: 72 }}>
        {children}
      </div>
      <BottomNav />
    </div>
  );
}
