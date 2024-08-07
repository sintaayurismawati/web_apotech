function initializeProductDisplay(products) {
    const productContainer = document.getElementById('product-container');

    let currentRow = document.createElement('div');
    currentRow.className = 'product-row';
    productContainer.appendChild(currentRow);

    products.forEach((product, index) => {
        const productItem = document.createElement('div');
        productItem.className = 'product-item';
        productItem.id = 'product-item';
        productItem.addEventListener('click', () =>
            window.location.href = '../html/detail_product.html'
        );

        const productImage = document.createElement('img');
        productImage.className = 'product-image';
        productImage.src = product.image;
        productImage.alt = product.name;

        const productDetails = document.createElement('div');
        productDetails.className = 'product-details';

        const productName = document.createElement('div');
        productName.className = 'product-name';
        productName.textContent = product.name;

        const productPrice = document.createElement('div');
        productPrice.className = 'product-price';
        productPrice.textContent = `Price: ${product.price}`;

        const productCity = document.createElement('div');
        productCity.className = 'product-city';
        productCity.textContent = `City: ${product.city}`;

        productDetails.appendChild(productName);
        productDetails.appendChild(productPrice);
        productDetails.appendChild(productCity);

        productItem.appendChild(productImage);
        productItem.appendChild(productDetails);

        currentRow.appendChild(productItem);

        // Check if current row has 3 products
        if ((index + 1) % 4 === 0) {
            // Create a new row if current row is full
            currentRow = document.createElement('div');
            currentRow.className = 'product-row';
            productContainer.appendChild(currentRow);
        }
    });
}

// Call the function once the DOM content is fully loaded
document.addEventListener('DOMContentLoaded', initializeProductDisplay);
