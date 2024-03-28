import * as cocoSsd from '@tensorflow-models/coco-ssd'
import '@tensorflow/tfjs'

import React, { useEffect, useRef, useState } from 'react'

export const ImageWithObjects = ({ src }) => {
	const [objects, setObjects] = useState([])
	const imgRef = useRef()
	const canvasRef = useRef()
	const [selectedObject, setSelectedObject] = useState(null)

	// Дополнительная функция для проверки наведения
	const isCursorOverObject = (x, y, bbox) => {
		const [bx, by, width, height] = bbox
		return x >= bx && x <= bx + width && y >= by && y <= by + height
	}

	useEffect(() => {
		// Загрузка модели COCO-SSD
		const loadModel = async () => {
			const model = await cocoSsd.load()

			// Определение объектов на изображении
			const predictions = await model.detect(imgRef.current)
			setObjects(predictions)
		}
		imgRef.current && loadModel()
	}, [src])

	useEffect(() => {
		const canvas = canvasRef.current

		// Функция для обработки движения мыши
		const handleMouseMove = event => {
			const rect = canvas.getBoundingClientRect()
			setSelectedObject(null)
			const x = event.clientX - rect.left
			const y = event.clientY - rect.top
			objects.forEach(prediction => {
				if (isCursorOverObject(x, y, prediction.bbox)) {
					setSelectedObject(prediction)
				}
			})
		}

		// Событие на движение мыши
		canvas.addEventListener('mousemove', handleMouseMove)

		return () => {
			canvas.removeEventListener('mousemove', handleMouseMove)
		}
	}, [objects])

	// Отрисовка обводки вокруг текущего выбранного объекта
	useEffect(() => {
		const ctx = canvasRef.current.getContext('2d')

		ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
		// Очистка предыдущих обводок
		if (selectedObject) {
			const [x, y, width, height] = selectedObject.bbox
			ctx.strokeStyle = 'blue'
			ctx.lineWidth = 4
			ctx.strokeRect(x, y, width, height)

			// Задаем белый фон под текст
			ctx.fillStyle = 'white'
			const textWidth = ctx.measureText(selectedObject.class).width
			const textHeight = parseInt(ctx.font, 10)
			ctx.fillRect(x, y - textHeight, textWidth, textHeight)

			// Задаем стиль и размер текста
			ctx.font = '18px sans-serif'
			ctx.fillStyle = 'red'
			ctx.fillText(selectedObject.class, x, y)
		}
	}, [selectedObject])

	return (
		<div style={{ position: 'relative' }}>
			<img
				ref={imgRef}
				src={src}
				alt='...'
				crossOrigin='anonymous'
				style={{ position: 'relative', width: '100%' }}
				onLoad={() => {
					canvasRef.current.width = imgRef.current.width
					canvasRef.current.height = imgRef.current.height
				}}
			/>
			<canvas
				ref={canvasRef}
				style={{ position: 'absolute', top: 0, left: 0 }}
			/>
		</div>
	)
}
