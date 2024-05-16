import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import { IconButton } from '@mui/material'
import Avatar from '@mui/material/Avatar'
import Divider from '@mui/material/Divider'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import ListItemText from '@mui/material/ListItemText'
import Skeleton from '@mui/material/Skeleton'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import fetchRemoveComment from '../../redux/slices/comments'
import { SideBlock } from '../SideBlock'
import styles from './CommentsBlock.module.scss'

export const CommentsBlock = ({
	id,
	items = [],
	children,
	isLoading = true,
}) => {
	const dispatch = useDispatch()
	const userData = useSelector(state => state.auth.data)

	const isEditable = (commentUserId, currentUserId) => {
		return commentUserId === currentUserId
	}

	const onClickRemove = commentId => {
		if (window.confirm('Вы действительно хотите удалить комментарий?'))
			dispatch(fetchRemoveComment(commentId))
	}

	return (
		<SideBlock title='Комментарии'>
			<List>
				{(isLoading ? [...Array(5)] : items).map((comment, index) => (
					<div className={styles.root} key={comment.id || index}>
						<ListItem alignItems='flex-start'>
							<ListItemAvatar>
								{isLoading ? (
									<Skeleton variant='circular' width={40} height={40} />
								) : (
									<Avatar
										alt={comment.user.fullName || 'Аноним'}
										src={
											comment.user.avatarUrl || '/path/to/default/avatar.png'
										}
									/>
								)}
							</ListItemAvatar>
							{isLoading ? (
								<div style={{ display: 'flex', flexDirection: 'column' }}>
									<Skeleton variant='text' height={25} width={120} />
									<Skeleton variant='text' height={18} width={230} />
								</div>
							) : (
								<ListItemText
									primary={comment.user.fullName || 'Аноним'}
									secondary={comment.text}
								/>
							)}
							{userData && isEditable(userData._id, comment.user._id) && (
								<div className={styles.editButton}>
									<Link to={`/comments/${id}/edit`}>
										<IconButton color='primary'>
											<EditIcon />
										</IconButton>
									</Link>
									<IconButton
										onClick={() => onClickRemove(comment._id)}
										color='secondary'
									>
										<DeleteIcon />
									</IconButton>
								</div>
							)}
						</ListItem>
						<Divider variant='inset' component='li' />
					</div>
				))}
			</List>
			{children}
		</SideBlock>
	)
}
