import React, { useState, useEffect } from 'react';
import axios from 'axios';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { MapPin, DollarSign, Briefcase } from 'lucide-react';
import toast from 'react-hot-toast';

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || '/api';

const JobBoard = () => {
    const [jobs, setJobs] = useState([]);
    const [selectedJob, setSelectedJob] = useState(null);
    const [expandedJobs, setExpandedJobs] = useState({});
    const [applicationForm, setApplicationForm] = useState({
        name: '', email: '', phone: '', experienceYears: '0', resume: null
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const res = await axios.get(`${API_BASE_URL}/jobs`);
                setJobs(Array.isArray(res.data) ? res.data : []);
            } catch (err) {
                console.error(err);
            }
        };
        fetchJobs();
    }, []);

    const handleApply = (job) => {
        setSelectedJob(job);
    };

    const toggleJobDescription = (jobId) => {
        setExpandedJobs(prev => ({ ...prev, [jobId]: !prev[jobId] }));
    };

    const handleInputChange = (e) => {
        setApplicationForm({ ...applicationForm, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        setApplicationForm({ ...applicationForm, resume: e.target.files[0] });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData();
        formData.append('jobId', selectedJob._id);
        formData.append('name', applicationForm.name);
        formData.append('email', applicationForm.email);
        formData.append('phone', applicationForm.phone);
        formData.append('experienceYears', applicationForm.experienceYears);
        formData.append('resume', applicationForm.resume);

        try {
            await axios.post(`${API_BASE_URL}/applications`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            toast.success('Application submitted successfully!');
            setSelectedJob(null);
            setApplicationForm({ name: '', email: '', phone: '', experienceYears: '0', resume: null });
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to submit application. Please try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-[#fffdf7] min-h-screen">
            <div className="pt-24 pb-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-4">Current Openings</h2>
                    <p className="text-slate-600 text-sm sm:text-base">Explore new opportunities to grow your career with ELOGIXA.</p>
                </div>

                <div className="grid gap-6">
                    {jobs.length > 0 ? (
                        jobs.map((job) => (
                            <motion.div
                                key={job._id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="card flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white border-[#ece7d8] p-5 sm:p-6 rounded-xl hover:shadow-lg transition-all"
                            >
                                <div className="w-full md:flex-1">
                                    <h3 className="text-xl font-bold text-slate-800">{job.title}</h3>
                                    <div className="flex flex-wrap gap-4 mt-2 text-sm text-slate-600">
                                        <span className="flex items-center gap-1"><MapPin size={16} /> {job.location}</span>
                                        <span className="flex items-center gap-1"><DollarSign size={16} /> {job.salaryRange}</span>
                                        <span className="flex items-center gap-1">
                                            <Briefcase size={16} /> {job.openings > 0 ? `${job.openings} Openings` : 'No Openings'}
                                        </span>
                                    </div>
                                    <div className="mt-4 flex flex-wrap gap-2">
                                        {job.skills.map((skill, index) => (
                                            <span key={index} className="bg-[#f7f5ec] text-slate-700 px-3 py-1.5 rounded-lg text-xs font-medium border border-[#e7e0c6]">
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                    {job.description && (
                                        <div className="mt-4 bg-[#fffaf0] p-4 rounded-xl border border-[#efe4bf]">
                                            <h4 className="text-sm font-semibold text-slate-800 mb-2">Job Description</h4>
                                            <div className={`text-sm text-slate-600 whitespace-pre-line ${expandedJobs[job._id] ? '' : 'line-clamp-3'}`}>
                                                {job.description}
                                            </div>
                                            {job.description.length > 200 && (
                                                <button
                                                    onClick={() => toggleJobDescription(job._id)}
                                                    className="text-accent text-sm mt-3 font-medium hover:underline focus:outline-none flex items-center gap-1"
                                                >
                                                    {expandedJobs[job._id] ? 'Read Less' : 'Read More...'}
                                                </button>
                                            )}
                                        </div>
                                    )}
                                </div>
                                <div className="w-full md:w-auto mt-2 md:mt-0 flex shrink-0">
                                    <button
                                        onClick={() => handleApply(job)}
                                        className="btn-primary w-full md:w-auto whitespace-nowrap px-8 py-3 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all"
                                        disabled={job.openings === 0}
                                    >
                                        {job.openings > 0 ? 'Apply Now' : 'Closed'}
                                    </button>
                                </div>
                            </motion.div>
                        ))
                    ) : (
                        <div className="text-center py-20 card bg-white border-[#ece7d8]">
                            <Briefcase size={48} className="mx-auto text-slate-400 mb-4" />
                            <h3 className="text-xl font-bold text-slate-800">No Current Openings</h3>
                            <p className="text-slate-600">Please check back later or follow us for updates.</p>
                        </div>
                    )}
                </div>
            </div>

            {selectedJob && (
                <div className="fixed inset-0 bg-slate-900/25 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="bg-white rounded-xl p-5 sm:p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-[#ece7d8]"
                    >
                        <h3 className="text-xl sm:text-2xl font-bold mb-1 text-slate-800">Apply for {selectedJob.title}</h3>
                        <p className="text-sm text-slate-500 mb-6">Submit your details below.</p>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1 text-slate-700">Full Name</label>
                                <input type="text" name="name" required className="input-field" onChange={handleInputChange} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1 text-slate-700">Email</label>
                                <input type="email" name="email" required className="input-field" onChange={handleInputChange} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1 text-slate-700">Phone</label>
                                <input type="tel" name="phone" required className="input-field" onChange={handleInputChange} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1 text-slate-700">Years of Experience</label>
                                <input
                                    type="text"
                                    name="experienceYears"
                                    required
                                    className="input-field"
                                    inputMode="numeric"
                                    pattern="^[0-9]+$"
                                    value={applicationForm.experienceYears}
                                    onChange={handleInputChange}
                                />
                                <p className="mt-1 text-xs text-slate-500">If you are a fresher, enter `0`.</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1 text-slate-700">Resume (PDF/DOC)</label>
                                <input type="file" name="resume" required className="input-field py-2" onChange={handleFileChange} />
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4 mt-6">
                                <button type="button" onClick={() => setSelectedJob(null)} className="btn-outline flex-1" disabled={loading}>Cancel</button>
                                <button type="submit" className="btn-primary flex-1 flex items-center justify-center gap-2" disabled={loading}>
                                    {loading ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                            Submitting...
                                        </>
                                    ) : 'Submit Application'}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default JobBoard;
