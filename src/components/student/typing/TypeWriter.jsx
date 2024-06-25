import React, { useEffect, useRef } from "react";

const TypeWriter = ({ id, text, speed = 50 }) => {
    const elementRef = useRef(null);
    const timeoutRef = useRef(null);

    useEffect(() => {
        let i = 0;
        elementRef.current.innerHTML = ""; // Clear existing text

        const typeWriter = () => {
            if (i < text.length) {
                if (elementRef.current) {
                    elementRef.current.innerHTML += text.charAt(i);
                    i++;
                    timeoutRef.current = setTimeout(typeWriter, speed);
                }
            }
        };

        typeWriter();

        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [text, speed]);

    return <p ref={elementRef} id={id} className="text-lg font-medium"></p>;
};

export default TypeWriter;
