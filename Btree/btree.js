class BTreeNode {
    constructor(leaf = true) {
        this.keys = []; // Array to store keys
        this.children = []; // Array to store child pointers
        this.leaf = leaf; // True if node is a leaf
    }
}

class BTree {
    constructor(t) {
        this.root = new BTreeNode(true);
        this.t = t; // Minimum degree
    }

    // Search for a key
    search(key) {
        return this._searchNode(this.root, key);
    }

    _searchNode(node, key) {
        let i = 0;
        while (i < node.keys.length && key > node.keys[i]) {
            i++;
        }
        if (i < node.keys.length && key === node.keys[i]) {
            return node;
        }
        if (node.leaf) {
            return null;
        }
        return this._searchNode(node.children[i], key);
    }

    // Insert a key
    insert(key) {
        let root = this.root;
        if (root.keys.length === 2 * this.t - 1) {
            let newRoot = new BTreeNode(false);
            newRoot.children.push(root);
            this._splitChild(newRoot, 0);
            this.root = newRoot;
            this._insertNonFull(newRoot, key);
        } else {
            this._insertNonFull(root, key);
        }
    }

    _insertNonFull(node, key) {
        let i = node.keys.length - 1;
        if (node.leaf) {
            node.keys.push(0);
            while (i >= 0 && key < node.keys[i]) {
                node.keys[i + 1] = node.keys[i];
                i--;
            }
            node.keys[i + 1] = key;
        } else {
            while (i >= 0 && key < node.keys[i]) {
                i--;
            }
            i++;
            if (node.children[i].keys.length === 2 * this.t - 1) {
                this._splitChild(node, i);
                if (key > node.keys[i]) {
                    i++;
                }
            }
            this._insertNonFull(node.children[i], key);
        }
    }

    _splitChild(parent, i) {
        let t = this.t;
        let child = parent.children[i];
        let newNode = new BTreeNode(child.leaf);
        newNode.keys = child.keys.splice(t, t - 1);
        if (!child.leaf) {
            newNode.children = child.children.splice(t, t);
        }
        parent.keys.splice(i, 0, child.keys[t - 1]);
        child.keys.length = t - 1;
        parent.children.splice(i + 1, 0, newNode);
    }

    // Delete a key
    delete(key) {
        this._delete(this.root, key);
        if (this.root.keys.length === 0 && !this.root.leaf) {
            this.root = this.root.children[0];
        }
    }

    _delete(node, key) {
        let i = 0;
        while (i < node.keys.length && key > node.keys[i]) {
            i++;
        }

        if (i < node.keys.length && key === node.keys[i]) {
            if (node.leaf) {
                node.keys.splice(i, 1); // Remove key from leaf
            } else {
                this._deleteInternalNode(node, key, i);
            }
        } else if (!node.leaf) {
            this._deleteFromSubtree(node, key, i);
        }
    }

    _deleteInternalNode(node, key, i) {
        let pred = this._getPredecessor(node, i);
        node.keys[i] = pred;
        this._delete(node.children[i], pred);
    }

    _getPredecessor(node, i) {
        let curr = node.children[i];
        while (!curr.leaf) {
            curr = curr.children[curr.children.length - 1];
        }
        return curr.keys[curr.keys.length - 1];
    }

    _deleteFromSubtree(node, key, i) {
        let child = node.children[i];
        if (child.keys.length < this.t) {
            this._fillChild(node, i);
        }
        if (i < node.children.length && node.children[i].keys.length >= this.t) {
            this._delete(node.children[i], key);
        } else {
            this._delete(node.children[i - 1], key);
        }
    }

    _fillChild(node, i) {
        let child = node.children[i];
        if (i > 0 && node.children[i - 1].keys.length >= this.t) {
            this._borrowFromPrev(node, i);
        } else if (i < node.children.length - 1 && node.children[i + 1].keys.length >= this.t) {
            this._borrowFromNext(node, i);
        } else {
            if (i < node.children.length - 1) {
                this._merge(node, i);
            } else {
                this._merge(node, i - 1);
            }
        }
    }

    _borrowFromPrev(node, i) {
        let child = node.children[i];
        let sibling = node.children[i - 1];
        child.keys.unshift(node.keys[i - 1]);
        if (!child.leaf) {
            child.children.unshift(sibling.children.pop());
        }
        node.keys[i - 1] = sibling.keys.pop();
    }

    _borrowFromNext(node, i) {
        let child = node.children[i];
        let sibling = node.children[i + 1];
        child.keys.push(node.keys[i]);
        if (!child.leaf) {
            child.children.push(sibling.children.shift());
        }
        node.keys[i] = sibling.keys.shift();
    }

    _merge(node, i) {
        let child = node.children[i];
        let sibling = node.children[i + 1];
        child.keys.push(node.keys[i]);
        child.keys = child.keys.concat(sibling.keys);
        if (!child.leaf) {
            child.children = child.children.concat(sibling.children);
        }
        node.keys.splice(i, 1);
        node.children.splice(i + 1, 1);
    }

    // In-order traversal
    traverse() {
        let result = [];
        this._traverseNode(this.root, result);
        return result;
    }

    _traverseNode(node, result) {
        let i;
        for (i = 0; i < node.keys.length; i++) {
            if (!node.leaf) {
                this._traverseNode(node.children[i], result);
            }
            result.push(node.keys[i]);
        }
        if (!node.leaf) {
            this._traverseNode(node.children[i], result);
        }
    }

    // Visualize tree structure
    visualize() {
        this._visualizeNode(this.root, 0);
    }

    _visualizeNode(node, level) {
        let indent = "  ".repeat(level);
        console.log(`${indent}Keys: [${node.keys.join(", ")}]`);
        if (!node.leaf) {
            for (let i = 0; i < node.children.length; i++) {
                console.log(`${indent}Child ${i}:`);
                this._visualizeNode(node.children[i], level + 1);
            }
        }
    }
}

// Example usage
let bTree = new BTree(3); // B-Tree with minimum degree 3
let keys = [10, 20, 30, 40, 50, 60, 70, 80, 90];

// Insert keys
for (let key of keys) {
    bTree.insert(key);
}

console.log("Tree after insertions:");
bTree.visualize();

console.log("\nIn-order traversal:", bTree.traverse().join(", "));

console.log("\nSearch 40:", bTree.search(40) ? "Found" : "Not Found");
console.log("Search 100:", bTree.search(100) ? "Found" : "Not Found");

console.log("\nDeleting 40...");
bTree.delete(40);

console.log("\nTree after deleting 40:");
bTree.visualize();

console.log("\nIn-order traversal after deletion:", bTree.traverse().join(", "));