import './Home-Carousel.css'
import Carousel from 'react-bootstrap/Carousel';
import OdeonScreen from '../../assets/generic-screen.jpg';
import DuneBG from '../../assets/Dune2.jpeg';
const HomeCarousel = ({loading}:{loading: boolean}) => {
    var settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
      };
    return(
        <div className={loading ? 'hidden' : 'homeCarousel'}>
            <Carousel>
                <Carousel.Item>
                    <div className="carouselItemInfo">
                        <img
                            className="slideBG"
                            src={OdeonScreen}
                            alt="first slide"
                        />
                        <div className="centered">Fanatical About Film</div>
                        <div className="bottom">Best Films... On the Biggest Screen</div>
                    </div>
                </Carousel.Item>
                <Carousel.Item>
                    <div className="carouselItemInfo">
                        <img
                            className="slideBG"
                            src={DuneBG}
                            alt="first slide"
                        />
                        <div className="centered">Dune 2</div>
                        <div className="bottom">Out Now</div>
                    </div>
                </Carousel.Item>
                {/* <Carousel.Item>
                    <ExampleCarouselImage text="Second slide" />
                    <Carousel.Caption>
                    <h3>Second slide label</h3>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                    </Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item>
                    <ExampleCarouselImage text="Third slide" />
                    <Carousel.Caption>
                    <h3>Third slide label</h3>
                    <p>
                        Praesent commodo cursus magna, vel scelerisque nisl consectetur.
                    </p>
                    </Carousel.Caption>
                </Carousel.Item> */}
            </Carousel>
        </div>
    )
}

export default HomeCarousel;