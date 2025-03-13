import React from 'react';
import './App.css';
import { Route, Routes } from 'react-router-dom';
import { ProductTable } from './routes/product/table/ProductTable';
import { EditProduct } from './routes/product/edit';
import { Home } from './routes/home';
import { CreatePost } from './routes/post/create';
import { ProductCreate } from './routes/product/create';

function App() {
    return (
      <div className="App">
            <Routes>
                <Route path='/' element={<Home/>} />
                <Route path='/admin'>
                    <Route path='post'>
                        <Route path='create' element={<CreatePost/>}/>
                    </Route>
                    <Route path='product'>
                        <Route path='table' element={<ProductTable/>} />
                        <Route path='edit/:id' element={<EditProduct/>} />
                        <Route path='create' element={<ProductCreate/>} />
                    </Route>
                </Route>
            </Routes>
      </div>
    );
}

export default App;
