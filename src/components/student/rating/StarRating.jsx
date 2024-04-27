import React from "react";
import { HiStar, HiOutlineStar } from "react-icons/hi";

const StarRating = ({ rating, size }) => {
    const fullStars = Array.from({ length: Math.floor(rating) }, (_, index) => index + 1);
    const remainingStars = Array.from({ length: 5 - Math.floor(rating) }, (_, index) => index + Math.floor(rating) + 1);

    return (
        <div className="flex gap-px ml-auto items-center">
            {fullStars.map((star) => (
                <HiStar key={star} className={`${size === "large" ? "w-10 h-10" : "w-6 h-6"} text-yellow-300 ml-0`} />
            ))}
            {remainingStars.map((star) => (
                <HiOutlineStar key={star} className={`${size === "large" ? "w-9 h-9" : "w-6 h-6"} text-yellow-300 ml-0 stroke-current`} />
            ))}
        </div>
    );
};

export default StarRating;