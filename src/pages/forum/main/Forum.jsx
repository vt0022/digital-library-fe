import Sidebar from "@components/forum/sidebar/Sidebar";
import TopBar from "@components/forum/topbar/TopBar";
import CustomFooter from "@components/student/footer/Footer";
import ForumRouters from "@routers/ForumRouters";
import { useState } from "react";

const Forum = () => {
    const [pinnedSections, setPinnedSections] = useState(localStorage.getItem("pinned_subsections") ? JSON.parse(localStorage.getItem("pinned_subsections")) : []);

    const handlePinSection = (section) => {
        setPinnedSections((prevPinnedSections) => {
            const isSectionPinned = prevPinnedSections.some((item) => JSON.stringify(item.subId) === JSON.stringify(section.subId));
            let updatedPinnedSections;
            if (isSectionPinned) {
                updatedPinnedSections = prevPinnedSections.filter((item) => JSON.stringify(item.subId) !== JSON.stringify(section.subId));
            } else {
                updatedPinnedSections = [...prevPinnedSections, section];
            }
            localStorage.setItem("pinned_subsections", JSON.stringify(updatedPinnedSections));
            return updatedPinnedSections;
        });
    };

    return (
        <div className="relative bg-emerald-50">
            <div className="sticky top-0 shadow-lg z-10">
                <TopBar />
            </div>

            <div className="flex h-full bg-emerald-50">
                <div className="w-1/6">
                    <Sidebar pinnedSections={pinnedSections} />
                </div>

                <div className="w-5/6">
                    <ForumRouters onPinSection={handlePinSection} />
                </div>
            </div>

            <CustomFooter />
        </div>
    );
};

export default Forum;
