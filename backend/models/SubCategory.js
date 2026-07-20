const mongoose = require('mongoose');

const subCategorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String },
  image: { type: String },
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true }
}, { timestamps: true });

subCategorySchema.index({ name: 1, categoryId: 1 }, { unique: true });
// Also ensure slug is unique across the whole subcategory collection if desired, or just scoped by category.
subCategorySchema.index({ slug: 1 }, { unique: true });

subCategorySchema.pre('save', async function () {
  if (this.isModified('name')) {
    this.slug = this.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  }
});

module.exports = mongoose.model('SubCategory', subCategorySchema);
