// src/apps/front/features/cart/utils/cart.utils.js

export const createCartItem = (product, variant) => {
    // On extrait la promotion de la variante
    const promo = variant.promotion;

    // Le prix final est le prix remisé s'il existe, sinon le prix normal
    const finalPrice = promo?.discountedPrice
        ? parseFloat(promo.discountedPrice)
        : parseFloat(variant.price);

    return {
        cartId: `${product.id}-${variant.id}`, // ID unique pour le panier
        productId: product.id,
        variantId: variant.id,
        name: product.name,
        image: variant.attributes?.image || product.mainImage,
        price: finalPrice, // C'EST CE PRIX QUI SERA UTILISÉ PARTOUT
        originalPrice: parseFloat(variant.price), // On garde l'ancien pour l'affichage barré
        color: variant.attributes?.color,
        size: variant.attributes?.size,
        sku: variant.sku,
        hasPromo: !!promo?.discountedPrice,
        quantity: 1
    };
};