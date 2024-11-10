let total = 0;

// Add a new item to the bill
function addItem() {
    const billItems = document.getElementById('billItems');
    const newItem = document.createElement('div');
    newItem.classList.add('bill-item');
    newItem.innerHTML = `
        <input type="text" placeholder="Item Name" class="item-name" required />
        <input type="number" placeholder="Price" class="item-price" oninput="updateTotal(this)" min="0" step="0.01" required />
        <input type="number" placeholder="Quantity" class="item-quantity" oninput="updateTotal(this)" min="1" required />
        <span>₹0.00</span>
    `;
    billItems.appendChild(newItem);
}

// Update the total price for each item and calculate the grand total
function updateTotal(input) {
    const billItem = input.parentElement;
    const price = parseFloat(billItem.querySelector('.item-price').value) || 0;
    const quantity = parseFloat(billItem.querySelector('.item-quantity').value) || 0;
    const totalItem = price * quantity;

    // Update the item's total display
    billItem.children[3].textContent = `₹${totalItem.toFixed(2)}`;
    calculateGrandTotal();
}

// Calculate the grand total of all items
function calculateGrandTotal() {
    const billItems = document.querySelectorAll('.bill-item');
    total = Array.from(billItems).reduce((acc, item) => {
        const itemTotal = parseFloat(item.children[3].textContent.replace('₹', '')) || 0;
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





// Feedback Form Validation
document.getElementById('feedbackForm')?.addEventListener('submit', (e) => {
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const rating = document.querySelector('input[name="rating"]:checked');
    const comments = document.getElementById('comments').value.trim();

    if (!name || !email || !rating || !comments) {
        e.preventDefault();
        alert("Please complete all fields and provide a rating.");
    }
});

// Login Form Validation
document.getElementById('loginForm')?.addEventListener('submit', (e) => {
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value.trim();

    if (!email || !password) {
        e.preventDefault();
        alert("Please enter both email and password.");
    }
});

// Register Form Validation
document.getElementById('registerForm')?.addEventListener('submit', (e) => {
    const name = document.getElementById('register-name').value.trim();
    const email = document.getElementById('register-email').value.trim();
    const password = document.getElementById('register-password').value.trim();

    if (!name || !email || !password) {
        e.preventDefault();
        alert("Please fill in your name, email, and password.");
    }
});

// Display alerts if there is any server-side message
const alertBox = document.querySelector('.alert-box');
const alertMessage = document.querySelector('.alert');

function showAlert(message) {
    alertMessage.textContent = message;
    alertBox.style.display = 'block';

    // Hide alert after 3 seconds
    setTimeout(() => {
        alertBox.style.display = 'none';
    }, 3000);
}

// Check if there are any URL parameters for alerts (e.g., from PHP redirects)
const urlParams = new URLSearchParams(window.location.search);
if (urlParams.has('message')) {
    const message = urlParams.get('message');
    showAlert(message);
}

// JavaScript for Carousel Slider
let currentSlide = 0;
const slides = document.querySelectorAll(".carousel .slide");

function showSlide(index) {
    slides.forEach((slide, i) => {
        slide.style.display = i === index ? "block" : "none";
    });
}

function nextSlide() {
    currentSlide = (currentSlide + 1) % slides.length;
    showSlide(currentSlide);
}

// Show the first slide initially
showSlide(currentSlide);

// Change slide every 5 seconds
setInterval(nextSlide, 5000);

