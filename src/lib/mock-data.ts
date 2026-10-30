export interface User {
  id: string;
  name: string;
  email: string;
  image: string | null;
  isPro: boolean;
}

export interface ItemType {
  id: string;
  name: string;
  slug: string;
  icon: string;
  color: string;
  itemCount: number;
}

export interface Collection {
  id: string;
  name: string;
  description: string;
  isFavorite: boolean;
  itemCount: number;
  // Ordered by most common first; the first type sets the card color
  itemTypeIds: string[];
}

export interface Item {
  id: string;
  title: string;
  description: string;
  itemTypeId: string;
  collectionIds: string[];
  tags: string[];
  content?: string;
  language?: string;
  url?: string;
  fileName?: string;
  isFavorite: boolean;
  isPinned: boolean;
  lastUsedAt: string;
}

export const currentUser: User = {
  id: "user-1",
  name: "John Doe",
  email: "john@example.com",
  image: null,
  isPro: true,
};

export const itemTypes: ItemType[] = [
  {
    id: "type-snippet",
    name: "Snippets",
    slug: "snippets",
    icon: "Code",
    color: "#3b82f6",
    itemCount: 24,
  },
  {
    id: "type-prompt",
    name: "Prompts",
    slug: "prompts",
    icon: "Sparkles",
    color: "#8b5cf6",
    itemCount: 18,
  },
  {
    id: "type-command",
    name: "Commands",
    slug: "commands",
    icon: "Terminal",
    color: "#f97316",
    itemCount: 15,
  },
  {
    id: "type-note",
    name: "Notes",
    slug: "notes",
    icon: "StickyNote",
    color: "#fde047",
    itemCount: 12,
  },
  {
    id: "type-file",
    name: "Files",
    slug: "files",
    icon: "File",
    color: "#6b7280",
    itemCount: 5,
  },
  {
    id: "type-image",
    name: "Images",
    slug: "images",
    icon: "Image",
    color: "#ec4899",
    itemCount: 3,
  },
  {
    id: "type-link",
    name: "Links",
    slug: "links",
    icon: "Link",
    color: "#10b981",
    itemCount: 8,
  },
];

export const collections: Collection[] = [
  {
    id: "collection-react-patterns",
    name: "React Patterns",
    description: "Common React patterns and hooks",
    isFavorite: true,
    itemCount: 12,
    itemTypeIds: ["type-snippet", "type-note", "type-link"],
  },
  {
    id: "collection-python-snippets",
    name: "Python Snippets",
    description: "Useful Python code snippets",
    isFavorite: false,
    itemCount: 8,
    itemTypeIds: ["type-snippet", "type-note"],
  },
  {
    id: "collection-context-files",
    name: "Context Files",
    description: "AI context files for projects",
    isFavorite: true,
    itemCount: 5,
    itemTypeIds: ["type-file", "type-note"],
  },
  {
    id: "collection-interview-prep",
    name: "Interview Prep",
    description: "Technical interview preparation",
    isFavorite: false,
    itemCount: 24,
    itemTypeIds: ["type-note", "type-snippet", "type-link", "type-prompt"],
  },
  {
    id: "collection-git-commands",
    name: "Git Commands",
    description: "Frequently used git commands",
    isFavorite: true,
    itemCount: 15,
    itemTypeIds: ["type-command", "type-note"],
  },
  {
    id: "collection-ai-prompts",
    name: "AI Prompts",
    description: "Curated AI prompts for coding",
    isFavorite: false,
    itemCount: 18,
    itemTypeIds: ["type-prompt", "type-snippet", "type-note"],
  },
];

