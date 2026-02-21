import { useState, useEffect, useCallback, useMemo } from 'react';
import { AdminPromotionService } from '../api/adminPromotion.service';
import { AdminProductService } from '../../products/api/adminProduct.service';
import toast from 'react-hot-toast';

const INITIAL_FORM_STATE = {
    name: '',
    description: '',
    discountType: 'PERCENTAGE',
    discountValue: '',
    startDate: '',
    endDate: '',
    maxUsage: '',
    status: 'ACTIVE',
};

/**
 * Convertit une date UTC backend vers le format <input type="datetime-local">.
 */
const formatDateForInput = (isoString) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    return new Date(date.getTime() - date.getTimezoneOffset() * 60000)
        .toISOString()
        .slice(0, 16);
};

/**
 * Construit le payload promotion prêt pour le backend.
 */
const buildPromoPayload = (formData) => ({
    ...formData,
    startDate: new Date(formData.startDate).toISOString(),
    endDate: new Date(formData.endDate).toISOString(),
    discountValue: parseFloat(formData.discountValue),
    maxUsage: formData.maxUsage ? parseInt(formData.maxUsage, 10) : null,
    status: formData.status.toUpperCase(),
});

/**
 * @hook usePromotionFormLogic
 *
 * Gère l'état et la logique du formulaire de création/édition de promotion.
 * Supporte la sélection par produit ET par variante individuelle.
 *
 * Règle métier :
 * - Si des variantes d'un produit sont sélectionnées → linkedItems.variantIds (promo précise)
 * - Si un produit est sélectionné sans variante choisie → linkedItems.productIds (promo globale)
 */
export const usePromotionFormLogic = (promoId, isOpen, onClose, onSuccess) => {
    const [formData, setFormData] = useState(INITIAL_FORM_STATE);
    const [availableProducts, setAvailableProducts] = useState([]);
    const [selectedProductIds, setSelectedProductIds] = useState([]);
    const [selectedVariantIds, setSelectedVariantIds] = useState([]);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    // ─── Chargement initial ─────────────────────────────────────────────────────

    useEffect(() => {
        if (!isOpen) return;

        const fetchFormData = async () => {
            setLoading(true);
            try {
                const productsRes = await AdminProductService.getAll({
                    limit: 100,
                    status: 'ALL',
                });
                setAvailableProducts(productsRes.products || []);

                if (promoId && promoId !== 'new') {
                    await fetchExistingPromotion(promoId);
                } else {
                    resetForm();
                }
            } catch {
                toast.error('Erreur lors du chargement des données');
            } finally {
                setLoading(false);
            }
        };

        fetchFormData();
    }, [isOpen, promoId]);

    const fetchExistingPromotion = async (id) => {
        const data = await AdminPromotionService.getOne(id);

        setFormData({
            name: data.name || '',
            description: data.description || '',
            discountType: data.discountType || 'PERCENTAGE',
            discountValue: data.discountValue || '',
            startDate: formatDateForInput(data.startDate),
            endDate: formatDateForInput(data.endDate),
            maxUsage: data.maxUsage || '',
            status: (data.status || 'ACTIVE').toUpperCase(),
        });

        setSelectedProductIds(data.linkedProducts?.map((p) => p.id) ?? []);
        setSelectedVariantIds(data.linkedVariants?.map((v) => v.id) ?? []);
    };

    const resetForm = () => {
        setFormData(INITIAL_FORM_STATE);
        setSelectedProductIds([]);
        setSelectedVariantIds([]);
    };

    // ─── Données dérivées ───────────────────────────────────────────────────────

    /**
     * Pour chaque produit sélectionné qui possède des variantes,
     * retourne { productId, productName, variants[] } pour l'affichage du sous-panneau.
     */
    const variantsBySelectedProduct = useMemo(() => {
        return availableProducts
            .filter((p) => selectedProductIds.includes(p.id))
            .map((p) => ({
                productId: p.id,
                productName: p.name,
                variants: p.variantsPreview || [],
            }))
            .filter((entry) => entry.variants.length > 0);
    }, [availableProducts, selectedProductIds]);

    // ─── Actions ────────────────────────────────────────────────────────────────

    const handleInputChange = useCallback((e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    }, []);

    /**
     * Bascule la sélection d'un produit.
     * Désélectionner un produit nettoie automatiquement ses variantes.
     */
    const toggleProduct = useCallback((productId) => {
        setSelectedProductIds((prev) => {
            const isSelected = prev.includes(productId);

            if (isSelected) {
                // Retire les variantes appartenant à ce produit
                setSelectedVariantIds((vIds) => {
                    const product = availableProducts.find((p) => p.id === productId);
                    const idsToRemove = new Set(
                        (product?.variantsPreview || []).map((v) => v.id)
                    );
                    return vIds.filter((id) => !idsToRemove.has(id));
                });
                return prev.filter((id) => id !== productId);
            }

            return [...prev, productId];
        });
    }, [availableProducts]);

    /**
     * Bascule la sélection d'une variante individuelle.
     */
    const toggleVariant = useCallback((variantId) => {
        setSelectedVariantIds((prev) =>
            prev.includes(variantId)
                ? prev.filter((id) => id !== variantId)
                : [...prev, variantId]
        );
    }, []);

    /**
     * Sélectionne ou désélectionne toutes les variantes d'un produit d'un coup.
     */
    const toggleAllVariantsForProduct = useCallback((productVariantIds) => {
        setSelectedVariantIds((prev) => {
            const allSelected = productVariantIds.every((id) => prev.includes(id));
            return allSelected
                ? prev.filter((id) => !productVariantIds.includes(id))
                : [...new Set([...prev, ...productVariantIds])];
        });
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);

        try {
            const promoPayload = buildPromoPayload(formData);

            // Produits dont au moins une variante est sélectionnée → passent en variantIds
            const productsWithVariantSelected = new Set(
                variantsBySelectedProduct
                    .filter((entry) =>
                        entry.variants.some((v) => selectedVariantIds.includes(v.id))
                    )
                    .map((entry) => entry.productId)
            );

            // productIds = produits sélectionnés SANS variante précise choisie
            const productIds = selectedProductIds.filter(
                (id) => !productsWithVariantSelected.has(id)
            );

            if (promoId === 'new') {
                await AdminPromotionService.create(promoPayload, productIds, selectedVariantIds);
                toast.success('Promotion créée');
            } else {
                await AdminPromotionService.update(promoId, promoPayload, productIds, selectedVariantIds);
                toast.success('Promotion mise à jour');
            }

            onSuccess();
            onClose();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Erreur lors de la sauvegarde');
        } finally {
            setSaving(false);
        }
    };

    return {
        state: {
            formData,
            availableProducts,
            selectedProductIds,
            selectedVariantIds,
            variantsBySelectedProduct,
            loading,
            saving,
        },
        actions: {
            handleInputChange,
            toggleProduct,
            toggleVariant,
            toggleAllVariantsForProduct,
            handleSubmit,
        },
    };
};