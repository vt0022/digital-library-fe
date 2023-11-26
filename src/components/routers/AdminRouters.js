import React from "react";

import { Route, Routes } from "react-router-dom";

import Dashboard from "../../pages/admin/Dashboard";
import Categories from "../../pages/admin/category/Categories";
import DetailDocument from "../../pages/admin/document/DetailDocument";
import Documents from "../../pages/admin/document/Documents";
import EditDocument from "../../pages/admin/document/EditDocument";
import NewDocument from "../../pages/admin/document/NewDocument";
import Fields from "../../pages/admin/field/Fields.jsx";
import DetailUser from "../../pages/admin/user/DetailUser";
import Users from "../../pages/admin/user/Users";
import Organizations from "../../pages/admin/organization/Organizations.jsx";
import PendingDocuments from "../../pages/admin/document/PendingDocument.jsx";

const AdminRoutes = () => {
    return (
        <Routes>
            <Route path="/admin/documents/new" element={<NewDocument />} />
            <Route path="/admin/documents/pending" element={<PendingDocuments />} />
            <Route path="/admin/documents/:slug" element={<DetailDocument />} />
            <Route path="/admin/documents/:slug/edit" element={<EditDocument />} />
            <Route path="/admin/users/:userId" element={<DetailUser />} />
            <Route path="/admin/users" element={<Users />} />
            <Route path="/admin/categories" element={<Categories />} />
            <Route path="/admin/documents" element={<Documents />} />
            <Route path="/admin/fields" element={<Fields />} />
            <Route path="/admin/organizations" element={<Organizations />} />
            <Route path="/admin/home" element={<Dashboard />} />
            <Route path="/admin/" element={<Dashboard />} />
        </Routes>
    );
};

export default AdminRoutes;
