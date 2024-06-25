import ListCategories from "@pages/student/category/ListCategories";
import DetailCollection from "@pages/student/collection/DetailCollection";
import ListCollections from "@pages/student/collection/ListCollections";
import MyCollections from "@pages/student/collection/MyCollections";
import DetailDocument from "@pages/student/document/DetailDocument";
import StudentEditDocument from "@pages/student/document/EditDocument";
import LikedDocument from "@pages/student/document/LikedDocuments";
import ListDocument from "@pages/student/document/ListDocuments";
import RecentDocument from "@pages/student/document/RecentDocuments";
import SavedDocument from "@pages/student/document/SavedDocuments";
import StudentNewDocument from "@pages/student/document/UploadDocument";
import UploadedDocument from "@pages/student/document/UploadedDocuments";
import ListFields from "@pages/student/field/ListFields";
import ListOrganizations from "@pages/student/organization/ListOrganizations";
import MyReviews from "@pages/student/review/MyReviews";
import StudentProfile from "@pages/student/user/Profile";
import UserWall from "@pages/student/user/Wall";
import LikedCollection from "pages/student/collection/LikedCollections";
import { Route, Routes, useNavigate } from "react-router-dom";
// import Search from "@search/search";
// import UserHome from "@user/home";
// import UserProfile from "@user/profile";

const UserRoute = () => {
    const navigate = useNavigate();

    return (
        <Routes>
            <Route path="/documents/upload" element={<StudentNewDocument />} />
            <Route path="/documents/:slug/edit" element={<StudentEditDocument />} />
            <Route path="/documents/:slug" element={<DetailDocument />} />
            <Route path="/documents" element={<ListDocument />} />

            <Route path="/me/my-liked-documents" element={<LikedDocument />} />
            <Route path="/me/my-saved-documents" element={<SavedDocument />} />
            <Route path="/me/my-shared-documents" element={<UploadedDocument />} />
            <Route path="/me/my-reading" element={<RecentDocument />} />
            <Route path="/me/my-liked-collections" element={<LikedCollection />} />
            <Route path="/me/my-created-collections" element={<MyCollections />} />
            <Route path="/me/my-reviews" element={<MyReviews />} />
            <Route path="/me" element={<StudentProfile />} />

            <Route path="/search/:searchQuery" element={<ListDocument />} />
            <Route path="/categories/:categorySlug" element={<ListDocument />} />
            <Route path="/categories" element={<ListCategories />} />
            <Route path="/fields/:fieldSlug" element={<ListDocument />} />
            <Route path="/fields" element={<ListFields />} />
            <Route path="/institutions/:organizationSlug" element={<ListDocument />} />
            <Route path="/institutions" element={<ListOrganizations />} />
            <Route path="/collections/:collectionSlug" element={<DetailCollection />} />
            <Route path="/collections" element={<ListCollections />} />

            <Route path="/users/:userId" element={<UserWall />} />

            <Route
                path="*"
                element={null}
                children={() => {
                    navigate("/error-404");
                    return null;
                }}
            />
        </Routes>
    );
};

export default UserRoute;
// import { React } from "react";
// import { Route, Routes } from "react-router-dom";

// // import ReadDocument from "@document/document";
// import Search from "@search/search";
// import UserHome from "@user/home";
// import UserProfile from "@user/profile";
// import DocumentDetail from "@document/documentDetail";

// const UserRoute = () => {
//     return (
//         <Routes>
//             <Route path="/user" element={<UserHome />} />
//             {/* <Route path="/user/documents/read" element={<ReadDocument />} /> */}
//             {/* <Route path="/user/documents" element={<UserDocuments />} /> */}
//             <Route path="/user/profile" element={<UserProfile />} />
//             <Route path="/user/search" element={<Search />} />
//             <Route path="/user/document/detail" element={<DocumentDetail />} />
//             {/* <Routhe path="/user/document/contribute" element={<DocumentContribute />} />"           */}
//         </Routes>
//     )
// }

// export default UserRoute
