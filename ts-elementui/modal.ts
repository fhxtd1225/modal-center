// src/modal.ts
import { createModalCenter } from '~/infra/modal-center/createModalCenter'
import { modalRegistry } from './modalRegistry'

export const modalCenter = createModalCenter(modalRegistry)