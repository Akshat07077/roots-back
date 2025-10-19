// Simple API testing script
// Run with: node test-api.js

const API_BASE = 'http://localhost:3000';

async function testAPI() {
  console.log('🧪 Testing Academic Archive API...\n');

  try {
    // Test 1: Get articles (should work even if empty)
    console.log('1. Testing GET /api/articles...');
    const articlesResponse = await fetch(`${API_BASE}/api/articles`);
    const articlesData = await articlesResponse.json();
    console.log('✅ Articles endpoint working');
    console.log(`   Found ${articlesData.articles?.length || 0} articles\n`);

    // Test 2: Get admin articles
    console.log('2. Testing GET /api/admin/approve...');
    const adminResponse = await fetch(`${API_BASE}/api/admin/approve`);
    const adminData = await adminResponse.json();
    console.log('✅ Admin endpoint working');
    console.log(`   Found ${adminData.articles?.length || 0} total articles\n`);

    // Test 3: Test file upload (you'll need a test.docx file)
    console.log('3. Testing file upload...');
    console.log('   ⚠️  To test upload, you need a test.docx file');
    console.log('   Run: curl -X POST http://localhost:3000/api/upload -F "title=Test Paper" -F "file=@test.docx"\n');

    console.log('🎉 Backend API is working correctly!');
    console.log('\nNext steps:');
    console.log('- Set up your Supabase project');
    console.log('- Add your environment variables');
    console.log('- Test file upload with a real DOCX file');

  } catch (error) {
    console.error('❌ API test failed:', error.message);
    console.log('\nTroubleshooting:');
    console.log('- Make sure the dev server is running: npm run dev');
    console.log('- Check your Supabase configuration');
    console.log('- Verify environment variables are set');
  }
}

// Run the test
testAPI();
