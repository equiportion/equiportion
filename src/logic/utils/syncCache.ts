/**
 * Cache for Matrix sync data. Stores raw event JSON per room so that
 * room.sync() can replay them on app restart, enabling incremental sync
 * via the cached nextBatch token.
 */

/** Increment when the cache format changes to auto-invalidate old caches */
const CACHE_VERSION = 1;

/** Maximum number of timeline events to keep per room */
const MAX_TIMELINE_EVENTS_PER_ROOM = 500;

interface CachedRoom {
  /** Accumulated state events, deduplicated by (type, state_key) */
  stateEvents: any[];
  /** Accumulated timeline events, deduplicated by event_id */
  timelineEvents: any[];
}

interface SyncCacheData {
  /** Schema version for cache invalidation across app updates */
  version: number;
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
 * Timeline events are appended, deduplicated by event_id, and trimmed to MAX_TIMELINE_EVENTS_PER_ROOM.
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

  // Evict oldest timeline events if over the limit
  if (result.timelineEvents.length > MAX_TIMELINE_EVENTS_PER_ROOM) {
    result.timelineEvents = result.timelineEvents.slice(-MAX_TIMELINE_EVENTS_PER_ROOM);
  }

  return result;
}

/**
 * Persists the sync cache to localStorage.
 */
function persistSyncCache(data: SyncCacheData): void {
  try {
    data.version = CACHE_VERSION;
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
    const parsed = JSON.parse(raw);
    if (parsed.version !== CACHE_VERSION) {
      clearSyncCache();
      return null;
    }
    return parsed;
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
