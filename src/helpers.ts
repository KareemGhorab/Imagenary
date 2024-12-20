import { Rectangle } from './types'

export const drawRectangles = (
	ctx: CanvasRenderingContext2D,
	rectangles: Rectangle[]
) => {
	rectangles.forEach((rect) => {
		ctx.strokeStyle = 'red'
		ctx.strokeRect(rect.x, rect.y, rect.width, rect.height)

		if (rect.annotation) {
			ctx.fillStyle = 'black'
			ctx.font = '16px Arial'
			ctx.fillText(rect.annotation, rect.x + 5, rect.y - 5)
		}
	})
}