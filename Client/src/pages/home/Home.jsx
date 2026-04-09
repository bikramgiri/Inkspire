import { useState } from "react";
import ArticleCard from "../../components/Article/ArticleCard";

const articles = [
  {
    id: 1,
    title: "How AI is Transforming Web Development in 2025",
    subtitle: "Explore the latest trends in AI-driven web development, including intelligent code generation, automated testing, and personalized user experiences that are shaping the future of the web.",
    date: "Feb 21, 2025",
    claps: 213,
    comments: 2,
    tag: null,
    publication: "Kiran Rai",
    pubIcon: "K",
    pubColor: "bg-blue-500 text-white",
    author: "Kiran Rai",
    isPremium: true,
    image: "https://miro.medium.com/v2/resize:fit:400/format:webp/1*example.png",
    imageBg: "#e8f0fe",
    imageEmoji: "💻",
//     imageText: "AI",
  },
  {
    id: 2,
    title: "Top 10 AI Tools for Content Creation in 2025",
    subtitle: "Discover the best AI tools that are revolutionizing content creation in 2025, helping creators produce high-quality content faster and more efficiently.",
    date: "Mar 28, 2025",
    claps: 297,
    comments: 7,
    isPremium: true,
    publication: "The Ai Studio",
    author: "Arjun Karki",
    pubIcon: "A",
    pubColor: "bg-black text-white",
    image: null,
    imageBg: "#e53e3e",
    imageText: "AI",
  },
  {
    id: 3,
    title: "10  Habits of Highly Effective Entrepreneurs",
    subtitle: "Learn about the daily habits and routines of successful entrepreneurs that can help you boost productivity, stay focused, and achieve your business goals.",
    date: "Apr 1, 2025",
    claps: 184,
    comments: 10,
    isPremium: false,
    publication: "Data Science Collective",
    author: "Dhiraj Pokharel",
    pubIcon: "D",
    pubColor: "bg-orange-500 text-white",
    imageBg: "#2d3748",
    imageText: "10 Habits",
//     hasLevels: true,
  },
];

export default function Home() {
  const [activeTab, setActiveTab] = useState("for-you");

  return (
      <div className="max-w-6xl">
      <div className="flex items-center gap-8 border-b border-gray-200 sticky top-22 z-10 bg-white">
        {[
          { id: "for-you", label: "For you" },
          { id: "featured", label: "Featured" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`cursor-pointer pb-3 text-md font-medium transition-colors border-b-2 ${
              activeTab === tab.id
                ? "text-gray-900 border-gray-900"
                : "text-gray-500 border-transparent hover:text-gray-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div>
        {articles.map((a) => (
          <ArticleCard key={a.id} article={a} />
        ))}
      </div>
    </div>
  );
}
