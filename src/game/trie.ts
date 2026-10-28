export interface TrieNode {
  children: Map<string, TrieNode>;
  /** True if the letters on the way down to this node spell a complete word. */
  isWord: boolean;
}

function createNode(): TrieNode {
  return { children: new Map(), isWord: false };
}

export function buildTrie(words: Iterable<string>): TrieNode {
  const root = createNode();
  for (const word of words) {
    let node = root;
    for (const letter of word) {
      let child = node.children.get(letter);
      if (!child) {
        child = createNode();
        node.children.set(letter, child);
      }
      node = child;
    }
    node.isWord = true;
  }
  return root;
}

/**
 * Follows `prefix` down from `node`. Returns the node it ends on,
 * or undefined if no word starts with that prefix.
 */
export function findNode(node: TrieNode, prefix: string): TrieNode | undefined {
  let current: TrieNode | undefined = node;
  for (const letter of prefix) {
    current = current.children.get(letter);
    if (!current) {
      return undefined;
    }
  }
  return current;
}

export function isWord(root: TrieNode, word: string): boolean {
  return findNode(root, word)?.isWord ?? false;
}
