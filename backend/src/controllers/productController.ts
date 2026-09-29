import { Request, Response } from 'express';
import { Product } from '../models/Product';
import { ProductCategory } from '../models/ProductCategory';
import { asyncHandler } from '../middleware/asyncHandler';
import { AppError } from '../middleware/errorHandler';
import { AuthenticatedRequest } from '../types';
import { auditService } from '../services/auditService';
import { logger } from '../utils/logger';

// GET /api/products - Query products with pagination & filters
export const getAllProducts = asyncHandler(async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string, 10) || 1;
  const limit = parseInt(req.query.limit as string, 10) || 12;
  const skip = (page - 1) * limit;

  const { category, brand, application, search, featured } = req.query;

  const queryFilters: Record<string, unknown> = { isPublished: true };

  if (category) {
    const categoryDoc = await ProductCategory.findOne({ slug: category as string });
    if (categoryDoc) {
      queryFilters.category = categoryDoc._id;
    }
  }

  if (brand) {
    queryFilters.brand = brand as string;
  }

  if (application) {
    queryFilters.applications = { $in: [application as string] };
  }

  if (featured === 'true') {
    queryFilters.featured = true;
  }

  if (search) {
    queryFilters.$text = { $search: search as string };
  }

  const [products, total] = await Promise.all([
    Product.find(queryFilters)
      .populate('category', 'name slug')
      .sort(search ? { score: { $meta: 'textScore' } } : { createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Product.countDocuments(queryFilters),
  ]);

  res.status(200).json({
    success: true,
    data: products,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
    },
  });
});

// GET /api/products/admin/all - Get all products for Admin management
export const getAdminProducts = asyncHandler(async (_req: Request, res: Response) => {
  const products = await Product.find().populate('category', 'name slug').sort({ createdAt: -1 });
  res.status(200).json({
    success: true,
    data: products,
  });
});

// GET /api/products/:slug - Product details by slug
export const getProductBySlug = asyncHandler(async (req: Request, res: Response) => {
  const { slug } = req.params;

  const product = await Product.findOne({ slug, isPublished: true }).populate('category', 'name slug description');

  if (!product) {
    throw new AppError('Requested product specification was not found.', 404, 'PRODUCT_NOT_FOUND');
  }

  product.viewsCount += 1;
  await product.save();

  const relatedProducts = await Product.find({
    category: product.category._id,
    _id: { $ne: product._id },
    isPublished: true,
  })
    .limit(4)
    .select('name slug shortDescription images brand applications');

  res.status(200).json({
    success: true,
    data: {
      product,
      relatedProducts,
    },
  });
});

// GET /api/categories - All product categories
export const getCategories = asyncHandler(async (_req: Request, res: Response) => {
  const categories = await ProductCategory.find().sort({ order: 1 });

  const categoriesWithCount = await Promise.all(
    categories.map(async (cat) => {
      const count = await Product.countDocuments({ category: cat._id, isPublished: true });
      return {
        ...cat.toObject(),
        productCount: count,
      };
    })
  );

  res.status(200).json({
    success: true,
    data: categoriesWithCount,
  });
});

// POST /api/admin/products - Create product (Admin)
export const createProduct = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { name, category, shortDescription, description, applications, specifications, availableSizes, standards, finishes, images, featured } = req.body;

  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  const existing = await Product.findOne({ slug });
  if (existing) {
    throw new AppError('A product with a similar name already exists.', 400, 'DUPLICATE_PRODUCT');
  }

  const product = await Product.create({
    name,
    slug,
    category,
    shortDescription,
    description,
    applications: applications || [],
    specifications: specifications || [],
    availableSizes: availableSizes || [],
    standards: standards || [],
    finishes: finishes || [],
    images: images || [],
    featured: featured || false,
  });

  if (req.user) {
    await auditService.logAction({
      userId: req.user.userId,
      userName: req.user.email,
      action: 'PRODUCT_CREATED',
      entityType: 'Product',
      entityId: String(product._id),
      details: `Created product: ${product.name}`,
    });
  }

  res.status(201).json({
    success: true,
    message: 'Product specification created successfully',
    data: product,
  });
});

// PATCH /api/admin/products/:id - Update product (Admin)
export const updateProduct = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;

  const product = await Product.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });

  if (!product) {
    throw new AppError('Product entity not found for update.', 404, 'NOT_FOUND');
  }

  if (req.user) {
    await auditService.logAction({
      userId: req.user.userId,
      userName: req.user.email,
      action: 'PRODUCT_UPDATED',
      entityType: 'Product',
      entityId: String(product._id),
      details: `Updated product: ${product.name}`,
    });
  }

  res.status(200).json({
    success: true,
    message: 'Product specification updated successfully',
    data: product,
  });
});

