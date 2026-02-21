import Card from './Card';
import Button from './Button';

export default function CandidateCard({ candidate, onVote, canVote, showVotes = false }) {
  return (
    <Card className="hover:border-slate-600/50 transition-colors">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-white">{candidate.name}</h3>
          <p className="text-emerald-400/90 text-sm font-medium">{candidate.party}</p>
          {candidate.manifesto && (
            <p className="text-slate-400 text-sm mt-1 line-clamp-2">{candidate.manifesto}</p>
          )}
          {showVotes && (
            <p className="text-slate-300 mt-2 font-medium">
              Votes: <span className="text-emerald-400">{candidate.votes || 0}</span>
            </p>
          )}
        </div>
        {canVote && onVote && (
          <Button onClick={() => onVote(candidate.id)} className="shrink-0">
            Vote
          </Button>
        )}
      </div>
    </Card>
  );
}
