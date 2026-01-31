
import React, { useState, useEffect, createContext, useContext } from 'react';
import { HashRouter, Routes, Route, Navigate, Link, useLocation, useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, X, Instagram, Twitter, ArrowRight, Trash2, Edit3, 
  Plus, LogOut, ChevronLeft, Briefcase, FileText, CheckCircle2, Clock, Mail, 
  MessageCircle, Facebook, Camera, Eye, Star, ThumbsUp, ShieldCheck, Lock,
  Linkedin, Share2, Globe, Settings, Target, Zap, Shield, Maximize2, Download, Upload, Copy, AlertTriangle
} from 'lucide-react';

import { Project, AuthState, Brief, Review, SocialLinks } from './types';
import { INITIAL_PROJECTS } from './constants';

const BRAND_NAME = "MuttaqiLab";

// --- Contexts ---
interface AppContextType {
  projects: Project[];
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
  briefs: Brief[];
  setBriefs: React.Dispatch<React.SetStateAction<Brief[]>>;
  reviews: Review[];
  setReviews: React.Dispatch<React.SetStateAction<Review[]>>;
  socials: SocialLinks;
  setSocials: React.Dispatch<React.SetStateAction<SocialLinks>>;
  auth: AuthState;
  login: (email: string) => void;
  logout: () => void;
  resetToDefaults: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useAppContext must be used within AppProvider");
  return context;
};

// --- Helper Components ---
const Button: React.FC<{ 
  variant?: 'primary' | 'outline' | 'ghost', 
  children: React.ReactNode, 
  onClick?: () => void,
  className?: string,
  type?: "button" | "submit",
  disabled?: boolean
}> = ({ variant = 'primary', children, onClick, className = "", type = "button", disabled = false }) => {
  const variants = {
    primary: "bg-[#FF7A00] text-white hover:bg-white hover:text-[#0B0B0B] shadow-lg shadow-[#FF7A00]/20",
    outline: "border border-[#FF7A00] text-[#FF7A00] hover:bg-[#FF7A00] hover:text-white",
    ghost: "text-white hover:text-[#FF7A00]"
  };

  return (
    <motion.button 
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`px-8 py-3 font-bold uppercase tracking-[0.2em] transition-all duration-500 disabled:opacity-50 premium-radius ${variants[variant]} ${className} text-[10px] md:text-xs`}
    >
      {children}
    </motion.button>
  );
};

const StarRating: React.FC<{ rating: number, setRating?: (r: number) => void, interactive?: boolean }> = ({ rating, setRating, interactive = false }) => {
  return (
    <div className="flex space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={!interactive}
          onClick={() => setRating?.(star)}
          className={`${interactive ? 'cursor-pointer' : 'cursor-default'} transition-all`}
        >
          <Star 
            size={interactive ? 24 : 14} 
            fill={star <= rating ? "#FF7A00" : "transparent"} 
            className={star <= rating ? "text-[#FF7A00]" : "text-zinc-800"} 
          />
        </button>
      ))}
    </div>
  );
};

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { auth, logout } = useAppContext();
  const location = useLocation();

  const navLinks = [
    { name: 'Work', path: '/' },
    { name: 'Projects', path: '/projects' },
    { name: 'Reviews', path: '/reviews' },
    { name: 'About', path: '/about' },
    { name: 'Process', path: '/work-with-me' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <nav className="fixed top-0 left-0 w-full z-[100] bg-[#0B0B0B]/80 backdrop-blur-xl border-b border-white/5">
      <div className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-3 group">
          <span className="text-xl md:text-2xl font-black tracking-tighter text-white uppercase flex items-center">
            MUTTAQI<span className="text-[#FF7A00] italic ml-1">LAB</span>
          </span>
        </Link>

        <div className="hidden lg:flex items-center space-x-10">
          {navLinks.map((link) => (
            <Link 
              key={link.path} 
              to={link.path} 
              className={`text-[9px] font-bold uppercase tracking-[0.4em] transition-all duration-500 hover:text-[#FF7A00] relative group ${location.pathname === link.path ? 'text-[#FF7A00]' : 'text-zinc-500'}`}
            >
              {link.name}
              <span className={`absolute -bottom-1 left-0 h-[1px] bg-[#FF7A00] transition-all duration-500 ${location.pathname === link.path ? 'w-full' : 'w-0 group-hover:w-full'}`} />
            </Link>
          ))}
          <Link to="/brief"><Button className="py-2 px-6">Start Brief</Button></Link>
          {auth.isAuthenticated && (
            <Link to="/admin" className="text-[9px] font-black uppercase tracking-widest bg-white text-black px-4 py-1.5 premium-radius hover:bg-[#FF7A00] transition-all">Admin</Link>
          )}
        </div>

        <div className="lg:hidden flex items-center space-x-4">
           <Link to="/brief"><Button className="py-2 px-4 text-[9px]">Start Brief</Button></Link>
           <button className="text-white p-2" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="absolute top-full left-0 w-full bg-[#0B0B0B] border-b border-white/10 py-10 lg:hidden shadow-2xl overflow-hidden"
          >
            <div className="flex flex-col items-center space-y-8">
              {navLinks.map((link) => (
                <Link 
                  key={link.path} 
                  to={link.path} 
                  onClick={() => setIsOpen(false)}
                  className="text-xl font-black uppercase tracking-[0.2em] text-white hover:text-[#FF7A00]"
                >
                  {link.name}
                </Link>
              ))}
              {auth.isAuthenticated && <Button variant="outline" onClick={logout}>Exit Admin</Button>}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const PageTransition: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.8 }}
    className="pt-24 min-h-screen"
  >
    {children}
  </motion.div>
);

