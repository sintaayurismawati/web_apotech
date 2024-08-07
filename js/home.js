document.addEventListener('DOMContentLoaded', function () {
    showProduct();
});

// Function to remove 'active' class from all links and add to the clicked one
function setActiveLink(link) {
    const links = document.querySelectorAll('.nav-links a');
    links.forEach(item => {
        item.classList.remove('active');
    });
    link.classList.add('active');
}

// Add event listeners to all nav-links
document.querySelectorAll('.nav-links a').forEach(item => {
    item.addEventListener('click', function () {
        setActiveLink(this);
    });
});

function initializeProductDisplay(products) {
    const productStoreContainer = document.createElement('div');

    let currentRow = document.createElement('div');
    currentRow.className = 'product-row';
    productStoreContainer.appendChild(currentRow);

    products.forEach((product, index) => {
        const productItem = document.createElement('div');
        productItem.className = 'product-item';
        productItem.id = 'product-item';
        productItem.addEventListener('click', () =>
            window.location.href = '../html/detail_product.html'
        );

        const productImage = document.createElement('img');
        productImage.className = 'product-image';
        productImage.src = product.image_url;
        productImage.alt = "product image";

        const productDetails = document.createElement('div');
        productDetails.className = 'product-details';

        const productName = document.createElement('div');
        productName.className = 'product-name';
        productName.textContent = product.nama_produk;

        const productPrice = document.createElement('div');
        productPrice.className = 'product-price';
        productPrice.textContent = `Price: ${product.harga_produk}`;

        // const productCity = document.createElement('div');
        // productCity.className = 'product-city';
        // productCity.textContent = `City: ${product.city}`;

        productDetails.appendChild(productName);
        productDetails.appendChild(productPrice);
        // productDetails.appendChild(productCity);

        productItem.appendChild(productImage);
        productItem.appendChild(productDetails);

        currentRow.appendChild(productItem);

        // Check if current row has 4 products
        if ((index + 1) % 4 === 0) {
            // Create a new row if current row is full
            currentRow = document.createElement('div');
            currentRow.className = 'product-row';
            productStoreContainer.appendChild(currentRow);
        }
    });
    return productStoreContainer;
}

function showAllProducts() {
    const productContainer = document.getElementById('product-container');
    while (productContainer.firstChild) {
        productContainer.removeChild(productContainer.firstChild);
    }
    fetch('../php/get_all_product.php')
        .then(response => {
            console.log('Fetch response:', response);
            return response.json();
        })
        .then(data => {
            console.log('Data fetched:', data);

            let currentRow = document.createElement('div');
            currentRow.className = 'product-row';
            productContainer.appendChild(currentRow);

            data.forEach((product, index) => {
                console.log('Product:', product);

                const productItem = document.createElement('div');
                productItem.className = 'product-item';
                productItem.id = 'product-item';
                productItem.addEventListener('click', () => {
                    localStorage.setItem('selectedProduct', JSON.stringify(product));
                    console.log('Product saved to localStorage:', product);
                    window.location.href = '../html/detail_produk.html';
                });

                const productImage = document.createElement('img');
                productImage.className = 'product-image';
                productImage.src = product.image_url;
                productImage.alt = "product image";

                const productDetails = document.createElement('div');
                productDetails.className = 'product-details';

                const productName = document.createElement('div');
                productName.className = 'product-name';
                productName.textContent = product.nama_produk;

                const productPrice = document.createElement('div');
                productPrice.className = 'product-price';
                productPrice.textContent = `Rp ${product.harga_produk}`;

                productDetails.appendChild(productName);
                productDetails.appendChild(productPrice);

                productItem.appendChild(productImage);
                productItem.appendChild(productDetails);

                currentRow.appendChild(productItem);

                // Check if current row has 4 products
                if ((index + 1) % 4 === 0) {
                    // Create a new row if current row is full
                    currentRow = document.createElement('div');
                    currentRow.className = 'product-row';
                    productContainer.appendChild(currentRow);
                }
            });
        })
        .catch(error => {
            console.error('Error fetching products:', error);
        });
}


