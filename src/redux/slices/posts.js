import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from '../../axios'

export const fetchPosts = createAsyncThunk(
	'posts/fetchPosts',
	async (sortType = 'new') => {
		const { data } = await axios.get(`/posts?sort=${sortType}`)
		return data
	}
)

export const fetchTags = createAsyncThunk('posts/fetchTags', async () => {
	const { data } = await axios.get('/tags')
	return data
})

export const fetchRemovePost = createAsyncThunk(
	'posts/fetchRemovePost',
	async id => {
		axios.delete(`/posts/${id}`)
	}
)

export const fetchPostsByTag = createAsyncThunk(
	'posts/fetchPostsByTag',
	async tagName => {
		const { data } = await axios.get(`/posts/tags/${tagName}`)
		return data
	}
)

const initialState = {
	posts: {
		items: [],
		status: 'loading',
	},
	tags: {
		items: [],
		status: 'loading',
	},
}

const postsSlice = createSlice({
	name: 'posts',
	initialState,
	reducers: {},
	extraReducers: builder => {
		builder
			// Получение статей
			.addCase(fetchPosts.pending, state => {
				state.posts.items = []
				state.posts.status = 'loading'
			})
			.addCase(fetchPosts.fulfilled, (state, action) => {
				state.posts.items = action.payload
				state.posts.status = 'loaded'
			})
			.addCase(fetchPosts.rejected, state => {
				state.posts.items = []
				state.posts.status = 'error'
			})

			// Получение тегов
			.addCase(fetchTags.pending, state => {
				state.tags.items = []
				state.tags.status = 'loading'
			})
			.addCase(fetchTags.fulfilled, (state, action) => {
				state.tags.items = action.payload
				state.tags.status = 'loaded'
			})
			.addCase(fetchTags.rejected, state => {
				state.tags.items = []
				state.tags.status = 'error'
			})

			// Удаление статей
			.addCase(fetchRemovePost.pending, (state, action) => {
				state.posts.items = state.posts.items.filter(
					obj => obj._id !== action.meta.arg
				)
			})

			.addCase(fetchPostsByTag.pending, state => {
				state.posts.items = []
				state.posts.status = 'loading'
			})
			.addCase(fetchPostsByTag.fulfilled, (state, action) => {
				state.posts.items = action.payload
				state.posts.status = 'loaded'
			})
			.addCase(fetchPostsByTag.rejected, state => {
				state.posts.items = []
				state.posts.status = 'error'
			})
	},
})
export const postsReducer = postsSlice.reducer
