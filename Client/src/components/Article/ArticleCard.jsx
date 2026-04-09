import React from 'react'
import { BookmarkIcon, ClapIcon, CommentIcon, MoreIcon, StarIcon } from '../icons/icons'
import { Calendar } from 'lucide-react'

const ArticleCard = ({ article }) => {

  return (
    <div className="py-6 border-b border-gray-100 flex gap-4">
      <div className="flex-1">
        {article.publication && (
          <div className="flex items-center gap-1.5 mb-3">
            <span className={`w-5 h-5 rounded-sm text-xs font-bold flex items-center justify-center ${article.pubColor}`}>
              {article.pubIcon}
            </span>
            {/* <span className="text-sm text-gray-600">
              In <span className="font-medium">{article.publication}</span>
            </span> */}
            <span className="text-md font-medium text-gray-600">By {article.author}</span>
          </div>
        )}

        <h2 className="text-xl font-bold text-gray-900 leading-snug mb-2 hover:underline cursor-pointer line-clamp-2">
          {article.title}
        </h2>
        <p className="text-gray-500 text-sm leading-relaxed line-clamp-2 hidden md:block">
          {article.subtitle}
        </p>

        {/* Meta */}
        <div className="flex items-center gap-3 mt-4 text-gray-400 text-xs">
          {article.isPremium && <Calendar className='h-4.5 w-4.5' />}
          <span className="text-gray-500">{article.date}</span>
          <span className="text-gray-200">·</span>
          {/* <button className="flex items-center gap-1 hover:text-gray-600 transition-colors">
            <ClapIcon />
            <span>{article.claps}</span>
          </button> */}
          <button className="cursor-pointer flex items-center gap-1 hover:text-gray-600 transition-colors">
            <CommentIcon />
            <span>{article.comments}</span>
          </button>
          <div className="flex-1"/>
          <button className="hover:text-gray-600 p-1 transition-colors"><BookmarkIcon /></button>
          <button className="hover:text-gray-600 p-1 transition-colors"><MoreIcon /></button>
        </div>
      </div>

      {/* Thumbnail */}
      <div
        className="w-32 h-24 sm:w-40 sm:h-28 rounded shrink-0 flex items-center justify-center overflow-hidden"
        style={{ backgroundColor: article.imageBg }}
      >
        {article.hasLevels ? (
          <div className="flex gap-0.5 p-1">
            {["LEVEL 1", "LEVEL 2", "PRO"].map((l, i) => (
              <div key={i} className="bg-white/10 border border-white/30 rounded p-1 text-white text-[8px] font-bold text-center">
                {l}
              </div>
            ))}
          </div>
        ) : article.imageText ? (
          <div className="text-white font-black text-lg text-center px-2 leading-tight" style={{ fontFamily: "Georgia, serif" }}>
            {article.imageText}
          </div>
        ) : (
          <div className="text-4xl">{article.imageEmoji}</div>
        )}
      </div>
    </div>
  )
}

export default ArticleCard
