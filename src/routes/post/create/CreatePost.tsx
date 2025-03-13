import { useNavigate } from 'react-router-dom';
import { Panel } from '../../../common/components/Panel';
import { useState } from 'react';
import './styles.css';
import { PostService } from '../../../common/service/post';

export const CreatePost = () => {
    const navigate = useNavigate();
    const [file, setFile] = useState<File | null>(null);

    const moveToMenu = () => {
        navigate('/');
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setFile(file);
    }

    const handlePostCreate = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const payload = new FormData(e.currentTarget);
        if (file) {
            if (
                !(file.name.includes('.jpg') 
                || file.name.includes('.png')
                || file.name.includes('.jpeg')
                || file.name.includes('.webp'))
            ) {
                alert('Разрешаются только jpg, jpeg, png, webp');
                return;
            } 
            payload.append('image', file);
        }

        PostService.create(payload)
            .then(() => alert('Пост создан'))
            .catch(() => {
                alert('Ошибка при создании поста, попробуйте еще раз, для создания поста вы должны ввести хотя бы текст. Если ошибка повторяется, обратитесь к администратору (Диме).');
            })
    }

    return (
        <div style={{ padding: 20 }}> 
            <div style={{ 
                display: 'flex', 
                flexDirection: 'row', 
                justifyContent: 'space-between',
                paddingBottom: 20,
            }}>
                <Panel.Title text='Создание поста'/>
                <Panel.Button text='Меню' onClick={moveToMenu}/>
            </div>

            <Panel.Container>
                <Panel.Header title='Введите данные'/>
                <Panel.Body>
                    <Panel.Form onSubmit={handlePostCreate}>
                        <p>Выберите изображение</p>
                        <input type="file" onChange={handleFileChange} />
                        {file && <img src={URL.createObjectURL(file)} />}

                        <Panel.FormInput 
                            title='Текст' 
                            type='text' 
                            name='text'
                            isTextArea />

                        <Panel.Button 
                            style={{ marginTop: 20 }}
                            text='Отправить' 
                            type='submit'/>
                    </Panel.Form>
                </Panel.Body>
            </Panel.Container>
        </div>
    )
}