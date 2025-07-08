import { useCallback } from 'react';

export interface FocusTarget {
    fieldName: string;
    sectionId?: string;
    elementType?: 'input' | 'select' | 'combobox' | 'textarea';
}

export const useFormFocus = () => {
    const focusOnField = useCallback((target: FocusTarget) => {
        setTimeout(() => {
            const { fieldName, sectionId, elementType = 'input' } = target;

            let targetElement: HTMLElement | null = null;

            // 1. Buscar por data-field attribute (más específico)
            targetElement = document.querySelector(`[data-field="${fieldName}"]`) as HTMLElement;

            if (!targetElement) {
                // 2. Buscar por name attribute
                targetElement = document.querySelector(`[name="${fieldName}"]`) as HTMLElement;
            }

            if (!targetElement) {
                // 3. Buscar por id attribute
                targetElement = document.getElementById(fieldName);
            }

            // 4. Para ComboBox, buscar el trigger button
            if (!targetElement && elementType === 'combobox') {
                const comboboxContainer = document.querySelector(`[data-field="${fieldName}"]`);
                if (comboboxContainer) {
                    // Buscar el botón interno del ComboBox
                    targetElement = comboboxContainer.querySelector('button[role="combobox"]') as HTMLElement;
                }
            }

            // 5. Buscar por aria-labelledby que contenga el fieldName
            if (!targetElement) {
                const elementsWithAria = document.querySelectorAll('[aria-labelledby]');
                for (const element of elementsWithAria) {
                    const ariaLabelledBy = element.getAttribute('aria-labelledby');
                    if (ariaLabelledBy && ariaLabelledBy.includes(fieldName)) {
                        targetElement = element as HTMLElement;
                        break;
                    }
                }
            }

            // 6. Buscar por aria-label que coincida con el fieldName
            if (!targetElement) {
                targetElement = document.querySelector(`[aria-label="${fieldName}"]`) as HTMLElement;
            }

            // 7. Si no se encuentra, buscar en la sección específica
            if (!targetElement && sectionId) {
                const section = document.getElementById(sectionId);
                if (section) {
                    targetElement = section.querySelector(`[data-field="${fieldName}"]`) as HTMLElement;
                }
            }

            // Si encontramos el elemento, hacer focus y scroll
            if (targetElement) {
                // Hacer scroll suave a la sección primero si existe
                if (sectionId) {
                    const section = document.getElementById(sectionId);
                    if (section) {
                        section.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start',
                            inline: 'nearest'
                        });
                    }
                }

                // Esperar un poco para que el scroll termine
                setTimeout(() => {
                    // Hacer focus en el elemento
                    if (typeof targetElement.focus === 'function') {
                        targetElement.focus();
                    }

                    // Hacer scroll fino al elemento
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'center',
                        inline: 'nearest'
                    });

                    // Aplicar efecto visual de resaltado
                    applyHighlightEffect(targetElement);
                }, 300);
            } else {
                console.warn(`No se pudo encontrar el elemento para el campo: ${fieldName}`);
            }
        }, 100);
    }, []);

    const applyHighlightEffect = useCallback((element: HTMLElement) => {
        // Determinar el tipo de elemento
        const isCombobox = element.getAttribute('role') === 'combobox';
        const isSelect = element.tagName.toLowerCase() === 'select';

        // Para ComboBox, buscar el botón interno (trigger)
        if (isCombobox) {
            // Buscar el botón interno del ComboBox
            const comboboxButton = element.querySelector('button[role="combobox"]') as HTMLElement;
            if (comboboxButton) {
                // Aplicar el efecto al botón interno
                applyEffectToElement(comboboxButton);
                return;
            }
        }

        // Para otros elementos, aplicar el efecto directamente
        applyEffectToElement(element);
    }, []);

    const applyEffectToElement = useCallback((element: HTMLElement) => {
        // Guardar estilos originales del elemento
        const originalBorder = element.style.borderColor;
        const originalBoxShadow = element.style.boxShadow;
        const originalTransition = element.style.transition;
        const originalBorderWidth = element.style.borderWidth;

        // Determinar el tipo de elemento
        const isCombobox = element.getAttribute('role') === 'combobox';
        const isSelect = element.tagName.toLowerCase() === 'select';

        // Para ComboBox y Select, solo aplicar efecto al borde
        if (isCombobox || isSelect) {
            // Aplicar estilos de error iniciales solo al borde
            element.style.borderColor = '#ef4444';
            element.style.borderWidth = '2px';
            element.style.boxShadow = '0 0 0 1px rgba(239, 68, 68, 0.2)';
            element.style.transition = 'border-color 0.3s ease, box-shadow 0.3s ease';

            // Efecto de pulso específico solo para el borde
            let pulseCount = 0;
            const pulseInterval = setInterval(() => {
                if (pulseCount >= 6) {
                    clearInterval(pulseInterval);
                    return;
                }
                if (pulseCount % 2 === 0) {
                    // Pulso intenso - borde más brillante
                    element.style.borderColor = '#dc2626';
                    element.style.boxShadow = '0 0 0 2px rgba(239, 68, 68, 0.3)';
                } else {
                    // Pulso suave - borde normal
                    element.style.borderColor = '#ef4444';
                    element.style.boxShadow = '0 0 0 1px rgba(239, 68, 68, 0.2)';
                }
                pulseCount++;
            }, 300);

            // Restaurar estilos después de 3 segundos
            setTimeout(() => {
                clearInterval(pulseInterval);
                element.style.borderColor = originalBorder;
                element.style.borderWidth = originalBorderWidth;
                element.style.boxShadow = originalBoxShadow;
                element.style.transition = originalTransition;
            }, 3000);
        } else {
            // Para otros elementos (input, textarea), mantener el comportamiento anterior
            const originalBackground = element.style.backgroundColor;

            element.style.borderColor = '#ef4444';
            element.style.boxShadow = '0 0 0 2px rgba(239, 68, 68, 0.3)';
            element.style.transition = 'all 0.3s ease';
            element.style.backgroundColor = '#fef2f2';

            let pulseCount = 0;
            const pulseInterval = setInterval(() => {
                if (pulseCount >= 6) {
                    clearInterval(pulseInterval);
                    return;
                }
                if (pulseCount % 2 === 0) {
                    element.style.borderColor = '#dc2626';
                    element.style.boxShadow = '0 0 0 3px rgba(239, 68, 68, 0.4)';
                    element.style.backgroundColor = '#fee2e2';
                } else {
                    element.style.borderColor = '#ef4444';
                    element.style.boxShadow = '0 0 0 2px rgba(239, 68, 68, 0.2)';
                    element.style.backgroundColor = '#fef2f2';
                }
                pulseCount++;
            }, 300);

            setTimeout(() => {
                clearInterval(pulseInterval);
                element.style.borderColor = originalBorder;
                element.style.boxShadow = originalBoxShadow;
                element.style.transition = originalTransition;
                element.style.backgroundColor = originalBackground;
            }, 3000);
        }
    }, []);

    const focusOnError = useCallback((fieldName: string, sectionId?: string) => {
        focusOnField({ fieldName, sectionId, elementType: 'input' });
    }, [focusOnField]);

    const focusOnCombobox = useCallback((fieldName: string, sectionId?: string) => {
        focusOnField({ fieldName, sectionId, elementType: 'combobox' });
    }, [focusOnField]);

    return {
        focusOnField,
        focusOnError,
        focusOnCombobox,
        applyHighlightEffect
    };
}; 