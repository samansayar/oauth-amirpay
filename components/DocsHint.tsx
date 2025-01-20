import { Card } from '@/components/ui/card'
import Link from 'next/link'

export function DocsHint() {
    return (
        <Card className="fixed bottom-4 right-4 p-4 shadow-lg bg-primary animate-in fade-in duration-700 hover:scale-105 transition-transform">
            <Link
                href="https://panel.amirpay.top/fa/docs"
                target="_blank"
                className="text-md text-primary-foreground transition-colors"
            >
                Visit the documentation for more help 📚
            </Link>
        </Card>
    )
}
