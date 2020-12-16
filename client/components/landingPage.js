import React from 'react'
import {
  CarouselProvider,
  Image,
  Slider,
  Slide,
  ButtonBack,
  ButtonNext,
  DotGroup,
  ButtonFirst,
  ButtonLast
} from 'pure-react-carousel'
import 'pure-react-carousel/dist/react-carousel.es.css'
import IconButton from '@material-ui/core/IconButton'
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord'
import Container from '@material-ui/core/Container'

function LandingPage() {
  return (
    <CarouselProvider
      visibleSlides={1}
      totalSlides={3}
      step={1}
      naturalSlideWidth={1.25}
      naturalSlideHeight={1}
      currentSlide={0}
      isPlaying
      infinite
    >
      <Slider>
        <Slide index={0}>
          <Image src="Slide 1-01.png" className="carousel-img" />
        </Slide>
        <Slide index={1}>
          <Image src="Slide 1-01.png" className="carousel-img" />
        </Slide>
        <Slide index={2}>
          <Image src="Slide 1-01.png" className="carousel-img" />
        </Slide>
      </Slider>
      <ButtonBack>Back</ButtonBack>
      <ButtonNext>Next</ButtonNext>
      <DotGroup />
    </CarouselProvider>
  )
}

export default LandingPage