// DELETE /api/admin/products/:id - Archive/Delete product (Admin)
export const deleteProduct = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;

  const product = await Product.findByIdAndDelete(id);

  if (!product) {
    throw new AppError('Product entity not found.', 404, 'NOT_FOUND');
  }

  if (req.user) {
    await auditService.logAction({
      userId: req.user.userId,
      userName: req.user.email,
      action: 'PRODUCT_DELETED',
      entityType: 'Product',
      entityId: String(product._id),
      details: `Deleted product: ${product.name}`,
    });
  }

  res.status(200).json({
    success: true,
    message: 'Product deleted successfully',
  });
});

// POST /api/products/seed-default - Verified Product Seeder
export const seedDefaultProducts = asyncHandler(async (_req: Request, res: Response) => {
  // Clear categories & products for clean seed
  await ProductCategory.deleteMany({});
  await Product.deleteMany({});

  const catPipes = await ProductCategory.create({
    name: 'Pipes & Tubes',
    slug: 'pipes-tubes',
    description: 'Precision engineered Hot Rolled, Cold Rolled, Pre-Galvanized, and GI Pipes for structural and fluid conveyances.',
    iconName: 'Pipette',
    order: 1,
  });

  const catCoils = await ProductCategory.create({
    name: 'Coils & Slit Strips',
    slug: 'coils-strips',
    description: 'High-tensile HRPO, CRCA, GP, and CRFH slit coils and strips manufactured with strict thickness tolerances.',
    iconName: 'Layers',
    order: 2,
  });

  const catScaffolding = await ProductCategory.create({
    name: 'Scaffolding Systems',
    slug: 'scaffolding',
    description: 'Heavy-duty steel scaffolding systems, props, and couplers engineered for high safety loads in construction.',
    iconName: 'Building2',
    order: 3,
  });

  const catBillets = await ProductCategory.create({
    name: 'M.S. Billets & Primary Steel',
    slug: 'billets',
    description: 'High-purity Mild Steel (MS) Billets and Sponge Iron produced via integrated induction and sponge iron kilns.',
    iconName: 'Box',
    order: 4,
  });

  const seededProducts = [
    {
      name: 'Hot Rolled (HR) Pipes & Tubes',
      slug: 'hr-pipes-tubes',
      category: catPipes._id,
      brand: 'Hariom Pipes',
      shortDescription: 'High-strength structural and fluid carrying steel pipes manufactured from premium grade Hot Rolled coils.',
      description: 'Hariom HR Pipes & Tubes are manufactured using high-frequency induction welding processes. Designed for robust mechanical properties, structural integrity, and long service life in infrastructure, building construction, solar structures, and general engineering applications.',
      applications: ['Structural Infrastructure', 'Solar Module Racking', 'Construction Framing', 'Water Transport', 'Industrial Frameworks'],
      specifications: [
        { name: 'Grade', value: 'IS 1161 / IS 4923 / YST 210, 240, 310' },
        { name: 'Outer Diameter (OD)', value: '15mm NB to 200mm NB (1/2" to 8")' },
        { name: 'Thickness Range', value: '1.20mm to 6.00mm' },
        { name: 'Standard Length', value: '6.0 meters / 12.0 meters (Custom sizes on request)' },
        { name: 'Finish', value: 'Plain Ends, Beveled Ends, Black Oiled' },
      ],
      availableSizes: ['15 NB', '20 NB', '25 NB', '32 NB', '40 NB', '50 NB', '80 NB', '100 NB', '150 NB', '200 NB'],
      standards: ['IS 1161', 'IS 4923', 'IS 1239 (Part-1)', 'ASTM A500'],
      finishes: ['Black Oiled', 'Mill Scale Finish', 'Beveled End'],
      images: ['/images/products/hr-pipe.jpg'],
      featured: true,
    },
    {
      name: 'Cold Rolled (CR) Pipes & Tubes',
      slug: 'cr-pipes-tubes',
      category: catPipes._id,
      brand: 'Hariom Pipes',
      shortDescription: 'Smooth surface finished precision steel tubes designed for furniture, automotive, and decorative fabrication.',
      description: 'Engineered from precision cold-rolled steel strips, Hariom CR Tubes offer exact dimensional accuracy, uniform thickness, superior surface finish, and excellent bendability. Ideal for powder coating, chrome plating, and precision engineering works.',
      applications: ['Automotive Components', 'Modular Furniture', 'Bicycle Frames', 'Transformers', 'Precision Machinery'],
      specifications: [
        { name: 'Grade', value: 'IS 3074 / CR1, CR2' },
        { name: 'Section Shapes', value: 'Round, Square, Rectangular, Oval' },
        { name: 'Thickness Range', value: '0.60mm to 3.00mm' },
        { name: 'Surface Finish', value: 'Bright Smooth / Clean Bright Finish' },
      ],
      availableSizes: ['12.7mm OD', '15.88mm OD', '19.05mm OD', '25.4mm OD', '31.75mm OD', '38.1mm OD', '50.8mm OD'],
      standards: ['IS 3074', 'BS 6323'],
      finishes: ['Bright Smooth', 'Light Oiled'],
      images: ['/images/products/cr-pipe.jpg'],
      featured: true,
    },
    {
      name: 'Galvanized Iron (GI) Pipes',
      slug: 'gi-pipes',
      category: catPipes._id,
      brand: 'Hariom Pipes',
      shortDescription: 'Corrosion-resistant zinc-coated pipes engineered for liquid transportation, plumbing, and outdoor structures.',
      description: 'Hariom GI Pipes undergo hot-dip galvanizing, applying a uniform protective coating of pure zinc to prevent rust and atmospheric oxidation. Extensively used in water distribution networks, fire-fighting lines, agriculture irrigation, and coastal structures.',
      applications: ['Potable Water Supply', 'Fire Fighting Systems', 'Agricultural Irrigation', 'Fencing & Railings', 'HVAC Piping'],
      specifications: [
        { name: 'Grade', value: 'IS 1239 (Part-1) Light, Medium & Heavy Class' },
        { name: 'Zinc Coating Thickness', value: '360 g/m² to 550 g/m² (As per BIS norms)' },
        { name: 'Nominal Bore', value: '15mm to 150mm (1/2" to 6")' },
        { name: 'Testing', value: '100% Hydrostatic Pressure Tested at 5 MPa' },
      ],
      availableSizes: ['15mm (1/2")', '20mm (3/4")', '25mm (1")', '32mm (1-1/4")', '40mm (1-1/2")', '50mm (2")', '80mm (3")', '100mm (4")'],
      standards: ['IS 1239 (Part-1)', 'IS 4736'],
      finishes: ['Hot-Dip Galvanized', 'Threaded with Socket'],
      images: ['/images/products/gi-pipe.jpg'],
      featured: true,
    },
    {
      name: 'Pre-Galvanized (GP) Pipes & Tubes',
      slug: 'gp-pipes-tubes',
      category: catPipes._id,
      brand: 'Hariom Pipes',
      shortDescription: 'Uniform pre-galvanized surface tubes offering light-weight structural support with rust protection.',
      description: 'Hariom GP Pipes are crafted directly from continuously galvanized steel coils, providing smooth aesthetics and cost-effective corrosion protection without secondary galvanizing dipping steps.',
      applications: ['Greenhouse Frames', 'Cable Trays', 'Highway Guard Rails', 'Bus Body Building', 'Scaffolding Handrails'],
      specifications: [
        { name: 'Zinc Mass', value: '120 g/m² to 275 g/m²' },
        { name: 'Thickness', value: '0.80mm to 3.00mm' },
        { name: 'Shapes Available', value: 'Square, Rectangular, Round' },
      ],
      availableSizes: ['20x20mm', '25x25mm', '40x40mm', '50x50mm', '60x40mm', '80x40mm', '100x50mm'],
      standards: ['IS 277', 'IS 4923'],
      finishes: ['Pre-Galvanized Spangle Finish'],
      images: ['/images/products/gp-pipe.jpg'],
      featured: false,
    },
    {
      name: 'HRPO (Hot Rolled Pickled & Oiled) Slit Coils',
      slug: 'hrpo-slit-coils',
      category: catCoils._id,
      brand: 'Hariom Steel',
      shortDescription: 'Cleaned scale-free hot rolled steel slit coils coated with rust preventive oil.',
      description: 'Hariom HRPO Coils are processed through acid pickling baths to strip scale, followed by uniform oil passivation. Excellent for deep drawing, stamping, and tube forming.',
      applications: ['Automotive Stamping', 'Tube Mill Feedstock', 'Electrical Panels', 'Heavy Machinery Enclosures'],
      specifications: [
        { name: 'Thickness', value: '1.20mm to 4.00mm' },
        { name: 'Width Range', value: '50mm to 650mm' },
        { name: 'Oil Film', value: 'Light / Medium Rust Preventive Oiled' },
      ],
      availableSizes: ['Slit widths from 50mm to 650mm'],
      standards: ['IS 1079', 'IS 2062'],
      finishes: ['Pickled & Oiled'],
      images: ['/images/products/hrpo-coil.jpg'],
      featured: false,
    },
    {
      name: 'CRCA (Cold Rolled Close Annealed) Slit Coils',
      slug: 'crca-slit-coils',
      category: catCoils._id,
      brand: 'Hariom Steel',
      shortDescription: 'High ductility close-annealed cold rolled steel coils with precise gauge control.',
      description: 'Manufactured through controlled cold reduction and bell annealing furnaces, providing superior formability, smooth surface texture, and close thickness tolerances.',
      applications: ['Home Appliances', 'Control Panels', 'Precision Tubes', 'Drawn Metal Components'],
      specifications: [
        { name: 'Grade', value: 'CR1, CR2, CR3, CR4 (D, DD, EDD)' },
        { name: 'Thickness', value: '0.40mm to 2.50mm' },
      ],
      availableSizes: ['Slit widths from 30mm to 600mm'],
      standards: ['IS 513 (Part 1 & 2)'],
      finishes: ['Matt / Oiled Finish'],
      images: ['/images/products/crca-coil.jpg'],
      featured: false,
    },
    {
      name: 'Heavy-Duty Steel Scaffolding Systems',
      slug: 'scaffolding-systems',
      category: catScaffolding._id,
      brand: 'Hariom Scaffolding',
      shortDescription: 'Modular cuplock and tubular scaffolding systems designed for high load capacity construction projects.',
      description: 'Hariom Scaffolding Systems are engineered from high-grade structural MS tubes to provide rigid, safe elevation access for civil construction, bridge work, and industrial plant maintenance.',
      applications: ['Building Construction', 'Bridge & Flyover Works', 'Industrial Plant Maintenance', 'Shoring Supports'],
      specifications: [
        { name: 'Components', value: 'Cuplock Vertical Standards, Ledger Horizontal Bars, Adjustable Base Jacks, Prop Sleeves' },
        { name: 'Tube Size', value: '48.3mm OD x 3.2mm / 4.0mm Thickness' },
        { name: 'Safety Load', value: 'Tested up to 45 kN per prop' },
      ],
      availableSizes: ['Standard Heights: 1.0m, 1.5m, 2.0m, 2.5m, 3.0m'],
      standards: ['IS 2750', 'BS 1139'],
      finishes: ['Painted Amber', 'Hot-Dip Galvanized'],
      images: ['/images/products/scaffolding.jpg'],
      featured: true,
    },
    {
      name: 'Mild Steel (MS) Billets',
      slug: 'ms-billets',
      category: catBillets._id,
      brand: 'Hariom Steel',
      shortDescription: 'Continuously cast high-grade steel billets used as re-rolling feed for TMT bars and structural sections.',
      description: 'Produced in Hariom’s integrated Mahabubnagar plant from virgin sponge iron and quality scrap in induction furnaces with continuous casting machines (CCM). Zero piping and uniform chemical composition.',
      applications: ['Re-Rolling Mills', 'TMT Bar Manufacturing', 'Structural Steel Rolling', 'Forging Units'],
      specifications: [
        { name: 'Cross Section', value: '100x100mm, 125x125mm, 150x150mm' },
        { name: 'Grade', value: 'IS 2830 / IS 1786 (3SP / 4SP Grade)' },
        { name: 'Length', value: '6 meters to 12 meters' },
      ],
      availableSizes: ['100 x 100 mm', '125 x 125 mm'],
      standards: ['IS 2830', 'IS 2062'],
      finishes: ['As Cast Billet'],
      images: ['/images/products/billets.jpg'],
      featured: true,
    },
  ];

  await Product.insertMany(seededProducts);

  logger.info('[Product Seeder] Pre-populated official Hariom Pipes product catalog.');

  res.status(201).json({
    success: true,
    message: 'Official product catalog seeded successfully',
    data: {
      categoriesCount: 4,
      productsCount: seededProducts.length,
    },
  });
});

