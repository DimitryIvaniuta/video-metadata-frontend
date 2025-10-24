import React from 'react';

const Spinner = () => (
    <svg
        className="ccv-spinner"
        height="24"
        width="24"
        viewBox="0 0 24 24"
        fill="#0A66C2"
        xmlns="http://www.w3.org/2000/svg"

    >
        <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 11.4477 2.44772 11 3 11C3.55228 11 4 11.4477 4 12C4 16.4183 7.58172 20 12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C11.4477 4 11 3.55228 11 3C11 2.44772 11.4477 2 12 2Z"
        >
            <animateTransform
                attributeName="transform"
                attributeType="XML"
                type="rotate"
                from="0 12 12"
                to="360 12 12"
                dur="1s"
                repeatCount="indefinite"
            />
        </path>
    </svg>
);
export default Spinner;