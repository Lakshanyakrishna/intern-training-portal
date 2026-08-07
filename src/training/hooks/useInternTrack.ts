import { useEffect, useState } from 'react';
import { getApplicationByUserId, getOpportunity } from '../../lib/db';
import { getTrainingTrackForForte } from '../config';
import type { TrainingTrackConfig } from '../config/types';

// The one real-data lookup in this whole skeleton: which forte the intern
// was accepted for (via their real, already-accepted application and its
// opportunity), used only to pick which mock TrainingTrackConfig to
// render. Everything downstream of this hook is mock/config-driven.
export function useInternTrack(userId: string | undefined) {
  const [track, setTrack] = useState<TrainingTrackConfig | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    let cancelled = false;
    (async () => {
      const app = await getApplicationByUserId(userId).catch(() => null);
      const opp = app?.opportunityId ? await getOpportunity(app.opportunityId).catch(() => null) : null;
      if (cancelled) return;
      setTrack(getTrainingTrackForForte(opp?.forte));
      setLoading(false);
    })();
    return () => { cancelled = true; };
  }, [userId]);

  return { track, loading };
}
