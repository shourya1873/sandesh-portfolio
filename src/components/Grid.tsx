import React from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

const products = [
    { code: '0001', name: 'Product 1', category: 'Category 1', quantity: 10 },
    { code: '0002', name: 'Product 2', category: 'Category 2', quantity: 10 },
]

const Grid = () => {
    return (
        <DataTable value={products} tableStyle={{ minWidth: '50rem' }}>
            <Column field="code" header="Code" sortable style={{ width: '25%' }}></Column>
            <Column field="name" header="Name" sortable style={{ width: '25%' }}></Column>
            <Column field="category" header="Category" sortable style={{ width: '25%' }}></Column>
            <Column field="quantity" header="Quantity" sortable style={{ width: '25%' }}></Column>
        </DataTable>
    );
};
export default Grid;