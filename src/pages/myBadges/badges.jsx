import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../../firebase';
import { useAuth } from '../../context/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { motion } from 'framer-motion';
// import { badgeCategories } from '../../config/badges';
import ProtectedRoute from '../../components/ProtectedRoute';
import { 
    faDroplet,
    faHandHoldingDroplet,
    faCloudRain,
    faCloudShowersHeavy,
    faWater,
    faWaterLadder,
    faDragon, // for legendary status
    faRuler,
    faArrowUp,
    faArrowTrendUp,
    faTreeCity,
    faMountain,
    faHouseChimney,
    faSeedling,
    faCalendarDays,
    faCake,
    faHourglass,
    faStopwatch,
    faClock,
    faCalendarCheck,
    faStar,
    faLock,
    faGem,
    faAward,
    faFireAlt
} from '@fortawesome/free-solid-svg-icons';
import { FaSeedling } from 'react-icons/fa';

const badgeCategories = {
    watering: {
        icon: faDroplet,
        measurement: "waterings",
        title: "Watering Achievements",
        badges: [
            {
                id: "first_sip",
                name: "First Sip",
                icon: faDroplet,
                requirement: 1,
                description: "You've given your tree its very first drink!"
            },
            {
                id: "thirst_quencher",
                name: "Thirst Quencher",
                icon: faHandHoldingDroplet,
                requirement: 10,
                description: "You're mastering the art of keeping your tree happy and hydrated."
            },
            {
                id: "rainmaker",
                name: "Rainmaker",
                icon: faCloudRain,
                requirement: 25,
                description: "Your tree couldn't be more grateful for all that love."
            },
            {
                id: "hydration_hero",
                name: "Hydration Hero",
                icon: faCloudShowersHeavy,
                requirement: 50,
                description: "You're officially a champion waterer!"
            },
            {
                id: "monsoon_master",
                name: "Monsoon Master",
                icon: faWater,
                requirement: 100,
                description: "That's a lot of water—and a lot of dedication."
            },
            {
                id: "oceans_bounty",
                name: "Ocean's Bounty",
                icon: faWaterLadder,
                requirement: 250,
                description: "You've filled enough watering cans to float a boat!"
            },
            {
                id: "aqua_legend",
                name: "Aqua Legend",
                icon: faDragon,
                requirement: 500,
                description: "Your tree must feel like it's living in a rainforest."
            }
        ]
    },
    height: {
        icon: faRuler,
        title: "Height Milestones",
        measurement: "cm",
        badges: [
            {
                id: "tiny_sprout",
                name: "Tiny Sprout",
                icon: faSeedling,
                requirement: 10,
                description: "Your seedling is off to a promising start!"
            },
            {
                id: "growing_sapling",
                name: "Growing Sapling",
                icon: faArrowUp,
                requirement: 30,
                description: "Shoot for the sky—your tree sure is."
            },
            {
                id: "skyward_seedling",
                name: "Skyward Seedling",
                icon: faArrowTrendUp,
                requirement: 50,
                description: "Look how tall your little friend is getting!"
            },
            {
                id: "sapling_sentinel",
                name: "Sapling Sentinel",
                icon: faTreeCity,
                requirement: 100,
                description: "You've got a meter-high guardian of nature."
            },
            {
                id: "branch_ambassador",
                name: "Branch Ambassador",
                icon: faMountain,
                requirement: 150,
                description: "Time to wave hello to the birds."
            },
            {
                id: "canopy_conqueror",
                name: "Canopy Conqueror",
                icon: faHouseChimney,
                requirement: 200,
                description: "Nearly treehouse-level height—fantastic work!"
            }
        ]
    },
    age: {
        icon: faCalendarDays,
        title: "Tree Age Achievements",
        measurement: "days",
        badges: [
            {
                id: "first_week",
                name: "First Week",
                icon: faHourglass,
                requirement: 7,
                description: "Your tree has survived its first week!"
            },
            {
                id: "month_milestone",
                name: "Month Milestone",
                icon: faStopwatch,
                requirement: 30,
                description: "A month of dedicated tree care—well done!"
            },
            {
                id: "season_star",
                name: "Season Star",
                icon: faClock,
                requirement: 90,
                description: "Through wind and weather, three months strong!"
            },
            {
                id: "half_year_hero",
                name: "Half Year Hero",
                icon: faCalendarCheck,
                requirement: 180,
                description: "Six months of growth and counting!"
            },
            {
                id: "year_champion",
                name: "Year Champion",
                icon: faCake,
                requirement: 365,
                description: "Happy first birthday to your tree!"
            }
        ]
    },
    secret: {
        icon: faStar,
        title: "Secret Achievements",
        measurement: "",
        badges: [
            {
                id: "early_bird",
                name: "Early Bird",
                icon: faLock,
                requirement: "???",
                description: "Water your tree at sunrise",
                isSecret: true
            },
            {
                id: "tree_whisperer",
                name: "Tree Whisperer",
                icon: faGem,
                requirement: "???",
                description: "Update your tree's measurements 5 days in a row",
                isSecret: true
            },
            {
                id: "green_guardian",
                name: "Green Guardian",
                icon: faAward,
                requirement: "???",
                description: "Water all your trees on the same day",
                isSecret: true
            },
            {
                id: "growth_spurt",
                name: "Growth Spurt",
                icon: faFireAlt,
                requirement: "???",
                description: "Tree grows more than 10cm in a week",
                isSecret: true
            }
        ]
    }
};

