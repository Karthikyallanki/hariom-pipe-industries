import { Request, Response } from 'express';
import { Facility } from '../models/Facility';
import { asyncHandler } from '../middleware/asyncHandler';
import { logger } from '../utils/logger';

// GET /api/facilities - Retrieve manufacturing plants
export const getAllFacilities = asyncHandler(async (_req: Request, res: Response) => {
  const facilities = await Facility.find().sort({ order: 1 });

  res.status(200).json({
    success: true,
    data: facilities,
  });
});

// POST /api/facilities/seed-default - Seed verified manufacturing units
export const seedDefaultFacilities = asyncHandler(async (_req: Request, res: Response) => {
  await Facility.deleteMany({});

  const seededFacilities = [
    {
      unitName: 'Unit I — Integrated Steel Plant',
      location: 'Mahabubnagar',
      state: 'Telangana',
      facilityType: 'Primary Steel & Pipe Manufacturing',
      capacityDetails: 'Sponge Iron, MS Billets, HR Pipes & Tubes Mill',
      capabilities: [
        'Sponge Iron Kilns',
        'Induction Melting Furnaces',
        'Continuous Billet Casting (CCM)',
        'High-Frequency ERW Pipe Mills',
      ],
      images: ['/images/facilities/mahabubnagar-unit-1.jpg'],
      order: 1,
    },
    {
      unitName: 'Unit II — Sponge Iron Division',
      location: 'Ananthapur',
      state: 'Andhra Pradesh',
      facilityType: 'Raw Material Processing',
      capacityDetails: 'Direct Reduced Iron (Sponge Iron) Production Kilns',
      capabilities: [
        'Iron Ore Beneficiation',
        'Rotary Kiln Reduction',
        'Raw Material Captive Supply',
        'Quality Testing Lab',
      ],
      images: ['/images/facilities/ananthapur-unit-2.jpg'],
      order: 2,
    },
    {
      unitName: 'Unit III — Galvanizing & Slitting Facility',
      location: 'Perundurai',
      state: 'Tamil Nadu',
      facilityType: 'Galvanizing & Coil Processing',
      capacityDetails: 'GI Pipe Galvanizing Baths & Precision Strip Slitting',
      capabilities: [
        'Hot-Dip Zinc Galvanizing Kettle',
        'Precision Coil Slitting Lines',
        'Cut-to-Length (CTL) Sheet Processing',
        'Hydrostatic Pipe Testing',
      ],
      images: ['/images/facilities/perundurai-unit-3.jpg'],
      order: 3,
    },
    {
      unitName: 'Unit IV — Advanced CR Tandem & GP Mill',
      location: 'Mahabubnagar',
      state: 'Telangana',
      facilityType: 'Cold Rolling & Pre-Galvanizing',
      capacityDetails: 'Cold Rolling Tandem Mill & Continuous GP Coating',
      capabilities: [
        'Continuous Cold Reduction Mill',
        'Bell Annealing Furnaces',
        'Continuous Pre-Galvanizing Line',
        'Automated Bundle Packaging',
      ],
      images: ['/images/facilities/mahabubnagar-unit-4.jpg'],
      order: 4,
    },
  ];

  await Facility.insertMany(seededFacilities);

  logger.info('[Facility Seeder] Pre-populated official Hariom Pipes manufacturing units.');

  res.status(201).json({
    success: true,
    message: 'Manufacturing facilities seeded successfully',
    data: seededFacilities,
  });
});
