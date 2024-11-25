let total = 0;

// Add a new item to the bill
function addItem(itemName = '', price = 0, quantity = 1) {
    const billItems = document.getElementById('billItems');
    const newItem = document.createElement('div');
    newItem.classList.add('bill-item');
    newItem.innerHTML = `
        <input type="text" placeholder="Item Name" class="item-name" value="${itemName}" required />
        <input type="number" placeholder="Price" class="item-price" oninput="updateTotal(this)" value="${price}" min="0" step="0.01" required />
        <input type="number" placeholder="Quantity" class="item-quantity" oninput="updateTotal(this)" value="${quantity}" min="1" required />
        <span>₹${(price * quantity).toFixed(2)}</span>
    `;
    billItems.appendChild(newItem);
    calculateGrandTotal();
}

// Update the total price for each item and calculate the grand total
function updateTotal(input) {
    const billItem = input.parentElement;
    const price = parseFloat(billItem.querySelector('.item-price').value) || 0;
    const quantity = parseFloat(billItem.querySelector('.item-quantity').value) || 0;
    const totalItem = price * quantity;

    // Update the item's total display
    const totalElement = billItem.querySelector('span');
    totalElement.textContent = `₹${totalItem.toFixed(2)}`;
    calculateGrandTotal();
}

// Calculate the grand total of all items
function calculateGrandTotal() {
    const billItems = document.querySelectorAll('.bill-item');
    total = Array.from(billItems).reduce((acc, item) => {
        const itemTotal = parseFloat(item.querySelector('span').textContent.replace('₹', '')) || 0;
        return acc + itemTotal;
    }, 0);

    document.getElementById('grandTotal').textContent = `Grand Total: ₹${total.toFixed(2)}`;
}

// Generate bill with validation
function generateBill() {
    const customerName = document.getElementById('customerName').value.trim();
    const customerMobile = document.getElementById('customerMobile').value.trim();
    const paymentMode = document.querySelector('input[name="paymentMode"]:checked');
    const message = document.getElementById('message');

    if (!customerName || !customerMobile || !paymentMode || total === 0) {
        message.textContent = 'Please fill in all fields and add items to the bill.';
        message.style.color = 'red';
        return;
    }

    message.textContent = `Bill generated successfully for ${customerName} (Mobile: ${customerMobile}). Payment mode: ${paymentMode.value}, Total: ₹${total.toFixed(2)}`;
    message.style.color = 'green';
}

// Print the bill with validation
function printBill() {
    const customerName = document.getElementById('customerName').value.trim();
    const customerMobile = document.getElementById('customerMobile').value.trim();
    const paymentMode = document.querySelector('input[name="paymentMode"]:checked');

    if (!customerName || !customerMobile || !paymentMode || total === 0) {
        alert("Please ensure all details are filled before printing.");
        return;
    }

    // Open a new print window
    const billWindow = window.open('', 'PRINT', 'height=600,width=800');
    billWindow.document.write('<html><head><title>Bill</title><style>');
    billWindow.document.write('table { width: 100%; border-collapse: collapse; }');
    billWindow.document.write('th, td { border: 1px solid black; padding: 8px; text-align: left; }');
    billWindow.document.write('</style></head><body>');

    // Add customer details
    billWindow.document.write('<h1>Radharani Supermarket</h1>');
    billWindow.document.write(`<p><strong>Customer Name:</strong> ${customerName}</p>`);
    billWindow.document.write(`<p><strong>Mobile Number:</strong> ${customerMobile}</p>`);

    // Build the table header
    billWindow.document.write('<table>');
    billWindow.document.write('<tr><th>Item Name</th><th>Price</th><th>Quantity</th><th>Total</th></tr>');

    // Fetch all bill items and build the table rows
    const billItems = Array.from(document.querySelectorAll('.bill-item'));
    if (billItems.length === 0) {
        billWindow.document.write('<tr><td colspan="4">No items added</td></tr>');
    } else {
        billItems.forEach((item) => {
            const itemName = item.querySelector('.item-name')?.value.trim() || 'Unnamed Item';
            const price = item.querySelector('.item-price')?.value.trim() || '0';
            const quantity = item.querySelector('.item-quantity')?.value.trim() || '0';
            const itemTotal = item.querySelector('span')?.textContent.trim() || '₹0.00';

            // Check if item name, price, and quantity are not empty before adding to the table
            if (itemName !== '' && price !== '0' && quantity !== '0') {
                billWindow.document.write(`
                    <tr>
                        <td>${itemName}</td>
                        <td>₹${price}</td>
                        <td>${quantity}</td>
                        <td>${itemTotal}</td>
                    </tr>
                `);
            }
        });
    }

    // Close the table and add the grand total
    billWindow.document.write('</table>');
    billWindow.document.write(`<p><strong>Grand Total:</strong> ₹${total.toFixed(2)}</p>`);
    billWindow.document.write(`<p><strong>Payment Mode:</strong> ${paymentMode.value}</p>`);
    billWindow.document.write('</body></html>');

    // Finalize and print
    billWindow.document.close();
    billWindow.focus();
    billWindow.print();
    billWindow.close();
}

// Step 1: Add a click event listener to the Search button
document.getElementById("searchButton").addEventListener("click", function () {
    // Step 2: Get the search input value
    const searchTerm = document.getElementById("searchInput").value.trim();

    // Step 3: Validate the input (alert if it's empty)
    if (!searchTerm) {
        alert("Please enter a search term!");
        return;
    }

    // Step 4: Perform the search (example: filtering product list)
    searchProducts(searchTerm);
});

// Step 5: Define the search function (filter products or fetch from backend)
function searchProducts(term) {
    const products = ["Apple", "Banana", "Orange", "Grapes", "Seasonal Fruits"];
    const results = products.filter((product) =>
        product.toLowerCase().includes(term.toLowerCase())
    );

    const resultsContainer = document.getElementById("resultsContainer");
    if (results.length > 0) {
        resultsContainer.innerHTML = results
            .map((result) => `<p><button onclick="addItem('${result}', 100, 1)">${result}</button></p>`)
            .join("");
    } else {
        resultsContainer.innerHTML = "<p>No products found!</p>";
    }
}

document.getElementById("searchInput").addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        document.getElementById("searchButton").click();
    }
});

// JavaScript for Hamburger Menu
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');

hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active'); // Toggle the active class to show/hide the menu
    hamburger.classList.toggle('is-active'); // Optional: for toggling hamburger animation
});

// JavaScript for Search Button
const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');
const resultsContainer = document.getElementById('resultsContainer');
const loadingMessage = document.getElementById('loadingMessage');

searchButton.addEventListener('click', () => {
    const query = searchInput.value.trim();

    if (query) {
        loadingMessage.style.display = 'block'; // Show the loading message
        resultsContainer.innerHTML = ''; // Clear previous results

        // Simulate a search result delay (e.g., fetch from API)
        setTimeout(() => {
            loadingMessage.style.display = 'none'; // Hide loading message
            resultsContainer.innerHTML = `
                <p>Search results for "<strong>${query}</strong>":</p>
                <ul>
                    <li>Result 1 for ${query}</li>
                    <li>Result 2 for ${query}</li>
                    <li>Result 3 for ${query}</li>
                </ul>
            `; // Replace with dynamic search logic
        }, 1000); // Simulated delay (1 second)
    } else {
        alert('Please enter a search term.');
    }
});
