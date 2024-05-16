import Grid from '@mui/material/Grid'
import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'
import { useEffect, useState } from 'react'

import { useDispatch, useSelector } from 'react-redux'
import { CommentsBlock } from '../components/CommentsBlock/CommentsBlock'
import { Post } from '../components/Post'
import { TagsBlock } from '../components/TagsBlock'
import { fetchPosts, fetchTags } from '../redux/slices/posts'

export const Home = () => {
	const dispatch = useDispatch()
	const userData = useSelector(state => state.auth.data)
	const { posts, tags } = useSelector(state => state.posts)
	const [sortType, setSortType] = useState('new')
	const [selectedTab, setSelectedTab] = useState('new')
	const isPostsLoading = posts.status === 'loading'
	const isTagsLoading = tags.status === 'loading'

	const handleFetchPosts = type => {
		setSortType(type)
		dispatch(fetchPosts(type))
	}

	const handleChange = (event, newValue) => {
		setSelectedTab(newValue)
		handleFetchPosts(newValue)
	}

	useEffect(() => {
		handleFetchPosts(selectedTab)
		dispatch(fetchTags())
	}, [])

	return (
		<>
			<Tabs
				style={{ marginBottom: 15 }}
				value={selectedTab}
				onChange={handleChange}
				indicatorColor='primary'
				textColor='primary'
				aria-label='basic tabs example'
			>
				<Tab label='Новые' value='new' />
				<Tab label='Популярные' value='popular' />
			</Tabs>
			<Grid container spacing={4}>
				<Grid xs={8} item>
					{(isPostsLoading ? [...Array(5)] : posts.items).map((obj, index) =>
						isPostsLoading ? (
							<Post key={index} isLoading={true} />
						) : (
							<Post
								key={obj._id}
								id={obj._id}
								title={obj.title}
								imageUrl={
									obj.imageUrl ? `http://localhost:4444${obj.imageUrl}` : ''
								}
								user={obj.user}
								createdAt={obj.createdAt}
								viewsCount={obj.viewsCount}
								commentsCount={obj.commentsCount}
								tags={obj.tags}
								isEditable={userData?._id === obj.user._id}
							/>
						)
					)}
				</Grid>
				<Grid xs={4} item>
					<TagsBlock items={tags.items} isLoading={isTagsLoading} />
					<CommentsBlock
						items={[
							{
								user: {
									fullName: 'Вася Пупкин',
									avatarUrl: 'https://mui.com/static/images/avatar/1.jpg',
								},
								text: 'Это тестовый комментарий',
							},
							{
								user: {
									fullName: 'Иван Иванов',
									avatarUrl: 'https://mui.com/static/images/avatar/2.jpg',
								},
								text: 'Это тестовый комментарий',
							},
						]}
						isLoading={false}
					/>
				</Grid>
			</Grid>
		</>
	)
}
