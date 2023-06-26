import { useContext } from 'react';
import {ReactComponent as IconDelete} from '../../assets/trash-outline.svg';
import {ReactComponent as IconEdit} from '../../assets/create-outline.svg';
import {ReactComponent as IconTrue} from '../../assets/checkmark-outline.svg';
import {ReactComponent as IconFalse} from '../../assets/close-outline.svg';

import { ProductContext } from '../../context/product.context';
import useProducts from '../../context/products.context';
import { 
    CategoryContainer,
    EnableContainer,
    IconContainer,
    NameContainer,
    StockContainer,
    ProductLineItemContainer ,
    ControlsContainer
} from './product-line-item.styles';

const ProductLineItem = ({product}) => {
    const {
        toggleProduct, 
    } = useContext(ProductContext);
    const {
        deleteProduct,
        updateProduct,
        toggleProductEditHidden,
        editProduct
    } = useProducts();

    const {category, name, stock, enable} = product;

    return(
        <ProductLineItemContainer>
            <CategoryContainer
                disable={!enable}>
                {category.toUpperCase()}
            </CategoryContainer>
            <NameContainer
                disable={!enable}>
                {name.toUpperCase()}
            </NameContainer>
            <StockContainer
                disable={!enable}>
                {stock}
            </StockContainer>
            <EnableContainer>
                <IconContainer onClick={()=>{
                    toggleProduct(product);
                }}>
                    {enable?<IconTrue/>:<IconFalse/>}
                </IconContainer>
            </EnableContainer>
            <ControlsContainer>
                <IconContainer isCleckeable>
                    <IconEdit onClick={()=>{
                        updateProduct(product);
//                        toggleProductEditHidden();
                        editProduct(product.id);
                        
                    }}/>
                </IconContainer>
                <IconContainer isCleckeable>
                    <IconDelete onClick={()=>{
                        console.log("DELETE! product:"+name)
                        window.confirm("QUIERE ELIMINAR EL PRODUCTO: " + name + "?") ?
                            deleteProduct(product)
                        :
                            console.log("CANCEL");
                    }}/>
                </IconContainer>
            </ControlsContainer>
        </ProductLineItemContainer>
    );
};

export default ProductLineItem; 