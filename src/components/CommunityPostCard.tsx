import { Heart, MessageCircle, Share2, MoreHorizontal } from 'lucide-react';
import type { CommunityPost } from '../types';

interface CommunityPostCardProps {
  post: CommunityPost;
  onLike?: () => void;
}

export default function CommunityPostCard({ post, onLike }: CommunityPostCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden">
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <img
              src={post.author.avatar}
              alt={post.author.name}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div>
              <h4 className="font-semibold text-gray-800">{post.author.name}</h4>
              <p className="text-sm text-gray-500">{post.createdAt}</p>
            </div>
          </div>
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <MoreHorizontal className="h-5 w-5 text-gray-400" />
          </button>
        </div>

        <p className="text-gray-700 leading-relaxed mb-4">{post.content}</p>

        {post.image && (
          <div className="mb-4 rounded-xl overflow-hidden">
            <img
              src={post.image}
              alt="Post image"
              className="w-full h-64 object-cover"
            />
          </div>
        )}

        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center space-x-6">
            <button
              onClick={onLike}
              className="flex items-center space-x-2 text-gray-500 hover:text-red-500 transition-colors"
            >
              <Heart className="h-5 w-5" />
              <span className="text-sm">{post.likes}</span>
            </button>
            <button className="flex items-center space-x-2 text-gray-500 hover:text-indigo-500 transition-colors">
              <MessageCircle className="h-5 w-5" />
              <span className="text-sm">{post.comments}</span>
            </button>
          </div>
          <button className="p-2 text-gray-500 hover:text-indigo-500 hover:bg-indigo-50 rounded-full transition-colors">
            <Share2 className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
