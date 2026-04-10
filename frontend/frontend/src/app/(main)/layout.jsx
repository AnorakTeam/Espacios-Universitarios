import RouteGuard from '@/components/RouteGuard'

export default function MainLayout({ children }) {
  return (
    <RouteGuard>
      <div className="min-h-screen bg-gray-50">{children}</div>
    </RouteGuard>
  )
}
