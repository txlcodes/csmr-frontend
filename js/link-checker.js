/**
 * Link Checker for CSMR Website
 * Checks all internal links on the page and reports broken ones
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log('Link checker running...');
    
    // Function to test if a link is valid
    async function testLink(url) {
        try {
            // Handle relative URLs properly
            const fullUrl = new URL(url, window.location.origin);
            const response = await fetch(fullUrl, { method: 'HEAD', cache: 'no-store' });
            return response.status < 400;
        } catch (error) {
            console.error(`Error checking ${url}:`, error);
            return false;
        }
    }
    
    // Find all links on the page
    const links = document.querySelectorAll('a');
    const internalLinks = Array.from(links).filter(link => {
        const href = link.getAttribute('href');
        // Only check internal links (not external URLs or JavaScript functions)
        return href && 
               !href.startsWith('http') && 
               !href.startsWith('mailto:') && 
               !href.startsWith('tel:') && 
               !href.startsWith('javascript:') &&
               href !== '#';
    });
    
    // Check each internal link
    let brokenLinks = 0;
    
    internalLinks.forEach(async (link) => {
        const href = link.getAttribute('href');
        const isValid = await testLink(href);
        
        if (!isValid) {
            brokenLinks++;
            console.error(`❌ Broken link found: ${href} (text: "${link.textContent.trim()}")`);
            // Add visual indicator in development mode
            link.style.color = 'red';
            link.style.textDecoration = 'line-through';
            link.title = 'Broken Link: ' + href;
        }
    });
    
    // Report results
    setTimeout(() => {
        if (brokenLinks > 0) {
            console.warn(`Found ${brokenLinks} broken links. Check console for details.`);
        } else {
            console.log('✓ All internal links are working properly.');
        }
    }, 2000);
});
