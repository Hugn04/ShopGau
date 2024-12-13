const mongoose = require('mongoose');
mongoose.set('strictQuery', false);

const Schema = mongoose.Schema;

// Tạo schema cho ProductModel
const ProductModel = new Schema({
    title: { type: String, required: true },
    image: String,
    slug: { type: String, unique: true }, // Đảm bảo slug là duy nhất
    description: String,
    price: { type: Number, required: true },
    rating: {
        rate: { type: Number, default: 5 },
        count: { type: Number, default: 0 },
    },
    amount: { type: Number, default: 0 },
    seller: { type: Number, default: 0 },
    sold: { type: Number, default: 0 },
});
function createSlug(title) {
    return title
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');
}
ProductModel.pre('save', async function (next) {
    if (this.isNew || this.isModified('title')) {
        if (!this.slug) {
            this.slug = createSlug(this.title);
        }

        try {
            const existingProduct = await this.constructor.findOne({ slug: this.slug });

            if (existingProduct) {
                this.slug = `${this.slug}-${Date.now()}`;
            }
        } catch (error) {
            if (error.code === 11000) {
                this.slug = `${this.slug}-${Date.now()}`;
            } else {
                return next(error);
            }
        }
    }
    next();
});
ProductModel.pre('findOneAndUpdate', async function (next) {
    const update = this.getUpdate();

    // Kiểm tra nếu `title` nằm trong bản cập nhật
    if (update.title) {
        const baseSlug = createSlug(update.title);
        update.slug = baseSlug;

        try {
            // Đảm bảo slug là duy nhất
            const existingProduct = await this.model.findOne({ slug: update.slug });
            if (existingProduct) {
                update.slug = `${baseSlug}-${Date.now()}`;
            }
        } catch (error) {
            return next(error);
        }
    }
    next();
});

// Đảm bảo slug luôn duy nhất với index của MongoDB
ProductModel.index({ slug: 1 }, { unique: true });

// Tạo model và export
const Product = mongoose.model('products', ProductModel);
module.exports = Product;
