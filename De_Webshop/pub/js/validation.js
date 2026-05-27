export function validateCheckoutForm(formData) {
  const errors = [];

  if (!formData.name || formData.name.trim().length < 2) {
    errors.push('Naam moet minimaal 2 tekens bevatten.');
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(formData.email || '')) {
    errors.push('Vul een geldig e-mailadres in.');
  }

  return errors;
}

export function validateProductForm(formData) {
  const errors = [];
  const allowedCategories = ['basses', 'amplification', 'accessories'];

  if (!formData.name || formData.name.trim().length < 2) {
    errors.push('Productnaam moet minimaal 2 tekens bevatten.');
  }

  if (!formData.description || formData.description.trim().length < 4) {
    errors.push('Beschrijving moet minimaal 4 tekens bevatten.');
  }

  if (allowedCategories.indexOf(formData.category) === -1) {
    errors.push('Kies een geldige categorie.');
  }

  const price = Number(formData.price);
  if (!Number.isFinite(price) || price <= 0) {
    errors.push('Prijs moet een getal groter dan 0 zijn.');
  }

  if (!formData.image || !formData.image.startsWith('http')) {
    errors.push('Afbeelding moet een geldige URL zijn die met http begint.');
  }

  return errors;
}
