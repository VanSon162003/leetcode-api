import axios from 'axios';

const JUDGE0_API_URL = 'http://103.20.97.228:2358';

// Test configuration
const testConfig = {
    pythonCode: `def add(a, b):
    return a + b

# Read input
a, b = map(int, input().split())
result = add(a, b)
print(result)`,
    
    cppCode: `#include <iostream>
using namespace std;

int add(int a, int b) {
    return a + b;
}

int main() {
    int a, b;
    cin >> a >> b;
    cout << add(a, b) << endl;
    return 0;
}`,
    
    javascriptCode: `const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.on('line', (input) => {
    const [a, b] = input.split(' ').map(Number);
    const result = a + b;
    console.log(result);
    rl.close();
});`
};

async function testJudge0Direct() {
    console.log('🚀 Starting Direct Judge0 API Tests...\n');
    console.log(`Testing against: ${JUDGE0_API_URL}\n`);

    try {
        // Test 1: Check if Judge0 is accessible
        console.log('1️⃣ Testing Judge0 Accessibility...');
        try {
            const response = await axios.get(`${JUDGE0_API_URL}/languages`, {
                timeout: 10000
            });
            console.log('✅ Judge0 is accessible');
            console.log('Languages available:', response.data.length || 'Unknown');
            console.log('');
        } catch (error) {
            console.log('❌ Judge0 is not accessible:', error.message);
            if (error.response) {
                console.log('Response status:', error.response.status);
                console.log('Response data:', error.response.data);
            }
            console.log('');
        }

        // Test 2: Submit Python Code
        console.log('2️⃣ Testing Python Code Submission...');
        try {
            const pythonSubmission = await axios.post(`${JUDGE0_API_URL}/submissions`, {
                source_code: testConfig.pythonCode,
                language_id: 71, // Python 3
                stdin: "5 3",
                wait: false
            }, {
                timeout: 15000
            });
            
            console.log('✅ Python Submission successful');
            console.log('Token:', pythonSubmission.data.token);
            console.log('Response:', pythonSubmission.data);
            
            const pythonToken = pythonSubmission.data.token;
            
            // Wait a bit for execution
            console.log('⏳ Waiting for execution...');
            await new Promise(resolve => setTimeout(resolve, 3000));
            
            // Get result
            const pythonResult = await axios.get(`${JUDGE0_API_URL}/submissions/${pythonToken}`, {
                timeout: 10000
            });
            
            console.log('✅ Python Result:', pythonResult.data);
            console.log('');
            
        } catch (error) {
            console.log('❌ Python submission failed:', error.message);
            if (error.response) {
                console.log('Response status:', error.response.status);
                console.log('Response data:', error.response.data);
            }
            console.log('');
        }

        // Test 3: Submit C++ Code
        console.log('3️⃣ Testing C++ Code Submission...');
        try {
            const cppSubmission = await axios.post(`${JUDGE0_API_URL}/submissions`, {
                source_code: testConfig.cppCode,
                language_id: 54, // C++17
                stdin: "10 20",
                wait: false
            }, {
                timeout: 15000
            });
            
            console.log('✅ C++ Submission successful');
            console.log('Token:', cppSubmission.data.token);
            
            const cppToken = cppSubmission.data.token;
            
            // Wait a bit for execution
            console.log('⏳ Waiting for execution...');
            await new Promise(resolve => setTimeout(resolve, 3000));
            
            // Get result
            const cppResult = await axios.get(`${JUDGE0_API_URL}/submissions/${cppToken}`, {
                timeout: 10000
            });
            
            console.log('✅ C++ Result:', cppResult.data);
            console.log('');
            
        } catch (error) {
            console.log('❌ C++ submission failed:', error.message);
            if (error.response) {
                console.log('Response status:', error.response.status);
                console.log('Response data:', error.response.data);
            }
            console.log('');
        }

        // Test 4: Submit JavaScript Code
        console.log('4️⃣ Testing JavaScript Code Submission...');
        try {
            const jsSubmission = await axios.post(`${JUDGE0_API_URL}/submissions`, {
                source_code: testConfig.javascriptCode,
                language_id: 63, // JavaScript
                stdin: "15 25",
                wait: false
            }, {
                timeout: 15000
            });
            
            console.log('✅ JavaScript Submission successful');
            console.log('Token:', jsSubmission.data.token);
            
            const jsToken = jsSubmission.data.token;
            
            // Wait a bit for execution
            console.log('⏳ Waiting for execution...');
            await new Promise(resolve => setTimeout(resolve, 3000));
            
            // Get result
            const jsResult = await axios.get(`${JUDGE0_API_URL}/submissions/${jsToken}`, {
                timeout: 10000
            });
            
            console.log('✅ JavaScript Result:', jsResult.data);
            console.log('');
            
        } catch (error) {
            console.log('❌ JavaScript submission failed:', error.message);
            if (error.response) {
                console.log('Response status:', error.response.status);
                console.log('Response data:', error.response.data);
            }
            console.log('');
        }

        console.log('🎉 Direct Judge0 tests completed!');

    } catch (error) {
        console.error('❌ Test failed:', error.message);
        if (error.response) {
            console.error('Response data:', error.response.data);
            console.error('Response status:', error.response.status);
        }
    }
}

// Run tests
testJudge0Direct();

