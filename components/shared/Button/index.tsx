import React from "react";

export default function Button({
  children,
  disable,
  onClick,
}: {
  children: React.ReactNode;
  disable?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={
        "bg-primary  rounded-xl text-gray-900 text-sm font-medium p-3 mt-6 w-32 hover:cursor-pointer" +
        (disable ? " opacity-50 cursor-not-allowed" : "")
      }
    >
      {children}
    </button>
  );
}
