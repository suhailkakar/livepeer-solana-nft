import React from "react";

interface InputProps {
  placeholder: string;
  textarea?: boolean;
  onChange?: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
}

export default function Input({ placeholder, textarea, onChange }: InputProps) {
  return (
    <div>
      {textarea ? (
        <textarea
          className="bg-[#171717] rounded-xl text-gray-500 text-sm font-light p-4 w-full h-20 placeholder:text-gray-600 focus:outline-none"
          placeholder={placeholder}
          onChange={onChange}
        />
      ) : (
        <input
          className="bg-[#171717] rounded-xl text-gray-500 text-sm font-light p-4 w-full  placeholder:text-gray-600 focus:outline-none"
          placeholder={placeholder}
          onChange={onChange}
        />
      )}
    </div>
  );
}