function showProduct() {
    document.getElementById("product-container").style.display = "block";
    document.getElementById("toko-saya").style.display = "none";
    document.getElementById("histori").style.display = "none";
    document.getElementById("keranjang").style.display = "none";
    document.getElementById("detail-product").style.display = "none";

    showAllProducts()
}

function showTokoSaya() {
    document.getElementById("product-container").style.display = "none";
    document.getElementById("toko-saya").style.display = "block";
    document.getElementById("histori").style.display = "none";
    document.getElementById("keranjang").style.display = "none";
    document.getElementById("detail-product").style.display = "none";

    fetch('../php/get_toko_saya.php')
        .then(response => response.json())
        .then(data => {
            console.log(data);
            var tokoSayaDiv = document.getElementById('toko-saya');

            if (data.error) {
                // Handle error case
                tokoSayaDiv.innerHTML = `
                    <div class="img-data-empty" style="display:flex; flex-flow:column; justify-content:center; height:100%; width:100%;  align-items:center;">
                        <img src="images/no_data_found.jpeg" alt="No Data Found" >
                        <p>${data.error}</p>
                        <button onclick="showAddStoreForm()" class="button-buka-toko" style="width:10%; padding: 10px; background-color: #00A69C; color: white; border: none; border-radius: 20px; cursor: pointer;">Buka Toko</button>
                    </div>
                `;
            } else {
                if (data.status == 0) {
                    tokoSayaDiv.innerHTML = `
                        <div class="profil-store" style="display:flex; flex-flow: row; justify-content:center; gap:130px; align-items:center;">
                            <div style="display:flex; flex-flow:column; text-align: center;">
                                <div class="circle-container" style="width: 100px; height: 100px; border-radius: 50%; overflow: hidden;">
                                    <img src="${data.image_profil}" alt="Deskripsi Gambar" style="width: 100%; height: 100%;">
                                </div>
                                <p style="color:#475353; font-weight:bold;">${data.nama_vendor}</p>
                            </div>
                            <div class="store-summary" style="display:flex; flex-flow: row; justify-content: space-between; gap:100px;">
                                <div class="jumlah-produk" style="text-align: center;">
                                    <h3 style="color:#475353;">Jumlah Produk</h3>
                                    <h1 style="color:#00A69C;">20</h1>
                                </div>
                                <div class="jumlah-produk" style="text-align: center;">
                                    <h3 style="color:#475353;">Produk Terjual</h3>
                                    <h1 style="color:#00A69C;">20</h1>
                                </div>
                                <div class="jumlah-produk" style="text-align: center;">
                                    <h3 style="color:#475353;">Jumlah Kunjungan</h3>
                                    <h1 style="color:#00A69C;">20</h1>
                                </div>
                                <div class="jumlah-produk" style="text-align: center;">
                                    <h3 style="color:#475353;">Keranjang</h3>
                                    <h1 style="color:#00A69C;">100</h1>
                                </div>
                                <div class="jumlah-produk" style="text-align: center;">
                                    <h3 style="color:#475353;">Rating</h3>
                                    <h1 style="color:#00A69C;">4.5</h1>
                                </div>
                            </div>
                        </div>
                        <hr>
                    `;
                    showPrdouctStore(); // Panggil fungsi untuk menampilkan produk
                } else {
                    // Handle successful data retrieval
                    tokoSayaDiv.innerHTML = `
                        <p>Nama Toko: ${data.nama_vendor}</p>
                    `;
                }
            }

            var btnTambahToko = document.querySelector('.button-buka-toko');
            btnTambahToko.addEventListener('mouseover', function () {
                this.style.backgroundColor = '#aaafab'; // Warna latar belakang saat hover
            });

            btnTambahToko.addEventListener('mouseout', function () {
                this.style.backgroundColor = '#00A69C'; // Kembali ke warna latar belakang asli setelah hover
            });
        })
        .catch(error => console.error('Error fetching user info:', error));
}

