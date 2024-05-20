import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getActiveSections } from "@api/main/sectionAPI";
import Subsection from "@components/forum/card/Subsection";
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
            <div className="w-11/12 m-auto p-5">
                <div className="space-y-5">
                    {sectionList &&
                        sectionList.map((section, index) => (
                            <div className="bg-white mt-2 rounded-lg shadow-lg shadow-gray-300 p-5">
                                <div className="space-y-4" key={index}>
                                    <div className="p-4 bg-green-400 tlbr-rounded shadow-lg shadow-gray-300 w-fit text-white font-medium text-xl">
                                        <p>{section.sectionName}</p>
                                    </div>

                                    {section.subsections && section.subsections.map((subsection, index) => <Subsection key={index} subsection={subsection} handlePinClick={() => handlePinClick(subsection)}/>)}
                                </div>
                            </div>
                        ))}
                </div>
            </div>
        </>
    );
};

export default Home;
