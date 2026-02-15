import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Zap, Target, Layers, Layout, Video, Cpu, Activity, User, Grid } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const LandingPage = () => {
    const navigate = useNavigate();
    const { isAuthenticated, currentUser } = useAppContext();
    const [scrolled, setScrolled] = useState(false);

    // Scroll effect for header
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleCTA = () => {
        if (isAuthenticated) {
            navigate(currentUser?.role === 'Admin' ? '/admin/dashboard' : '/employee/dashboard');
        } else {
            navigate('/signup');
        }
    };

    return (
        <div className="min-h-screen bg-[#0f172a] text-white overflow-hidden relative font-sans selection:bg-indigo-500 selection:text-white">

            {/* Background Particles (static CSS animation) */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/20 rounded-full blur-[120px] animate-pulse"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-cyan-500/10 rounded-full blur-[120px] animate-pulse delay-1000"></div>
                <div className="absolute top-[40%] left-[60%] w-[20%] h-[20%] bg-purple-500/10 rounded-full blur-[80px] animate-float"></div>
            </div>

            {/* Navigation */}
            <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-[#0f172a]/80 backdrop-blur-md border-b border-white/5 py-4' : 'bg-transparent py-6'}`}>
                <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center transform rotate-3 hover:rotate-6 transition-transform">
                            <Zap className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                            Svadhyaya
                        </span>
                    </div>
                    <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-gray-300">
                        <a href="#features" className="hover:text-white transition-colors">Features</a>
                        <a href="#how-it-works" className="hover:text-white transition-colors">How it Works</a>
                        <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
                    </div>
                    <div>
                        <button
                            onClick={() => navigate('/login')}
                            className="px-5 py-2 text-sm font-medium text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-full backdrop-blur-sm transition-all mr-3"
                        >
                            Sign In
                        </button>
                        <button
                            onClick={handleCTA}
                            className="px-5 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-500 shadow-[0_0_20px_rgba(79,70,229,0.3)] rounded-full transition-all"
                        >
                            Get Started
                        </button>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 z-10">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <div className="inline-flex items-center px-4 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-xs font-medium mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <span className="flex w-2 h-2 bg-indigo-400 rounded-full mr-2 animate-pulse"></span>
                        AI-Driven Learning Ecosystem v2.0
                    </div>

                    <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 leading-[1.1] animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-100">
                        Unlock Your Potential with <br />
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400">
                            Intelligent Self-Learning
                        </span>
                    </h1>

                    <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200 leading-relaxed">
                        Svadhyaya adapts to your pace, style, and goals using advanced AI.
                        Experience a new era of personalized workforce development.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-300">
                        <button
                            onClick={handleCTA}
                            className="px-8 py-4 text-base font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-full shadow-[0_10px_30px_rgba(79,70,229,0.4)] hover:shadow-[0_15px_40px_rgba(79,70,229,0.5)] transition-all transform hover:-translate-y-1 flex items-center"
                        >
                            Start Learning Now
                            <ArrowRight className="ml-2 w-5 h-5" />
                        </button>
                        <button className="px-8 py-4 text-base font-semibold text-gray-300 hover:text-white border border-gray-700 hover:border-gray-500 rounded-full bg-white/5 backdrop-blur-sm transition-all flex items-center group">
                            <Video className="mr-2 w-5 h-5 text-gray-500 group-hover:text-white transition-colors" />
                            Watch Demo
                        </button>
                    </div>

                    {/* Hero Dashboard Preview */}
                    <div className="mt-24 relative max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-500">
                        <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl blur opacity-30"></div>
                        <div className="relative rounded-xl border border-white/10 bg-[#1e293b]/80 backdrop-blur-xl shadow-2xl overflow-hidden aspect-[16/9]">
                            {/* Mock UI Interface */}
                            <div className="absolute inset-0 flex flex-col">
                                <div className="h-10 border-b border-white/5 bg-white/5 flex items-center px-4 space-x-2">
                                    <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                                    <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
                                    <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
                                </div>
                                <div className="flex-1 flex">
                                    <div className="w-64 border-r border-white/5 bg-white/5 p-4 hidden md:block">
                                        <div className="space-y-4">
                                            <div className="h-8 w-3/4 bg-white/10 rounded animate-pulse"></div>
                                            <div className="h-4 w-1/2 bg-white/5 rounded animate-pulse"></div>
                                            <div className="h-4 w-2/3 bg-white/5 rounded animate-pulse"></div>
                                            <div className="h-4 w-1/2 bg-white/5 rounded animate-pulse"></div>
                                        </div>
                                    </div>
                                    <div className="flex-1 p-8 grid grid-cols-2 gap-6">
                                        <div className="col-span-2 h-32 bg-indigo-500/10 border border-indigo-500/20 rounded-lg p-6 flex items-center justify-between">
                                            <div>
                                                <div className="h-6 w-48 bg-indigo-400/20 rounded mb-2"></div>
                                                <div className="h-4 w-32 bg-indigo-400/10 rounded"></div>
                                            </div>
                                            <div className="w-16 h-16 rounded-full border-4 border-indigo-500/30 flex items-center justify-center text-indigo-400 font-bold text-xl">85%</div>
                                        </div>
                                        <div className="h-40 bg-white/5 rounded-lg border border-white/5 p-4"></div>
                                        <div className="h-40 bg-white/5 rounded-lg border border-white/5 p-4"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section id="features" className="py-24 relative z-10 bg-[#0f172a]">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 mb-4">
                            Designed for the Future of Work
                        </h2>
                        <p className="text-gray-400 max-w-2xl mx-auto">
                            Powerful tools that adapt to your unique learning journey.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: <Cpu className="w-6 h-6 text-indigo-400" />,
                                title: "Adaptive AI Engine",
                                desc: "Real-time analysis of your performance to tailor content difficulty."
                            },
                            {
                                icon: <Target className="w-6 h-6 text-cyan-400" />,
                                title: "Precision Learning Paths",
                                desc: "No more generic courses. Get exactly what you need to advance."
                            },
                            {
                                icon: <Layers className="w-6 h-6 text-purple-400" />,
                                title: "Skill Visualization",
                                desc: "Track your growth with interactive dataviz and mastery charts."
                            },
                            {
                                icon: <Activity className="w-6 h-6 text-emerald-400" />,
                                title: "Real-time Analytics",
                                desc: "Instant feedback loops to accelerate your retention."
                            },
                            {
                                icon: <Layout className="w-6 h-6 text-orange-400" />,
                                title: "Premium Dashboard",
                                desc: "A clutter-free, focused environment designed for deep work."
                            },
                            {
                                icon: <Grid className="w-6 h-6 text-pink-400" />,
                                title: "Resource Library",
                                desc: "Curated content from world-class providers at your fingertips."
                            }
                        ].map((feature, idx) => (
                            <div key={idx} className="p-6 rounded-2xl bg-[#1e293b]/60 border border-white/5 hover:border-indigo-500/30 hover:bg-[#1e293b] transition-all group">
                                <div className="w-12 h-12 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                                <p className="text-gray-400 text-sm leading-relaxed">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 border-t border-white/5 bg-[#0b1120]">
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
                    <p>&copy; {new Date().getFullYear()} Svadhyaya. All rights reserved.</p>
                    <div className="flex space-x-6 mt-4 md:mt-0">
                        <a href="#" className="hover:text-white transition-colors">Privacy</a>
                        <a href="#" className="hover:text-white transition-colors">Terms</a>
                        <a href="#" className="hover:text-white transition-colors">Contact</a>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
