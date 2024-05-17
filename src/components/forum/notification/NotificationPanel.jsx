import { getMyNotifications } from "@api/main/notificationAPI";
import usePrivateAxios from "@api/usePrivateAxios";
import NotificationItem from "@components/forum/notification/NotificationItem";
import { initFlowbite } from "flowbite";
import { Tooltip } from "flowbite-react";
import { useEffect, useRef, useState } from "react";

const NotificationPanel = () => {
    initFlowbite();

    usePrivateAxios();

    const [notificationList, setNotificationList] = useState([]);
    const [size, setSize] = useState(10);
    const [total, setTotal] = useState(0);

    const dropdownRef = useRef(null);

        const user = JSON.parse(sessionStorage.getItem("profile"));
        const accessToken = localStorage.getItem("accessToken");

    // useEffect(() => {
    //     const observer = new MutationObserver((mutationsList) => {
    //         for (const mutation of mutationsList) {
    //             if (mutation.type === "attributes" && mutation.attributeName === "class") {
    //                 const element = mutation.target;
    //                 if (element.classList.contains("hidden")) setSize(10);
    //             }
    //         }
    //     });

    //     if (dropdownRef.current) {
    //         observer.observe(dropdownRef.current, {
    //             attributes: true,
    //             attributeFilter: ["class"],
    //         });
    //     }

    //     return () => {
    //         if (dropdownRef.current) observer.disconnect();
    //     };
    // }, []);

    useEffect(() => {
        if(user && accessToken){
            getNotifications();
        }
    }, [size]);

    const getNotifications = async () => {
        try {
            const response = await getMyNotifications({
                params: {
                    size: size,
                },
            });
            setNotificationList(response.data.content);
            setTotal(response.data.totalElements);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <>
            <Tooltip content="Thông báo" placement="bottom" style="light">
                <button id="dropdownNotificationButton" data-dropdown-toggle="dropdownNotification" className="relative inline-flex items-center text-sm font-medium text-center text-gray-500 hover:text-gray-900 focus:outline-none" type="button">
                    <svg className="w-6 h-6" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                        <g id="style=fill">
                            <g id="notification-bell">
                                <path
                                    id="vector (Stroke)"
                                    fill-rule="evenodd"
                                    clip-rule="evenodd"
                                    d="M14.802 19.8317C15.4184 19.7699 15.8349 20.4242 15.5437 20.9539C15.3385 21.3271 15.0493 21.6529 14.7029 21.9197C14.3496 22.1918 13.9397 22.4006 13.5 22.5408C13.0601 22.6812 12.593 22.7522 12.1242 22.7522C11.6554 22.7522 11.1883 22.6812 10.7484 22.5408C10.3087 22.4006 9.89883 22.1918 9.54556 21.9197C9.1991 21.6529 8.90988 21.3271 8.70472 20.9539C8.41354 20.4242 8.83002 19.7699 9.44644 19.8317C9.63869 19.851 11.1433 19.9981 12.1242 19.9981C13.1051 19.9981 14.6097 19.851 14.802 19.8317Z"
                                    fill="#000000"
                                />
                                <path
                                    id="vector (Stroke)_2"
                                    fill-rule="evenodd"
                                    clip-rule="evenodd"
                                    d="M8.52901 2.08755C10.7932 1.00445 13.4465 0.967602 15.7423 1.98737L15.9475 2.07851C18.3532 3.14707 19.8934 5.4622 19.8934 8.0096L19.8934 9.27297C19.8934 10.2885 20.1236 11.2918 20.5681 12.213L20.8335 12.7632C22.0525 15.29 20.465 18.2435 17.6156 18.7498L17.455 18.7783C13.93 19.4046 10.3154 19.4046 6.79044 18.7783C3.90274 18.2653 2.37502 15.1943 3.77239 12.7115L3.99943 12.3082C4.55987 11.3124 4.85335 10.1981 4.85335 9.06596L4.85335 7.79233C4.85335 5.3744 6.27704 3.16478 8.52901 2.08755Z"
                                    fill="#000000"
                                />
                            </g>
                        </g>
                    </svg>

                    <div className="absolute flex items-center justify-center text-white bg-red-500 block w-full aspect-square rounded-full -top-3.5 start-3">
                        <p className="text-xs">24</p>
                    </div>
                </button>
            </Tooltip>

            <div ref={dropdownRef} id="dropdownNotification" className="z-20 hidden w-full max-w-sm max-h-[75%] overflow-auto bg-white divide-y divide-gray-100 rounded-lg shadow" aria-labelledby="dropdownNotificationButton">
                <div className="block px-4 py-2 font-medium text-center text-gray-700 rounded-t-lg bg-gray-50 text-lg">Thông báo</div>

                <div className="divide-y divide-gray-100">
                    {notificationList.map((notification, index) => (
                        <NotificationItem notification={notification} key={index} />
                    ))}
                </div>

                <div className="block py-2 text-sm font-medium text-center text-gray-900 rounded-b-lg bg-gray-50 hover:bg-gray-100">
                    {size > total ? (
                        <div className="inline-flex items-center hover:text-gray-600">
                            <svg className="w-4 h-4 me-2 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                                <path
                                    d="M12 2C6.49 2 2 6.49 2 12C2 17.51 6.49 22 12 22C17.51 22 22 17.51 22 12C22 6.49 17.51 2 12 2ZM16.78 9.7L11.11 15.37C10.97 15.51 10.78 15.59 10.58 15.59C10.38 15.59 10.19 15.51 10.05 15.37L7.22 12.54C6.93 12.25 6.93 11.77 7.22 11.48C7.51 11.19 7.99 11.19 8.28 11.48L10.58 13.78L15.72 8.64C16.01 8.35 16.49 8.35 16.78 8.64C17.07 8.93 17.07 9.4 16.78 9.7Z"
                                    fill="#292D32"
                                />
                            </svg>
                            Bạn đã xem hết thông báo!
                        </div>
                    ) : (
                        <div
                            className="inline-flex items-center cursor-pointer hover:text-gray-600"
                            onClick={() => {
                                if (size < total) setSize(size + 10);
                            }}>
                            <svg className="w-4 h-4 me-2 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 14">
                                <path d="M10 0C4.612 0 0 5.336 0 7c0 1.742 3.546 7 10 7 6.454 0 10-5.258 10-7 0-1.664-4.612-7-10-7Zm0 10a3 3 0 1 1 0-6 3 3 0 0 1 0 6Z" />
                            </svg>
                            Xem thêm
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default NotificationPanel;
