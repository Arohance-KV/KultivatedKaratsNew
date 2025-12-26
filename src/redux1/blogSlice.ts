import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

const BASE_URL = 'https://kk-server-lqp8.onrender.com';

// Types
export interface BlogAuthor {
  name?: string;
  avatar?: string;
}

export interface Blog {
  _id: string;
  title: string;
  slug?: string;
  content: string;
  excerpt?: string;
  author?: BlogAuthor;
  featuredImage?: string;
  tags?: string[];
  categories?: string[];
  publishedAt?: string;
  isPublished?: boolean;
  views?: number;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  data: T;
  statusCode: number;
  success: boolean;
}

interface BlogState {
  blogs: Blog[];
  selectedBlog: Blog | null;
  loading: boolean;
  error: string | null;
  pagination?: {
    currentPage: number;
    totalPages: number;
    total: number;
  };
}

const initialState: BlogState = {
  blogs: [],
  selectedBlog: null,
  loading: false,
  error: null,
};

// Async Thunks

export const fetchAllBlogs = createAsyncThunk<
  Blog[],
  void,
  { rejectValue: string }
>(
  'blog/fetchAllBlogs',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${BASE_URL}/blog`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: ApiResponse<Blog[]> = await response.json();
      return result.data;
    } catch (error: any) {
      return rejectWithValue(
        error.message || 'Failed to fetch blogs'
      );
    }
  }
);

export const fetchBlogById = createAsyncThunk<
  Blog,
  string,
  { rejectValue: string }
>(
  'blog/fetchBlogById',
  async (blogId, { rejectWithValue }) => {
    try {
      const response = await fetch(`${BASE_URL}/blog/${blogId}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: ApiResponse<Blog> = await response.json();
      return result.data;
    } catch (error: any) {
      return rejectWithValue(
        error.message || 'Failed to fetch blog'
      );
    }
  }
);

// Slice
const blogSlice = createSlice({
  name: 'blog',
  initialState,
  reducers: {
    clearSelectedBlog: (state) => {
      state.selectedBlog = null;
    },
    clearBlogs: (state) => {
      state.blogs = [];
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch All Blogs
    builder
      .addCase(fetchAllBlogs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllBlogs.fulfilled, (state, action: PayloadAction<Blog[]>) => {
        state.loading = false;
        state.blogs = action.payload;
      })
      .addCase(fetchAllBlogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'An error occurred';
      });

    // Fetch Blog By ID
    builder
      .addCase(fetchBlogById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBlogById.fulfilled, (state, action: PayloadAction<Blog>) => {
        state.loading = false;
        state.selectedBlog = action.payload;
      })
      .addCase(fetchBlogById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'An error occurred';
      });
  },
});

export const { clearSelectedBlog, clearBlogs, clearError } = blogSlice.actions;
export default blogSlice.reducer;

// Selectors
export const selectBlogs = (state: { blog: BlogState }) => state.blog.blogs;

export const selectSelectedBlog = (state: { blog: BlogState }) => state.blog.selectedBlog;

export const selectBlogsByTag = (state: { blog: BlogState }, tag: string) =>
  state.blog.blogs.filter(blog => blog.tags?.includes(tag));

export const selectBlogsByCategory = (state: { blog: BlogState }, category: string) =>
  state.blog.blogs.filter(blog => blog.categories?.includes(category));

export const selectPublishedBlogs = (state: { blog: BlogState }) =>
  state.blog.blogs.filter(blog => blog.isPublished);

export const selectRecentBlogs = (state: { blog: BlogState }, limit: number = 5) =>
  [...state.blog.blogs]
    .sort((a, b) => new Date(b.publishedAt || b.createdAt).getTime() - new Date(a.publishedAt || a.createdAt).getTime())
    .slice(0, limit);
