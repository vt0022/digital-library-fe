import Page404 from "@pages/404Page.jsx";
import Dashboard from "@pages/admin/Dashboard.jsx";
import Profile from "@pages/admin/Profile.jsx";
import Categories from "@pages/admin/category/Categories.jsx";
import DetailDocument from "@pages/admin/document/DetailDocument.jsx";
import Documents from "@pages/admin/document/Documents.jsx";
import EditDocument from "@pages/admin/document/EditDocument.jsx";
import NewDocument from "@pages/admin/document/NewDocument.jsx";
import PendingDocuments from "@pages/admin/document/PendingDocument.jsx";
import Fields from "@pages/admin/field/Fields.jsx";
import Labels from "@pages/admin/label/Labels.jsx";
import Organizations from "@pages/admin/organization/Organizations.jsx";
import Sections from "@pages/admin/section/Sections.jsx";
import Subsections from "@pages/admin/subsection/Subsections.jsx";
import DetailUser from "@pages/admin/user/DetailUser.jsx";
import Users from "@pages/admin/user/Users.jsx";
import { Route, Routes } from "react-router-dom";

const ManagementRoutes = () => {
    return (
        <Routes>
            <Route path="/documents/new" element={<NewDocument />} />
            <Route path="/documents/latest" element={<Documents />} />
            <Route path="/documents/pending" element={<PendingDocuments />} />
            <Route path="/documents/:slug" element={<DetailDocument />} />
            <Route path="/documents/:slug/edit" element={<EditDocument />} />
            <Route path="/users/latest" element={<Users />} />
            <Route path="/users/:userId" element={<DetailUser />} />
            <Route path="/users" element={<Users />} />
            <Route path="/categories/:categorySlug" element={<Documents />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/fields/:fieldSlug" element={<Documents />} />
            <Route path="/fields" element={<Fields />} />
            <Route path="/organizations/:organizationSlug" element={<Documents />} />
            <Route path="/organizations" element={<Organizations />} />
            <Route path="/subsections" element={<Subsections />} />
            <Route path="/sections" element={<Sections />} />
            <Route path="/labels" element={<Labels />} />
            <Route path="/documents" element={<Documents />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/home" element={<Dashboard />} />
            <Route path="/" element={<Dashboard />} />
            <Route path="*" element={<Page404 />} />
        </Routes>
    );
};

export default ManagementRoutes;
