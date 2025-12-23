import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
    ArrowRight,
    Users,
    FileText,
    DollarSign,
    Mail,
    Facebook,
    Shield,
    BookOpen,
    Target,
    BarChart3,
    CheckCircle2,
    Zap,
    Globe,
    Clock,
} from "lucide-react"
import PublicHeader from "@/components/public/public-header"
import Hero from "@/components/public/home/hero"

export default function HomePage() {
    return (
        <div className="min-h-screen bg-background">
            {/* Navigation */}
            <PublicHeader />

            {/* Hero Section */}
            <Hero />

            {/* Core Features Grid */}
            <section id="features" className="py-24 bg-muted/30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <Badge className="mb-4" variant="outline">
                            Core Features
                        </Badge>
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4 text-balance">
                            Everything You Need to Manage Your Consultancy
                        </h2>
                        <p className="text-lg text-muted-foreground text-pretty">
                            Comprehensive tools designed specifically for education consultancies
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[
                            {
                                icon: Users,
                                title: "Student Tracking",
                                description:
                                    "Monitor every student's journey from inquiry to enrollment with detailed profiles and progress tracking.",
                            },
                            {
                                icon: FileText,
                                title: "Application Management",
                                description:
                                    "Streamline application processes with automated workflows, document management, and status tracking.",
                            },
                            {
                                icon: Users,
                                title: "Counselor Management",
                                description:
                                    "Assign, track, and manage counselor performance with integrated dashboards and reporting tools.",
                            },
                            {
                                icon: DollarSign,
                                title: "Commission Automation",
                                description:
                                    "Automate commission calculations and payments with customizable rules and transparent tracking.",
                            },
                            {
                                icon: BookOpen,
                                title: "Course Management",
                                description:
                                    "Advanced course catalog with detailed information, requirements, and automated matching algorithms.",
                            },
                            {
                                icon: Shield,
                                title: "Multi-Role Access Control",
                                description:
                                    "Granular permissions system allowing secure access for admins, counselors, students, and partners.",
                            },
                            {
                                icon: Target,
                                title: "Lead Tracking",
                                description:
                                    "Capture, qualify, and convert leads with intelligent scoring and automated follow-up workflows.",
                            },
                            {
                                icon: Mail,
                                title: "Mail Automation",
                                description: "Send personalized emails at scale with templates, scheduling, and engagement tracking.",
                            },
                            {
                                icon: Facebook,
                                title: "Social Media Automation",
                                description: "Schedule and automate Facebook posts, track engagement, and manage your social presence.",
                            },
                        ].map((feature, i) => (
                            <Card key={i} className="p-6 hover:shadow-lg transition-shadow border-border bg-card">
                                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                                    <feature.icon className="w-6 h-6 text-primary" />
                                </div>
                                <h3 className="text-xl font-semibold text-foreground mb-2">{feature.title}</h3>
                                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Bento Grid - Advanced Features */}
            <section id="solutions" className="py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <Badge className="mb-4" variant="outline">
                            Advanced Capabilities
                        </Badge>
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4 text-balance">
                            Powerful Tools for Modern Consultancies
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {/* Large Feature Card */}
                        <Card className="lg:col-span-2 lg:row-span-2 p-8 bg-linear-to-br from-primary/10 via-card to-card border-border">
                            <BarChart3 className="w-12 h-12 text-primary mb-4" />
                            <h3 className="text-2xl font-bold text-foreground mb-3">Advanced Analytics</h3>
                            <p className="text-muted-foreground mb-6 leading-relaxed">
                                Get real-time insights into your consultancy operations with comprehensive dashboards, custom reports,
                                and predictive analytics.
                            </p>
                            <ul className="space-y-3">
                                {["Revenue forecasting", "Conversion analytics", "Performance metrics", "Custom reporting"].map(
                                    (item, i) => (
                                        <li key={i} className="flex items-center gap-2 text-sm text-foreground">
                                            <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                                            {item}
                                        </li>
                                    ),
                                )}
                            </ul>
                        </Card>

                        {/* Small Feature Cards */}
                        <Card className="p-6 border-border bg-card">
                            <Globe className="w-10 h-10 text-primary mb-4" />
                            <h3 className="text-lg font-semibold text-foreground mb-2">Global Reach</h3>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                Multi-language support for international consultancies
                            </p>
                        </Card>

                        <Card className="p-6 border-border bg-card">
                            <Clock className="w-10 h-10 text-primary mb-4" />
                            <h3 className="text-lg font-semibold text-foreground mb-2">Real-Time Sync</h3>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                Instant updates across all devices and team members
                            </p>
                        </Card>

                        <Card className="lg:col-span-2 p-8 bg-linear-to-br from-secondary via-card to-card border-border">
                            <Shield className="w-12 h-12 text-primary mb-4" />
                            <h3 className="text-2xl font-bold text-foreground mb-3">Enterprise Security</h3>
                            <p className="text-muted-foreground leading-relaxed">
                                Bank-level encryption, SOC 2 compliance, and regular security audits to protect your sensitive data.
                            </p>
                        </Card>

                        <Card className="p-6 border-border bg-card">
                            <Zap className="w-10 h-10 text-primary mb-4" />
                            <h3 className="text-lg font-semibold text-foreground mb-2">API Access</h3>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                Integrate with your existing tools seamlessly
                            </p>
                        </Card>

                        <Card className="p-6 border-border bg-card">
                            <Mail className="w-10 h-10 text-primary mb-4" />
                            <h3 className="text-lg font-semibold text-foreground mb-2">24/7 Support</h3>
                            <p className="text-sm text-muted-foreground leading-relaxed">Expert assistance whenever you need it</p>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Social Proof */}
            <section className="py-24 bg-muted/30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4 text-balance">
                            Trusted by Leading Consultancies Worldwide
                        </h2>
                        <p className="text-lg text-muted-foreground">Join thousands of consultancies already using Abhyam CRM</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                quote:
                                    "Abhyam CRM transformed how we manage our student applications. The automation features alone saved us 20 hours per week.",
                                author: "Sarah Johnson",
                                role: "Director, Global Education Partners",
                            },
                            {
                                quote:
                                    "The commission management system is incredibly accurate and transparent. Our counselors love being able to track their earnings in real-time.",
                                author: "Michael Chen",
                                role: "CEO, EduConnect Consulting",
                            },
                            {
                                quote:
                                    "Best investment we've made. The student tracking and analytics features give us insights we never had before.",
                                author: "Priya Sharma",
                                role: "Founder, StudyAbroad Pro",
                            },
                        ].map((testimonial, i) => (
                            <Card key={i} className="p-6 border-border bg-card">
                                <p className="text-muted-foreground mb-4 leading-relaxed italic">"{testimonial.quote}"</p>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                                        <span className="text-primary font-semibold">{testimonial.author[0]}</span>
                                    </div>
                                    <div>
                                        <div className="font-semibold text-foreground text-sm">{testimonial.author}</div>
                                        <div className="text-xs text-muted-foreground">{testimonial.role}</div>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="bg-linear-to-br from-primary/10 via-primary/5 to-background rounded-2xl p-12 border border-border">
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4 text-balance">
                            Ready to Transform Your Consultancy?
                        </h2>
                        <p className="text-lg text-muted-foreground mb-8 text-pretty max-w-2xl mx-auto">
                            Start your 14-day free trial today. No credit card required. Experience the complete 360° CRM solution.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Button size="lg" className="w-full sm:w-auto">
                                Get Started Free <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                            <Button size="lg" variant="outline" className="w-full sm:w-auto bg-transparent">
                                Schedule a Demo
                            </Button>
                        </div>
                        <div className="flex items-center justify-center gap-6 mt-8 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-primary" />
                                Free 14-day trial
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-primary" />
                                No credit card needed
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-primary" />
                                Cancel anytime
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-border bg-muted/30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="grid md:grid-cols-4 gap-8 mb-8">
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                                    <span className="text-primary-foreground font-bold text-lg">A</span>
                                </div>
                                <span className="text-lg font-bold text-foreground">Abhyam CRM</span>
                            </div>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                Complete 360° CRM solution for modern education consultancies.
                            </p>
                        </div>
                        <div>
                            <h4 className="font-semibold text-foreground mb-4">Product</h4>
                            <ul className="space-y-2 text-sm">
                                <li>
                                    <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                                        Features
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                                        Pricing
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                                        Security
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                                        Roadmap
                                    </a>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold text-foreground mb-4">Company</h4>
                            <ul className="space-y-2 text-sm">
                                <li>
                                    <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                                        About
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                                        Blog
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                                        Careers
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                                        Contact
                                    </a>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold text-foreground mb-4">Support</h4>
                            <ul className="space-y-2 text-sm">
                                <li>
                                    <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                                        Help Center
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                                        Documentation
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                                        API Reference
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                                        Status
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="border-t border-border pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <p className="text-sm text-muted-foreground">© 2025 Abhyam CRM. All rights reserved.</p>
                        <div className="flex items-center gap-6 text-sm">
                            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                                Privacy
                            </a>
                            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                                Terms
                            </a>
                            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                                Cookies
                            </a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    )
}