// --- About Page ---
const AboutPage = () => {
  const expertise = [
    { title: "Brand Identity", icon: Target, desc: "Building visual systems that command attention and drive recognition." },
    { title: "Creative Strategy", icon: Maximize2, desc: "Deconstructing market noise to find your unique brand authority." },
    { title: "Digital Design", icon: Zap, desc: "Engineering high-performance UI/UX that prioritizes clarity and conversion." },
    { title: "Art Direction", icon: Eye, desc: "Crafting a cohesive visual narrative across every brand touchpoint." }
  ];

  return (
    <PageTransition>
      <div className="max-w-7xl mx-auto px-6 mb-40 pt-16">
        <header className="mb-40">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl md:text-[10rem] font-black uppercase mb-16 tracking-tighter leading-[0.85] italic"
          >
            THE <span className="text-[#FF7A00]">VISION.</span> <br /> 
            <span className="md:ml-24">DECONSTRUCTED.</span>
          </motion.h1>
          <p className="text-2xl md:text-5xl text-zinc-500 font-light max-w-5xl leading-tight">
            MuttaqiLab is a sanctuary for <span className="text-white font-bold">Brutalist Precision</span> and strategic visual clarity. We don't just design; we engineer perception.
          </p>
        </header>

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-24 mb-60">
          <div className="space-y-12">
            <h2 className="text-sm font-black uppercase tracking-[0.5em] text-[#FF7A00] flex items-center space-x-4">
              <div className="w-8 h-[1px] bg-[#FF7A00]" />
              <span>OUR PHILOSOPHY</span>
            </h2>
            <p className="text-xl md:text-2xl text-zinc-400 font-light leading-relaxed">
              Design is a science of signals. Every line, every shade, and every typographic choice is a data point intended to elicit a specific psychological response. At MuttaqiLab, we focus on the <span className="text-white font-bold">Signal over the Noise</span>.
            </p>
            <p className="text-xl md:text-2xl text-zinc-400 font-light leading-relaxed">
              Our approach is rooted in brutalist honesty—removing the superfluous to expose the core strength of your message.
            </p>
          </div>
          <div className="bg-zinc-950 p-12 premium-radius border border-white/5 flex flex-col justify-center">
            <h3 className="text-3xl font-black uppercase italic mb-8">ENGINEERING <span className="text-[#FF7A00]">DOMINANCE</span></h3>
            <p className="text-zinc-500 font-bold uppercase tracking-widest text-[10px] leading-loose">
              01 // DECONSTRUCTION <br />
              02 // CORE IDENTIFICATION <br />
              03 // PRECISION RECONSTRUCTION <br />
              04 // MARKET DEPLOYMENT
            </p>
          </div>
        </section>

        <section className="mb-60">
          <h2 className="text-sm font-black uppercase tracking-[0.5em] text-[#FF7A00] mb-20 text-center">CORE EXPERTISE</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {expertise.map((item, i) => (
              <div key={i} className="bg-zinc-950 border border-white/5 p-10 premium-radius hover:border-[#FF7A00]/40 transition-all group">
                <item.icon size={32} className="text-[#FF7A00] mb-8 group-hover:scale-110 transition-transform" />
                <h3 className="text-xl font-black uppercase mb-4">{item.title}</h3>
                <p className="text-zinc-500 text-sm font-light leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-60 bg-white text-black p-12 md:p-32 premium-radius">
          <div className="max-w-4xl mx-auto text-center">
             <h2 className="text-4xl md:text-7xl font-black uppercase italic tracking-tighter mb-12">WE ARE THE <span className="text-[#FF7A00]">SIGNAL.</span></h2>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mt-20">
                <div className="space-y-4">
                  <ShieldCheck size={40} className="mx-auto text-[#FF7A00]" />
                  <h4 className="font-black uppercase tracking-widest text-xs">Authority</h4>
                  <p className="text-[10px] font-bold uppercase text-zinc-400 tracking-widest">Commanding industry presence.</p>
                </div>
                <div className="space-y-4">
                  <Target size={40} className="mx-auto text-[#FF7A00]" />
                  <h4 className="font-black uppercase tracking-widest text-xs">Precision</h4>
                  <p className="text-[10px] font-bold uppercase text-zinc-400 tracking-widest">Intentional visual metrics.</p>
                </div>
                <div className="space-y-4">
                  <CheckCircle2 size={40} className="mx-auto text-[#FF7A00]" />
                  <h4 className="font-black uppercase tracking-widest text-xs">Timelessness</h4>
                  <p className="text-[10px] font-bold uppercase text-zinc-400 tracking-widest">Built to endure cycles.</p>
                </div>
             </div>
          </div>
        </section>

        <section className="text-center py-40">
           <h2 className="text-4xl md:text-6xl font-black uppercase italic mb-12">READY TO DEPLOY?</h2>
           <div className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-6">
             <Link to="/brief"><Button className="px-16">Start Brief</Button></Link>
             <Link to="/contact"><Button variant="outline" className="px-16">Initialize Contact</Button></Link>
           </div>
        </section>
      </div>
    </PageTransition>
  );
};

// --- Reviews Page ---
const ReviewsPage = () => {
  const { reviews, setReviews } = useAppContext();
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ clientName: '', content: '', rating: 5 });

  const approvedReviews = reviews.filter(r => r.status === 'approved');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newReview: Review = {
      ...formData,
      id: Math.random().toString(36).substr(2, 9),
      date: Date.now(),
      status: 'pending'
    };
    setReviews(prev => [newReview, ...prev]);
    setSubmitted(true);
  };

  return (
    <PageTransition>
      <div className="max-w-7xl mx-auto px-6 mb-40 pt-16">
        <header className="mb-24">
          <h1 className="text-6xl md:text-[10rem] font-black uppercase mb-12 tracking-tighter leading-none italic">CLIENT <br /> <span className="text-[#FF7A00]">VERDICTS.</span></h1>
          <p className="text-2xl text-zinc-500 font-light max-w-3xl leading-relaxed">
            Unfiltered data from project leaders who have navigated the MuttaqiLab ecosystem.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-24">
          <div className="lg:col-span-2 space-y-12">
            {approvedReviews.length === 0 ? (
              <div className="p-20 border border-dashed border-white/5 premium-radius text-center">
                 <p className="text-zinc-600 font-bold uppercase tracking-widest text-xs">Waiting for transmission data...</p>
              </div>
            ) : (
              approvedReviews.map(review => (
                <motion.div 
                  key={review.id}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  className="bg-zinc-950/50 p-10 border border-white/5 premium-radius relative"
                >
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h4 className="font-black uppercase text-xl mb-1 tracking-tight">{review.clientName}</h4>
                      <p className="text-[8px] font-black text-zinc-700 uppercase tracking-[0.3em]">Project Manifest: {new Date(review.date).toLocaleDateString()}</p>
                    </div>
                    <StarRating rating={review.rating} />
                  </div>
                  <p className="text-zinc-400 font-light leading-relaxed italic">"{review.content}"</p>
                  <ShieldCheck className="absolute top-10 right-10 text-[#FF7A00]/10" size={60} />
                </motion.div>
              ))
            )}
          </div>

          <div className="bg-zinc-950 p-10 premium-radius border border-white/5 h-fit sticky top-32">
            {submitted ? (
              <div className="text-center py-10">
                 <ThumbsUp size={48} className="text-[#FF7A00] mx-auto mb-6" />
                 <h3 className="text-2xl font-black uppercase italic mb-4">Transmission Received</h3>
                 <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest leading-loose">Your verdict is being vetted by the laboratory. It will broadcast shortly.</p>
                 <Button onClick={() => setSubmitted(false)} variant="outline" className="mt-8">Send another</Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-8">
                <h3 className="text-2xl font-black uppercase italic mb-2">Drop a Verdict</h3>
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase tracking-[0.4em] text-zinc-600">Commander Name</label>
                  <input required value={formData.clientName} onChange={e => setFormData({...formData, clientName: e.target.value})} className="w-full bg-zinc-900 border border-white/5 p-4 outline-none focus:border-[#FF7A00] transition-all font-bold premium-radius" />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase tracking-[0.4em] text-zinc-600">Satisfaction Level</label>
                  <div className="bg-zinc-900 p-4 premium-radius border border-white/5">
                    <StarRating rating={formData.rating} setRating={r => setFormData({...formData, rating: r})} interactive />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase tracking-[0.4em] text-zinc-600">Verdict Narrative</label>
                  <textarea required rows={4} value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})} className="w-full bg-zinc-900 border border-white/5 p-4 outline-none focus:border-[#FF7A00] transition-all font-bold premium-radius resize-none" />
                </div>
                <Button type="submit" className="w-full">Initialize Review</Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

const HomePage = () => {
  const { projects } = useAppContext();
  const featured = projects.filter(p => p.isFeatured).slice(0, 3);
  return (
    <PageTransition>
      <section className="max-w-7xl mx-auto px-6 mb-32 pt-20">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-5xl">
           <p className="text-[#FF7A00] font-black uppercase tracking-[0.6em] text-[10px] mb-6">MuttaqiLab Design Ecosystem</p>
           <h1 className="text-6xl md:text-9xl font-black uppercase leading-[0.85] tracking-tighter mb-12">PRECISION <br /> <span className="text-[#FF7A00] italic">BY DESIGN.</span></h1>
           <div className="flex flex-col md:flex-row space-y-8 md:space-y-0 md:space-x-12 items-baseline">
             <p className="text-xl text-zinc-500 max-w-xl font-light leading-relaxed">Deconstructing brand complexities to build powerful visual protocols. We craft the signals that command industry authority.</p>
             <Link to="/projects"><Button variant="outline">View Archive</Button></Link>
           </div>
        </motion.div>
      </section>
      <section className="max-w-7xl mx-auto px-6 mb-40">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {featured.map((p, idx) => (
            <motion.div key={p.id} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className={`group relative overflow-hidden bg-zinc-950 premium-radius ${idx === 2 ? 'md:col-span-2 aspect-[21/9]' : 'aspect-video'}`}>
              <Link to={`/project/${p.id}`} className="block h-full">
                <img src={p.images[0]} alt={p.title} className="w-full h-full object-cover grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-1000" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                <div className="absolute bottom-8 left-8">
                  <span className="text-[#FF7A00] text-[8px] font-black uppercase tracking-[0.4em] block mb-2">{p.category}</span>
                  <h3 className="text-3xl font-black uppercase tracking-tighter">{p.title}</h3>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>
    </PageTransition>
  );
};

const ProjectBriefPage = () => {
  const { setBriefs } = useAppContext();
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ clientName: '', companyName: '', email: '', projectGoals: '', deliverables: [] as string[], budget: 'Request Quotation', timeline: '1 Month' });
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newBrief: Brief = { ...formData, id: Math.random().toString(36).substr(2, 9), dateSubmitted: Date.now(), status: 'new' };
    setBriefs(prev => [newBrief, ...prev]);
    setSubmitted(true);
  };
  if (submitted) return <PageTransition><div className="max-w-2xl mx-auto px-6 text-center py-48"><h1 className="text-5xl font-black uppercase mb-8 italic">MANIFEST SENT.</h1><p className="text-zinc-500 text-lg font-light mb-12">I've received your brief. We'll connect shortly.</p><Link to="/"><Button variant="outline">Return Home</Button></Link></div></PageTransition>;
  return (
    <PageTransition>
      <div className="max-w-4xl mx-auto px-6 mb-40 pt-12 text-center">
        <h1 className="text-6xl md:text-8xl font-black uppercase mb-6 tracking-tighter">PROJECT <span className="text-[#FF7A00]">BRIEF</span></h1>
        <form onSubmit={handleSubmit} className="space-y-12 text-left mt-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <input required placeholder="Name" value={formData.clientName} onChange={e => setFormData({...formData, clientName: e.target.value})} className="bg-zinc-900 border border-white/5 p-5 focus:border-[#FF7A00] outline-none font-bold premium-radius" />
            <input required placeholder="Company" value={formData.companyName} onChange={e => setFormData({...formData, companyName: e.target.value})} className="bg-zinc-900 border border-white/5 p-5 focus:border-[#FF7A00] outline-none font-bold premium-radius" />
          </div>
          <input required type="email" placeholder="Email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-zinc-900 border border-white/5 p-5 focus:border-[#FF7A00] outline-none font-bold premium-radius" />
          <textarea required rows={5} placeholder="Goals" value={formData.projectGoals} onChange={e => setFormData({...formData, projectGoals: e.target.value})} className="w-full bg-zinc-900 border border-white/5 p-8 focus:border-[#FF7A00] outline-none resize-none font-bold premium-radius" />
          <Button type="submit" className="w-full">Transmit Manifest</Button>
        </form>
      </div>
    </PageTransition>
  );
};

const WorkWithMePage = () => {
  const rateCard = [
    { title: "Visual Identity System", scope: "Logo, Typography, Palette, Brand Book" },
    { title: "Digital Architecture", scope: "UX/UI Design, Interaction Models, Prototypes" },
    { title: "Art Direction", scope: "Creative Strategy, Photoshoot Direction, Assets" },
    { title: "Editorial Protocols", scope: "Layout Design, Magazine Systems, Publications" }
  ];

  return (
    <PageTransition>
      <div className="max-w-7xl mx-auto px-6 mb-40 pt-16">
        <section className="mb-40">
          <h1 className="text-6xl md:text-[10rem] font-black uppercase mb-16 tracking-tighter leading-[0.85]">SYSTEMS OF <br /> <span className="text-[#FF7A00] italic">POWER.</span></h1>
          <p className="text-2xl md:text-4xl text-zinc-400 font-light max-w-4xl leading-relaxed">
            I don't just design; I engineer perception. My process is a meticulous deconstruction of your brand DNA to ensure every visual signal is intentional.
          </p>
        </section>

        <section className="mb-60">
          <h2 className="text-sm font-black uppercase tracking-[0.5em] text-[#FF7A00] mb-16 flex items-center space-x-6">
             <div className="w-12 h-[1px] bg-[#FF7A00]" />
             <span>RATE CARD & CAPABILITIES</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {rateCard.map((item, i) => (
              <div key={i} className="p-10 bg-zinc-950 border border-white/5 premium-radius group hover:border-[#FF7A00] transition-all">
                <h3 className="text-2xl font-black uppercase mb-4 text-white group-hover:text-[#FF7A00] transition-colors">{item.title}</h3>
                <p className="text-zinc-500 font-light mb-8">{item.scope}</p>
                <Link to="/contact"><span className="text-[10px] font-black uppercase tracking-widest text-[#FF7A00] underline decoration-zinc-800 underline-offset-8">Message for Quote</span></Link>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-zinc-950 p-12 md:p-20 premium-radius border border-white/5">
           <h2 className="text-3xl font-black uppercase mb-16 tracking-tighter italic">THE <span className="text-[#FF7A00]">MANIFESTO</span> (CONTRACT)</h2>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-16 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 leading-loose">
             <div className="space-y-10">
               <div className="space-y-2">
                 <p className="text-white">● COMMITMENT</p>
                 <p>A 50% non-refundable deposit is required to secure your spot. I intentionally take on a limited number of projects at a time to ensure full focus and quality delivery.</p>
               </div>
               <div className="space-y-2">
                 <p className="text-white">● OWNERSHIP</p>
                 <p>Full copyright is transferred to the client upon final payment. I retain the right to feature the completed work in my portfolio and promotional materials.</p>
               </div>
               <div className="space-y-2">
                 <p className="text-white">● COMMUNICATION</p>
                 <p>Expect clear, consistent updates—no ghosting, no confusion.</p>
               </div>
             </div>
             <div className="space-y-10">
               <div className="space-y-2">
                 <p className="text-white">● REVISIONS</p>
                 <p>Each project includes a defined number of revision rounds. Requests beyond the agreed scope may incur additional charges.</p>
               </div>
               <div className="space-y-2">
                 <p className="text-white">● TIMELINES</p>
                 <p>Project timelines begin once the deposit and all required assets are received.</p>
               </div>
               <div className="space-y-2">
                 <p className="text-white">● PROFESSIONAL BOUNDARIES</p>
                 <p>I value mutual respect, clarity, and professionalism.</p>
               </div>
           </div>
           </div>
           <div className="mt-16 text-center">
             <Link to="/brief"><Button className="px-24">Acknowledge & Start</Button></Link>
           </div>
        </section>
      </div>
    </PageTransition>
  );
};

const ContactPage = () => {
  const { socials } = useAppContext();
  return (
    <PageTransition>
      <div className="max-w-7xl mx-auto px-6 mb-40 flex flex-col items-center justify-center min-h-[70vh] text-center">
         <h1 className="text-6xl md:text-[11rem] font-black uppercase mb-16 tracking-tighter italic">SECURE <br /> <span className="text-[#FF7A00]">DOMINANCE.</span></h1>
         <a href={`mailto:${socials.email}`} className="text-xl md:text-5xl font-black uppercase hover:text-[#FF7A00] transition-all border-b-8 border-[#FF7A00] pb-4 tracking-tighter">{socials.email}</a>
      </div>
    </PageTransition>
  );
};

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAppContext();
  const navigate = useNavigate();
  const handleLogin = (e: React.FormEvent) => { e.preventDefault(); if (email === 'admin@muttaqilab.com' && password === 'admin123') { login(email); navigate('/admin'); } else { alert("Portal Denied."); } };
  return (
    <PageTransition>
      <div className="max-w-md mx-auto px-6 py-48">
        <h1 className="text-4xl font-black uppercase tracking-tighter italic mb-16 text-center">GATE <span className="text-[#FF7A00]">SECURITY</span></h1>
        <form onSubmit={handleLogin} className="space-y-8">
          <input type="email" placeholder="Identity" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-zinc-950 border border-white/5 p-5 outline-none focus:border-[#FF7A00] font-bold premium-radius" />
          <input type="password" placeholder="Sequence" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-zinc-950 border border-white/5 p-5 outline-none focus:border-[#FF7A00] font-bold premium-radius" />
          <Button type="submit" className="w-full py-6">Authorize</Button>
        </form>
      </div>
    </PageTransition>
  );
};

const AdminDashboard = () => {
  const { projects, setProjects, briefs, setBriefs, reviews, setReviews, socials, setSocials, logout, auth, resetToDefaults } = useAppContext();
  const [activeTab, setActiveTab] = useState<'projects' | 'briefs' | 'reviews' | 'settings' | 'data'>('projects');
  
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [projForm, setProjForm] = useState<Partial<Project>>({ title: '', category: '', description: '', images: [], isFeatured: false });
  const [selectedBrief, setSelectedBrief] = useState<Brief | null>(null);
  
  const [socialForm, setSocialForm] = useState<SocialLinks>(socials);

  if (!auth.isAuthenticated) return <Navigate to="/login" />;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      (Array.from(files) as File[]).forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => { setProjForm(prev => ({ ...prev, images: [...(prev.images || []), reader.result as string] })); };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleSaveProject = () => {
    if (isEditing) { setProjects(prev => prev.map(p => p.id === isEditing ? { ...p, ...projForm } as Project : p)); setIsEditing(null); }
    else { const newProj: Project = { ...projForm, id: Math.random().toString(36).substr(2, 9), dateCreated: Date.now() } as Project; setProjects(prev => [newProj, ...prev]); }
    setProjForm({ title: '', category: '', description: '', images: [], isFeatured: false });
    setShowProjectModal(false);
  };

  const approveReview = (id: string) => {
    setReviews(prev => prev.map(r => r.id === id ? { ...r, status: 'approved' } : r));
  };

  const deleteReview = (id: string) => {
    if(confirm("Erase this verdict manifest?")) { setReviews(prev => prev.filter(r => r.id !== id)); }
  };

  const saveSocials = (e: React.FormEvent) => {
    e.preventDefault();
    setSocials(socialForm);
    alert("Social Manifest Synchronized.");
  };

  const exportData = () => {
    const data = {
      projects,
      socials,
      reviews: reviews.filter(r => r.status === 'approved')
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `muttaqilab_manifest_${Date.now()}.json`;
    a.click();
  };

  const copyCode = () => {
    const code = `export const INITIAL_PROJECTS: Project[] = ${JSON.stringify(projects, null, 2)};`;
    navigator.clipboard.writeText(code);
    alert("Project Manifest Code copied to clipboard. Paste this into constants.tsx to make changes permanent.");
  };

  return (
    <PageTransition>
      <div className="max-w-7xl mx-auto px-6 mb-40 pt-16">
        <header className="flex flex-col md:flex-row justify-between items-center mb-12 border-b border-white/5 pb-12">
          <h1 className="text-5xl font-black uppercase italic tracking-tighter">LAB <span className="text-[#FF7A00]">CONSOLE</span></h1>
          <div className="flex space-x-2 mt-8 md:mt-0 overflow-x-auto pb-4 md:pb-0">
            {['projects', 'briefs', 'reviews', 'settings', 'data'].map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab as any)} className={`px-6 py-2 text-[9px] font-black uppercase tracking-widest border premium-radius transition-all ${activeTab === tab ? 'bg-[#FF7A00] border-[#FF7A00] text-white' : 'border-white/10 text-zinc-600 hover:text-white'}`}>
                {tab}
              </button>
            ))}
            <button onClick={logout} className="p-2 text-zinc-600 hover:text-red-500 transition-colors ml-4"><LogOut size={20} /></button>
          </div>
        </header>

        {/* Global Alert for Local Storage */}
        <div className="bg-[#FF7A00]/10 border border-[#FF7A00]/20 p-6 premium-radius mb-12 flex items-start space-x-4">
           <AlertTriangle className="text-[#FF7A00] shrink-0" size={24} />
           <div>
              <p className="text-[#FF7A00] font-black uppercase tracking-widest text-[10px] mb-1">LOCAL SYNCHRONIZATION ONLY</p>
              <p className="text-zinc-400 text-xs leading-relaxed">Changes made here are saved to your browser cache. To make these updates visible to the public, navigate to the <button onClick={() => setActiveTab('data')} className="text-white underline font-bold">DATA</button> tab and export your manifest to the laboratory source code.</p>
           </div>
        </div>

        {activeTab === 'projects' && (
          <div>
            <div className="flex justify-between items-center mb-12">
               <h2 className="text-2xl font-black uppercase tracking-widest italic">Manifest Assets</h2>
               <Button onClick={() => { setProjForm({title:'',category:'',description:'',images:[],isFeatured:false}); setIsEditing(null); setShowProjectModal(true); }} variant="outline">Initialise New</Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
               {projects.map(p => (
                 <div key={p.id} className="bg-zinc-950 border border-white/5 premium-radius p-6 group">
                    <img src={p.images[0]} className="w-full aspect-video object-cover mb-6 opacity-40 group-hover:opacity-100 transition-opacity premium-radius" />
                    <div className="flex justify-between items-start">
                       <div><h3 className="font-black uppercase text-lg mb-1">{p.title}</h3><span className="text-[8px] font-black uppercase text-[#FF7A00]">{p.category}</span></div>
                       <div className="flex space-x-2">
                          <button onClick={() => { setProjForm(p); setIsEditing(p.id); setShowProjectModal(true); }} className="p-2 bg-white text-black premium-radius"><Edit3 size={14} /></button>
                          <button onClick={() => setProjects(prev => prev.filter(x => x.id !== p.id))} className="p-2 bg-red-900/20 text-red-500 premium-radius"><Trash2 size={14} /></button>
                       </div>
                    </div>
                 </div>
               ))}
            </div>
          </div>
        )}

        {activeTab === 'briefs' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-black uppercase tracking-widest italic mb-10">Brief Manifests</h2>
            {briefs.map(b => (
              <div key={b.id} className="p-8 bg-zinc-950 border border-white/5 premium-radius flex justify-between items-center hover:border-[#FF7A00]/40 transition-all">
                <div><h4 className="font-black uppercase text-xl mb-1">{b.companyName}</h4><p className="text-[8px] font-black text-zinc-600 uppercase tracking-widest">{b.clientName} &bull; {b.email}</p></div>
                <Button onClick={() => setSelectedBrief(b)} variant="ghost" className="border border-white/5">Inspect</Button>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="space-y-10">
            <h2 className="text-2xl font-black uppercase tracking-widest italic mb-10">Review Protocol</h2>
            
            <div className="space-y-12">
               <div>
                  <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600 mb-6 border-b border-white/5 pb-2">Pending Vetting</h3>
                  <div className="space-y-4">
                    {reviews.filter(r => r.status === 'pending').length === 0 ? (
                      <p className="text-zinc-700 text-xs italic">No pending verdicts in queue.</p>
                    ) : (
                      reviews.filter(r => r.status === 'pending').map(r => (
                        <div key={r.id} className="p-8 bg-zinc-950 border border-white/5 premium-radius flex flex-col md:flex-row justify-between md:items-center space-y-4 md:space-y-0">
                          <div className="max-w-xl">
                            <div className="flex items-center space-x-4 mb-2">
                               <h4 className="font-black uppercase text-white">{r.clientName}</h4>
                               <StarRating rating={r.rating} />
                            </div>
                            <p className="text-zinc-500 text-xs italic">"{r.content}"</p>
                          </div>
                          <div className="flex space-x-3">
                            <button onClick={() => approveReview(r.id)} className="px-6 py-2 bg-[#FF7A00] text-white text-[9px] font-black uppercase premium-radius hover:bg-white hover:text-black transition-all">Authorize broadcast</button>
                            <button onClick={() => deleteReview(r.id)} className="p-2 text-red-900 hover:text-red-500 transition-colors"><X size={20} /></button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
               </div>

               <div>
                  <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-[#FF7A00] mb-6 border-b border-white/5 pb-2">Live Broadcasts</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {reviews.filter(r => r.status === 'approved').map(r => (
                        <div key={r.id} className="p-6 bg-zinc-900/50 border border-white/5 premium-radius flex justify-between items-center">
                          <div>
                            <p className="font-black uppercase text-xs text-white">{r.clientName}</p>
                            <StarRating rating={r.rating} />
                          </div>
                          <button onClick={() => deleteReview(r.id)} className="text-red-900 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                        </div>
                    ))}
                  </div>
               </div>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="max-w-4xl">
             <h2 className="text-2xl font-black uppercase tracking-widest italic mb-10">Lab Configuration</h2>
             <form onSubmit={saveSocials} className="space-y-10 bg-zinc-950 p-12 premium-radius border border-white/5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div className="space-y-2">
                      <label className="text-[9px] font-black uppercase tracking-[0.4em] text-zinc-600">Primary Identity (Gmail)</label>
                      <input value={socialForm.email} onChange={e => setSocialForm({...socialForm, email: e.target.value})} className="w-full bg-zinc-900 border border-white/5 p-4 outline-none focus:border-[#FF7A00] font-bold premium-radius" />
                   </div>
                   <div className="space-y-2">
                      <label className="text-[9px] font-black uppercase tracking-[0.4em] text-zinc-600">WhatsApp Data Link</label>
                      <input value={socialForm.whatsapp} onChange={e => setSocialForm({...socialForm, whatsapp: e.target.value})} placeholder="https://wa.me/..." className="w-full bg-zinc-900 border border-white/5 p-4 outline-none focus:border-[#FF7A00] font-bold premium-radius" />
                   </div>
                   <div className="space-y-2">
                      <label className="text-[9px] font-black uppercase tracking-[0.4em] text-zinc-600">Instagram</label>
                      <input value={socialForm.instagram} onChange={e => setSocialForm({...socialForm, instagram: e.target.value})} className="w-full bg-zinc-900 border border-white/5 p-4 outline-none focus:border-[#FF7A00] font-bold premium-radius" />
                   </div>
                   <div className="space-y-2">
                      <label className="text-[9px] font-black uppercase tracking-[0.4em] text-zinc-600">Facebook</label>
                      <input value={socialForm.facebook} onChange={e => setSocialForm({...socialForm, facebook: e.target.value})} className="w-full bg-zinc-900 border border-white/5 p-4 outline-none focus:border-[#FF7A00] font-bold premium-radius" />
                   </div>
                   <div className="space-y-2">
                      <label className="text-[9px] font-black uppercase tracking-[0.4em] text-zinc-600">Twitter (X)</label>
                      <input value={socialForm.twitter} onChange={e => setSocialForm({...socialForm, twitter: e.target.value})} className="w-full bg-zinc-900 border border-white/5 p-4 outline-none focus:border-[#FF7A00] font-bold premium-radius" />
                   </div>
                   <div className="space-y-2">
                      <label className="text-[9px] font-black uppercase tracking-[0.4em] text-zinc-600">Pinterest</label>
                      <input value={socialForm.pinterest} onChange={e => setSocialForm({...socialForm, pinterest: e.target.value})} className="w-full bg-zinc-900 border border-white/5 p-4 outline-none focus:border-[#FF7A00] font-bold premium-radius" />
                   </div>
                   <div className="space-y-2">
                      <label className="text-[9px] font-black uppercase tracking-[0.4em] text-zinc-600">Behance Portfolio</label>
                      <input value={socialForm.behance} onChange={e => setSocialForm({...socialForm, behance: e.target.value})} className="w-full bg-zinc-900 border border-white/5 p-4 outline-none focus:border-[#FF7A00] font-bold premium-radius" />
                   </div>
                   <div className="space-y-2">
                      <label className="text-[9px] font-black uppercase tracking-[0.4em] text-zinc-600">LinkedIn Profile</label>
                      <input value={socialForm.linkedin} onChange={e => setSocialForm({...socialForm, linkedin: e.target.value})} className="w-full bg-zinc-900 border border-white/5 p-4 outline-none focus:border-[#FF7A00] font-bold premium-radius" />
                   </div>
                </div>
                <Button type="submit" className="w-full py-5">Sync Laboratory Connections</Button>
             </form>
          </div>
        )}

        {activeTab === 'data' && (
          <div className="max-w-4xl">
             <h2 className="text-2xl font-black uppercase tracking-widest italic mb-10">Data Management</h2>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-zinc-950 p-10 border border-white/5 premium-radius">
                   <Download className="text-[#FF7A00] mb-6" size={32} />
                   <h3 className="text-xl font-black uppercase mb-4">Export Manifest</h3>
                   <p className="text-zinc-500 text-xs leading-relaxed mb-8 font-bold uppercase tracking-widest">Download your current configuration as a JSON file for backup or restoration.</p>
                   <Button onClick={exportData} variant="outline" className="w-full flex items-center justify-center">
                      <Download size={14} className="mr-2" /> Download JSON
                   </Button>
                </div>
                <div className="bg-zinc-950 p-10 border border-white/5 premium-radius">
                   <Copy className="text-[#FF7A00] mb-6" size={32} />
                   <h3 className="text-xl font-black uppercase mb-4">Project Source Code</h3>
                   <p className="text-zinc-500 text-xs leading-relaxed mb-8 font-bold uppercase tracking-widest">Copy the formatted JavaScript code for your projects to update constants.tsx permanently.</p>
                   <Button onClick={copyCode} variant="outline" className="w-full flex items-center justify-center">
                      <Copy size={14} className="mr-2" /> Copy Code
                   </Button>
                </div>
                <div className="bg-zinc-950 p-10 border border-white/5 premium-radius md:col-span-2">
                   <AlertTriangle className="text-red-900 mb-6" size={32} />
                   <h3 className="text-xl font-black uppercase mb-4 text-red-900">Laboratory Reset</h3>
                   <p className="text-zinc-500 text-xs leading-relaxed mb-8 font-bold uppercase tracking-widest">Wipe all local changes and restore the laboratory to its factory hardcoded state.</p>
                   <Button onClick={() => { if(confirm("ABORT LOCAL DATA? This will erase all your unsaved work.")) resetToDefaults(); }} className="bg-red-900/20 text-red-500 border border-red-900/50 hover:bg-red-900 hover:text-white">
                      Initialize Factory Reset
                   </Button>
                </div>
             </div>
          </div>
        )}

        <AnimatePresence>
          {showProjectModal && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/95 z-[200] flex items-center justify-center p-6 backdrop-blur-xl">
              <div className="bg-[#0B0B0B] border border-white/10 w-full max-w-2xl premium-radius p-10 overflow-y-auto max-h-[90vh]">
                 <div className="flex justify-between items-center mb-10"><h2 className="text-3xl font-black uppercase italic tracking-tighter">Asset Editor</h2><button onClick={() => setShowProjectModal(false)}><X size={24} /></button></div>
                 <div className="space-y-6">
                   <input placeholder="Title" value={projForm.title} onChange={e => setProjForm({...projForm, title: e.target.value})} className="w-full bg-zinc-900 border border-white/5 p-4 outline-none focus:border-[#FF7A00] font-bold premium-radius" />
                   <input placeholder="Category" value={projForm.category} onChange={e => setProjForm({...projForm, category: e.target.value})} className="w-full bg-zinc-900 border border-white/5 p-4 outline-none focus:border-[#FF7A00] font-bold premium-radius" />
                   <textarea rows={4} placeholder="Narrative" value={projForm.description} onChange={e => setProjForm({...projForm, description: e.target.value})} className="w-full bg-zinc-900 border border-white/5 p-4 outline-none focus:border-[#FF7A00] font-bold premium-radius resize-none" />
                   <div className="space-y-4">
                      <label className="text-[9px] font-black uppercase tracking-widest text-zinc-600">Assets</label>
                      <div className="grid grid-cols-4 gap-4">
                        {projForm.images?.map((img, idx) => (
                           <div key={idx} className="aspect-square bg-zinc-800 relative premium-radius overflow-hidden border border-white/10">
                              <img src={img} className="w-full h-full object-cover" />
                              <button onClick={() => setProjForm({...projForm, images: projForm.images?.filter((_, i) => i !== idx)})} className="absolute top-1 right-1 bg-red-600 rounded-full p-1 text-white"><X size={10} /></button>
                           </div>
                        ))}
                        <label className="aspect-square bg-zinc-900 border-2 border-dashed border-white/5 flex flex-col items-center justify-center cursor-pointer hover:border-[#FF7A00] premium-radius">
                           <Plus size={24} className="text-zinc-600" />
                           <input type="file" multiple className="hidden" onChange={handleImageUpload} />
                        </label>
                      </div>
                   </div>
                   <div className="flex items-center space-x-3 p-4 bg-zinc-900 premium-radius border border-white/5">
                      <input type="checkbox" id="featuredToggle" checked={projForm.isFeatured} onChange={e => setProjForm({...projForm, isFeatured: e.target.checked})} className="accent-[#FF7A00]" />
                      <label htmlFor="featuredToggle" className="text-[9px] font-black uppercase tracking-widest text-zinc-500">Promote to Featured Selection</label>
                   </div>
                   <Button onClick={handleSaveProject} className="w-full">Commit Changes</Button>
                 </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {selectedBrief && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/95 z-[200] flex items-center justify-center p-6 backdrop-blur-xl">
              <div className="bg-[#0B0B0B] border border-white/10 w-full max-w-3xl premium-radius p-12 overflow-y-auto max-h-[90vh]">
                 <div className="flex justify-between items-start mb-12">
                   <div>
                      <span className="text-[9px] font-black uppercase tracking-[0.4em] text-[#FF7A00] mb-2 block">Project Evaluation</span>
                      <h2 className="text-4xl font-black uppercase italic tracking-tighter">{selectedBrief.companyName}</h2>
                   </div>
                   <button onClick={() => setSelectedBrief(null)}><X size={32} className="text-zinc-600 hover:text-white transition-colors" /></button>
                 </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div className="space-y-8">
                       <section>
                          <h4 className="text-[9px] font-black uppercase tracking-widest text-zinc-600 mb-4 border-b border-white/5 pb-2">The Mission</h4>
                          <p className="text-zinc-300 font-light leading-relaxed whitespace-pre-wrap">{selectedBrief.projectGoals}</p>
                       </section>
                    </div>
                    <div className="space-y-8">
                       <section className="bg-zinc-900 p-6 premium-radius border border-white/5">
                          <h4 className="text-[9px] font-black uppercase tracking-widest text-zinc-600 mb-6">Manifest Meta</h4>
                          <div className="space-y-4">
                             <div>
                                <p className="text-[8px] font-black uppercase text-zinc-700">Stakeholder</p>
                                <p className="font-bold text-white">{selectedBrief.clientName}</p>
                             </div>
                             <div>
                                <p className="text-[8px] font-black uppercase text-zinc-700">Budget Range</p>
                                <p className="font-bold text-white">{selectedBrief.budget}</p>
                             </div>
                             <div>
                                <p className="text-[8px] font-black uppercase text-zinc-700">Timeline Window</p>
                                <p className="font-bold text-white">{selectedBrief.timeline}</p>
                             </div>
                          </div>
                       </section>
                       <div className="flex flex-col space-y-4">
                          <a href={`mailto:${selectedBrief.email}`} className="w-full">
                            <Button className="w-full py-4 text-[10px] flex items-center justify-center">
                               <Mail size={16} className="mr-2" /> Reply via Email
                            </Button>
                          </a>
                          <button onClick={() => { if(confirm("Discard this brief manifest?")) { setBriefs(prev => prev.filter(x => x.id !== selectedBrief.id)); setSelectedBrief(null); }}} className="text-[10px] font-black uppercase tracking-widest text-red-900 hover:text-red-500 transition-colors">Erase Submission</button>
                       </div>
                    </div>
                 </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PageTransition>
  );
};

const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [projects, setProjects] = useState<Project[]>(() => {
    const saved = localStorage.getItem('muttaqi_projects');
    return saved ? (JSON.parse(saved) as Project[]) : INITIAL_PROJECTS;
  });
  const [briefs, setBriefs] = useState<Brief[]>(() => {
    const saved = localStorage.getItem('muttaqi_briefs');
    return saved ? (JSON.parse(saved) as Brief[]) : [];
  });
  const [reviews, setReviews] = useState<Review[]>(() => {
    const saved = localStorage.getItem('muttaqi_reviews');
    return saved ? (JSON.parse(saved) as Review[]) : [
      { id: 'initial-1', clientName: 'Aura Skincare', content: 'MuttaqiLab deconstructed our brand and rebuilt it into a visual powerhouse. Incredible attention to detail.', rating: 5, date: Date.now() - 5000000, status: 'approved' }
    ];
  });
  const [socials, setSocials] = useState<SocialLinks>(() => {
    const saved = localStorage.getItem('muttaqi_socials');
    return saved ? (JSON.parse(saved) as SocialLinks) : {
      instagram: '',
      facebook: '',
      whatsapp: 'https://wa.me/+2348035134934',
      twitter: '',
      pinterest: '',
      behance: '',
      linkedin: '',
      email: 'official.muttaqilab@gmail.com'
    };
  });
  const [auth, setAuth] = useState<AuthState>(() => {
    const saved = localStorage.getItem('muttaqi_auth');
    return saved ? (JSON.parse(saved) as AuthState) : { isAuthenticated: false, user: null };
  });

  useEffect(() => { localStorage.setItem('muttaqi_projects', JSON.stringify(projects)); }, [projects]);
  useEffect(() => { localStorage.setItem('muttaqi_briefs', JSON.stringify(briefs)); }, [briefs]);
  useEffect(() => { localStorage.setItem('muttaqi_reviews', JSON.stringify(reviews)); }, [reviews]);
  useEffect(() => { localStorage.setItem('muttaqi_socials', JSON.stringify(socials)); }, [socials]);
  useEffect(() => { localStorage.setItem('muttaqi_auth', JSON.stringify(auth)); }, [auth]);

  const login = (email: string) => setAuth({ isAuthenticated: true, user: { email } });
  const logout = () => setAuth({ isAuthenticated: false, user: null });
  
  const resetToDefaults = () => {
    setProjects(INITIAL_PROJECTS);
    setReviews([]);
    setBriefs([]);
    localStorage.clear();
    window.location.reload();
  };

  return (
    <AppContext.Provider value={{ projects, setProjects, briefs, setBriefs, reviews, setReviews, socials, setSocials, auth, login, logout, resetToDefaults }}>
      {children}
    </AppContext.Provider>
  );
};

const App = () => {
  return (
    <AppProvider>
      <HashRouter>
        <div className="bg-[#0B0B0B] text-white selection:bg-[#FF7A00] selection:text-white min-h-screen">
          <Navbar />
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/projects" element={<ProjectsPage />} />
              <Route path="/project/:id" element={<ProjectDetailPage />} />
              <Route path="/work-with-me" element={<WorkWithMePage />} />
              <Route path="/brief" element={<ProjectBriefPage />} />
              <Route path="/reviews" element={<ReviewsPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </AnimatePresence>
          <Footer />
        </div>
      </HashRouter>
    </AppProvider>
  );
};

const ProjectsPage = () => {
  const { projects } = useAppContext();
  return (
    <PageTransition>
      <div className="max-w-7xl mx-auto px-6 mb-40 pt-20">
        <h1 className="text-7xl md:text-[12rem] font-black uppercase mb-32 tracking-tighter italic leading-none">MASTER <br /> <span className="text-[#FF7A00]">WORKS.</span></h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {projects.map(p => (
            <Link key={p.id} to={`/project/${p.id}`} className="group relative overflow-hidden bg-zinc-950 premium-radius border border-white/5">
              <img src={p.images[0]} className="w-full aspect-[4/5] object-cover grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700" />
              <div className="p-8"><span className="text-[#FF7A00] text-[8px] font-black uppercase tracking-widest">{p.category}</span><h3 className="text-2xl font-black uppercase mt-2">{p.title}</h3></div>
            </Link>
          ))}
        </div>
      </div>
    </PageTransition>
  );
};

const ProjectDetailPage = () => {
  const { id } = useParams();
  const { projects } = useAppContext();
  const project = projects.find(p => p.id === id);
  if (!project) return <Navigate to="/" />;
  return (
    <PageTransition>
      <div className="max-w-7xl mx-auto px-6 mb-40 pt-16">
        <Link to="/projects" className="flex items-center space-x-4 text-zinc-600 hover:text-white mb-20 group">
           <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-all" /><span className="text-[10px] font-black uppercase tracking-widest">Back to Archive</span>
        </Link>
        <header className="mb-24">
          <p className="text-[#FF7A00] font-black uppercase tracking-widest text-xs mb-6">{project.category}</p>
          <h1 className="text-6xl md:text-9xl font-black uppercase tracking-tighter mb-12">{project.title}</h1>
          <p className="text-xl md:text-3xl text-zinc-400 font-light max-w-4xl leading-relaxed">{project.description}</p>
        </header>
        <div className="space-y-16">{project.images.map((img, i) => (<img key={i} src={img} className="w-full h-auto premium-radius border border-white/5 grayscale hover:grayscale-0 transition-all duration-1000" />))}</div>
      </div>
    </PageTransition>
  );
};

const SocialLinksComp = ({ className = "flex flex-wrap gap-8 justify-center md:justify-start" }) => {
  const { socials } = useAppContext();
  
  const links = [
    { icon: Instagram, url: socials.instagram, name: 'Instagram' },
    { icon: Facebook, url: socials.facebook, name: 'Facebook' },
    { icon: MessageCircle, url: socials.whatsapp, name: 'WhatsApp' },
    { icon: Twitter, url: socials.twitter, name: 'Twitter' },
    { icon: Share2, url: socials.pinterest, name: 'Pinterest' },
    { icon: Globe, url: socials.behance, name: 'Behance' },
    { icon: Linkedin, url: socials.linkedin, name: 'LinkedIn' },
  ];

  return (
    <div className={className}>
      {links.map((link, i) => link.url ? (
        <a 
          key={i} 
          href={link.url} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-zinc-600 hover:text-[#FF7A00] transition-all flex items-center group"
          title={link.name}
        >
          <link.icon size={20} />
          <span className="ml-2 text-[8px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity hidden sm:inline">{link.name}</span>
        </a>
      ) : null)}
    </div>
  );
};

const Footer = () => {
  const { socials } = useAppContext();
  return (
    <footer className="bg-[#0B0B0B] border-t border-white/5 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-6 text-center md:text-left">
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-12">
          <h2 className="text-4xl font-black uppercase tracking-tighter mb-8 md:mb-0">LET'S SHAPE <span className="text-[#FF7A00] italic">IDENTITY.</span></h2>
          <SocialLinksComp />
        </div>
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 pt-8 border-t border-white/5">
          <p className="text-[9px] text-zinc-800 uppercase tracking-[0.5em] font-black">
            &copy; 2024 {BRAND_NAME.toUpperCase()} LABORATORY.
          </p>
          <Link 
            to="/login" 
            className="text-[9px] text-zinc-700 hover:text-[#FF7A00] uppercase tracking-[0.3em] font-black flex items-center transition-colors group"
          >
            <Lock size={10} className="mr-2 opacity-50 group-hover:opacity-100" />
            SECURITY PORTAL
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default App;
