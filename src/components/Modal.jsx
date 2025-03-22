import React from 'react';
import SignUp from './SignUp';

const Modal = ({ isOpen, onClose }) => {
    if (!isOpen) return null; // Don't render anything if not open

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="absolute inset-0 bg-black opacity-50 transition-opacity duration-300" onClick={onClose}></div>
            <div className=" rounded-lg shadow-lg mt-[60px] w-full max-w-md relative z-10"> {/* Increased width here */}
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 text-gray-600 hover:text-gray-800 text-3xl"
                >
                    &times;
                </button>
                <SignUp />
            </div>
        </div>
    );
};

export default Modal;