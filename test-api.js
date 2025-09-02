import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

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

async function testAPI() {
    console.log('🚀 Starting LeetCode API Tests...\n');
    console.log(`Testing against: ${API_BASE_URL}\n`);

    try {
        // Test 1: Health Check
        console.log('1️⃣ Testing Health Check...');
        try {
            const healthResponse = await axios.get(`${API_BASE_URL}/submissions/health/judge0`);
            console.log('✅ Health Check:', healthResponse.data);
            console.log('');
        } catch (error) {
            console.log('❌ Health Check failed:', error.message);
            if (error.response) {
                console.log('Response status:', error.response.status);
                console.log('Response data:', error.response.data);
            }
            console.log('');
        }

        // Test 2: Get Supported Languages
        console.log('2️⃣ Testing Get Supported Languages...');
        try {
            const languagesResponse = await axios.get(`${API_BASE_URL}/submissions/languages`);
            console.log('✅ Supported Languages:', languagesResponse.data.data.count, 'languages');
            console.log('');
        } catch (error) {
            console.log('❌ Get Languages failed:', error.message);
            if (error.response) {
                console.log('Response status:', error.response.status);
                console.log('Response data:', error.response.data);
            }
            console.log('');
        }

        // Test 3: Submit Python Code
        console.log('3️⃣ Testing Python Code Submission...');
        try {
            const pythonSubmission = await axios.post(`${API_BASE_URL}/submissions`, {
                source_code: testConfig.pythonCode,
                language_id: 71, // Python 3
                stdin: "5 3",
                problemId: "test-add-function"
            });
            console.log('✅ Python Submission:', pythonSubmission.data);
            
            const pythonToken = pythonSubmission.data.data.token;
            console.log('📝 Python Token:', pythonToken);
            console.log('');
            
            // Wait a bit for execution
            console.log('⏳ Waiting for execution...');
            await new Promise(resolve => setTimeout(resolve, 3000));
            
            // Get result
            const pythonResult = await axios.get(`${API_BASE_URL}/submissions/${pythonToken}`);
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

        // Test 4: Submit C++ Code
        console.log('4️⃣ Testing C++ Code Submission...');
        try {
            const cppSubmission = await axios.post(`${API_BASE_URL}/submissions`, {
                source_code: testConfig.cppCode,
                language_id: 54, // C++17
                stdin: "10 20",
                problemId: "test-cpp-add-function"
            });
            console.log('✅ C++ Submission:', cppSubmission.data);
            
            const cppToken = cppSubmission.data.data.token;
            console.log('📝 C++ Token:', cppToken);
            console.log('');
            
            // Wait a bit for execution
            console.log('⏳ Waiting for execution...');
            await new Promise(resolve => setTimeout(resolve, 3000));
            
            // Get result
            const cppResult = await axios.get(`${API_BASE_URL}/submissions/${cppToken}`);
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

        // Test 5: Submit JavaScript Code
        console.log('5️⃣ Testing JavaScript Code Submission...');
        try {
            const jsSubmission = await axios.post(`${API_BASE_URL}/submissions`, {
                source_code: testConfig.javascriptCode,
                language_id: 63, // JavaScript
                stdin: "15 25",
                problemId: "test-js-add-function"
            });
            console.log('✅ JavaScript Submission:', jsSubmission.data);
            
            const jsToken = jsSubmission.data.data.token;
            console.log('📝 JavaScript Token:', jsToken);
            console.log('');
            
            // Wait a bit for execution
            console.log('⏳ Waiting for execution...');
            await new Promise(resolve => setTimeout(resolve, 3000));
            
            // Get result
            const jsResult = await axios.get(`${API_BASE_URL}/submissions/${jsToken}`);
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

        // Test 6: Submit with Test Cases
        console.log('6️⃣ Testing Test Cases Submission...');
        try {
            const testCasesSubmission = await axios.post(`${API_BASE_URL}/submissions/test-cases`, {
                source_code: testConfig.pythonCode,
                language_id: 71,
                testCases: [
                    { input: "1 2", output: "3" },
                    { input: "5 3", output: "8" },
                    { input: "10 20", output: "30" }
                ],
                problemId: "test-cases-add-function"
            });
            console.log('✅ Test Cases Submission:', testCasesSubmission.data);
            
            const testCaseTokens = testCasesSubmission.data.data.tokens;
            console.log('📝 Test Case Tokens:', testCaseTokens);
            console.log('');
            
            // Wait a bit for code execution
            console.log('⏳ Waiting for code execution...');
            await new Promise(resolve => setTimeout(resolve, 3000));

            // Test 7: Get Test Cases Results
            console.log('7️⃣ Testing Get Test Cases Results...');
            for (let i = 0; i < testCaseTokens.length; i++) {
                try {
                    const testCaseResult = await axios.get(`${API_BASE_URL}/submissions/${testCaseTokens[i]}`);
                    console.log(`✅ Test Case ${i + 1} Result:`, testCaseResult.data);
                } catch (error) {
                    console.log(`❌ Test Case ${i + 1} failed:`, error.message);
                }
            }
            console.log('');
            
        } catch (error) {
            console.log('❌ Test cases submission failed:', error.message);
            if (error.response) {
                console.log('Response status:', error.response.status);
                console.log('Response data:', error.response.data);
            }
            console.log('');
        }

        console.log('🎉 All tests completed!');

    } catch (error) {
        console.error('❌ Test failed:', error.message);
        if (error.response) {
            console.error('Response data:', error.response.data);
            console.error('Response status:', error.response.status);
        }
    }
}

// Run tests
testAPI();
