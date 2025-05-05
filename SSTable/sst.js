const fs = require('fs').promises;
const path = require('path');

class SSTable {
  constructor(directory, filename) {
    this.filePath = path.join(directory, filename);
    this.index = new Map(); // In-memory sparse index
    this.size = 0;
  }

  // Write a batch of sorted key-value pairs to disk
  async write(pairs) {
    // Ensure pairs are sorted by key
    const sortedPairs = [...pairs].sort((a, b) => a.key.localeCompare(b.key));
    
    let offset = 0;
    let buffer = '';

    // Build data and index
    for (const { key, value } of sortedPairs) {
      const record = `${key}:${value}\n`;
      buffer += record;
      
      // Store offset in index (sparse: every Nth record or based on strategy)
      if (this.size % 10 === 0) { // Example: index every 10th record
        this.index.set(key, offset);
      }
      
      offset += Buffer.byteLength(record);
      this.size++;
    }

    // Append to file
    await fs.appendFile(this.filePath, buffer);
  }

  // Read a value by key
  async get(key) {
    // Find the closest indexed key <= target key
    let closestKey = null;
    let closestOffset = 0;
    
    for (const [indexedKey, offset] of this.index) {
      if (indexedKey <= key && (!closestKey || indexedKey > closestKey)) {
        closestKey = indexedKey;
        closestOffset = offset;
      }
    }

    if (!closestKey) return null;

    // Read from file starting at closest offset
    const fd = await fs.open(this.filePath, 'r');
    const buffer = Buffer.alloc(1024); // Adjustable read buffer
    let position = closestOffset;
    let result = null;

    while (true) {
      const { bytesRead } = await fd.read(buffer, 0, buffer.length, position);
      if (bytesRead === 0) break;

      const chunk = buffer.slice(0, bytesRead).toString();
      const lines = chunk.split('\n').filter(line => line);

      for (const line of lines) {
        const [recordKey, value] = line.split(':');
        if (recordKey === key) {
          result = value;
          break;
        }
        if (recordKey > key) {
          break; // Key not found (passed sorted position)
        }
      }

      if (result) break;
      position += bytesRead;
    }

    await fd.close();
    return result;
  }

  // Optional: Load index from existing file (for recovery)
  async loadIndex() {
    try {
      const data = await fs.readFile(this.filePath, 'utf8');
      const lines = data.split('\n').filter(line => line);
      let offset = 0;

      this.index.clear();
      this.size = 0;

      for (let i = 0; i < lines.length; i++) {
        const [key] = lines[i].split(':');
        if (i % 10 === 0) { // Rebuild sparse index
          this.index.set(key, offset);
        }
        offset += Buffer.byteLength(lines[i] + '\n');
        this.size++;
      }
    } catch (err) {
      if (err.code === 'ENOENT') {
        // File doesn't exist yet
        this.index.clear();
        this.size = 0;
      } else {
        throw err;
      }
    }
  }
}

// Example usage
async function main() {
  const sstable = new SSTable('./data', 'sstable.dat');
  
  // Initialize or load existing SSTable
  await sstable.loadIndex();

  // Write some data
  const pairs = [
    { key: 'apple', value: 'fruit' },
    { key: 'banana', value: 'fruit' },
    { key: 'carrot', value: 'vegetable' }
  ];
  await sstable.write(pairs);

  // Read some values
  console.log(await sstable.get('banana')); // Output: fruit
  console.log(await sstable.get('carrot')); // Output: vegetable
  console.log(await sstable.get('missing')); // Output: null
}

main().catch(console.error);