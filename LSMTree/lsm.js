const fs = require('fs').promises; // For file-based WAL simulation
const path = require('path');

// Simple Memtable implementation using a Map
class Memtable {
  constructor() {
    this.data = new Map();
  }

  set(key, value) {
    this.data.set(key, value);
  }

  get(key) {
    return this.data.get(key);
  }

  clear() {
    this.data.clear();
  }

  entries() {
    return Array.from(this.data.entries()).sort((a, b) => a[0].localeCompare(b[0]));
  }

  size() {
    return this.data.size;
  }
}

// Write-Ahead Log for durability
class WAL {
  constructor(logFile) {
    this.logFile = logFile;
  }

  async append(operation) {
    await fs.appendFile(this.logFile, JSON.stringify(operation) + '\n');
  }

  async recover() {
    try {
      const content = await fs.readFile(this.logFile, 'utf-8');
      const operations = content.trim().split('\n').map(JSON.parse);
      const memtable = new Memtable();
      for (const op of operations) {
        if (op.type === 'set') {
          memtable.set(op.key, op.value);
        }
      }
      return memtable;
    } catch (err) {
      return new Memtable(); // Return empty memtable if no log exists
    }
  }

  async clear() {
    await fs.writeFile(this.logFile, '');
  }
}

// SSTable simulation (in-memory sorted key-value store)
class SSTable {
  constructor(id) {
    this.id = id;
    this.data = []; // Array of [key, value] pairs, sorted by key
  }

  static fromEntries(entries) {
    const sstable = new SSTable(Date.now());
    sstable.data = entries.sort((a, b) => a[0].localeCompare(b[0]));
    return sstable;
  }

  get(key) {
    // Binary search for the key
    let left = 0, right = this.data.length - 1;
    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      const [k, v] = this.data[mid];
      if (k === key) return v;
      if (k < key) left = mid + 1;
      else right = mid - 1;
    }
    return undefined;
  }
}

// LSM Tree implementation
class LSMTree {
  constructor(directory, memtableSize = 1000) {
    this.directory = directory;
    this.memtableSize = memtableSize;
    this.memtable = new Memtable();
    this.wal = new WAL(path.join(directory, 'wal.log'));
    this.sstables = []; // Array of SSTables
  }

  async init() {
    // Recover memtable from WAL
    this.memtable = await this.wal.recover();
  }

  async set(key, value) {
    // Append to WAL
    await this.wal.append({ type: 'set', key, value });

    // Update memtable
    this.memtable.set(key, value);

    // Flush memtable to SSTable if it exceeds size
    if (this.memtable.size() >= this.memtableSize) {
      await this.flush();
    }
  }

  async get(key) {
    // Check memtable first
    const value = this.memtable.get(key);
    if (value !== undefined) return value;

    // Check SSTables (newest to oldest)
    for (let i = this.sstables.length - 1; i >= 0; i--) {
      const value = this.sstables[i].get(key);
      if (value !== undefined) return value;
    }

    return undefined; // Key not found
  }

  async flush() {
    // Create SSTable from memtable
    const entries = this.memtable.entries();
    if (entries.length === 0) return;

    const sstable = SSTable.fromEntries(entries);
    this.sstables.push(sstable);

    // Clear memtable and WAL
    this.memtable.clear();
    await this.wal.clear();

    // Trigger compaction if needed
    await this.compact();
  }

  async compact() {
    // Simple compaction: merge all SSTables into one if there are too many
    if (this.sstables.length <= 2) return;

    // Merge all SSTables
    let merged = [];
    for (const sstable of this.sstables) {
      merged.push(...sstable.data);
    }

    // Remove duplicates, keep latest value for each key
    const unique = new Map();
    for (const [key, value] of merged) {
      unique.set(key, value);
    }

    // Create new SSTable
    const newSSTable = SSTable.fromEntries(Array.from(unique.entries()));
    this.sstables = [newSSTable];
  }
}

// Example usage
async function main() {
  const lsm = new LSMTree('./lsm_data');
  await lsm.init();

  // Insert some data
  await lsm.set('key1', 'value1');
  await lsm.set('key2', 'value2');
  await lsm.set('key1', 'updated_value1'); // Update existing key

  // Read data
  console.log(await lsm.get('key1')); // Output: updated_value1
  console.log(await lsm.get('key2')); // Output: value2
  console.log(await lsm.get('key3')); // Output: undefined

  // Simulate memtable flush
  await lsm.set('key3', 'value3');
  await lsm.flush();

  // Read after flush
  console.log(await lsm.get('key1')); // Output: updated_value1
}

main().catch(console.error);