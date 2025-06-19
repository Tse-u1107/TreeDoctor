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

export const badgeCategories = {
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