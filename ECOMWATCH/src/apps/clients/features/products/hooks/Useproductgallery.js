import { useState, useRef, useEffect, useCallback } from 'react';

// ─── CONSTANTES ───────────────────────────────────────────────────────────────
const MIN_ZOOM = 1;
const MAX_ZOOM = 3;
const ZOOM_STEP_WHEEL = 0.3;
const ZOOM_STEP_BTN = 0.5;
const ZOOM_DOUBLE_TAP = 2.5;
const DOUBLE_TAP_MS = 280;
const HINT_TIMEOUT_MS = 3000;

// ─── HELPERS PURS ─────────────────────────────────────────────────────────────

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

const getTouchDistance = (t1, t2) => {
    const dx = t1.clientX - t2.clientX;
    const dy = t1.clientY - t2.clientY;
    return Math.sqrt(dx * dx + dy * dy);
};

const getTouchMidpointPct = (t1, t2, rect) => ({
    x: (((t1.clientX + t2.clientX) / 2) - rect.left) / rect.width * 100,
    y: (((t1.clientY + t2.clientY) / 2) - rect.top) / rect.height * 100,
});

const getPointerPct = (clientX, clientY, rect) => ({
    x: ((clientX - rect.left) / rect.width) * 100,
    y: ((clientY - rect.top) / rect.height) * 100,
});

/**
 * @hook useProductGallery
 *
 * Encapsule toute la logique d'interaction de la galerie produit :
 * - Zoom molette + suivi souris (desktop)
 * - Pinch, double-tap, drag 1 doigt (mobile)
 *
 * Le composant ProductGallery reste un pur composant d'affichage.
 *
 * @returns {object} ref du container + état dérivé + handlers à brancher sur le JSX
 */
