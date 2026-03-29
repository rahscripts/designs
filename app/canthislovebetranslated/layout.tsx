export default function CanLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="bg-gradient-to-b from-red-50 to-yellow-200">
            {children}
        </div>
    )
}