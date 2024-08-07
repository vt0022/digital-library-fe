import React from "react";

const Select = (props) => {
    const { selectName, defaultName, options, selectedValue, onChangeHandler, name, field} = props;
    return (
        <div className="mb-2 max-w-full">
            <label htmlFor="hs-select-label" className="block text-sm text-gray-700 font-medium mb-2 dark:text-white">
                {selectName}
            </label>
            <select
                className="py-3 px-4 pe-9 block w-full bg-gray-100 border border-gray-300 rounded-lg text-sm focus:border-blue-500 
            focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-gray-700 dark:border-transparent 
            dark:text-gray-400 dark:focus:ring-gray-600"
                value={selectedValue}
                onChange={onChangeHandler}>
                <option value="">{defaultName ? defaultName : "Chọn"}</option>
                {options?.map((item) => (
                    <option key={item[field]} value={item[field]}>
                        {item[name]}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default Select;
