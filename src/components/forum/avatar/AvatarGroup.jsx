import { Avatar, Tooltip } from "flowbite-react";
import { Link } from "react-router-dom";

const AvatarGroup = ({ images }) => {
    const displayedImages = images.slice(0, 4); // Lấy 4 ảnh đầu tiên

    return (
        <Tooltip content="Số lượt thích" style="light">
                <Avatar.Group className="-space-x-2">
                    {displayedImages.map((img, index) => (
                        <Avatar key={index} img={img} rounded stacked size="sm" />
                    ))}
                    {images.length > 4 && <Avatar.Counter total={images.length} as={Link} className="w-8 h-8" />}
                </Avatar.Group>
        </Tooltip>
    );
};

export default AvatarGroup;
