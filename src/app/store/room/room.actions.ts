import { createAction, props } from "@ngrx/store";

export const startGame = createAction(
    '[Room] startGame'
)

export const selectedElement = createAction(
    '[Room] selectedElement',
    props<{ selectedElement: string }>()
)