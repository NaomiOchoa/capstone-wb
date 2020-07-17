import React, {useEffect, useState} from 'react'
import {Line} from './line'
import {Stage, Layer, Text} from 'react-konva'
import {Redraw} from './redrawutils'
import WhiteboardToolbar from './toolbar'
import {makeStyles} from '@material-ui/core/styles'
import Circle from './shapes/circle'
import Rectangle from './shapes/rectangle'
import Lin from './shapes/line'
import socket from '../socket'
import {Arr} from './arrow'

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary
  }
}))

export default function Whiteboard(props) {
  const stageEl = React.createRef()
  const layerEl = React.createRef()
  const classes = useStyles()
  const [circles, setCircles] = useState([])
  const [shapes, setShapes] = useState([])
  const [selectedId, selectShape] = useState(null)
  const [rectangles, setRectangles] = useState([])
  const [arrows, setArrows] = useState([])
  const {
    getLine,
    getCirc,
    getRect,
    whiteboardData,
    getUpdatedShapes,
    width,
    projectId
  } = props

  const getRandomInt = max => {
    return Math.floor(Math.random() * Math.floor(max))
  }

  const addRectangle = () => {
    const rect = {
      x: getRandomInt(100),
      y: getRandomInt(100),
      width: 100,
      height: 100,
      id: `rect${rectangles.length + 1}`,
      stroke: 'black'
    }
    getRect(rect)
    socket.emit('new-rect-from-client', rect, projectId)
    const rects = rectangles.concat([rect])
    setRectangles(rects)
    const shs = shapes.concat([`rect${rectangles.length + 1}`])
    setShapes(shs)
  }

  const addCircle = () => {
    const circ = {
      x: getRandomInt(100),
      y: getRandomInt(100),
      width: 100,
      height: 100,
      id: `circ${circles.length + 1}`,
      stroke: 'black'
    }
    console.log(circ)
    getCirc(circ)
    socket.emit('new-circ-from-client', circ, projectId)
    const circs = circles.concat([circ])
    setCircles(circs)
    const shs = shapes.concat([`circ${circles.length + 1}`])
    setShapes(shs)
  }

  const drawLine = (color = 'black') => {
    Line(stageEl.current.getStage(), layerEl.current, color)
  }

  const drawArrow = () => {
    console.log('arrowing')
    Arr(stageEl.current.getStage(), layerEl.current)
  }

  const erase = () => {
    console.log('erasing')
    Line(stageEl.current.getStage(), layerEl.current, 'white', 'eraser')
  }

  const redrawLine = () => {
    Redraw(layerEl.current)
  }

  const clearBoard = () => {
    layerEl.current.destroyChildren()
  }

  useEffect(
    () => {
      fitStageIntoParentContainer()
    },
    [width]
  )

  let stageWidth = 1000
  let stageHeight = 1000

  function fitStageIntoParentContainer() {
    const stage = stageEl.current.getStage()

    // now we need to fit stage into parent
    let containerWidth = width

    // to do this we need to scale the stage
    const scale = containerWidth / stageWidth

    stage.width(stageWidth * scale)
    stage.draw()
  }

  return (
    <div id="whiteboard-container">
      <WhiteboardToolbar
        drawLine={drawLine}
        circle={addCircle}
        rectangle={addRectangle}
        erase={erase}
        arrow={drawArrow}
      />
      <Stage height={stageHeight} width={stageWidth} ref={stageEl}>
        <Layer ref={layerEl}>
          <Text
            text="Some text on canvas"
            fontSize={15}
            draggable="true"
            x={50}
            y={80}
            fontSize={20}
            width={200}
            padding={20}
            draggable="true"
          />

          {whiteboardData.map((shape, i) => {
            switch (shape.type) {
              case 'circ':
                return (
                  <Circle
                    key={i}
                    shapeProps={shape}
                    isSelected={shape.id === selectedId}
                    onSelect={() => {
                      selectShape(shape.id)
                    }}
                    onChange={newAttrs => {
                      const shapesArr = whiteboardData.slice()
                      shapesArr[i] = newAttrs
                      setShapes(shapesArr)
                      getUpdatedShapes(shapesArr)
                      socket.emit(
                        'new-updateShape-from-client',
                        shapesArr,
                        projectId
                      )
                    }}
                  />
                )
              case 'rect':
                return (
                  <Rectangle
                    key={i}
                    shapeProps={shape}
                    isSelected={shape.id === selectedId}
                    onSelect={() => {
                      selectShape(shape.id)
                    }}
                    onChange={newAttrs => {
                      const shapesArr = whiteboardData.slice()
                      shapesArr[i] = newAttrs
                      setShapes(shapesArr)
                      getUpdatedShapes(shapesArr)
                      socket.emit(
                        'new-updateShape-from-client',
                        shapesArr,
                        projectId
                      )
                    }}
                  />
                )
              case 'line':
                return (
                  <Lin
                    key={i}
                    shapeProps={shape}
                    isSelected={shape.id === selectedId}
                    onSelect={() => {
                      selectShape(shape.id)
                    }}
                    onChange={newAttrs => {
                      const shapesArr = whiteboardData.slice()
                      shapesArr[i] = newAttrs
                      setShapes(shapesArr)
                      getUpdatedShapes(shapesArr)
                      socket.emit(
                        'new-updateShape-from-client',
                        shapesArr,
                        projectId
                      )
                    }}
                  />
                )
              // case 'arrow':
              //   return (
              //     <Arrow
              //       key={i}
              //       shapeProps={shape}
              //       isSelected={shape.id === selectedId}
              //       onSelect={() => {
              //         selectShape(shape.id)
              //       }}
              //       onChange={newAttrs => {
              //         const shapesArr = whiteboardData.slice()
              //         shapesArr[i] = newAttrs
              //         setShapes(shapesArr)
              //         getUpdatedShapes(shapesArr)
              //         socket.emit(
              //           'new-updateShape-from-client',
              //           shapesArr,
              //           projectId
              //         )
              //       }}
              //     />
              //   )
              default:
                console.log('N/A')
            }
          })}
        </Layer>
      </Stage>
    </div>
  )
}
