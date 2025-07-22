import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Image from '../../../components/AppImage';

const ProjectComments = ({ project }) => {
  const [newComment, setNewComment] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  const comments = [
    {
      id: 1,
      author: {
        name: "Elena Rodriguez",
        avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150",
        role: "Environmental Scientist"
      },
      content: `This project demonstrates excellent methodology and community engagement. The documentation is thorough and the impact measurements align with international standards. I'm particularly impressed with the soil analysis data and the transparent reporting of challenges faced during implementation.`,
      timestamp: "2 hours ago",
      likes: 12,
      replies: 3,
      verified: true
    },
    {
      id: 2,
      author: {
        name: "Marcus Chen",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
        role: "Community Member"
      },
      content: "Great to see local communities taking charge of climate action. The progress photos really show the transformation of the area. How can other communities replicate this model?",
      timestamp: "5 hours ago",
      likes: 8,
      replies: 1,
      verified: false
    },
    {
      id: 3,
      author: {
        name: "Dr. Amara Okafor",
        avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150",
        role: "Carbon Credit Specialist"
      },
      content: "The carbon calculations look solid, but I'd like to see more details on the long-term monitoring plan. What measures are in place to ensure the carbon sequestration is permanent?",timestamp: "1 day ago",
      likes: 15,
      replies: 2,
      verified: true
    },
    {
      id: 4,
      author: {
        name: "Sarah Thompson",avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150",role: "Local Resident"
      },
      content: "Living near this project, I can see the positive impact firsthand. The air quality has improved and we're seeing more wildlife return to the area. Thank you to everyone involved!",timestamp: "2 days ago",
      likes: 23,
      replies: 5,
      verified: false
    }
  ];

  const handleSubmitComment = () => {
    if (newComment.trim()) {
      // Mock comment submission
      console.log('New comment:', newComment);
      setNewComment('');
      alert('Comment submitted successfully!');
    }
  };

  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'popular', label: 'Most Popular' }
  ];

  return (
    <div className="bg-card rounded-lg organic-shadow-subtle">
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-foreground">
            Community Discussion ({comments.length})
          </h3>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-1 text-sm border border-border rounded-md bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Comment Form */}
        <div className="space-y-4">
          <Input
            type="text"
            placeholder="Share your thoughts about this project..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="w-full"
          />
          <div className="flex justify-end">
            <Button
              variant="default"
              iconName="Send"
              iconPosition="left"
              onClick={handleSubmitComment}
              disabled={!newComment.trim()}
            >
              Post Comment
            </Button>
          </div>
        </div>
      </div>

      {/* Comments List */}
      <div className="divide-y divide-border">
        {comments.map((comment) => (
          <div key={comment.id} className="p-6">
            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                <Image
                  src={comment.author.avatar}
                  alt={comment.author.name}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <h4 className="font-medium text-foreground">
                    {comment.author.name}
                  </h4>
                  {comment.verified && (
                    <Icon name="CheckCircle" size={16} className="text-primary" />
                  )}
                  <span className="text-sm text-muted-foreground">
                    {comment.author.role}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    • {comment.timestamp}
                  </span>
                </div>
                
                <p className="text-foreground leading-relaxed mb-4">
                  {comment.content}
                </p>
                
                <div className="flex items-center space-x-4">
                  <button className="flex items-center space-x-1 text-muted-foreground hover:text-primary organic-transition">
                    <Icon name="ThumbsUp" size={16} />
                    <span className="text-sm">{comment.likes}</span>
                  </button>
                  
                  <button className="flex items-center space-x-1 text-muted-foreground hover:text-primary organic-transition">
                    <Icon name="MessageCircle" size={16} />
                    <span className="text-sm">Reply ({comment.replies})</span>
                  </button>
                  
                  <button className="flex items-center space-x-1 text-muted-foreground hover:text-primary organic-transition">
                    <Icon name="Share" size={16} />
                    <span className="text-sm">Share</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Load More */}
      <div className="p-6 border-t border-border text-center">
        <Button variant="outline" iconName="ChevronDown" iconPosition="left">
          Load More Comments
        </Button>
      </div>
    </div>
  );
};

export default ProjectComments;