import RightSidebar from "./components/RightSidebar";
import MyBlog from "./components/MyBlog";

export default function Profile() {
  return (
    <div className="min-h-screen bg-white font-sans text-gray-900">
      <div className="max-w-1xl mx-auto px-4 sm:px-6">
        <div className="flex gap-0 lg:gap-8">

          {/* Main content */}
          <div className="flex-1 min-w-0">
            <MyBlog />
          </div>

          {/* Sidebar — hidden on mobile, shown lg+ */}
          <RightSidebar />

        </div>
      </div>
    </div>
  );
}