// GET /api/products/compare?slugs=hr-pipes-tubes,gi-pipes - Product comparison
export const compareProducts = asyncHandler(async (req: Request, res: Response) => {
  const slugsQuery = req.query.slugs as string;

  if (!slugsQuery) {
    throw new AppError('Product slugs are required for comparison.', 400, 'VALIDATION_ERROR');
  }

  const slugs = slugsQuery.split(',').map((s) => s.trim());

  const products = await Product.find({ slug: { $in: slugs }, isPublished: true }).populate('category', 'name slug');

  res.status(200).json({
    success: true,
    data: products,
  });
});

// GET /api/products/finder - Smart rule-based product finder
export const findProductByRule = asyncHandler(async (req: Request, res: Response) => {
  const { application, category, finish, standard } = req.query;

  const filters: Record<string, unknown> = { isPublished: true };

  if (category) {
    const categoryDoc = await ProductCategory.findOne({ slug: category as string });
    if (categoryDoc) {
      filters.category = categoryDoc._id;
    }
  }

  if (application) {
    filters.applications = { $in: [application as string] };
  }

  if (finish) {
    filters.finishes = { $in: [finish as string] };
  }

  if (standard) {
    filters.standards = { $in: [standard as string] };
  }

  const products = await Product.find(filters).populate('category', 'name slug').limit(10);

  res.status(200).json({
    success: true,
    data: products,
  });
});

