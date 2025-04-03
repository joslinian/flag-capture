# flag-capture
Created with CodeSandbox

code used to process hidden url:

// This script extracts a hidden URL from a webpage by scraping specific HTML elements.
const https = require('https');
const { JSDOM } = require('jsdom');

/**
 * Extract the hidden URL from a webpage
 * @param {string} url - The URL to scrape
 * @returns {Promise<string>} - Promise that resolves with the hidden URL
 */
async function extractHiddenUrl(url) {
  console.log(`Fetching URL: ${url}`);
  
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode !== 200) {
        reject(new Error(`Request failed with status code: ${res.statusCode}`));
        return;
      }
      
      let html = '';
      res.on('data', (chunk) => {
        html += chunk;
      });
      
      res.on('end', () => {
        try {
          // Parse the HTML using JSDOM
          const dom = new JSDOM(html);
          const document = dom.window.document;
          
          // Find all sections with data-id attribute starting with "92"
          const sections = Array.from(document.querySelectorAll('section[data-id]'))
            .filter(section => section.getAttribute('data-id').startsWith('92'));
          
          console.log(`Found ${sections.length} matching sections`);
          
          // Array to store the characters in order
          const hiddenChars = [];
          
          // Process each section
          sections.forEach(section => {
            // Find article with data-class attribute ending with "45"
            const articles = Array.from(section.querySelectorAll('article[data-class]'))
              .filter(article => article.getAttribute('data-class').endsWith('45'));
            
            if (articles.length === 0) return;
            const article = articles[0];
            
            // Find div with data-tag attribute containing "78"
            const divs = Array.from(article.querySelectorAll('div[data-tag]'))
              .filter(div => div.getAttribute('data-tag').includes('78'));
            
            if (divs.length === 0) return;
            const div = divs[0];
            
            // Find b element with class "ref"
            const bTag = div.querySelector('b.ref');
            
            if (!bTag || !bTag.hasAttribute('value')) return;
            
            // Extract the value attribute
            const charValue = bTag.getAttribute('value');
            hiddenChars.push(charValue);
          });
          
          // Combine characters to form the hidden URL
          const hiddenUrl = hiddenChars.join('');
          resolve(hiddenUrl);
          
        } catch (error) {
          reject(error);
        }
      });
    }).on('error', (error) => {
      reject(error);
    });
  });
}

// Main function
async function main() {
  // Use command line argument or default URL
  console.log("Starting the script...");
  const url = process.argv[2] || "https://tns4lpgmziiypnxxzel5ss5nyu0nftol.lambda-url.us-east-1.on.aws/challenge";
  
  if (!process.argv[2]) {
    console.log(`No URL provided, using default: ${url}`);
  }
  
  try {
    console.log("Starting extraction process...");
    const hiddenUrl = await extractHiddenUrl(url);
    
    if (hiddenUrl) {
      console.log("-".repeat(50));
      console.log(`Hidden URL found: ${hiddenUrl}`);
      console.log("-".repeat(50));
    } else {
      console.error("No hidden URL was found in the provided webpage");
    }
  } catch (error) {
    console.error(`Error: ${error.message}`);
  }
}

// Run the main function
main();
