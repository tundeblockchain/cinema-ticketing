import FilmsGrid from '../components/films-grid/FilmsGrid';
import Header from '../components/header/Header';
import '../pages/Films.css';

const Films = () => {
    return (
        <div>
            <div>
                <div className='center'>
                    <h1 className='col-start-2 col-span-2'>Films Out Now</h1>
                </div>
                <FilmsGrid></FilmsGrid>
            </div>
        </div>
    )
}

export default Films;