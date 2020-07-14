import axios from 'axios'
import socket from '../socket'

//default state
const defaultBoard = {
  whiteboardData: [],
  name: '',
  projectId: null,
  codeEditorData: ''
}

//action type
export const GET_LINE = 'GET_LINE'
export const GET_CODE = 'GET_CODE'
export const GET_NAME = 'GET_NAME'
const SET_PROJECTID = 'SET_PROJECTID'
const SET_RELOADEDBOARD = 'SET_RELOADEDBOARD'
const SET_NEW_BOARD = 'SET_NEW_BOARD'
const REMOVE_BOARD = 'REMOVE_BOARD'

//action creator
export const getLine = (points, color) => ({
  type: GET_LINE,
  lineObj: {type: 'line', points, color}
})

export const getCode = str => ({
  type: GET_CODE,
  str
})

export const getName = str => ({
  type: GET_NAME,
  str
})

export const setId = projectId => ({
  type: SET_PROJECTID,
  projectId
})

export const setReloadedBoard = (
  projectId,
  whiteboardData,
  name,
  codeEditorData
) => ({
  type: SET_RELOADEDBOARD,
  projectId,
  whiteboardData,
  name,
  codeEditorData
})

export const setNewBoard = () => ({
  type: SET_NEW_BOARD
})

export const removeBoard = boardId => ({
  type: REMOVE_BOARD,
  boardId
})

export const saveBoard = (projectId, whiteboardData, codeEditorData, name) => {
  console.log('name', name)
  if (projectId) {
    return async dispatch => {
      try {
        const {data} = await axios.put(`/api/projects/${projectId}`, {
          whiteboardData: whiteboardData,
          codeEditorData: codeEditorData,
          name: name
        })
        console.log(data)
        return projectId
      } catch (error) {
        console.errror(error)
      }
    }
  } else {
    return async dispatch => {
      try {
        const {data} = await axios.post('/api/projects', {
          whiteboardData: whiteboardData,
          codeEditorData: codeEditorData,
          name: name
        })
        console.log(data)
        dispatch(setId(data._id))
        return data._id
        // socket.emit('new-line', data._id)
      } catch (error) {
        console.error(error)
      }
    }
  }
}

export const reloadSavedBoard = projectId => {
  return async dispatch => {
    try {
      const {data} = await axios.get(`/api/projects/${projectId}`)
      dispatch(
        setReloadedBoard(
          data._id,
          data.whiteboardData,
          data.name,
          data.codeEditorData
        )
      )
    } catch (error) {
      console.error(error)
    }
  }
}

export const deleteBoard = boardId => {
  return async dispatch => {
    try {
      await axios.delete(`/api/projects/${boardId}`)
      dispatch(removeBoard(boardId))
    } catch (error) {
      console.log('Error deleting board', error)
    }
  }
}
//check if there is already a project id
//if there is, were going to send a put request

//if there is not, we're going to send a post request and create a new project

//when we create that new project, we should take its ID number and put that in the redux

//reducer
export default function(state = defaultBoard, action) {
  switch (action.type) {
    case GET_LINE:
      return {
        ...state,
        whiteboardData: [...state.whiteboardData, action.lineObj]
      }
    case GET_CODE:
      return {
        ...state,
        codeEditorData: action.str
      }
    case GET_NAME:
      return {
        ...state,
        name: action.str
      }
    case SET_PROJECTID:
      return {
        ...state,
        projectId: action.projectId
      }
    case SET_RELOADEDBOARD:
      return {
        ...state,
        projectId: action.projectId,
        whiteboardData: action.whiteboardData,
        name: action.name,
        codeEditorData: action.codeEditorData
      }
    case SET_NEW_BOARD:
      return {
        whiteboardData: [],
        name: 'New Project',
        projectId: null
      }
    case REMOVE_BOARD:
      return {
        ...state,
        projectId: action.boardId
      }
    default:
      return state
  }
}
