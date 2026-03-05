/**
 * Cache for Matrix sync data. Stores raw event JSON per room so that
 * room.sync() can replay them on app restart, enabling incremental sync
 * via the cached nextBatch token.
 */

interface CachedRoom {
  /** Accumulated state events, deduplicated by (type, state_key) */
  stateEvents: any[];
  /** Accumulated timeline events, deduplicated by event_id */
  timelineEvents: any[];
}

interface SyncCacheData {
  /** The next_batch token for incremental sync */
  nextBatch: string;
  /** Accumulated raw events for all joined rooms */
  joinedRooms: {[roomId: string]: CachedRoom};
  /** Accumulated raw events for all invited rooms */
  invitedRooms: {[roomId: string]: CachedRoom};
  /** Cached user profile */
  userProfile?: {userId: string; displayname?: string; avatarUrl?: string};
}

const CACHE_KEY = 'matrix_sync_cache';

/**
 * Accumulates new raw event data into an existing room cache entry.
 * State events are replaced by (type, state_key) key.
 * Timeline events are appended and deduplicated by event_id.
 */
function accumulateRoomEvents(existing: CachedRoom | undefined, newData: any): CachedRoom {
  const result: CachedRoom = existing
    ? {stateEvents: [...existing.stateEvents], timelineEvents: [...existing.timelineEvents]}
    : {stateEvents: [], timelineEvents: []};

  // Accumulate state events (replace by type + state_key)
  const stateEvents = newData.state?.events || [];
  for (const event of stateEvents) {
    const idx = result.stateEvents.findIndex(
      (e: any) => e.type === event.type && e.state_key === event.state_key
    );
    if (idx >= 0) {
      result.stateEvents[idx] = event;
    } else {
      result.stateEvents.push(event);
    }
  }

  // Accumulate timeline events (deduplicate by event_id)
  const timelineEvents = newData.timeline?.events || [];
  const existingIds = new Set(result.timelineEvents.map((e: any) => e.event_id));
  for (const event of timelineEvents) {
    if (!existingIds.has(event.event_id)) {
      result.timelineEvents.push(event);
      existingIds.add(event.event_id);
    }
  }

  // Handle invite_state (same dedup logic as state events)
  const inviteEvents = newData.invite_state?.events || [];
  for (const event of inviteEvents) {
    const idx = result.stateEvents.findIndex(
      (e: any) => e.type === event.type && e.state_key === event.state_key
    );
    if (idx >= 0) {
      result.stateEvents[idx] = event;
    } else {
      result.stateEvents.push(event);
    }
  }

  return result;
}

/**
 * Persists the sync cache to localStorage.
 */
function persistSyncCache(data: SyncCacheData): void {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(data));
  } catch {
    // Ignore localStorage quota errors
  }
}

/**
 * Loads the sync cache from localStorage.
 * @returns the cached data, or null if no cache exists or it's corrupted
 */
function loadSyncCache(): SyncCacheData | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

/**
 * Clears the sync cache from localStorage.
 */
function clearSyncCache(): void {
  localStorage.removeItem(CACHE_KEY);
}

export {accumulateRoomEvents, persistSyncCache, loadSyncCache, clearSyncCache};
export type {CachedRoom, SyncCacheData};
