import React, { useState } from 'react'

import styles from './AddComment.module.scss'

import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import { useSelector } from 'react-redux'

export const AddComment = ({ onAddComment }) => {
	const [text, setText] = useState('')
	const userData = useSelector(state => state.auth.data)

	const handleTextChange = event => {
		setText(event.target.value)
	}

	const handleSubmit = () => {
		if (text.trim()) {
			onAddComment(text)
			setText('')
		}
	}

	if (!userData) {
		return (
			<div className={styles.root}>
				<p className={styles.authMessage}>
					Чтобы оставить комментарий, войдите в систему.
				</p>
			</div>
		)
	}

	return (
		<>
			<div className={styles.root}>
				<Avatar
					classes={{ root: styles.avatar }}
					src={userData.avatarUrl || '/path/to/default/avatar.png'}
				/>
				<div className={styles.form}>
					<TextField
						label={`Написать комментарий как ${userData.fullName}`}
						variant='outlined'
						maxRows={10}
						multiline
						fullWidth
						value={text}
						onChange={handleTextChange}
					/>
					<Button variant='contained' onClick={handleSubmit}>
						Отправить
					</Button>
				</div>
			</div>
		</>
	)
}
