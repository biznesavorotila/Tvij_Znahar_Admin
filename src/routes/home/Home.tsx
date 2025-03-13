import { useNavigate } from 'react-router-dom';
import { Panel } from '../../common/components/Panel';
import './styles.css';

export const Home = () => {
    const navigate = useNavigate();

    const moveToProductTable = () => {
        navigate('/admin/product/table');
    }

    const moveToCreatePost = () => {
        navigate('/admin/post/create');
    }

    const moveToCreateProduct = () => {
        navigate('/admin/product/create');
    }

    return (
        <div className='home-main-container'>
            <Panel.Button text='Создать продукт' onClick={moveToCreateProduct}/>
            <Panel.Button text='Список продуктов' onClick={moveToProductTable}/>
            <Panel.Button text='Создать новый пост' onClick={moveToCreatePost}/>            
        </div>
    );
}