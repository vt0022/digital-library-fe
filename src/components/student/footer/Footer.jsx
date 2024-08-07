import { Footer } from "flowbite-react";
import { BsDribbble, BsFacebook, BsGithub, BsInstagram, BsTwitter } from "react-icons/bs";

import logo from "../../../assets/images/logo.png";

import "./footer.css";

const CustomFooter = () => {
    return (
        <Footer container className="bg-gray-200 px-[7%]">
            <div className="w-full hover-link">
                <div className="grid w-full justify-between sm:flex sm:justify-between md:flex md:grid-cols-1">
                    <div className="mt-4 footer-brand">
                        <Footer.Brand href="/home" src={logo} alt="miniverse Logo" name="THƯ VIỆN SỐ VÀ DIỄN ĐÀN" />
                    </div>
                    <div className="grid grid-cols-2 gap-8 sm:mt-4 sm:grid-cols-3 sm:gap-6">
                        <div>
                            <Footer.Title title="Về chúng tôi" />
                            <Footer.LinkGroup col>
                                <Footer.Link href="#">miniverse</Footer.Link>
                            </Footer.LinkGroup>
                        </div>
                        <div>
                            <Footer.Title title="Theo dõi trên" />
                            <Footer.LinkGroup col>
                                <Footer.Link href="#" className="hover-link">
                                    Github
                                </Footer.Link>
                                <Footer.Link href="#">Discord</Footer.Link>
                            </Footer.LinkGroup>
                        </div>
                        <div>
                            <Footer.Title title="Giấy phép" />
                            <Footer.LinkGroup col>
                                <Footer.Link href="#">Chính sách bảo mật</Footer.Link>
                                <Footer.Link href="#">Điều khoản &amp; điều kiện</Footer.Link>
                            </Footer.LinkGroup>
                        </div>
                    </div>
                </div>
                <Footer.Divider />
                <div className="w-full sm:flex sm:items-center sm:justify-between">
                    <Footer.Copyright href="#" by="miniverse" year={2024} />
                    <div className="mt-4 flex space-x-6 sm:mt-0 sm:justify-center">
                        <Footer.Icon href="#" icon={BsFacebook} />
                        <Footer.Icon href="#" icon={BsInstagram} />
                        <Footer.Icon href="#" icon={BsTwitter} />
                        <Footer.Icon href="#" icon={BsGithub} />
                        <Footer.Icon href="#" icon={BsDribbble} />
                    </div>
                </div>
            </div>
        </Footer>
    );
};

export default CustomFooter;
