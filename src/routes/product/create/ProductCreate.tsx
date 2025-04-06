import { Link, useNavigate } from 'react-router-dom';
import { Panel } from '../../../common/components/Panel';
import './styles.css';
import { useEffect, useState } from 'react';
import { TProduct } from '../edit/types';
import { ProductService } from '../../../common/service/product/product';
import { Option } from './types';

export const ProductCreate = () => {
    const navigate = useNavigate();
    const [file, setFile] = useState<File | null>(null);
    const [selectedOption, setSelectedOption] = useState<string | undefined>();
    const [product, setProduct] = useState<Partial<TProduct>>({
        isCatalog: false,
        isPublished: true,
    });
    const [catalogProducts, setCatalogProducts] = useState<Option[]>([]);

    useEffect(() => {
        ProductService.getAll(true).then(products => {
            setCatalogProducts(products.data.map(product => (
                { label: product.name, value: product.id.toString() }
            )));
        });
    }, []);

    const moveToMenu = () => {
        navigate('/');
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setFile(file);
    }

    const updateProduct = (key: keyof TProduct, value: any) => {
        setProduct(prevState => ({...prevState, [key]: value}));
    }

    const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const value = event.target.value;
        setSelectedOption(value);
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();


        const payload = new FormData(e.currentTarget);
        payload.append('isCatalog', String(product.isCatalog));
        payload.append('isPublished', String(product.isPublished));

        if (Number(payload.get('price')) < 0) {
            alert('Цена не может быть отрицательной');
            return;
        }

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
        } else {
            alert('Выберите изображение');
            return;
        }

        if (selectedOption)
            payload.append('product_id', selectedOption);

        // print payload
        for (const [key, value] of payload.entries()) {
            console.log(`${key}: ${value}`);
        }

        ProductService.create(payload).then(() => {
            alert('Продукт создан');
        }).catch(() => {
            alert('Ошибка при создании продукта. Обратитесь к администратору (Диме)');
        })
    }

    return (
        <div style={{ padding: 20 }}>
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 }}>
                <Panel.Title text="Создание продукта"/>
                <Panel.Button text="Меню" onClick={moveToMenu}/>
            </div>

            <Panel.Container>
                <Panel.Header title="Введите данные"/>
                <Panel.Body>
                    <Panel.Form onSubmit={handleSubmit}>
                        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', width: '45%' }}>
                                <Panel.FormInput
                                    title='Название'
                                    name='name'
                                    onTextChange={(value) => updateProduct('name', value)}
                                    />
                                <Panel.Tip>
                                    <b>Внимание!</b> 
                                    <span>Что бы сделать текст <b>ЖИРНЫМ</b>, оберните его в </span><pre/>
                                    <span><u><code>&lt;b&gt; "Ваш Текст..." &lt;/b&gt;</code></u></span><pre/>
                                    <Link to={'https://emojidb.org'} target="_blank">Выбрать смайлики</Link>
                                </Panel.Tip>
                                <Panel.FormInput
                                    title='Описание'
                                    name='description'
                                    onTextChange={(value) => updateProduct('description', value)}
                                    isTextArea
                                    />
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                                        <Panel.FormInput
                                            style={{ width: '30%' }}
                                            title='Цена'
                                            name='price'
                                            type='number'
                                            onTextChange={(value) => updateProduct('price', Number(value))}
                                            />
                                    <Panel.Tip>! Внимание ! Продукт, отмеченный как каталог не может иметь цену!</Panel.Tip>
                                    <Panel.Checkbox
                                        label='Каталог (Выберите, если этот продукт будет содержать в себе другие продукты)'
                                        state={product.isCatalog}
                                        onChange={(value) => updateProduct('isCatalog', value)}
                                        />
                                    <Panel.Checkbox
                                        label='Опубликовать (Этот товар увидят все пользователи)'
                                        state={product.isPublished}
                                        onChange={(value) => updateProduct('isPublished', value)}
                                        />
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                                    <label htmlFor="select">Выберите родительский продукт (опционально).</label>
                                    <select id="select" value={selectedOption} onChange={handleChange}>
                                        <option value="">Select...</option>
                                        {catalogProducts.map((option) => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', width: '45%' }}>
                                <input type='file' onChange={handleFileChange} />
                                { file && <img src={URL.createObjectURL(file)} alt='#' /> }
                            </div>
                        </div>
                        <Panel.Button text="Создать" type='submit' />
                    </Panel.Form>
                </Panel.Body>
            </Panel.Container>
        </div>
    )
}