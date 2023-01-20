import React from "react";

export default function Button({
  children,
  disable,
  onClick,
  className,
}: {
  children: React.ReactNode;
  disable?: boolean;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={
        className +
        "  rounded-xl  text-sm font-medium p-3 mt-6 w-32 hover:cursor-pointer bg-primary " +
        (disable ? " opacity-50 cursor-not-allowed" : "")
      }
    >
      {children}
    </button>
  );
}
