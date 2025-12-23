"use client"

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ArrowRight, Zap } from 'lucide-react'
import { useTheme } from 'next-themes'

export default function Hero() {
    const { theme } = useTheme();

    return (
        <section className="relative min-h-screen overflow-hidden pt-20 pb-24 sm:pt-48 sm:pb-32 -mt-16">
            <div
                className="absolute inset-0 z-0"
                style={{
                    background: theme === "dark"
                        ? "radial-gradient(125% 125% at 50% 100%, #000000 40%, #010133 100%)"
                        : "radial-gradient(125% 125% at 50% 100%, #FFFFFF 40%, #C2C2DD 100%)",
                }}
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <Badge className="mb-4 rounded-full shadow-md" variant="secondary">
                        <Zap className="w-3 h-3 mr-1" />
                        Complete 360° CRM Solution
                    </Badge>
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6 text-balance">
                        Streamline Your Consultancy with <span className="text-primary">Abhyam CRM</span>
                    </h1>
                    <p className="text-lg sm:text-xl text-muted-foreground mb-8 text-pretty leading-relaxed">
                        All-in-one platform for student tracking, application management, commission automation, and more. Built
                        for modern consultancies.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Button size="lg" className="w-full sm:w-auto">
                            Start Free Trial <ArrowRight />
                        </Button>
                        <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                            Watch Demo
                        </Button>
                    </div>
                    <p className="text-sm text-muted-foreground mt-4">No credit card required • 14-day free trial</p>
                </div>

                {/* Hero Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
                    {[
                        { label: "Active Users", value: "10K+" },
                        { label: "Students Tracked", value: "500K+" },
                        { label: "Uptime", value: "99.9%" },
                        { label: "Countries", value: "25+" },
                    ].map((stat, i) => (
                        <Card key={i} className="p-6 text-center border-border">
                            <div className="text-3xl font-bold text-foreground mb-1">{stat.value}</div>
                            <div className="text-sm text-muted-foreground">{stat.label}</div>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    )
}