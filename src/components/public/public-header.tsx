"use client";

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '../ui/button'
import { ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils';

export default function PublicHeader() {
    const [isScrolled, setIsScrolled] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    return (
        <nav className={cn(
            "sticky top-0 z-50 transition-all duration-300",
            isScrolled
                ? "border-b border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60"
                : "bg-transparent border-b border-transparent"
        )}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                            <span className="text-primary-foreground font-bold text-lg">A</span>
                        </div>
                        <span className="text-xl font-bold text-foreground">Abhyam CRM</span>
                    </div>
                    <div className="hidden md:flex items-center gap-8">
                        <a
                            href="#features"
                            className="text-sm font-medium text-black dark:text-muted-foreground hover:text-foreground transition-colors"
                        >
                            Features
                        </a>
                        <a
                            href="#solutions"
                            className="text-sm font-medium text-black dark:text-muted-foreground hover:text-foreground transition-colors"
                        >
                            Solutions
                        </a>
                        <a
                            href="#pricing"
                            className="text-sm font-medium text-black dark:text-muted-foreground hover:text-foreground transition-colors"
                        >
                            Pricing
                        </a>
                    </div>
                    <Button size="sm" asChild>
                        <Link href="/auth/sign-in">
                            Sign In <ArrowRight />
                        </Link>
                    </Button>
                </div>
            </div>
        </nav>
    )
}