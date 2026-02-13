import AuthGuard from '@/components/auth-guard';

export default function B2ProLayout({
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
