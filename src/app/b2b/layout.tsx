import AuthGuard from '@/components/auth-guard';

export default function B2BLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <AuthGuard>
            {children}
        </AuthGuard>
    );
}
