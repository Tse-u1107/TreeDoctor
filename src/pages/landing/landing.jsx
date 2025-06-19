import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faSeedling, 
    faChartLine, 
    faMagnifyingGlass,
    faUsers,
    faLeaf,
    faGraduationCap,
    faMapMarkerAlt,
    faCamera,
    faCalendarAlt,
    faHeart,
    faArrowRight,
    faCheckCircle
} from '@fortawesome/free-solid-svg-icons';
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import { motion } from 'framer-motion';

const TreeProjectLanding = () => {
    const [activeFeature, setActiveFeature] = useState(0);

    const features = [
        {
            icon: faChartLine,
            title: "Track Growth Data",
            description: "Monitor tree height, diameter, and health with precise measurements.",
            details: "Students collect baseline data at planting and track growth over time with regular monitoring intervals."
        },
        {
            icon: faMagnifyingGlass,
            title: "Scientific Monitoring",
            description: "Teach students proper data collection techniques and environmental observation skills.",
            details: "Learn to assess tree health, identify species, and understand survival rates through hands-on experience."
        },
        {
            icon: faUsers,
            title: "Community Engagement",
            description: "Connect students with their local community through collaborative environmental projects.",
            details: "Partner with local organizations, involve parents, and make lasting impacts on school grounds."
        },
        {
            icon: faGraduationCap,
            title: "Educational Integration",
            description: "Seamlessly integrate with science, social studies, and environmental curriculum.",
            details: "Pre-planting research, hands-on learning experiences, and data analysis projects."
        }
    ];

    const benefits = [
        "Environmental awareness and conservation understanding",
        "Hands-on experiential learning reinforcing classroom concepts",
        "Sense of ownership and environmental responsibility",
        "Teamwork and collaboration skills development",
        "Physical outdoor activity and community connection",
        "Long-term environmental impact and stewardship"
    ];

    const handleGetStarted = () => {
        window.location.href = '/auth';
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-green-100">
            {/* Navigation */}
            <nav className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <FontAwesomeIcon 
                                icon={faSeedling} 
                                className="text-2xl text-green-600 mr-3" 
                            />
                            <span className="text-xl font-bold text-green-800">TreeDoctor</span>
                            <span className="ml-2 text-sm text-green-600 font-medium">For Educators</span>
                        </div>
                        <div className="flex items-center">
                            <button 
                                onClick={handleGetStarted}
                                className="bg-green-600 text-white font-semibold py-2 px-6 rounded-full 
                                         shadow-lg hover:shadow-xl transition-all transform hover:scale-105
                                         hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                            >
                                Start Planning
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative py-20 px-4">
                <div className="max-w-6xl mx-auto text-center">
                    <motion.div 
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="mb-8"
                    >
                        <div className="flex items-center justify-center gap-4 mb-6">
                            <FontAwesomeIcon 
                                icon={faSeedling} 
                                className="text-5xl md:text-6xl text-green-600" 
                            />
                            <h1 className="text-4xl md:text-6xl font-bold text-green-800">
                                TreeDoctor
                            </h1>
                        </div>
                        <p className="text-xl md:text-2xl text-green-700 max-w-4xl mx-auto leading-relaxed">
                            Transform tree planting into a comprehensive educational experience for middle school students
                        </p>
                    </motion.div>

                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12"
                    >
                        <div className="bg-white/70 backdrop-blur p-6 rounded-xl shadow-md">
                            <FontAwesomeIcon icon={faUsers} className="text-3xl text-green-600 mb-3" />
                            <h3 className="font-semibold text-green-800">Student Engagement</h3>
                            <p className="text-green-700 text-sm">Hands-on environmental learning</p>
                        </div>
                        <div className="bg-white/70 backdrop-blur p-6 rounded-xl shadow-md">
                            <FontAwesomeIcon icon={faChartLine} className="text-3xl text-green-600 mb-3" />
                            <h3 className="font-semibold text-green-800">Scientific Monitoring</h3>
                            <p className="text-green-700 text-sm">Data collection & analysis</p>
                        </div>
                        <div className="bg-white/70 backdrop-blur p-6 rounded-xl shadow-md">
                            <FontAwesomeIcon icon={faLeaf} className="text-3xl text-green-600 mb-3" />
                            <h3 className="font-semibold text-green-800">Environmental Impact</h3>
                            <p className="text-green-700 text-sm">Long-term community benefit</p>
                        </div>
                    </motion.div>

                    <motion.button 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.6 }}
                        onClick={handleGetStarted}
                        className="bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold 
                                 py-4 px-8 rounded-full text-lg shadow-xl hover:shadow-2xl 
                                 transition-all transform hover:scale-105 hover:from-green-700 hover:to-emerald-700
                                 focus:outline-none focus:ring-4 focus:ring-green-300"
                    >
                        Begin Your Tree Project
                        <FontAwesomeIcon icon={faArrowRight} className="ml-2" />
                    </motion.button>
                </div>
            </section>

            {/* Interactive Features Section */}
            <section className="py-20 bg-white/30 backdrop-blur">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-green-800 mb-4">
                            Complete Project Management
                        </h2>
                        <p className="text-xl text-green-700 max-w-3xl mx-auto">
                            From planning to monitoring, everything you need for a successful educational tree planting project
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        {/* Feature Tabs */}
                        <div className="space-y-4">
                            {features.map((feature, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    className={`p-6 rounded-xl cursor-pointer transition-all ${
                                        activeFeature === index 
                                            ? 'bg-green-600 text-white shadow-xl transform scale-105' 
                                            : 'bg-white/70 backdrop-blur hover:bg-white/90 text-green-800'
                                    }`}
                                    onClick={() => setActiveFeature(index)}
                                >
                                    <div className="flex items-start space-x-4">
                                        <FontAwesomeIcon 
                                            icon={feature.icon} 
                                            className={`text-2xl mt-1 ${
                                                activeFeature === index ? 'text-white' : 'text-green-600'
                                            }`} 
                                        />
                                        <div>
                                            <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                                            <p className={`mb-2 ${
                                                activeFeature === index ? 'text-green-100' : 'text-green-700'
                                            }`}>
                                                {feature.description}
                                            </p>
                                            {/* {activeFeature === index && (
                                                <motion.p 
                                                    initial={{ opacity: 0, height: 0 }}
                                                    animate={{ opacity: 1, height: 'auto' }}
                                                    className="text-green-50 text-sm"
                                                >
                                                    {feature.details}
                                                </motion.p>
                                            )} */}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* Visual Representation */}
                        <div className="bg-white/80 backdrop-blur rounded-2xl p-8 shadow-xl">
                            <motion.div
                                key={activeFeature}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.5 }}
                                className="text-center"
                            >
                                <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full 
                                              flex items-center justify-center mx-auto mb-6 shadow-lg">
                                    <FontAwesomeIcon 
                                        icon={features[activeFeature].icon} 
                                        className="text-3xl text-white" 
                                    />
                                </div>
                                <h4 className="text-2xl font-bold text-green-800 mb-4">
                                    {features[activeFeature].title}
                                </h4>
                                <p className="text-green-700 text-lg leading-relaxed">
                                    {features[activeFeature].details}
                                </p>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Benefits Section */}
            <section className="py-20">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-green-800 mb-4">
                            Educational Benefits
                        </h2>
                        <p className="text-xl text-green-700">
                            Why tree planting projects are perfect for middle school education
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {benefits.map((benefit, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className="flex items-start space-x-4 p-6 bg-white/70 backdrop-blur rounded-xl 
                                         shadow-md hover:shadow-lg transition-all hover:transform hover:scale-105"
                            >
                                <FontAwesomeIcon 
                                    icon={faCheckCircle} 
                                    className="text-2xl text-green-600 mt-1 flex-shrink-0" 
                                />
                                <p className="text-green-800 font-medium">{benefit}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Process Overview */}
            <section className="py-20 bg-white/30 backdrop-blur">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-green-800 mb-4">
                            Project Process
                        </h2>
                        <p className="text-xl text-green-700">
                            A structured approach from planning to long-term monitoring
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        {[
                            { icon: faMapMarkerAlt, title: "Planning", desc: "Location selection, species research, resource planning" },
                            { icon: faSeedling, title: "Planting", desc: "Hands-on planting day with proper techniques" },
                            { icon: faCamera, title: "Documentation", desc: "Data collection and logging trees" },
                            { icon: faChartLine, title: "Monitoring", desc: "Regular growth tracking and analysis" }
                        ].map((step, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: index * 0.15 }}
                                className="text-center"
                            >
                                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full 
                                              flex items-center justify-center mx-auto mb-4 shadow-lg">
                                    <FontAwesomeIcon icon={step.icon} className="text-2xl text-white" />
                                </div>
                                <h3 className="text-xl font-bold text-green-800 mb-2">{step.title}</h3>
                                <p className="text-green-700">{step.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20">
                <div className="max-w-4xl mx-auto text-center px-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6 }}
                        className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-12 shadow-2xl text-white"
                    >
                        <FontAwesomeIcon icon={faSeedling} className="text-5xl mb-6" />
                        <h2 className="text-3xl md:text-4xl font-bold mb-6">
                            Ready to Start Your Tree Project?
                        </h2>
                        <p className="text-xl mb-8 text-green-100">
                            Join educators worldwide who are making environmental education impactful and engaging
                        </p>
                        <button 
                            onClick={handleGetStarted}
                            className="bg-white text-green-600 font-bold py-4 px-8 rounded-full text-lg
                                     shadow-xl hover:shadow-2xl transition-all transform hover:scale-105
                                     hover:bg-green-50"
                        >
                            Begin Planning Today
                            <FontAwesomeIcon icon={faArrowRight} className="ml-2" />
                        </button>
                    </motion.div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 text-white py-12">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <FontAwesomeIcon icon={faSeedling} className="text-2xl text-green-400" />
                                <h3 className="text-xl font-bold">TreeDoctor</h3>
                            </div>
                            <p className="text-gray-300">
                                Empowering educators to create meaningful environmental learning experiences 
                                through structured tree planting projects.
                            </p>
                        </div>

                        {/* <div>
                            <h4 className="font-bold mb-4">Resources</h4>
                            <ul className="space-y-2">
                                <li><a href="#" className="text-gray-300 hover:text-green-400 transition-colors">Planning Guide</a></li>
                                <li><a href="#" className="text-gray-300 hover:text-green-400 transition-colors">Species Selection</a></li>
                                <li><a href="#" className="text-gray-300 hover:text-green-400 transition-colors">Monitoring Tools</a></li>
                                <li><a href="#" className="text-gray-300 hover:text-green-400 transition-colors">Curriculum Integration</a></li>
                            </ul>
                        </div> */}

                        <div className='flex flex-col'>
                            <h4 className="font-bold mb-4">Connect</h4>
                            <div className="flex gap-4 mb-4 justify-center">
                                <a href="#" target="_blank" rel="noopener noreferrer">
                                    <FaGithub className="text-2xl text-gray-300 hover:text-green-400 transition-colors" />
                                </a>
                                <a href="#" target="_blank" rel="noopener noreferrer">
                                    <FaLinkedin className="text-2xl text-gray-300 hover:text-green-400 transition-colors" />
                                </a>
                            </div>
                            <p className="text-sm text-gray-300">
                                Made with <FontAwesomeIcon icon={faHeart} className="text-red-400" /> for educators
                            </p>
                        </div>
                    </div>
                    
                    <div className="mt-8 pt-8 border-t border-gray-800 text-center text-sm text-gray-400">
                        © {new Date().getFullYear()} TreeDoctor. Supporting environmental education worldwide.
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default TreeProjectLanding;