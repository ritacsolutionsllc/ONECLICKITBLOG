export type Slug = string;

export interface Author {
  id: string;
  name: string;
  image?: string;
  bio?: string;
  twitter?: string;
}

export interface Category {
  id: string;
  slug: Slug;
  name: string;
  description?: string;
  seoTitle?: string;
  seoDescription?: string;
}

export interface Tag {
  id: string;
  slug: Slug;
  name: string;
}

export interface Post {
  id: string;
  slug: Slug;
  title: string;
  description: string;
  /** CMS-rendered body (HTML or MD). Renderer lives in <ArticleBody />. */
  content: string;
  image?: string | null;
  /** ISO 8601 */
  publishedAt: string;
  /** ISO 8601 */
  updatedAt?: string;
  author: Author;
  categories: Category[];
  tags: Tag[];
  readingTimeMin?: number;
}

export interface FeaturedContent {
  hero: Post;
  /** 2 to 4 supporting cards rendered alongside the hero. */
  secondary: Post[];
}

export interface PaginatedPosts {
  posts: Post[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
