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

const commentsSlice = createSlice({
	name: 'comments',
	initialState: {
		comments: [],
		addCommentStatus: null,
		addCommentError: null,
	},
	reducers: {},
	extraReducers: builder => {
		builder.addCase(fetchAddComment.pending, state => {
			state.addCommentStatus = 'loading'
			state.addCommentError = null
		})

		builder.addCase(fetchAddComment.fulfilled, (state, action) => {
			state.comments.push(action.payload)
			state.addCommentStatus = 'succeeded'
			state.addCommentError = null
		})

		builder.addCase(fetchAddComment.rejected, (state, action) => {
			state.addCommentStatus = 'failed'
			state.addCommentError =
				action.payload || 'Не удалось добавить комментарий.'
		})
	},
})

export const commentsReducer = commentsSlice.reducer
