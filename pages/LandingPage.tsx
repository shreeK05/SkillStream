import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Zap, Target, Layers, Layout, Video, Cpu, Activity, User, Grid, PlayCircle, Sparkles } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import ParticleBackground from '../components/ParticleBackground';

const LandingPage = () => {
    const navigate = useNavigate();
    const { isAuthenticated, currentUser } = useAppContext();
    const [scrolled, setScrolled] = useState(false);
    const { scrollY } = useScroll();

    // Parallax effect for header
    const headerY = useTransform(scrollY, [0, 500], [0, 150]);
    const headerOpacity = useTransform(scrollY, [0, 300], [1, 0]);

    // Scroll effect for navbar
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

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.3
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { type: "spring", stiffness: 100 }
        }
    };

    return (
        <div className="min-h-screen bg-[#0f172a] text-white overflow-hidden relative font-sans selection:bg-indigo-500 selection:text-white">

            <ParticleBackground />

            {/* Navigation */}
            <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-[#0f172a]/80 backdrop-blur-md border-b border-white/5 py-4 shadow-lg' : 'bg-transparent py-6'}`}>
                <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                        className="flex items-center space-x-2 cursor-pointer"
                        onClick={() => navigate('/')}
                    >
                        <img src="/logo.png" alt="Svadhyaya" className="h-10 w-auto object-contain drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]" />
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="hidden md:flex items-center space-x-8 text-sm font-medium text-gray-400"
                    >
                        <a href="#features" className="hover:text-white transition-colors relative group">
                            Features
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-indigo-500 transition-all group-hover:w-full"></span>
                        </a>
                        <a href="#how-it-works" className="hover:text-white transition-colors relative group">
                            Engine
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-indigo-500 transition-all group-hover:w-full"></span>
                        </a>
                        <a href="#pricing" className="hover:text-white transition-colors relative group">
                            Enterprise
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-indigo-500 transition-all group-hover:w-full"></span>
                        </a>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                        className="flex items-center space-x-4"
                    >
                        <button
                            onClick={() => navigate('/login')}
                            className="hidden md:block px-5 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors"
                        >
                            Sign In
                        </button>
                        <button
                            onClick={handleCTA}
                            className="px-6 py-2.5 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-[0_0_20px_rgba(79,70,229,0.4)] rounded-full transition-all hover:scale-105 active:scale-95 border border-indigo-500/50"
                        >
                            Get Started
                        </button>
                    </motion.div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 z-10 flex flex-col items-center justify-center min-h-screen">
                <motion.div
                    style={{ y: headerY, opacity: headerOpacity }}
                    className="max-w-7xl mx-auto px-6 text-center relative z-20"
                >
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="inline-flex items-center px-4 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-xs font-bold mb-8 shadow-[0_0_15px_rgba(99,102,241,0.2)] backdrop-blur-sm"
                    >
                        <span className="flex w-2 h-2 bg-indigo-400 rounded-full mr-2 animate-pulse shadow-[0_0_10px_#818cf8]"></span>
                        Svadhyaya AI Engine v2.0 Live
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.3, type: "spring" }}
                        className="text-6xl md:text-8xl font-bold tracking-tight mb-8 leading-[1.1]"
                    >
                        <span className="block text-white drop-shadow-lg">Unlock Your</span>
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400 animate-gradient-x drop-shadow-lg">
                            True Potential
                        </span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.5 }}
                        className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-12 leading-relaxed"
                    >
                        The intelligent learning ecosystem that adapts to your career velocity.
                        <br className="hidden md:block" /> Powered by advanced neural networks to personalize every step.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.7 }}
                        className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6"
                    >
                        <button
                            onClick={handleCTA}
                            className="group relative px-8 py-4 text-base font-bold text-white bg-indigo-600 rounded-full shadow-[0_0_30px_rgba(79,70,229,0.5)] overflow-hidden transition-all hover:scale-105 active:scale-95"
                        >
                            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer"></span>
                            <span className="relative flex items-center">
                                Start Your Journey
                                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </span>
                        </button>

                        <button className="px-8 py-4 text-base font-bold text-gray-300 hover:text-white border border-white/10 hover:border-white/30 rounded-full bg-white/5 backdrop-blur-sm transition-all flex items-center group hover:bg-white/10">
                            <PlayCircle className="mr-2 w-5 h-5 text-indigo-400 group-hover:text-white transition-colors fill-current bg-white rounded-full bg-opacity-10" />
                            Watch Demo
                        </button>
                    </motion.div>
                </motion.div>

                {/* Hero Dashboard Preview */}
                <motion.div
                    initial={{ opacity: 0, y: 100, rotateX: 20 }}
                    animate={{ opacity: 1, y: 0, rotateX: 0 }}
                    transition={{ duration: 1, delay: 0.4, type: "spring", stiffness: 50 }}
                    className="mt-20 relative max-w-6xl mx-auto px-4 z-10 w-full perspective-1000"
                >
                    <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl blur-2xl opacity-20 animate-pulse"></div>
                    <div className="relative rounded-2xl border border-white/10 bg-[#1e293b]/50 backdrop-blur-xl shadow-2xl overflow-hidden aspect-[16/9] ring-1 ring-white/10">
                        {/* Mock UI Interface */}
                        <div className="absolute inset-0 flex flex-col">
                            <div className="h-12 border-b border-white/5 bg-white/5 flex items-center px-6 justify-between">
                                <div className="flex space-x-2">
                                    <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                                    <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
                                    <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
                                </div>
                                <div className="h-6 w-1/3 bg-white/5 rounded-full"></div>
                            </div>
                            <div className="flex-1 flex overflow-hidden">
                                <div className="w-64 border-r border-white/5 bg-white/5 p-6 hidden md:block space-y-6">
                                    <div className="h-10 w-full bg-indigo-500/20 rounded-lg animate-pulse delay-75"></div>
                                    <div className="space-y-3">
                                        <div className="h-4 w-3/4 bg-white/5 rounded animate-pulse"></div>
                                        <div className="h-4 w-1/2 bg-white/5 rounded animate-pulse"></div>
                                        <div className="h-4 w-5/6 bg-white/5 rounded animate-pulse"></div>
                                    </div>
                                    <div className="mt-auto h-32 bg-gradient-to-b from-transparent to-indigo-900/20 rounded-xl border border-white/5"></div>
                                </div>
                                <div className="flex-1 p-8 grid grid-cols-12 gap-6 overflow-hidden relative">
                                    <div className="col-span-8 bg-white/5 rounded-2xl border border-white/5 p-6 relative overflow-hidden group">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl group-hover:bg-indigo-500/20 transition-all"></div>
                                        <div className="h-48 flex items-end justify-between gap-2">
                                            {[40, 65, 50, 80, 55, 90, 70].map((h, i) => (
                                                <motion.div
                                                    key={i}
                                                    initial={{ height: 0 }}
                                                    animate={{ height: `${h}%` }}
                                                    transition={{ duration: 1, delay: 1 + i * 0.1 }}
                                                    className="w-full bg-gradient-to-t from-indigo-600 to-purple-500 rounded-t-sm opacity-80"
                                                ></motion.div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="col-span-4 space-y-6">
                                        <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl p-6 shadow-lg h-full relative overflow-hidden">
                                            <Sparkles className="absolute top-4 right-4 text-white/20 w-8 h-8" />
                                            <div className="h-16 w-16 rounded-full bg-white/20 mb-4 animate-pulse"></div>
                                            <div className="h-4 w-2/3 bg-white/20 rounded mb-2"></div>
                                            <div className="h-4 w-1/2 bg-white/10 rounded"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </section>

            {/* Features Grid */}
            <section id="features" className="py-32 relative z-10 bg-[#0f172a]">
                <div className="max-w-7xl mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="text-center mb-20"
                    >
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
                            Engineered for <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">Hyper-Growth</span>
                        </h2>
                        <p className="text-gray-400 max-w-2xl mx-auto text-lg">
                            Our platform combines behavioral science with machine learning to create the most efficient learning paths.
                        </p>
                    </motion.div>

                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        className="grid md:grid-cols-3 gap-8"
                    >
                        {[
                            {
                                icon: <Cpu className="w-6 h-6 text-indigo-400" />,
                                title: "Adaptive AI Engine",
                                desc: "Proprietary algorithms analyze your code and quiz performance to continuously adjust curriculum difficulty.",
                                color: "indigo"
                            },
                            {
                                icon: <Target className="w-6 h-6 text-cyan-400" />,
                                title: "Precision Paths",
                                desc: "Dynamic curriculum generation based on your role, goals, and gaps. No generic content.",
                                color: "cyan"
                            },
                            {
                                icon: <Layers className="w-6 h-6 text-purple-400" />,
                                title: "Deep Skill Mapping",
                                desc: "Visualize your competency matrix across 500+ technical dimensions with real-time updates.",
                                color: "purple"
                            },
                            {
                                icon: <Activity className="w-6 h-6 text-emerald-400" />,
                                title: "Instant Feedback Loops",
                                desc: "Get immediate, actionable feedback on assignments with automated grading and suggestions.",
                                color: "emerald"
                            },
                            {
                                icon: <Layout className="w-6 h-6 text-orange-400" />,
                                title: "Flow State Interface",
                                desc: "A distraction-free, high-contrast environment designed to keep you in the zone.",
                                color: "orange"
                            },
                            {
                                icon: <Grid className="w-6 h-6 text-pink-400" />,
                                title: "Enterprise Scalability",
                                desc: "Manage thousands of custom learning paths with team-level analytics and reporting.",
                                color: "pink"
                            }
                        ].map((feature, idx) => {
                            const colorMap: Record<string, string> = { indigo: 'bg-indigo-500', cyan: 'bg-cyan-500', purple: 'bg-purple-500', emerald: 'bg-emerald-500', orange: 'bg-orange-500', pink: 'bg-pink-500' };
                            return (
                                <motion.div
                                    key={idx}
                                    variants={itemVariants}
                                    whileHover={{ y: -10, transition: { duration: 0.3 } }}
                                    className="p-8 rounded-3xl bg-[#1e293b]/40 backdrop-blur-sm border border-white/5 hover:border-indigo-500/30 hover:bg-[#1e293b]/80 transition-all group relative overflow-hidden"
                                >
                                    <div className={`absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity`}>
                                        <div className={`w-24 h-24 rounded-full ${colorMap[feature.color] || 'bg-indigo-500'} blur-2xl`}></div>
                                    </div>

                                    <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 shadow-lg">
                                        {feature.icon}
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-3 group-hover:text-indigo-400 transition-colors">{feature.title}</h3>
                                    <p className="text-gray-400 text-sm leading-relaxed">{feature.desc}</p>
                                </motion.div>
                            );
                        })}
                    </motion.div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 border-t border-white/5 bg-[#0b1120] relative z-10">
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
                    <div className="flex items-center space-x-2 mb-4 md:mb-0">
                        <img src="/logo.png" alt="Svadhyaya" className="h-8 w-auto opacity-70 filter grayscale hover:grayscale-0 transition-all" />
                        <span className="text-gray-400 font-bold">&copy; {new Date().getFullYear()}</span>
                    </div>
                    <div className="flex space-x-8">
                        <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                        <a href="#" className="hover:text-white transition-colors">Support</a>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
