import { collection, getDocs, setDoc, doc } from 'firebase/firestore';
import { db } from '../../firebase';
import { badgeCategories } from '../config/badges';

export const checkAndAwardBadges = async (userId, trees) => {
    try {
        // Get total waterings across all trees
        const totalWaterings = trees.reduce((sum, tree) => 
            sum + (tree.wateringDates?.length  - 1 || 0), 0);

        // Get maximum height across all trees
        const maxHeight = Math.max(...trees.map(tree => {
            const heights = Object.values(tree.heights || {});
            return heights.length ? Math.max(...heights) : 0;
        }));

        // Get oldest tree age in days
        const oldestTreeDate = Math.min(...trees.map(tree => 
            tree.date?.toDate?.() || new Date()));
        const ageInDays = Math.floor((new Date() - oldestTreeDate) / (1000 * 60 * 60 * 24));

        // Get existing badges
        const badgesRef = collection(db, 'userTrees', userId, 'badges');
        const snapshot = await getDocs(badgesRef);
        const existingBadges = new Set(snapshot.docs.map(doc => doc.id));

        // Check watering badges
        for (const badge of badgeCategories.watering.badges) {
            if (!existingBadges.has(badge.id) && totalWaterings >= badge.requirement) {
                await setDoc(doc(badgesRef, badge.id), {
                    earnedAt: new Date(),
                    type: 'watering'
                });
            }
        }

        // Check height badges
        for (const badge of badgeCategories.height.badges) {
            if (!existingBadges.has(badge.id) && maxHeight >= badge.requirement) {
                await setDoc(doc(badgesRef, badge.id), {
                    earnedAt: new Date(),
                    type: 'height'
                });
            }
        }

        // Check age badges
        for (const badge of badgeCategories.age.badges) {
            if (!existingBadges.has(badge.id) && ageInDays >= badge.requirement) {
                await setDoc(doc(badgesRef, badge.id), {
                    earnedAt: new Date(),
                    type: 'age'
                });
            }
        }

        // Check secret badges
        // Early Bird (water between 5-7 AM)
        const hasEarlyMorningWatering = trees.some(tree => 
            tree.wateringDates?.some(date => {
                const hour = date.toDate().getHours();
                return hour >= 5 && hour < 7;
            })
        );
        if (!existingBadges.has('early_bird') && hasEarlyMorningWatering) {
            await setDoc(doc(badgesRef, 'early_bird'), {
                earnedAt: new Date(),
                type: 'secret'
            });
        }

        // Other secret badges logic...

    } catch (error) {
        console.error('Error checking badges:', error);
    }
};