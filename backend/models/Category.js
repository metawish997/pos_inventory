const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  slug: { type: String, unique: true },
  image: { type: String },
  description: { type: String }
}, { timestamps: true });

categorySchema.pre('save', async function () {
  if (this.isModified('name')) {
    this.slug = this.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  }
});

module.exports = mongoose.model('Category', categorySchema);
