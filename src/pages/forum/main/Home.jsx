import { getActiveSections } from "@api/main/sectionAPI";
import Subsection from "@components/forum/card/Subsection";
import PageHead from "@components/shared/head/PageHead";
import { useEffect, useState } from "react";
import { BsThreads } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import "./home.css";

const Home = ({ onPinSection }) => {
    const navigate = useNavigate();

    const [sectionList, setSectionList] = useState([]);

    useEffect(() => {
        getSectionList();
    }, []);

    const getSectionList = async () => {
        try {
            const response = await getActiveSections();
            setSectionList(response.data);
        } catch (error) {
            navigate("/error-500");
        }
    };

    const handlePinClick = (subsection) => {
        onPinSection(subsection);
    };

    return (
        <>
            <PageHead title="Trang chủ" description="Trang chủ - learniverse & shariverse" url={window.location.href} origin="forum" />

            <div className="p-5">
                <div className="space-y-5">
                    {sectionList &&
                        sectionList.map((section, index) => (
                            <div className="mt-2 p-5">
                                <div className="space-y-4" key={index}>
                                    <div className="flex items-center px-5 py-2 bg-green-400 tlbr-rounded shadow-lg shadow-gray-300 w-fit text-white font-medium text-xl space-x-2">
                                        <BsThreads className="text-4xl font-bold" />
                                        <p>{section.sectionName}</p>
                                    </div>

                                    <div className="grid grid-cols-3 gap-10">{section.subsections && section.subsections.map((subsection, index) => <Subsection key={index} subsection={subsection} handlePinClick={() => handlePinClick(subsection)} />)}</div>
                                </div>
                            </div>
                        ))}
                </div>
            </div>
        </>
    );
};

export default Home;
