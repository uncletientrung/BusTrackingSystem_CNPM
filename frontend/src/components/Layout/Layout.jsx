import { useState } from "react"
import Sidebar from "./Sidebar";
import Header from "./Header";
import { Outlet } from "react-router-dom";

export default function Layout() {
    const [sidebarOpen, setSidebarOpen]= useState(false);
    
   return (
      <>
        <div className="flex h-screen bg-gray-100">
            {/* isOpen và onClose để xử lý trên moblie */}
            {/* Sidebar */}
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)}> </Sidebar>

            {/* Phần thân */}
            <div className="flex-1 flex flex-col overflow-hidden lg:ml-64">
                {/* Header */}
                <Header onMenuClick={() => setSidebarOpen(true)}> </Header>

                {/* Nội dung */}
                <main className="flex-1 overflow-y-auto bg-gray-50">
                    <div className="py-6">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <Outlet />  {/* Nơi render nội dung con */}
                        </div>
                    </div>
                </main>
            </div>

            {/* Mobile sidebar overlay */}
            {sidebarOpen && (
                <div
                className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
                onClick={() => setSidebarOpen(false)}
                />
            )}
        </div>
      </>
   )
};