export const useProductGallery = () => {

    // ─── ÉTAT ─────────────────────────────────────────────────────────────────
    const [imageLoaded, setImageLoaded] = useState(false);
    const [zoomLevel, setZoomLevel] = useState(MIN_ZOOM);
    const [origin, setOrigin] = useState({ x: 50, y: 50 });
    const [showMobileHint, setShowMobileHint] = useState(true);

    const containerRef = useRef(null);

    // Refs miroir pour les handlers natifs (évite les closures périmées)
    const zoomRef = useRef(MIN_ZOOM);
    const originRef = useRef({ x: 50, y: 50 });

    // Refs d'état d'interaction
    const lastTapRef = useRef(0);
    const pinchRef = useRef({ active: false, initialDist: 0, initialZoom: 1 });
    const dragRef = useRef({ active: false, startX: 0, startY: 0, startOrigin: { x: 50, y: 50 } });

    // ─── SYNC REFS ────────────────────────────────────────────────────────────
    useEffect(() => { zoomRef.current = zoomLevel; }, [zoomLevel]);
    useEffect(() => { originRef.current = origin; }, [origin]);

    // ─── HINT MOBILE ──────────────────────────────────────────────────────────
    useEffect(() => {
        if (!showMobileHint) return;
        const id = setTimeout(() => setShowMobileHint(false), HINT_TIMEOUT_MS);
        return () => clearTimeout(id);
    }, [showMobileHint]);

    // ─── HELPERS D'ÉTAT ───────────────────────────────────────────────────────

    const applyZoom = useCallback((nextZoom, nextOrigin) => {
        const clamped = clamp(nextZoom, MIN_ZOOM, MAX_ZOOM);
        setZoomLevel(clamped);
        if (nextOrigin) setOrigin(nextOrigin);
        if (clamped === MIN_ZOOM) setOrigin({ x: 50, y: 50 });
    }, []);

    const resetZoom = useCallback(() => {
        setZoomLevel(MIN_ZOOM);
        setOrigin({ x: 50, y: 50 });
    }, []);

    // ─── DESKTOP : molette ────────────────────────────────────────────────────
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const handleWheel = (e) => {
            e.preventDefault();
            const direction = e.deltaY > 0 ? -1 : 1;
            applyZoom(zoomRef.current + direction * ZOOM_STEP_WHEEL);
        };

        container.addEventListener('wheel', handleWheel, { passive: false });
        return () => container.removeEventListener('wheel', handleWheel);
    }, [applyZoom]);

    // ─── DESKTOP : suivi souris ───────────────────────────────────────────────
    const handleMouseMove = useCallback((e) => {
        if (zoomRef.current <= MIN_ZOOM) return;
        const pct = getPointerPct(e.clientX, e.clientY, e.currentTarget.getBoundingClientRect());
        setOrigin(pct);
    }, []);

    const handleClick = useCallback(() => {
        if (zoomRef.current > MIN_ZOOM) resetZoom();
    }, [resetZoom]);

    // ─── DESKTOP : boutons +/- ────────────────────────────────────────────────
    const handleZoomIn = useCallback(() => applyZoom(zoomRef.current + ZOOM_STEP_BTN), [applyZoom]);
    const handleZoomOut = useCallback(() => applyZoom(zoomRef.current - ZOOM_STEP_BTN), [applyZoom]);

    // ─── MOBILE : touch (pinch + double-tap + drag) ───────────────────────────
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const onTouchStart = (e) => {
            setShowMobileHint(false);

            // ── Pinch (2 doigts) ──
            if (e.touches.length === 2) {
                pinchRef.current = {
                    active: true,
                    initialDist: getTouchDistance(e.touches[0], e.touches[1]),
                    initialZoom: zoomRef.current,
                };
                dragRef.current.active = false;
                return;
            }

            // ── 1 doigt ──
            if (e.touches.length !== 1) return;
            const touch = e.touches[0];
            const now = Date.now();

            // Double-tap
            if (now - lastTapRef.current < DOUBLE_TAP_MS) {
                lastTapRef.current = 0;
                if (zoomRef.current > MIN_ZOOM) {
                    resetZoom();
                } else {
                    const rect = container.getBoundingClientRect();
                    applyZoom(ZOOM_DOUBLE_TAP, getPointerPct(touch.clientX, touch.clientY, rect));
                }
                return;
            }
            lastTapRef.current = now;

            // Début drag (seulement si déjà zoomé)
            if (zoomRef.current > MIN_ZOOM) {
                dragRef.current = {
                    active: true,
                    startX: touch.clientX,
                    startY: touch.clientY,
                    startOrigin: { ...originRef.current },
                };
            }
        };

        const onTouchMove = (e) => {
            // Pinch actif
            if (e.touches.length === 2 && pinchRef.current.active) {
                e.preventDefault();
                const scale = getTouchDistance(e.touches[0], e.touches[1]) / pinchRef.current.initialDist;
                const newZoom = clamp(pinchRef.current.initialZoom * scale, MIN_ZOOM, MAX_ZOOM);
                const rect = container.getBoundingClientRect();
                const mid = getTouchMidpointPct(e.touches[0], e.touches[1], rect);
                applyZoom(newZoom, mid);
                return;
            }

            // Drag 1 doigt
            if (e.touches.length === 1 && dragRef.current.active) {
                e.preventDefault();
                const touch = e.touches[0];
                const rect = container.getBoundingClientRect();
                const sensitivity = 100 / zoomRef.current;
                const dx = (touch.clientX - dragRef.current.startX) / rect.width * sensitivity;
                const dy = (touch.clientY - dragRef.current.startY) / rect.height * sensitivity;
                setOrigin({
                    x: clamp(dragRef.current.startOrigin.x - dx, 0, 100),
                    y: clamp(dragRef.current.startOrigin.y - dy, 0, 100),
                });
            }
        };

        const onTouchEnd = (e) => {
            if (e.touches.length < 2) pinchRef.current.active = false;
            if (e.touches.length === 0) {
                dragRef.current.active = false;
                if (zoomRef.current <= MIN_ZOOM) resetZoom();
            }
        };

        container.addEventListener('touchstart', onTouchStart, { passive: true });
        container.addEventListener('touchmove', onTouchMove, { passive: false });
        container.addEventListener('touchend', onTouchEnd, { passive: true });

        return () => {
            container.removeEventListener('touchstart', onTouchStart);
            container.removeEventListener('touchmove', onTouchMove);
            container.removeEventListener('touchend', onTouchEnd);
        };
    }, [applyZoom, resetZoom]);

    // ─── ÉTAT DÉRIVÉ ──────────────────────────────────────────────────────────
    const isZoomed = zoomLevel > MIN_ZOOM;
    const canZoomIn = zoomLevel < MAX_ZOOM;
    const canZoomOut = zoomLevel > MIN_ZOOM;
    const zoomLabel = `${zoomLevel.toFixed(1)}x`;

    return {
        // Ref à brancher sur le conteneur DOM
        containerRef,

        // État
        imageLoaded,
        setImageLoaded,
        zoomLevel,
        origin,
        showMobileHint,

        // État dérivé
        isZoomed,
        canZoomIn,
        canZoomOut,
        zoomLabel,

        // Handlers DOM natifs (desktop)
        handleMouseMove,
        handleClick,

        // Actions (boutons)
        handleZoomIn,
        handleZoomOut,
        resetZoom,
    };
};