const BadgeCard = ({ badge, isEarned, category }) => {
    return (
        <motion.div
            whileHover={{ scale: 1.05 }}
            className={`p-6 rounded-xl shadow-md flex flex-col min-h-[300px] ${
                isEarned 
                    ? 'bg-gradient-to-br from-green-50 to-green-100 border border-green-200' 
                    : 'bg-gray-50 border border-gray-200'
            }`}
        >
            {/* Badge Icon */}
            <div className={`text-center mb-4 ${isEarned ? '' : 'opacity-40'}`}>
                <FontAwesomeIcon 
                    icon={badge.icon} 
                    className={`text-4xl ${
                        isEarned ? 'text-green-600' : 'text-gray-400'
                    }`}
                />
            </div>

            {/* Badge Content */}
            <div className="flex-grow">
                <h3 className={`font-bold text-lg mb-2 text-center ${
                    isEarned ? 'text-green-800' : 'text-gray-500'
                }`}>
                    {badge.name}
                </h3>
                <p className={`text-sm text-center ${
                    isEarned ? 'text-green-600' : 'text-gray-400'
                }`}>
                    {badge.description}
                </p>
            </div>

            {/* Requirement Footer - Now stays at bottom */}
            <div className="mt-auto pt-4 border-t border-dashed border-green-200">
                <p className={`text-xs text-center ${
                    isEarned ? 'text-green-500' : 'text-gray-400'
                }`}>
                    {isEarned 
                        ? '🎉 Achievement Unlocked!' 
                        : badge.isSecret
                            ? 'Secret Achievement'
                            : `Required: ${badge.requirement} ${category.measurement}`
                    }
                </p>
            </div>
        </motion.div>
    );
};

const BadgeSection = ({ category, earnedBadges }) => {
    return (
        <div className="mb-12">
            <div className="flex items-center gap-3 mb-6 bg-white p-4 rounded-lg shadow-sm">
                <FontAwesomeIcon 
                    icon={category.icon} 
                    className="text-2xl text-green-600"
                />
                <h2 className="text-xl font-bold text-green-800">
                    {category.title}
                </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {category.badges.map((badge) => (
                    <BadgeCard
                        key={badge.id}
                        badge={badge}
                        category={category}
                        isEarned={earnedBadges.includes(badge.id)}
                    />
                ))}
            </div>
        </div>
    );
};

const MOCK_EARNED_BADGES = [
    "first_sip",
    "tiny_sprout",
    "early_bird",
    "thirst_quencher"
];

const Badges = ({ isPreview = false }) => {
    const { user } = useAuth();
    const [earnedBadges, setEarnedBadges] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchBadges = async () => {
            if (!user) return;
            if (isPreview) return;
            setLoading(true)
            
            try {
                const userCollectionId = `${user.uid.slice(0,5)}${user.uid.slice(-5)}`;
                const badgesRef = collection(db, 'userTrees', userCollectionId, 'badges');
                const snapshot = await getDocs(badgesRef);
                
                const badges = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setEarnedBadges(badges.map(badge => badge.id));
            } catch (error) {
                console.error('Error fetching badges:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchBadges();
    }, [user]);

    if (isPreview) {
        // Show only watering and height categories for preview
        const previewCategories = {
            watering: badgeCategories.watering,
            height: badgeCategories.height
        };

        return (
            <div className="p-6">
                {Object.entries(previewCategories).map(([key, category]) => (
                    <div key={key} className="mb-8">
                        <div className="flex items-center gap-3 mb-6 bg-white p-4 rounded-lg shadow-sm">
                            <FontAwesomeIcon 
                                icon={category.icon} 
                                className="text-2xl text-green-600"
                            />
                            <h2 className="text-xl font-bold text-green-800">
                                {category.title}
                            </h2>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {category.badges.slice(0, 2).map((badge) => (
                                <BadgeCard
                                    key={badge.id}
                                    badge={badge}
                                    category={category}
                                    isEarned={MOCK_EARNED_BADGES.includes(badge.id)}
                                />
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-green-50/50">
                <div className="container mx-auto px-4 py-8">
                    <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
                        <h1 className="text-3xl font-bold text-green-800">
                            My Achievements
                        </h1>
                        <p className="text-green-600 mt-2">
                            Track your progress and earn badges as you care for your trees!
                        </p>
                    </div>
                    {
                        loading &&
                            <div className="flex justify-center items-center h-64">
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                >
                                    <FaSeedling className="text-4xl text-green-600" />
                                </motion.div>
                            </div>
                    }
                    
                    { !loading && Object.entries(badgeCategories).map(([key, category]) => (
                        <BadgeSection
                            key={key}
                            category={category}
                            earnedBadges={earnedBadges}
                        />
                    ))}
                </div>
            </div>
        </ProtectedRoute>
    );
};

export default Badges;