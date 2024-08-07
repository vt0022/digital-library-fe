import colors from "@assets/json-data/colors.json";
import { useState } from "react";
import { HiOutlineBookOpen, HiOutlineTag } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import "./card.css";

const KeyCard = (props) => {
    const { path, name, slug, icon } = props;

    const navigate = useNavigate();

    const randomIndex = Math.floor(Math.random() * colors.length);

    const [randomColor, setRandomColor] = useState(colors[randomIndex]);

    return (
        <>
            <div
                className="key-card rounded-2xl shadow-lg bg-red-400 grid place-items-center h-auto p-5 hover:bg-red-200 cursor-pointer"
                style={{ backgroundColor: randomColor.bg, "--hover-color": randomColor.hover, "--active-color": randomColor.active }}
                onClick={() => {
                    navigate(path + slug);
                }}>
                {icon === "category" && <HiOutlineTag className="h-10 w-10 mb-2 text-white" />}

                {icon === "field" && <HiOutlineBookOpen className="h-10 w-10 mb-2 text-white" />}

                <h4 className="text-xl font-bold text-white text-center">{name}</h4>
            </div>
        </>
    );
};

export default KeyCard;
