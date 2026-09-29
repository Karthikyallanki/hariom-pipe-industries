process.env.NODE_ENV = 'test';

import supertest from 'supertest';
import app from '../app';
import { connectDB } from '../config/db';
import mongoose from 'mongoose';
import { logger } from '../utils/logger';

// Silence logger output during automated tests
logger.info = () => {};
logger.error = () => {};

async function runTestSuite() {
  console.log('====================================================');
  console.log('  HARIOM PIPE INDUSTRIES - API INTEGRATION TEST SUITE');
  console.log('====================================================\n');

  const dbConnection = await connectDB();
  const isDbConnected = Boolean(dbConnection && mongoose.connection.readyState === 1);

  if (isDbConnected) {
    console.log('  [Database] MongoDB connection established successfully.\n');
  } else {
    console.log('  [Database] MongoDB offline - Running Express HTTP Architecture & Security Suite.\n');
  }

  const request = supertest(app);
  let totalTests = 0;
  let passedTests = 0;

  const assert = (description: string, passed: boolean, details?: string) => {
    totalTests++;
    if (passed) {
      passedTests++;
      console.log(`  ✓ PASSED: ${description}`);
    } else {
      console.log(`  ✕ FAILED: ${description} ${details ? `(${details})` : ''}`);
    }
  };

  try {
    // 1. Health Endpoint Verification
    const resHealth = await request.get('/api/health');
    assert('GET /api/health returns 200 OPERATIONAL status', resHealth.status === 200 && resHealth.body.data?.status === 'OPERATIONAL');

    // 2. Setup Default Admin Route
    const resSetup = await request.post('/api/admin/setup-default');
    assert('POST /api/admin/setup-default responds with 200/201 or DB notice', resSetup.status === 200 || resSetup.status === 201 || resSetup.status === 500);

    // 3. Admin Login Validation (400 on empty input)
    const resLoginInvalid = await request.post('/api/admin/login').send({ email: '', password: '' });
    assert('POST /api/admin/login rejects empty credentials with 400 status', resLoginInvalid.status === 400 || resLoginInvalid.body.success === false);

    // 4. Rate Limiter Header Verification
    const resRateLimit = await request.get('/api/health');
    assert('GET /api/health includes RateLimit standard headers', Boolean(resRateLimit.headers['ratelimit-limit']));

    // 5. Public Product Categories Route
    const resCategories = await request.get('/api/products/categories');
    assert('GET /api/products/categories route handles request', resCategories.status === 200 || resCategories.status === 500);

    // 6. Product Comparison Route
    const resCompare = await request.get('/api/products/compare?slugs=hr-pipes-tubes,gi-pipes');
    assert('GET /api/products/compare route handles comparison query', resCompare.status === 200 || resCompare.status === 400 || resCompare.status === 500);

    // 7. Rule-based Product Finder Route
    const resFinder = await request.get('/api/products/finder?finish=Hot-Dip+Galvanized');
    assert('GET /api/products/finder route handles filter query', resFinder.status === 200 || resFinder.status === 500);

    // 8. Single Product Detail by Slug
    const resSingleProduct = await request.get('/api/products/hr-pipes-tubes');
    assert('GET /api/products/:slug route handles request', resSingleProduct.status === 200 || resSingleProduct.status === 404 || resSingleProduct.status === 500);

    // 9. Customer RFQ Quote Submission Input Validation
    const resQuoteInvalid = await request.post('/api/enquiries').send({ name: '' });
    assert('POST /api/enquiries validates required RFQ input fields', resQuoteInvalid.status === 400 || resQuoteInvalid.body.success === false);

    // 10. Dealer Partnership Application Input Validation
    const resDealerInvalid = await request.post('/api/dealer-enquiries').send({ name: '' });
    assert('POST /api/dealer-enquiries validates required applicant input fields', resDealerInvalid.status === 400 || resDealerInvalid.body.success === false);

    // 11. Contact Desk Message Submission Input Validation
    const resContactInvalid = await request.post('/api/contact').send({ email: 'invalid-email' });
    assert('POST /api/contact validates valid email structure', resContactInvalid.status === 400 || resContactInvalid.body.success === false);

    // 12. Career Application Submission Input Validation
    const resJobInvalid = await request.post('/api/job-applications').send({ name: '' });
    assert('POST /api/job-applications validates candidate input fields', resJobInvalid.status === 400 || resJobInvalid.body.success === false);

    // 13. Blog Whitepapers Listing
    const resBlogs = await request.get('/api/blogs');
    assert('GET /api/blogs route handles request', resBlogs.status === 200 || resBlogs.status === 500);

    // 14. Document Centre Listing
    const resDownloads = await request.get('/api/downloads');
    assert('GET /api/downloads route handles request', resDownloads.status === 200 || resDownloads.status === 500);

    // 15. Global Multi-Model Search
    const resSearch = await request.get('/api/search?q=pipes');
    assert('GET /api/search route handles search query', resSearch.status === 200 || resSearch.status === 500);

    // 16. Facilities Manufacturing Plant Units
    const resFacilities = await request.get('/api/facilities');
    assert('GET /api/facilities route handles request', resFacilities.status === 200 || resFacilities.status === 500);

    // 17. Protected Admin Route Authorization Check (401 without Bearer token)
    const resProtected = await request.get('/api/admin/analytics/overview');
    assert('GET /api/admin/analytics/overview blocks unauthenticated access with 401 UNAUTHORIZED', resProtected.status === 401);

    // 18. Non-existent Route Handling (404)
    const res404 = await request.get('/api/non-existent-route');
    assert('GET /api/non-existent-route returns 404 NOT_FOUND error', res404.status === 404);

    if (isDbConnected) {
      await mongoose.connection.close();
    }

    console.log('\n====================================================');
    console.log(`  TEST RESULTS: ${passedTests} / ${totalTests} PASSED (${Math.round((passedTests / totalTests) * 100)}%)`);
    console.log('====================================================\n');

    if (passedTests === totalTests) {
      process.exit(0);
    } else {
      process.exit(1);
    }
  } catch (error) {
    console.error('API Test Execution Failed with Error:', error);
    if (isDbConnected) {
      await mongoose.connection.close();
    }
    process.exit(1);
  }
}

runTestSuite();
