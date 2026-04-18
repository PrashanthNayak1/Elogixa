import React from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';

const Services = () => {
    const services = [
        {
            image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80",
            title: "Fully Managed IT Services",
            description: "End-to-end management of your IT operations, ensuring reliability, security, and peak performance."
        },
        {
            image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80",
            title: "IT Infrastructure Solutions",
            description: "Robust framework design for networks, servers, and storage to engage your digital transformation."
        },
        {
            image: "/Data_centers.webp",
            title: "Data Center Solutions",
            description: "Scalable, secure, and efficient data center management and design solutions."
        },
        {
            image: "https://images.unsplash.com/photo-1562564055-71e051d33c19?auto=format&fit=crop&w=800&q=80",
            title: "Managed Printing Services",
            description: "Cost-effective and efficient printing solutions to streamline your document workflow."
        },
        {
            image: "https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?auto=format&fit=crop&w=800&q=80",
            title: "Software Solutions",
            description: "Custom software development and integration to meet your unique business challenges."
        },
        {
            image: "https://images.unsplash.com/photo-1597852074816-d933c7d2b988?auto=format&fit=crop&w=800&q=80",
            title: "Desktop & Laptop Repairs",
            description: "Expert repair and maintenance services for your hardware assets including UPS systems."
        }
    ];

    return (
        <div className="pt-24 bg-[#f7f8f2] min-h-screen pb-16 sm:pb-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-12 sm:mb-16"
                >
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-800 mb-4">Our Services</h1>
                    <p className="text-slate-600 max-w-2xl mx-auto text-base sm:text-lg leading-relaxed">
                        We offer a comprehensive range of IT services and solutions designed to help your business thrive in the digital age. Our expertise spans infrastructure, managed services, and custom software.
                    </p>
                </motion.div>

                <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-8">
                    {services.map((service, index) => (
                        <ServiceCard
                            key={index}
                            index={index}
                            image={service.image}
                            title={service.title}
                            description={service.description}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

const ServiceCard = ({ image, title, description, index }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.1, duration: 0.5 }}
        whileHover={{ y: -10 }}
        className="group overflow-hidden bg-white rounded-2xl border border-[#ece7d8] hover:border-[#e5cf77] transition-all duration-300 shadow-sm hover:shadow-xl"
    >
        <div className="h-48 sm:h-52 overflow-hidden">
            <img
                src={image}
                alt={title}
                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
            />
        </div>
        <div className="p-6">
            <h3 className="text-xl font-bold mb-3 text-slate-800 group-hover:text-accent transition-colors">{title}</h3>
            <p className="text-slate-600 leading-relaxed">{description}</p>
        </div>
    </motion.div>
);

export default Services;