function showHistori() {
    document.getElementById("product-container").style.display = "none";
    document.getElementById("toko-saya").style.display = "none";
    document.getElementById("histori").style.display = "block";
    document.getElementById("keranjang").style.display = "none";
    document.getElementById("detail-product").style.display = "none";
}

function showKeranjang() {
    document.getElementById("product-container").style.display = "none";
    document.getElementById("toko-saya").style.display = "none";
    document.getElementById("histori").style.display = "none";
    document.getElementById("keranjang").style.display = "block";
    document.getElementById("detail-product").style.display = "none";
}

function showAddProductStoreForm() {
    var modalHTML = `
        <div id="modal" class="modal" style="display: flex; justify-content: center; align-items: center; position: fixed; left: 0; top: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.5); z-index: 1000;">
            <div class="modal-content" style="background-color: #fefefe; margin: 15% auto; padding: 20px; border: 1px solid #888; width: 80%; max-width: 600px; border-radius: 10px; position: relative; max-height: 80%; overflow-y: auto;">
                <span class="close" onclick="closeModal()" style="color: #aaa; float: right; font-size: 28px; font-weight: bold;">&times;</span>
                <h2 style="text-align: center;">Form Tambah Produk</h2>
                <form id="addStoreForm" action="..php/tambah_produk_toko.php" method="post">
                    <div style="display:flex; flex-flow:column;">
                        <label for="nama_produk" style="margin-top: 10px;">Nama Produk:</label>
                        <input type="text" id="nama_produk" name="nama_produk" required style="width: 95%; padding: 10px; margin-bottom: 10px; border: 1px solid #ccc; border-radius: 5px;">

                        <label for="kategori_produk" style="margin-top: 10px;">Kategori Produk:</label>
                        <input type="text" id="kategori_produk" name="kategori_produk" required style="width: 95%; padding: 10px; margin-bottom: 10px; border: 1px solid #ccc; border-radius: 5px;">

                        <label for="harga_produk" style="margin-top: 10px;">Harga Produk:</label>
                        <input type="number" id="harga_produk" name="harga_produk" required style="width: 95%; padding: 10px; margin-bottom: 10px; border: 1px solid #ccc; border-radius: 5px;">

                        <label for="jumlah_stok" style="margin-top: 10px;">Jumlah Stok:</label>
                        <input type="number" id="jumlah_stok" name="jumlah_stok" required style="width: 95%; padding: 10px; margin-bottom: 10px; border: 1px solid #ccc; border-radius: 5px;">

                        <label for="image_url" style="margin-top: 10px;">URL Gambar Produk:</label>
                        <input type="text" id="image_url" name="image_url" required style="width: 95%; padding: 10px; margin-bottom: 10px; border: 1px solid #ccc; border-radius: 5px;">

                        <label for="deskripsi" style="margin-top: 10px;">Deskripsi:</label>
                        <textarea id="deskripsi" name="deskripsi" style="height: 100px; width: 95%; padding: 10px; margin-bottom: 10px; border: 1px solid #ccc; border-radius: 5px;"></textarea>
                    </div>
                    <input type="submit" value="Simpan" style="background-color: #00A69C; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer;">
                </form>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);
}

// Function to show product store
function showPrdouctStore() {
    fetch('../php/get_product_store.php')
        .then(response => response.json())
        .then(data => {
            var tokoSayaDiv = document.getElementById('toko-saya');

            if (data.error) {
                console.error(data.error);
            } else {
                // Jika tidak ada produk
                if (data.length === 0) {
                    const noProductDiv = document.createElement('div');
                    noProductDiv.innerHTML = `
                    <div style="display:flex; flex-flow:column; justify-content: center; margin-top:70px; width:100%; height:100%; align-items:center;">
                        <img src="images/empty.png" alt="Deskripsi Gambar" style="width: 250px; height: 250px">
                        <p>Belum ada produk</p>
                        <button onclick="showAddProductStoreForm()" class="button-tambah-produk" style="width:15%; padding: 10px; background-color: #00A69C; color: white; border: none; border-radius: 20px; cursor: pointer;">Tambahkan Produk</button>
                    </div>`;
                    tokoSayaDiv.appendChild(noProductDiv);
                } else {
                    const productStoreDiv = document.createElement('div');
                    productStoreDiv.innerHTML = `
                    <div style="display:flex; flex-flow:column;">
                        <div style="display:flex; justify-content:space-between; align-items: center;">
                        <h2>Produk</h2>
                            <button onclick="showAddProductStoreForm()" class="button-tambah-produk" style="width:13%; height : 50px; background-color: #00A69C; color: white; border: none; border-radius: 20px; cursor: pointer;">Tambahkan Produk</button>
                        </div>
                    </div>
                    `;
                    tokoSayaDiv.appendChild(productStoreDiv);
                    // soon

                    // Tampilkan produk
                    tokoSayaDiv.appendChild(initializeProductDisplay(data));
                }
            }
        })
        .catch(error => console.error('Error fetching products:', error));
}

function showAddStoreForm() {
    // Menampilkan popup modal
    var modalHTML = `
        <div id="modal" class="modal" style="display: flex; justify-content: center; align-items: center; position: fixed; left: 0; top: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.5); z-index: 1000;">
            <div class="modal-content" style="background-color: #fefefe; margin: 15% auto; padding: 20px; border: 1px solid #888; width: 80%; max-width: 600px; border-radius: 10px; position: relative;">
                <span class="close" onclick="closeModal()" style="color: #aaa; float: right; font-size: 28px; font-weight: bold;">&times;</span>
                <h2 style="text-align: center;">Form Tambah Toko</h2>
                <form id="addStoreForm" action="../php/tambah_toko.php" method="post">
                    <div style="display:flex; flex-flow:column; gap:5px;">
                        <label for="storeName">Nama Toko:</label>
                        <input type="text" id="storeName" name="storeName" required style="width: 95%; padding: 10px; margin-bottom: 10px; border: 1px solid #ccc; border-radius: 5px;">
                        <label for="city">Kota:</label>
                        <input type="text" id="city" name="city" required style="width: 95%; padding: 10px; margin-bottom: 10px; border: 1px solid #ccc; border-radius: 5px;">
                        <label for="address">Alamat:</label>
                        <input type="text" id="address" name="address" required style="width: 95%; padding: 10px; margin-bottom: 10px; border: 1px solid #ccc; border-radius: 5px;">
                        <label for="phoneNumber">Nomor Telepon:</label>
                        <input type="tel" id="phoneNumber" name="phoneNumber" pattern="[0-9]{10,12}" required style="width: 95%; padding: 10px; margin-bottom: 10px; border: 1px solid #ccc; border-radius: 5px;">
                        <label for="image_profil">Image Profile URL:</label>
                        <input type="text" id="image_profil" name="image_profil" required style="width: 95%; padding: 10px; margin-bottom: 10px; border: 1px solid #ccc; border-radius: 5px;">
                    </div>
                    <input type="submit" value="Simpan" style="background-color: #00A69C; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer;">
                </form>
            </div>
        </div>
    `;

    // Memasukkan modal ke dalam halaman
    document.body.insertAdjacentHTML('beforeend', modalHTML);

    // Mencegah scroll background saat modal ditampilkan
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    var modal = document.getElementById('modal');
    if (modal) {
        modal.remove();
        document.body.style.overflow = ''; // Mengembalikan scroll saat modal ditutup
    }
}

function submitStoreForm(event) {
    event.preventDefault(); // Prevent default form submission

    // Collect form data
    const formData = new FormData(document.getElementById('addStoreForm'));

    fetch('../php/tambah_toko.php', {
        method: 'POST',
        body: formData
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Handle success case
                closeModal(); // Close modal after successful submission
                // Optionally, you can redirect or refresh the page here
            } else {
                // Handle error case
                console.error('Error adding store:', data.error);
                // Optionally, display an error message to the user
            }
        })
        .catch(error => {
            console.error('Error:', error);
            // Handle network errors or other exceptions
        });
}