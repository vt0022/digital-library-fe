import { getAccessibleFields } from "@api/main/fieldAPI";
import fieldImage from "@assets/images/field.png";
import PageHead from "@components/shared/head/PageHead";
import KeyCard from "@components/student/card/KeyCard";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ListFields = () => {
    const navigate = useNavigate();

    const [fieldList, setFieldList] = useState([]);

    useEffect(() => {
        getFieldList();
    }, []);

    const getFieldList = async () => {
        try {
            const response = await getAccessibleFields({
                params: {
                    page: 0,
                    size: 100,
                },
            });
            if (response.status === 200) {
                setFieldList(response.data);
            }
        } catch (error) {
            navigate("/error-500");
        }
    };

    return (
        <>
            <PageHead title="Lĩnh vực" description="Lĩnh vực - learniverse & shariverse" url={window.location.href} origin="lib" />

            <div className="h-full w-full overflow-auto">
                <div className="px-[10%]">
                    <div className="grid place-items-center mt-10 mb-10">
                        <img src={fieldImage} alt="" width="20%" height="20%" />
                        <h2 className="text-3xl font-semibold text-gray-500 dark:text-white mt-10">Bạn muốn tìm lĩnh vực nào?</h2>
                    </div>

                    <div className="grid grid-cols-5 gap-8 mb-20 ">
                        {fieldList.map((field) => (
                            <KeyCard name={field.fieldName} slug={field.slug} path="/fields/" icon="field" />
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
};

export default ListFields;
