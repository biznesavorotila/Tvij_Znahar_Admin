import { useEffect, useState } from "react";
import { Panel } from "../../../common/components/Panel"
import { THeaderElem } from "../../../common/components/Panel/types"
import { TableProduct } from "./types";
import { Service } from "../../../common/service";
import './styles.css';
import { ActionRow } from "./components/ActionRow";
import { Link, useNavigate } from "react-router-dom";
import { TActions } from "./components/ActionRow/types";
import { ProductService } from "../../../common/service/product/product";

const ListHeaders: Array<THeaderElem> = [
    { label: 'Название', value: 'name' },
    { label: 'Родитель', value: 'product_id' },
    { label: 'Цена', value: 'price' },
    { label: 'Опубликованно', value: 'isPublished' },
    { label: 'Каталог', value: 'isCatalog' },
];
const ListHeadersWidth = [
    { columnIndex: 0, widthPercent: 40 },
    { columnIndex: 1, widthPercent: 30 },
    { columnIndex: 2, widthPercent: 10 },
    { columnIndex: 3, widthPercent: 10 },
    { columnIndex: 3, widthPercent: 10 },
];

export const ProductTable = () => {
    const navigate = useNavigate();
    const [products, setProducts] = useState<TableProduct[]>([]);
    const [updatedProducts, setUpdatedProducts] = useState<TableProduct[]>([]);

    const loadProducts = () => {
        Service.ProductService.getAllWithParents().then(products => {
            setProducts(products.data);
            setUpdatedProducts(products.data);
        })
    }

    useEffect(() => {
        loadProducts();
    }, []);

    const handleGlobalCheckmarkUpdate = (checked: boolean) => {
        setUpdatedProducts(updatedProducts.map(product => {
            return {
                ...product,
                isChecked: checked
            }
        }))
    }

    const handleCheckmarkUpdate = (index: number, state: boolean) => {
        const newProducts = [...updatedProducts];
        newProducts[index].isChecked = state;
        setUpdatedProducts(newProducts);
    }

    const moveToMenu = () => {
        navigate('/');
    }

    const handleAction = (action: TActions, productId: number) => {
        switch (action) {
            case 'delete':
                const curProduct = products.find(p => p?.parent?.id === productId);

                if (curProduct?.parent) {
                    if (!window.confirm(`Каталог ${curProduct.name} содержит дочерние продукты. вы уверены, что хотите удалить каталог ПОЛНОСТЬЮ?`)) {
                        break;
                    }
                }

                ProductService.delete(productId)
                    .then(() => {
                        setUpdatedProducts(updatedProducts.filter(product => product.id !== productId));
                        alert('Продукт удален, перезагрузите страницу, что бы увидеть обновленную таблицу');
                    })
                break;

            case 'publish': 
                const payloadPublsih = new FormData();
                payloadPublsih.append('isPublished', 'true');
                ProductService.update(productId, payloadPublsih)
                    .then(() => alert('Продукт опубликован'));
                break;

            case 'hide': 
                const payloadHide = new FormData();
                payloadHide.append('isPublished', 'false');
                ProductService.update(productId, payloadHide)
                    .then(() => alert('Продукт скрыт'));
                break;    

            default:
                break;
        }
    }

    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const searchText = new FormData(e.currentTarget).get('search')?.toString()?.toLowerCase();
        if (!searchText) 
            return;

        setUpdatedProducts(prevState => prevState.filter(product => product.name.toLowerCase().includes(searchText)));
    }

    return (
        <div>
            <div className="product-table-container">
                <div style={{ 
                display: 'flex', 
                flexDirection: 'row', 
                justifyContent: 'space-between',
                paddingBottom: 20,
            }}>
                <div style={{ display: 'flex', flexDirection: 'row', gap: 20 }}>
                    <Panel.Title text='Продукция' />
                    <button className="refresh-button" onClick={loadProducts}>🔄</button>
                </div>
                <Panel.Button text="Меню" onClick={moveToMenu}  />
            </div>

            <Panel.Form onSubmit={handleSearch} style={{ 
                marginBottom: 20, 
                width: '40%',
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'end',
                gap: 20
            }}>
                <Panel.Input placeholder='Поиск' inputName='search' style={{color: 'whitesmoke'}} />
                <Panel.Button text='Поиск' type="submit" style={{ height: 32, fontSize: 7, padding: '0 5px' }} />
                <Panel.Button text='Очистить поиск' onClick={() => setUpdatedProducts(products)} style={{ width: 300, height: 32, fontSize: 7, padding: '0 5px' }} />
            </Panel.Form>

                <Panel.List
                    headersWidth={ListHeadersWidth}
                    header={ListHeaders}
                    data={updatedProducts}
                    onCheckmarkUpdate={handleGlobalCheckmarkUpdate}
                    onSortChange={() => {}}
                >
                    {(entry, index) => (
                        <tr className="table-row-container">
                            <td className='list-checkbox-container'>
                                <Panel.Checkbox 
                                    state={entry.isChecked} 
                                    onChange={(state) => handleCheckmarkUpdate(index, state)}/>
                            </td>
                            <td className="table-product-title">
                                <Link to={`/admin/product/edit/${entry.id}`}>{entry.name}</Link>
                                <ActionRow 
                                    isPublished={entry.isPublished}
                                    onAction={(type) => handleAction(type, entry.id)}/>
                            </td>
                            <td>
                                {
                                    entry?.parent 
                                    ? <Link to={`/admin/product/edit/${entry.parent.id}`}>
                                        {entry.parent.name}
                                      </Link>
                                    : '-'
                                }
                            </td>
                            <td>{entry.price}</td>
                            <td>{entry.isPublished ? "Да" : "Нет"}</td>
                            <td>{entry.isCatalog ? "Да" : "Нет"}</td>
                        </tr>
                    )}
                </Panel.List>
            </div>
        </div>
    )
}