export const items: Item[] = [
  {
    id: "item-use-auth-hook",
    title: "useAuth Hook",
    description: "Custom authentication hook for React applications",
    itemTypeId: "type-snippet",
    collectionIds: ["collection-react-patterns", "collection-interview-prep"],
    tags: ["react", "auth", "hooks"],
    content: `export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}`,
    language: "typescript",
    isFavorite: true,
    isPinned: true,
    lastUsedAt: "2026-01-15T10:30:00.000Z",
  },
  {
    id: "item-api-error-handling",
    title: "API Error Handling Pattern",
    description: "Fetch wrapper with exponential backoff retry logic",
    itemTypeId: "type-snippet",
    collectionIds: ["collection-react-patterns"],
    tags: ["api", "fetch", "error-handling"],
    content: `export async function fetchWithRetry(url: string, retries = 3): Promise<Response> {
  for (let attempt = 0; attempt < retries; attempt++) {
    const response = await fetch(url);
    if (response.ok) return response;
    await new Promise((resolve) => setTimeout(resolve, 2 ** attempt * 1000));
  }
  throw new Error("Request failed after retries");
}`,
    language: "typescript",
    isFavorite: false,
    isPinned: true,
    lastUsedAt: "2026-01-12T16:45:00.000Z",
  },
  {
    id: "item-python-read-json",
    title: "Read JSON File",
    description: "Load and parse a JSON file with a context manager",
    itemTypeId: "type-snippet",
    collectionIds: ["collection-python-snippets"],
    tags: ["python", "json", "files"],
    content: `import json

with open("data.json") as file:
    data = json.load(file)`,
    language: "python",
    isFavorite: false,
    isPinned: false,
    lastUsedAt: "2026-01-11T09:15:00.000Z",
  },
  {
    id: "item-code-review-prompt",
    title: "Code Review Prompt",
    description: "Review code for bugs, security issues and readability",
    itemTypeId: "type-prompt",
    collectionIds: ["collection-ai-prompts"],
    tags: ["ai", "code-review"],
    content:
      "Review the following code. List bugs, security issues and readability problems, ordered by severity, with a suggested fix for each.",
    isFavorite: true,
    isPinned: false,
    lastUsedAt: "2026-01-10T14:20:00.000Z",
  },
  {
    id: "item-undo-last-commit",
    title: "Undo Last Commit",
    description: "Undo the last commit and keep the changes staged",
    itemTypeId: "type-command",
    collectionIds: ["collection-git-commands"],
    tags: ["git", "commit"],
    content: "git reset --soft HEAD~1",
    language: "bash",
    isFavorite: false,
    isPinned: false,
    lastUsedAt: "2026-01-09T11:05:00.000Z",
  },
  {
    id: "item-big-o-notes",
    title: "Big O Cheat Sheet",
    description: "Time complexity of common operations and algorithms",
    itemTypeId: "type-note",
    collectionIds: ["collection-interview-prep"],
    tags: ["algorithms", "interview"],
    content:
      "- Array access: O(1)\n- Binary search: O(log n)\n- Linear search: O(n)\n- Merge sort: O(n log n)",
    language: "markdown",
    isFavorite: false,
    isPinned: false,
    lastUsedAt: "2026-01-08T08:40:00.000Z",
  },
  {
    id: "item-react-docs",
    title: "React Docs",
    description: "Official React documentation",
    itemTypeId: "type-link",
    collectionIds: ["collection-react-patterns", "collection-interview-prep"],
    tags: ["react", "docs"],
    url: "https://react.dev",
    isFavorite: false,
    isPinned: false,
    lastUsedAt: "2026-01-07T13:00:00.000Z",
  },
  {
    id: "item-project-context",
    title: "Project Context File",
    description: "Base AI context file for new projects",
    itemTypeId: "type-file",
    collectionIds: ["collection-context-files"],
    tags: ["ai", "context"],
    fileName: "CLAUDE.md",
    isFavorite: false,
    isPinned: false,
    lastUsedAt: "2026-01-06T17:30:00.000Z",
  },
  {
    id: "item-dashboard-wireframe",
    title: "Dashboard Wireframe",
    description: "Early wireframe of the dashboard layout",
    itemTypeId: "type-image",
    collectionIds: [],
    tags: ["design", "wireframe"],
    fileName: "dashboard-wireframe.png",
    isFavorite: false,
    isPinned: false,
    lastUsedAt: "2026-01-05T12:10:00.000Z",
  },
];
