import React, { useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'

import axios from '../axios'

import { AddComment } from '../components/AddComment'
import { CommentsBlock } from '../components/CommentsBlock/CommentsBlock'
import { Post } from '../components/Post'

export const FullPost = () => {
	const [data, setData] = useState()
	const [comments, setComments] = useState([])
	const [isLoading, setIsLoading] = useState(true)
	const { id } = useParams()
	const userData = useSelector(state => state.auth.data)

	const handleAddComment = text => {
		axios
			.post(`/posts/${id}/comments`, { text })
			.then(response => {
				setComments(prevComments => [...prevComments, response.data])
			})
			.catch(error => {
				console.error('Ошибка при добавлении комментария:', error)
			})
	}

	useEffect(() => {
		const fetchData = async () => {
			setIsLoading(true)
			try {
				const postData = await axios.get(`/posts/${id}`)
				setData(postData.data)
				const commentsData = await axios.get(`/posts/${id}/comments`)
				setComments(commentsData.data)
			} catch (err) {
				console.warn(err)
				alert('Ошибка при получении статьи и комментариев')
			} finally {
				setIsLoading(false)
			}
		}

		fetchData()
	}, [id])

	if (isLoading) {
		return <Post isLoading={isLoading} isFullPost />
	}

	return (
		<>
			<Post
				id={data._id}
				title={data.title}
				imageUrl={data.imageUrl ? `http://localhost:4444${data.imageUrl}` : ''}
				user={data.user}
				createdAt={data.createdAt}
				viewsCount={data.viewsCount}
				commentsCount={comments.length}
				tags={data.tags}
				isFullPost
			>
				<ReactMarkdown children={data.text} />
			</Post>

			<CommentsBlock items={comments} isLoading={isLoading}>
				<AddComment
					onAddComment={handleAddComment}
					// userName={data.fullName}
					// userAvatarUrl={data.avatarUrl}
				/>
			</CommentsBlock>
		</>
	)
}
