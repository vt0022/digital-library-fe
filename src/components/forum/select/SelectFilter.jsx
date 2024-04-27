import React from "react";

const SelectFilter = (props) => {
    const { selectName, options, selectedValue, onChangeHandler, name, field, defaultName, defaultValue, placeholder } = props;
    return (
        <div className="mb-2 w-52">
            <label htmlFor="hs-select-label" className="block text-sm font-medium mb-2 dark:text-white">
                {selectName}
            </label>
            <select
                className="py-3 px-4 pe-9 block w-full bg-white border border-gray-400 rounded-md focus:border-green-500 
            focus:ring-green-500 disabled:opacity-50 disabled:pointer-events-none "
                value={selectedValue}
                onChange={onChangeHandler}
                placeholder={placeholder}>
                <option value={defaultValue}>{defaultName}</option>
                {options?.map((item) => (
                    <option key={item[field]} value={item[field]} className="bg-white">
                        {item[name]}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default SelectFilter;
