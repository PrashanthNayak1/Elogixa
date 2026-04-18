import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Linkedin, Twitter, Facebook } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-white border-t border-[#ece7d8] pt-16 pb-8 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-8 mb-12">
                    <div className="space-y-4">
                        <div className="flex items-center">
                            <img src="/elogixa-logo.png" alt="Elogixa" className="h-12 w-auto object-contain" />
                        </div>
                        <p className="text-slate-600 text-sm">
                            Empowering businesses with practical IT infrastructure and security solutions.
                        </p>
                    </div>

                    <div>
                        <h4 className="font-bold mb-4 text-slate-800">Quick Links</h4>
                        <ul className="space-y-2 text-sm text-slate-600">
                            <li><Link onClick={() => scrollTo(0, 0)} to="/" className="hover:text-accent transition-colors">Home</Link></li>
                            <li><Link onClick={() => scrollTo(0, 0)} to="/jobs" className="hover:text-accent transition-colors">Careers</Link></li>
                            <li><Link onClick={() => scrollTo(0, 0)} to="/services" className="hover:text-accent transition-colors">Our Services</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold mb-4 text-slate-800">Services</h4>
                        <ul className="space-y-2 text-sm text-slate-600">
                            <li>IT Infrastructure</li>
                            <li>Cloud Services</li>
                            <li>Cyber Security</li>
                            <li>Software Development</li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold mb-4 text-slate-800">Contact Us</h4>
                        <ul className="space-y-2 text-sm text-slate-600">
                            <li className="flex items-center gap-2 break-all"><Mail size={16} /> contact@elogixa.co.in</li>
                            <li className="flex items-center gap-2"><Phone size={16} /> +91 123 456 7890</li>
                            <li className="flex items-center gap-2"><MapPin size={16} /> Bangalore, India</li>
                        </ul>
                        <div className="flex gap-4 mt-4 text-slate-500">
                            <a href="#" className="hover:text-accent transition-colors"><Linkedin size={20} /></a>
                            <a href="#" className="hover:text-accent transition-colors"><Twitter size={20} /></a>
                            <a href="#" className="hover:text-accent transition-colors"><Facebook size={20} /></a>
                        </div>
                    </div>
                </div>

                <div className="border-t border-[#ece7d8] pt-8 text-center text-sm text-slate-500">
                    &copy; {new Date().getFullYear()} Elogixa Technology India Pvt Ltd. All rights reserved.
                </div>
            </div>
        </footer>
    );
};

export default Footer;
