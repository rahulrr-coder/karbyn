import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Image from '../../../components/AppImage';

const ProjectVerification = ({ project }) => {
  const [userVote, setUserVote] = useState(null);
  const [comment, setComment] = useState('');
  const [showVoteForm, setShowVoteForm] = useState(false);

  const handleVoteSubmit = () => {
    // Mock vote submission - TODO: Replace with actual canister call
    setShowVoteForm(false);
    setComment('');
  };

  const verificationStats = {
    totalVotes: 127,
    approveVotes: 98,
    rejectVotes: 29,
    approvalRate: 77
  };

  const recentValidators = [
    {
      id: 1,
      name: "Dr. Sarah Chen",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150",
      vote: "approve",
      comment: "Excellent documentation and clear evidence of carbon sequestration. The methodology aligns with international standards.",
      timestamp: "2 hours ago",
      expertise: "Environmental Science"
    },
    {
      id: 2,
      name: "Marcus Rodriguez",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
      vote: "approve",
      comment: "Strong community engagement and transparent reporting. The project shows measurable impact.",
      timestamp: "5 hours ago",
      expertise: "Sustainability Consulting"
    },
    {
      id: 3,
      name: "Dr. Amara Okafor",
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150",
      vote: "reject",
      comment: "While the project has merit, I need to see more detailed soil analysis data before approval.",
      timestamp: "1 day ago",
      expertise: "Soil Science"
    }
  ];

  return (
    <div className="space-y-8">
      {/* Verification Status Overview */}
      <div>
        <h3 className="text-xl font-semibold text-foreground mb-6">
          Verification Status
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-surface rounded-lg p-6 text-center">
            <div className="text-2xl font-bold text-foreground mb-2">
              {verificationStats.totalVotes}
            </div>
            <div className="text-sm text-muted-foreground">
              Total Votes
            </div>
          </div>
          <div className="bg-surface rounded-lg p-6 text-center">
            <div className="text-2xl font-bold text-success mb-2">
              {verificationStats.approveVotes}
            </div>
            <div className="text-sm text-muted-foreground">
              Approve Votes
            </div>
          </div>
          <div className="bg-surface rounded-lg p-6 text-center">
            <div className="text-2xl font-bold text-warning mb-2">
              {verificationStats.rejectVotes}
            </div>
            <div className="text-sm text-muted-foreground">
              Reject Votes
            </div>
          </div>
          <div className="bg-surface rounded-lg p-6 text-center">
            <div className="text-2xl font-bold text-primary mb-2">
              {verificationStats.approvalRate}%
            </div>
            <div className="text-sm text-muted-foreground">
              Approval Rate
            </div>
          </div>
        </div>
      </div>

      {/* Verification Progress */}
      <div>
        <h3 className="text-xl font-semibold text-foreground mb-4">
          Verification Progress
        </h3>
        <div className="bg-surface rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-foreground">
              Community Consensus
            </span>
            <span className="text-sm text-muted-foreground">
              {verificationStats.approvalRate}% approval
            </span>
          </div>
          <div className="w-full bg-muted rounded-full h-3 mb-4">
            <div 
              className="bg-primary h-3 rounded-full organic-transition"
              style={{ width: `${verificationStats.approvalRate}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>Minimum required: 75%</span>
            <span className={`font-medium ${
              verificationStats.approvalRate >= 75 ? 'text-success' : 'text-warning'
            }`}>
              {verificationStats.approvalRate >= 75 ? 'Threshold Met' : 'Needs More Votes'}
            </span>
          </div>
        </div>
      </div>

      {/* Voting Interface */}
      <div>
        <h3 className="text-xl font-semibold text-foreground mb-4">
          Cast Your Vote
        </h3>
        <div className="bg-surface rounded-lg p-6">
          {!showVoteForm ? (
            <div className="text-center">
              <p className="text-muted-foreground mb-6">
                Help verify this project by reviewing the documentation and casting your vote.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  variant="success"
                  iconName="ThumbsUp"
                  iconPosition="left"
                  onClick={() => {
                    setUserVote('approve');
                    setShowVoteForm(true);
                  }}
                >
                  Approve Project
                </Button>
                <Button
                  variant="outline"
                  iconName="ThumbsDown"
                  iconPosition="left"
                  onClick={() => {
                    setUserVote('reject');
                    setShowVoteForm(true);
                  }}
                >
                  Request Changes
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center space-x-2 mb-4">
                <Icon 
                  name={userVote === 'approve' ? 'ThumbsUp' : 'ThumbsDown'} 
                  size={20} 
                  className={userVote === 'approve' ? 'text-success' : 'text-warning'}
                />
                <span className="font-medium text-foreground">
                  You are voting to {userVote} this project
                </span>
              </div>
              
              <Input
                label="Verification Comment"
                type="text"
                placeholder="Explain your verification decision..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                description="Provide detailed feedback to help the community understand your decision"
                required
              />
              
              <div className="flex space-x-4">
                <Button
                  variant="default"
                  iconName="Send"
                  iconPosition="left"
                  onClick={handleVoteSubmit}
                  disabled={!comment.trim()}
                >
                  Submit Vote
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowVoteForm(false);
                    setUserVote(null);
                    setComment('');
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Recent Validator Comments */}
      <div>
        <h3 className="text-xl font-semibold text-foreground mb-4">
          Validator Comments
        </h3>
        <div className="space-y-4">
          {recentValidators.map((validator) => (
            <div key={validator.id} className="bg-surface rounded-lg p-6">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                  <Image
                    src={validator.avatar}
                    alt={validator.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <h4 className="font-medium text-foreground">
                        {validator.name}
                      </h4>
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                        validator.vote === 'approve' ?'bg-success/10 text-success' :'bg-warning/10 text-warning'
                      }`}>
                        <Icon 
                          name={validator.vote === 'approve' ? 'ThumbsUp' : 'ThumbsDown'} 
                          size={12} 
                          className="inline mr-1"
                        />
                        {validator.vote === 'approve' ? 'Approved' : 'Requested Changes'}
                      </div>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {validator.timestamp}
                    </span>
                  </div>
                  <div className="text-sm text-muted-foreground mb-2">
                    {validator.expertise}
                  </div>
                  <p className="text-sm text-foreground leading-relaxed">
                    {validator.comment}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Verification Badges */}
      <div>
        <h3 className="text-xl font-semibold text-foreground mb-4">
          Verification Badges
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {project.verificationBadges.map((badge, index) => (
            <div key={index} className="bg-surface rounded-lg p-4 flex items-center space-x-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                badge.earned ? 'bg-success' : 'bg-muted'
              }`}>
                <Icon 
                  name={badge.icon} 
                  size={20} 
                  color={badge.earned ? 'white' : '#4A5D4F'} 
                />
              </div>
              <div>
                <h4 className={`font-medium ${
                  badge.earned ? 'text-foreground' : 'text-muted-foreground'
                }`}>
                  {badge.name}
                </h4>
                <p className="text-sm text-muted-foreground">
                  {badge.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProjectVerification;