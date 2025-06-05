const Category = require('./models/Category');

const categories = ['Electronics', 'Books', 'Clothing', 'Home', 'Sports'];

const seedCategories = async () => {
  const existing = await Category.countDocuments();
  if (existing > 0) {
    console.log('Categories already exist, skipping seeding.');
    return;
  }

  await Category.insertMany(categories.map(name => ({ name })));
  console.log('Categories seeded successfully');
};

module.exports = seedCategories;
