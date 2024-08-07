import React, { useEffect, useRef } from "react";

const InfiniteScroll = ({ children, loader, fetchMore, hasMore, endMessage }) => {
    const pageEndRef = useRef(null);
    
    useEffect(() => {
        if (hasMore) {
            const observer = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting) {
                    // kiểm tra element có nằm trong viewport không?
                    fetchMore();
                }
            });

            if (pageEndRef.current) {
                observer.observe(pageEndRef.current);
            }

            return () => {
                if (pageEndRef.current) {
                    observer.unobserve(pageEndRef.current);
                }
            };
        }
    }, [hasMore]);

    return (
        <div>
            {children}

            {hasMore ? <div ref={pageEndRef}>{loader}</div> : endMessage}
        </div>
    );
};

export default InfiniteScroll;
