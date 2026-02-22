import ProductCard from './ProductCard';
import CatalogueProductCard from '../../catalogue/components/CatalogueCards';
import ProductSkeleton from '../../../../../shared/UI/ProductSkeleton'
import ErrorMessage from '../../../../../shared/UI/ErrorMessage';
import EmptyState from '../../../../../shared/UI/EmptyState';

const ProductGrid = ({
    products = [],
    isLoading,
    isError,
    error,
    refetch,
    selectedVariants,
    onVariantChange,
    variant = 'default'
}) => {
    const productsList = Array.isArray(products) ? products : [];

    const CardComponent = variant === 'catalogue' ? CatalogueProductCard : ProductCard;
    const gridCols = variant === 'catalogue'
        ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
        : 'grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6';

    if (isLoading) {
        return (
            <div className={gridCols}>
                {[...Array(8)].map((_, i) => <ProductSkeleton key={i} />)}
            </div>
        );
    }

    if (isError) {
        return <ErrorMessage message={error?.message} retryFn={refetch} />;
    }

    if (productsList.length === 0) {
        return <EmptyState />;
    }

    return (
        <div className={gridCols}>
            {productsList.map((product) => (
                <CardComponent
                    key={product.id || product._id || product.slug}
                    product={product}
                    persistedVariant={selectedVariants[product.id]}
                    onVariantChange={(variant) => onVariantChange(product.id, variant)}
                />
            ))}
        </div>
    );
};

export default ProductGrid;