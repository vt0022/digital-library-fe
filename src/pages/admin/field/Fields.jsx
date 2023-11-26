import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import FieldModal from "../../../components/admin/modal/field/FieldModal";
import Table from "../../../components/admin/table/Table";

import ActionButton from "../../../components/admin/action-button/ActionButton";

import { Badge, Button, Modal, Toast } from "flowbite-react";
import { HiDocumentRemove } from "react-icons/hi";

import { deleteAField, getAllFields } from "../../../api/admin/fieldAPI";
import usePrivateAxios from "../../../api/usePrivateAxios";

import { HiCheck, HiExclamation, HiOutlineCloudUpload, HiX } from "react-icons/hi";

const Fields = () => {
    const customerTableHead = ["", "Tên", "Trạng thái", "Số tài liệu", ""];

    const renderHead = (item, index) => (
        <th className="text-center" key={index}>
            {item}
        </th>
    );
    const renderBody = (item, index) => (
        <tr key={index}>
            <td className="w-1/12 text-center font-bold">{index + 1}</td>
            <td className="w-5/12 text-center">{item.fieldName}</td>
            <td className="w-3/12 text-center">
                <div className="m-auto w-fit">
                    {item.deleted ? (
                        <Badge color="warning" icon={HiX}>
                            Đã vô hiệu
                        </Badge>
                    ) : (
                        <Badge icon={HiCheck}>Đang hoạt động</Badge>
                    )}
                </div>
            </td>
            <td className="w-2/12 text-center">123</td>
            <td className="w-1/12 text-center">
                <div className="flex space-x-0">
                    <ActionButton onClick={() => handleEdit(item.fieldId)} icon="bx bxs-user-check" color="yellow" content="Chỉnh sửa lĩnh vực" />
                    <ActionButton onClick={() => handleDelete(item.fieldId)} icon="bx bxs-user-x" color="red" content="Xoá lĩnh vực" />
                </div>
            </td>
        </tr>
    );

    const navigate = useNavigate();
    usePrivateAxios();

    const handleAdd = () => {
        setOpenFieldModal(true);
        setIsCreatingNew(true);
        setTriggerModal(triggerModal + 1);
    };

    const handleEdit = (fieldId) => {
        setOpenFieldModal(true);
        setIsCreatingNew(false);
        setFieldId(fieldId);
        setTriggerModal(triggerModal + 1);
    };

    const handleDelete = (fieldId) => {
        setOpenDeleteModal(true);
        setFieldId(fieldId);
    };

    const [fieldList, setFieldList] = useState([]);
    const [fieldId, setFieldId] = useState("");

    const [openFieldModal, setOpenFieldModal] = useState(false);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [isCreatingNew, setIsCreatingNew] = useState(true);
    const [triggerModal, setTriggerModal] = useState(0);
    const [status, setStatus] = useState(0);
    const [message, setMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        getFieldList();
    }, []);

    const getFieldList = async () => {
        try {
            const response = await getAllFields();
            if (response.status === 200) {
                setFieldList(response.data);
            } else {
                navigate("/admin/login");
            }
        } catch (error) {
            console.log(error);
        }
    };

    const deleteField = async (fieldId) => {
        setIsLoading(true);
        try {
            const response = await deleteAField(fieldId);
            setIsLoading(false);
            setOpenDeleteModal(false);
            if (response.status === 200) {
                setStatus(1);
                if (response.message === "Delete field from system successfully") setMessage("Xoá lĩnh vực thành công!");
                else setMessage("Không thể xoá lĩnh vực do đã tồn tại tài liệu, đã huỷ kích hoạt!");

                setTimeout(() => {
                    setStatus(0);
                }, 4000);
                getFieldList();
            } else {
                setStatus(-1);
                setMessage("Đã xảy ra lỗi!");
                setTimeout(() => {
                    setStatus(0);
                }, 4000);
            }
        } catch (error) {
            setStatus(-1);
            setMessage("Đã xảy ra lỗi!");
            setTimeout(() => {
                setStatus(0);
            }, 4000);
        }
    };

    return (
        <div className="w-4/5 m-auto">
            <h2 className="page-header">Lĩnh vực</h2>
            <Button color="gray" className="mb-7 mt-7 justify-self-end bg-white" style={{ boxShadow: "var(--box-shadow)", borderRadius: "var(--border-radius)" }} onClick={handleAdd}>
                <i className="bx bxs-calendar-plus mr-3 text-xl hover:text-white" style={{ color: "var(--main-color)" }}></i>
                Thêm danh mục
            </Button>

            <div className="row">
                <div className="col-12">
                    <div className="card">
                        <div className="card__body">
                            <Table totalPages="10" headData={customerTableHead} renderHead={(item, index) => renderHead(item, index)} bodyData={fieldList} renderBody={(item, index) => renderBody(item, index)} />
                        </div>
                    </div>
                </div>
            </div>

            <Modal show={openDeleteModal} size="md" onClose={() => setOpenDeleteModal(false)} popup className="z-40">
                <Modal.Header />
                <Modal.Body>
                    <div className="text-center">
                        <HiDocumentRemove className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
                        <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">Bạn có chắc chắn muốn xoá lĩnh vực này không?</h3>
                        <div className="flex justify-center gap-4">
                            <Button color="failure" isProcessing={isLoading} onClick={() => deleteField(fieldId)}>
                                Chắc chắn
                            </Button>
                            <Button color="gray" disabled={isLoading} onClick={() => setOpenDeleteModal(false)}>
                                Huỷ bỏ
                            </Button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>

            <FieldModal openFieldModal={openFieldModal} fieldId={fieldId} isCreatingNew={isCreatingNew} triggerModal={triggerModal} refreshFieldList={getFieldList} />

            {status === -1 && (
                <Toast className="top-1/4 right-5 w-100 fixed z-50">
                    <HiExclamation className="h-5 w-5 text-amber-400 dark:text-amber-300" />
                    <div className="pl-4 text-sm font-normal">{message}</div>
                </Toast>
            )}

            {status === 1 && (
                <Toast className="top-1/4 right-5 fixed w-100 z-50">
                    <HiOutlineCloudUpload className="h-5 w-5 text-green-600 dark:text-green-500" />
                    <div className="pl-4 text-sm font-normal">{message}</div>
                </Toast>
            )}
        </div>
    );
};

export default Fields;
