import React from "react";

export default function Modal({
  children,
  sm,
}: {
  children: React.ReactNode;
  sm?: boolean;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div
        className={
          sm ? "bg-zinc-900 rounded-xl w-96" : "bg-zinc-900 rounded-xl"
        }
      >
        <div className="flex flex-col items-center justify-center h-full p-4">
          {children}
        </div>
      </div>
    </div>
  );
}