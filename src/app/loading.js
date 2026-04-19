export default function Loading() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 16,
        height: 'calc(100vh - 48px)',
        color: '#94a3b8',
      }}
    >
      <div
        style={{
          width: 44,
          height: 44,
          border: '3px solid rgba(124,58,237,0.2)',
          borderTopColor: '#a78bfa',
          borderRadius: '50%',
          animation: 'hq-spin 0.8s linear infinite',
        }}
      />
      <p style={{ fontSize: 14 }}>Загружаем…</p>
      <style>{`@keyframes hq-spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
