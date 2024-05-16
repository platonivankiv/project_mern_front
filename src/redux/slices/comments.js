import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from '../../axios'

export const fetchAddComment = createAsyncThunk(
	'comments/fetchAddComment',
	async ({ postId, text }, { rejectWithValue }) => {
		try {
			const response = await axios.post(`/posts/${postId}/comments`, { text })
			return response.data
		} catch (error) {
			if (!error.response) {
				throw error
			}
			return rejectWithValue(error.response.data)
		}
	}
)

export const fetchEditComment = createAsyncThunk(
	'comments/fetchEditComment',
	async ({ commentId, text }, { rejectWithValue }) => {
		try {
			const response = await axios.patch(`/comments/${commentId}`, { text })
			return response.data
		} catch (error) {
			if (!error.response) {
				throw error
			}
			return rejectWithValue(error.response.data)
		}
	}
)

export const fetchRemoveComment = createAsyncThunk(
	'comments/fetchRemoveComment',
	async (id, { rejectWithValue }) => {
		try {
			const response = await axios.delete(`/comments/${id}`)
			return response.data
		} catch (error) {
			if (!error.response) {
				throw error
			}
			return rejectWithValue(error.response.data)
		}
	}
)
export default fetchRemoveComment

const commentsSlice = createSlice({
	name: 'comments',
	initialState: {
		comments: [],
		addCommentStatus: null,
		addCommentError: null,
	},
	reducers: {},
	extraReducers: builder => {
		builder
			// Получение комментариев
			.addCase(fetchAddComment.pending, state => {
				state.addCommentStatus = 'loading'
				state.addCommentError = null
			})

		builder.addCase(fetchAddComment.fulfilled, (state, action) => {
			state.comments.push(action.payload)
			state.addCommentStatus = 'succeeded'
			state.addCommentError = null
		})

		builder
			.addCase(fetchAddComment.rejected, (state, action) => {
				state.addCommentStatus = 'failed'
				state.addCommentError =
					action.payload || 'Не удалось добавить комментарий.'
			})

			// Удаление комментария
			.addCase(fetchRemoveComment.pending, (state, action) => {
				state.comments = state.comments.filter(
					comment => comment._id !== action.meta.arg
				)
			})

			.addCase(fetchRemoveComment.fulfilled, (state, action) => {
				state.comments = state.comments.filter(
					comment => comment._id !== action.meta.arg
				)
			})

			.addCase(fetchRemoveComment.rejected, (state, action) => {
				state.addCommentStatus = 'failed'
				state.addCommentError =
					action.payload || 'Не удалось удалить	 комментарий.'
			})
	},
})

export const commentsReducer = commentsSlice.reducer
