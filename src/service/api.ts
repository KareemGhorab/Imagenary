import axios from 'axios'
import task from './task'

const api = axios.create()

export const taskSVC = task(api)
