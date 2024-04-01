import CommentIcon from '@mui/icons-material/ChatBubbleOutlineOutlined'
import EyeIcon from '@mui/icons-material/RemoveRedEyeOutlined'
import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Post } from '../components/Post'
import styles from '../components/Post/Post.module.scss'
import { UserInfo } from '../components/UserInfo'

import axios from '../axios'

export const TagPage = () => {
	const [posts, setPosts] = useState([]) // Начальное значение - пустой массив
	const [isLoading, setIsLoading] = useState(true)
	const { tagName } = useParams()

	useEffect(() => {
		axios
			.get(`/posts/tags/${tagName}`)
			.then(res => {
				setPosts(res.data)
			})
			.catch(err => {
				console.warn(err)
				alert('Ошибка при получении статей с выбранным тегом')
			})
			.finally(() => {
				setIsLoading(false)
			})
	}, [tagName])

	if (isLoading) {
		return <Post isLoading={isLoading} /> // Предполагается наличие пропса isLoading в компоненте Post
	}

	return (
		<div>
			<h1 style={{ opacity: 0.4 }}>#{tagName}</h1>
			{posts.map(post => (
				<div key={post._id} className={styles.root}>
					<Link to={`/posts/${post._id}`}>
						<img
							className={styles.image}
							src={post.imageUrl ? `http://localhost:4444${post.imageUrl}` : ''}
							alt={post.title}
						/>
					</Link>
					<div className={styles.wrapper}>
						<UserInfo
							{...post.user}
							additionalText={new Date(post.createdAt).toLocaleDateString()}
						/>
						<div className={styles.indention}>
							<h2 className={styles.title}>
								<Link to={`/posts/${post._id}`}>{post.title}</Link>
							</h2>
							<ul className={styles.tags}>
								{post.tags.map((name, index) => (
									<li key={index}>
										<Link to={`/tags/${name}`}>#{name}</Link>
									</li>
								))}
							</ul>
							<ul className={styles.postDetails}>
								<li>
									<EyeIcon />
									<span>{post.viewsCount}</span>
								</li>
								<li>
									<CommentIcon />
									<span>{post.commentsCount}</span>
								</li>
							</ul>
						</div>
					</div>
				</div>
			))}
		</div>
	)
}
