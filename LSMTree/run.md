node lsm.js



Explanation
Memtable:
Uses a Map for fast key-value storage.

Stores data in-memory until it reaches a size threshold (memtableSize).

Write-Ahead Log (WAL):
Appends operations to a file (wal.log) before applying them to the memtable.

Supports recovery by replaying the log on startup.

SSTable:
Simulates a disk-based sorted key-value store using an in-memory array.

Uses binary search for efficient lookups.

LSMTree:
Manages the memtable, WAL, and SSTables.

set: Writes to WAL and memtable, flushes to SSTable when full.

get: Checks memtable first, then SSTables (newest to oldest).

flush: Converts memtable to an SSTable and clears the WAL.

compact: Merges SSTables to reduce their number (simple strategy: merge all if >2).

Limitations
In-Memory SSTables: Real LSM trees store SSTables on disk. This implementation keeps them in memory for simplicity.

Simple Compaction: The compaction strategy is basic (merge all SSTables). Real systems use leveled or tiered compaction.

No Deletion Support: This version doesn't handle deletions (e.g., tombstones).

No Error Handling: Limited error handling for brevity.

Single-Threaded: No concurrency control (real systems use locks or other mechanisms).

