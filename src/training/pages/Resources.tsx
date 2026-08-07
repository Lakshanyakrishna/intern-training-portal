import { MOCK_RESOURCES } from '../mock/resources';
import EmptyState from '../../applicant/components/EmptyState';
import { FileText, Globe, Upload, Video } from '../../components/Icons';

const KIND_ICON = { doc: FileText, video: Video, link: Globe, download: Upload } as const;

export default function Resources() {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="animate-[slideUp_0.35s_ease-out]">
        <h1 className="text-2xl font-bold text-primary">Resources</h1>
        <p className="text-sm text-secondary mt-1">Reference material for your track.</p>
      </div>

      <div className="bg-surface border border-line rounded-xl overflow-hidden animate-[slideUp_0.35s_ease-out_0.05s_both]">
        {MOCK_RESOURCES.length === 0 ? (
          <EmptyState icon={<FileText className="w-4 h-4" />} title="No resources yet" />
        ) : (
          <div className="divide-y divide-line">
            {MOCK_RESOURCES.map(r => {
              const Icon = KIND_ICON[r.kind];
              return (
                <div key={r.id} className="flex items-center gap-3 px-5 py-4 transition-colors hover:bg-surface-alt">
                  <Icon className="w-4 h-4 text-secondary shrink-0" />
                  <span className="text-sm text-primary flex-1 truncate">{r.title}</span>
                  <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-surface-alt text-secondary shrink-0 capitalize">{r.kind}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
