import { Link, redirect, useNavigate, useParams } from 'react-router-dom';
import './styles.css';
import { useEffect, useState } from 'react';
import { TProduct } from './types';
import { Service } from '../../../common/service';
import { Panel } from '../../../common/components/Panel';

export const EditProduct = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [product, setProduct] = useState<TProduct | null>(null);
    const [edit, setEdit] = useState<Partial<TProduct>>({});
    const [newFile, setNewFile] = useState<File | null>(null);
    
    useEffect(() => {
        if (!id) redirect('/admin/product/table');

        Service.ProductService.getProduct(Number(id)).then(product => {
            setProduct(product.data);
            setEdit({ isPublished: product.data.isPublished, isCatalog: product.data.isCatalog });
        })
    }, []);

    const updateProduct = (field: keyof TProduct, value: any) => {
        setEdit(prevState => ({...prevState, [field]: value}));
    }

    const handleFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        console.log(file);
        setNewFile(file);
    }

    const handleProductUpdate = () => {
        const payload = new FormData();

        for (const [key, value] of Object.entries(edit)) {
            if (value)
                payload.append(key, value.toString());
        }

        if (newFile) {
            if (
                !(newFile.name.includes('.jpg') 
                || newFile.name.includes('.png')
                || newFile.name.includes('.jpeg')
                || newFile.name.includes('.webp'))
            ) {
                alert('Разрешаются только jpg, jpeg, png, webp');
                return;
            } 
            payload.append('image', newFile);
        }

        Service.ProductService.update(Number(id), payload).then(() => alert('Продукт обновлен'))
        .catch(() => {
            alert('Ошибка при обновлении товара. Обратитесь к администратору (Диме)');
        })
    }

    const moveToMenu = () => {
        navigate('/');
    }

    const moveToProductTable = () => {
        navigate('/admin/product/table');
    }

    return (
        <div className='product-view-container'>
            <div style={{ 
                display: 'flex', 
                flexDirection: 'row', 
                justifyContent: 'space-between',
                paddingBottom: 20,
            }}>
                <Panel.Title text="Просмотр" />
                <div style={{ gap: 20, display: 'flex', flexDirection: 'row' }}>
                    <Panel.Button text="Меню" onClick={moveToMenu} />
                    <Panel.Button text="Список продуктов" onClick={moveToProductTable} />
                </div>
            </div>

            <Panel.Container>
                <Panel.Header title={product?.name || 'Loading...'} />
                <Panel.Body style={{ gap: 15 }}>
                    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                        <div style={{ width: '55%' }}>
                            <Panel.FormInput
                                style={{ color: 'black' }}
                                defaultValue={product?.name}
                                onTextChange={value => updateProduct('name', value)}
                                title="Название"
                                name="name"
                                />
                            <Panel.Tip>
                                <b>Внимание!</b> 
                                Что бы сделать текст <b>ЖИРНЫМ</b>, оберните его в <code>&lt;b&gt; "Ваш Текст..." &lt;/b&gt;</code><br/>
                                <Link to={'https://emojidb.org'} target="_blank">Выбрать смайлики</Link>
                            </Panel.Tip>
                            <Panel.FormInput
                                defaultValue={product?.description}
                                onTextChange={value => updateProduct('description', value)}
                                title="Описание"
                                name="description"
                                isTextArea
                                />
                            <Panel.FormInput
                                defaultValue={product?.price?.toString()}
                                onTextChange={value => updateProduct('price', Number(value))}
                                title="Цена"
                                name="price"
                                type='number'
                                style={{ width: '30%' }}
                                />
                                
                            <Panel.Checkbox label='Опубликовано' state={edit?.isPublished} onChange={value => updateProduct('isPublished', value)} />
                            <Panel.Checkbox label='Каталог (Есть ли в этом продукты подпродукты?)' state={edit?.isCatalog} onChange={value => updateProduct('isCatalog', value)} />
                        </div>

                        <div style={{ width: '35%' }}>
                            <p>Нажмите, что бы изменить изображение продукта</p>
                            <input type="file" onChange={handleFileSelected} />
                            <img 
                                src={newFile ? URL.createObjectURL(newFile) : product?.image} 
                                style={{ width: '450px' }}/>
                        </div>
                    </div>
                    <Panel.Button onClick={handleProductUpdate} text='Сохранить изменения' />
                </Panel.Body>
            </Panel.Container>
        </div>
    );
}