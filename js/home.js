document.addEventListener("DOMContentLoaded", function () {
  initializeButtonToggle();
  showProduct();

  document.getElementById("jumlah_beli").addEventListener("input", () => {
    const jumlahBeli =
      parseInt(document.getElementById("jumlah_beli").value, 10) || 0;
    const total = jumlahBeli * hargaProdukKrj;

    // Logging values to console for debugging
    console.log("Jumlah Beli:", jumlahBeli);
    console.log("Harga Produk:", hargaProdukKrj);
    console.log("Total:", total);

    document.getElementById(
      "total"
    ).textContent = `Total: Rp${total.toLocaleString("id-ID")}`;
    document.getElementById("total_hidden").value = total;
  });
});

// Function to remove 'active' class from all links and add to the clicked one
function setActiveLink(link) {
  const links = document.querySelectorAll(".nav-links a");
  links.forEach((item) => {
    item.classList.remove("active");
  });
  link.classList.add("active");
}

// Add event listeners to all nav-links
document.querySelectorAll(".nav-links a").forEach((item) => {
  item.addEventListener("click", function () {
    setActiveLink(this);
  });
});

function initializeProductDisplay(products) {
  const productStoreContainer = document.createElement("div");

  let currentRow = document.createElement("div");
  currentRow.className = "product-row";
  productStoreContainer.appendChild(currentRow);

  products.forEach((product, index) => {
    const productItem = document.createElement("div");
    productItem.className = "product-item";
    productItem.id = "product-item";
    productItem.addEventListener("click", () => {
      localStorage.setItem("selectedProductVendor", JSON.stringify(product));
      console.log("Product saved to localStorage:", product);
      window.location.href = "../html/detail_produk_vendor.html";
    });

    // const productImage = document.createElement("img");
    // productImage.className = "product-image";
    // productImage.src = product.image_url;
    // productImage.alt = "product image";

    const productImage = document.createElement("img");
    productImage.className = "product-image";
    productImage.src = `http://localhost/web_apotech/apotech_images/${product.image_url}`;
    productImage.alt = "product image";

    const productDetails = document.createElement("div");
    productDetails.className = "product-details";

    const productName = document.createElement("div");
    productName.className = "product-name";
    productName.textContent = product.nama_produk;

    const productPrice = document.createElement("div");
    productPrice.className = "product-price";
    productPrice.textContent = `Price: ${product.harga_produk}`;

    productDetails.appendChild(productName);
    productDetails.appendChild(productPrice);

    productItem.appendChild(productImage);
    productItem.appendChild(productDetails);

    currentRow.appendChild(productItem);

    // Check if current row has 4 products
    if ((index + 1) % 4 === 0) {
      // Create a new row if current row is full
      currentRow = document.createElement("div");
      currentRow.className = "product-row";
      productStoreContainer.appendChild(currentRow);
    }
  });
  return productStoreContainer;
}

function showAllProducts() {
  const productContainer = document.getElementById("product-container");
  while (productContainer.firstChild) {
    productContainer.removeChild(productContainer.firstChild);
  }
  fetch("../php/get_all_product.php")
    .then((response) => {
      console.log("Fetch response:", response);
      return response.json();
    })
    .then((data) => {
      console.log("Data fetched:", data);

      let currentRow = document.createElement("div");
      currentRow.className = "product-row";
      productContainer.appendChild(currentRow);

      data.forEach((product, index) => {
        console.log("Product:", product);

        const productItem = document.createElement("div");
        productItem.className = "product-item";
        productItem.id = "product-item";
        productItem.addEventListener("click", () => {
          localStorage.setItem("selectedProduct", JSON.stringify(product));
          console.log("Product saved to localStorage:", product);
          window.location.href = "../html/detail_produk.html";
        });

        // const productImage = document.createElement("img");
        // productImage.className = "product-image";
        // productImage.src = product.image_url;
        // productImage.alt = "product image";

        const productImage = document.createElement("img");
        productImage.className = "product-image";
        productImage.src = `http://localhost/web_apotech/apotech_images/${product.image_url}`;
        productImage.alt = "product image";

        const productDetails = document.createElement("div");
        productDetails.className = "product-details";

        const productName = document.createElement("div");
        productName.className = "product-name";
        productName.textContent = product.nama_produk;

        const productPrice = document.createElement("div");
        productPrice.className = "product-price";
        productPrice.textContent = `Rp ${product.harga_produk}`;

        productDetails.appendChild(productName);
        productDetails.appendChild(productPrice);

        productItem.appendChild(productImage);
        productItem.appendChild(productDetails);

        currentRow.appendChild(productItem);

        // Check if current row has 4 products
        if ((index + 1) % 4 === 0) {
          // Create a new row if current row is full
          currentRow = document.createElement("div");
          currentRow.className = "product-row";
          productContainer.appendChild(currentRow);
        }
      });
    })
    .catch((error) => {
      console.error("Error fetching products:", error);
    });
}

function showProduct() {
  document.getElementById("product-container").style.display = "block";
  document.getElementById("toko-saya").style.display = "none";
  document.getElementById("histori-1").style.display = "none";
  document.getElementById("keranjang").style.display = "none";
  document.getElementById("detail-product").style.display = "none";

  showAllProducts();
}

document.querySelectorAll(".dropdown-item").forEach((item) => {
  item.addEventListener("click", function (event) {
    event.preventDefault(); // Mencegah tindakan default link
    console.log(this.getAttribute("data-value")); // Cetak nilai yang diklik

    document.getElementById("product-container").style.display = "block";
    document.getElementById("toko-saya").style.display = "none";
    document.getElementById("histori-1").style.display = "none";
    document.getElementById("keranjang").style.display = "none";
    document.getElementById("detail-product").style.display = "none";

    const kategoriProduk = this.getAttribute("data-value");

    const productContainer = document.getElementById("product-container");
    while (productContainer.firstChild) {
      productContainer.removeChild(productContainer.firstChild);
    }

    fetch(
      `../php/get_product_by_category.php?kategori=${encodeURIComponent(
        kategoriProduk
      )}`
    )
      .then((response) => {
        console.log("Fetch response:", response);
        return response.json();
      })
      .then((data) => {
        if (!data || data.length === 0) {
          const noDataFound = document.createElement("div");
          noDataFound.className = "histori-noDataFound";
          noDataFound.innerHTML = `
              <div style="display: flex; flex-flow: column; justify-content: center; align-items: center;">
                <img
                  src="../images/no_data_found.jpeg"
                  style="height: 300px; width: 300px; align-items: center;"
                />
                <h4>Maaf, produk belum tersedia.</h4>
              </div>
            `;
          // Menambahkan noDataFound ke historiContainer
          productContainer.appendChild(noDataFound);
        } else {
          console.log("Data fetched:", data);

          let currentRow = document.createElement("div");
          currentRow.className = "product-row";
          productContainer.appendChild(currentRow);

          data.forEach((product, index) => {
            console.log("Product:", product);

            const productItem = document.createElement("div");
            productItem.className = "product-item";
            productItem.id = "product-item";
            productItem.addEventListener("click", () => {
              localStorage.setItem("selectedProduct", JSON.stringify(product));
              console.log("Product saved to localStorage:", product);
              window.location.href = "../html/detail_produk.html";
            });

            // const productImage = document.createElement("img");
            // productImage.className = "product-image";
            // productImage.src = product.image_url;
            // productImage.alt = "product image";
            const productImage = document.createElement("img");
            productImage.className = "product-image";
            productImage.src = `http://localhost/web_apotech/apotech_images/${product.image_url}`;
            productImage.alt = "product image";

            const productDetails = document.createElement("div");
            productDetails.className = "product-details";

            const productName = document.createElement("div");
            productName.className = "product-name";
            productName.textContent = product.nama_produk;

            const productPrice = document.createElement("div");
            productPrice.className = "product-price";
            productPrice.textContent = `Rp ${product.harga_produk}`;

            productDetails.appendChild(productName);
            productDetails.appendChild(productPrice);

            productItem.appendChild(productImage);
            productItem.appendChild(productDetails);

            currentRow.appendChild(productItem);

            // Check if current row has 4 products
            if ((index + 1) % 4 === 0) {
              // Create a new row if current row is full
              currentRow = document.createElement("div");
              currentRow.className = "product-row";
              productContainer.appendChild(currentRow);
            }
          });
        }
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
      });
  });
});

function showTokoSaya() {
  document.getElementById("product-container").style.display = "none";
  document.getElementById("toko-saya").style.display = "block";
  document.getElementById("histori-1").style.display = "none";
  document.getElementById("keranjang").style.display = "none";
  document.getElementById("detail-product").style.display = "none";

  fetch("../php/get_toko_saya.php")
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      var tokoSayaDiv = document.getElementById("toko-saya");
      while (tokoSayaDiv.firstChild) {
        tokoSayaDiv.removeChild(tokoSayaDiv.firstChild);
      }

      if (data.error) {
        // Handle error case
        tokoSayaDiv.innerHTML = `
                    <div class="img-data-empty" style="display:flex; flex-flow:column; justify-content:center; height:100%; width:100%;  align-items:center;">
                        <img src="../images/no_data_found.jpeg" alt="No Data Found" >
                        <p>${data.error}</p>
                        <button onclick="showAddStoreForm()" class="button-buka-toko" style="width:10%; padding: 10px; background-color: #00A69C; color: white; border: none; border-radius: 20px; cursor: pointer;">Buka Toko</button>
                    </div>
                `;
      } else {
        if (data.status == "Aktif") {
          tokoSayaDiv.innerHTML = `
                        <div class="profil-store" style="display:flex; flex-flow: row; justify-content:center; gap:130px; align-items:center;">
                            <div style="display:flex; flex-flow:column; text-align: center;">
                                <div class="circle-container" style="width: 100px; height: 100px; border-radius: 50%; overflow: hidden;">
                                    <img src="http://localhost/web_apotech/apotech_images/${data.image_profil}" alt="Deskripsi Gambar" style="width: 100%; height: 100%;">
                                </div>
                                <p style="color:#475353; font-weight:bold;">${data.nama_vendor}</p>
                            </div>
                            <div class="store-summary" style="display:flex; flex-flow: row; justify-content: space-between; gap:100px;">
                                <div class="jumlah-produk" style="text-align: center;">
                                    <h3 style="color:#475353;">Produk</h3>
                                    <h1 style="color:#00A69C;">${data.jumlah_produk}</h1>
                                </div>
                                <div class="jumlah-produk" style="text-align: center;">
                                    <h3 style="color:#475353;">Terjual</h3>
                                    <h1 style="color:#00A69C;">${data.jumlah_terjual}</h1>
                                </div>
                                <div class="jumlah-produk" style="text-align: center;">
                                    <h3 style="color:#475353;">Keranjang</h3>
                                    <h1 style="color:#00A69C;">${data.jumlah_keranjang}</h1>
                                </div>                                
                            </div>
                        </div>
                        <hr>
                    `;
          showPrdouctStore(); // Panggil fungsi untuk menampilkan produk
        } else {
          // Handle successful data retrieval
          // tokoSayaDiv.innerHTML = `
          //               <p>Nama Toko: ${data.nama_vendor}</p>
          //           `;

          tokoSayaDiv.innerHTML = `
              <div style="display: flex; flex-flow: column; justify-content: center; align-items: center;">
                <img
                  src="../images/waiting.png"
                  style="height: 200px; width: 200px; align-items: center;"
                />
                <h4>Toko dalam proses konfirmasi oleh admin.</h4>
              </div>
            `;
        }
      }

      var btnTambahToko = document.querySelector(".button-buka-toko");
      btnTambahToko.addEventListener("mouseover", function () {
        this.style.backgroundColor = "#aaafab"; // Warna latar belakang saat hover
      });

      btnTambahToko.addEventListener("mouseout", function () {
        this.style.backgroundColor = "#00A69C"; // Kembali ke warna latar belakang asli setelah hover
      });
    })
    .catch((error) => console.error("Error fetching user info:", error));
}

// Function to show product store
function showPrdouctStore() {
  fetch("../php/get_product_store.php")
    .then((response) => response.json())
    .then((data) => {
      var tokoSayaDiv = document.getElementById("toko-saya");

      if (data.error) {
        console.error(data.error);
      } else {
        // Jika tidak ada produk
        if (data.length === 0) {
          const noProductDiv = document.createElement("div");
          noProductDiv.innerHTML = `
                    <div style="display:flex; flex-flow:column; justify-content: center; margin-top:70px; width:100%; height:100%; align-items:center;">
                        <img src="../images/empty.png" alt="Deskripsi Gambar" style="width: 250px; height: 250px">
                        <p>Belum ada produk</p>
                        <button onclick="showAddProductStoreForm()" class="button-tambah-produk" style="width:15%; padding: 10px; background-color: #00A69C; color: white; border: none; border-radius: 20px; cursor: pointer;">Tambahkan Produk</button>
                    </div>`;
          tokoSayaDiv.appendChild(noProductDiv);
        } else {
          const productStoreDiv = document.createElement("div");
          productStoreDiv.innerHTML = `
                    <div style="display:flex; flex-flow:column;">
                        <div style="display:flex; justify-content:space-between; align-items: center;">
                        <h2>Produk</h2>
                        <div style="display:flex; flex-flow:row; gap:10px;">
                          <button onclick="showAddProductStoreForm()" class="button-tambah-produk" style=" height : 50px; background-color: #00A69C; color: white; border: none; border-radius: 20px; cursor: pointer;">Tambahkan Produk</button>
                          <button onclick="window.location.href = '../html/pesanan_masuk.html'" class="button-pesanan-masuk" style=" height : 50px; background-color: #00A69C; color: white; border: none; border-radius: 20px; cursor: pointer;">Pesanan Masuk</button>
                          <button onclick="window.location.href = '../html/riwayat_penjualan_vendor.html'" class="button-pesanan-masuk" style=" height : 50px; background-color: #00A69C; color: white; border: none; border-radius: 20px; cursor: pointer;">Riwayat Penjualan</button>
                        </div>
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
    .catch((error) => console.error("Error fetching products:", error));
}

function showAddProductStoreForm() {
  var modalHTML = `
        <div id="modal" class="modal" style="display: flex; justify-content: center; align-items: center; position: fixed; left: 0; top: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.5); z-index: 1000;">
            <div class="modal-content" style="background-color: #fefefe; margin: 15% auto; padding: 20px; border: 1px solid #888; width: 80%; max-width: 600px; border-radius: 10px; position: relative; max-height: 80%; overflow-y: auto;">
                <span class="close" onclick="closeModal('modal')" style="color: #aaa; float: right; font-size: 28px; font-weight: bold;">&times;</span>
                <h2 style="text-align: center;">Form Tambah Produk</h2>
                <form id="addProductStoreForm" method="post" onsubmit="submitProductStoreForm(event)">
                    <div style="display:flex; flex-flow:column;">
                        <label for="nama_produk" style="margin-top: 10px;">Nama Produk:</label>
                        <input type="text" id="nama_produk" name="nama_produk" required style="width: 95%; padding: 10px; margin-bottom: 10px; border: 1px solid #ccc; border-radius: 5px;">

                        <label for="kategori_produk" style="margin-top: 10px;">Kategori Produk:</label>
                        <select id="kategori_produk" name="kategori_produk" required style="width: 99%; padding: 10px; margin-bottom: 10px; border: 1px solid #ccc; border-radius: 5px;">
                            <option value="" disabled selected>Pilih kategori produk</option>    
                            <option value="Obat Kapsul">Obat Kapsul</option>
                            <option value="Obat Sirup">Obat Sirup</option>
                            <option value="Obat Tetes">Obat Tetes</option>
                            <option value="Obat Oles">Obat Oles</option>
                            <option value="Alat Medis">Alat Medis</option>
                        </select>
                        
                        <label for="harga_produk" style="margin-top: 10px;">Harga Produk:</label>
                        <input type="number" id="harga_produk" name="harga_produk" required style="width: 95%; padding: 10px; margin-bottom: 10px; border: 1px solid #ccc; border-radius: 5px;">

                        <label for="jumlah_stok" style="margin-top: 10px;">Jumlah Stok:</label>
                        <input type="number" id="jumlah_stok" name="jumlah_stok" required style="width: 95%; padding: 10px; margin-bottom: 10px; border: 1px solid #ccc; border-radius: 5px;">

                        <label for="image_url" style="margin-top: 10px;">Upload Gambar Produk:</label>
                        <input type="file" id="image_url" name="image_url" accept="image/*" required style="width: 95%; padding: 10px; margin-bottom: 10px; border: 1px solid #ccc; border-radius: 5px;">

                        <label for="deskripsi" style="margin-top: 10px;">Deskripsi:</label>
                        <textarea id="deskripsi" name="deskripsi" style="height: 100px; width: 95%; padding: 10px; margin-bottom: 10px; border: 1px solid #ccc; border-radius: 5px;"></textarea>
                    </div>
                    <input type="submit" value="Simpan" style="background-color: #00A69C; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer;">
                </form>
            </div>
        </div>
    `;
  document.body.insertAdjacentHTML("beforeend", modalHTML);
  document.body.style.overflow = "hidden";
}

function submitProductStoreForm(event) {
  event.preventDefault();
  const formData = new FormData(document.getElementById("addProductStoreForm"));

  fetch("../php/tambah_produk_toko.php", {
    method: "POST",
    body: formData,
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.status === "success") {
        closeModal("modal");
        showModalSuccess("Produk berhasil ditambahkan.");
        showTokoSaya();
      } else {
        console.error("Error adding store:", data.error);
        showModalFail("Gagal menambahkan produk.");
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      // Handle network errors or other exceptions
    });
}

function showAddStoreForm() {
  // Menampilkan popup modal
  var modalHTML = `
        <div id="modal2" class="modal2" style="display: flex; justify-content: center; align-items: center; position: fixed; left: 0; top: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.5); z-index: 1000;">
            <div class="modal-content" style="background-color: #fefefe; margin: 15% auto; padding: 20px; border: 1px solid #888; width: 80%; max-width: 600px; border-radius: 10px; position: relative;">
                <span class="close" onclick="closeModal('modal2')" style="color: #aaa; float: right; font-size: 28px; font-weight: bold;">&times;</span>
                <h2 style="text-align: center;">Form Tambah Toko</h2>
                <form id="addStoreForm" action="../php/tambah_toko.php" method="post"  enctype="multipart/form-data">
                    <div style="display:flex; flex-flow:column; gap:5px;">
                        <label for="storeName">Nama Toko:</label>
                        <input type="text" id="storeName" name="storeName" required style="width: 95%; padding: 10px; margin-bottom: 10px; border: 1px solid #ccc; border-radius: 5px;">
                        <label for="city">Kota:</label>
                        <input type="text" id="city" name="city" required style="width: 95%; padding: 10px; margin-bottom: 10px; border: 1px solid #ccc; border-radius: 5px;">
                        <label for="address">Alamat:</label>
                        <input type="text" id="address" name="address" required style="width: 95%; padding: 10px; margin-bottom: 10px; border: 1px solid #ccc; border-radius: 5px;">
                        <label for="phoneNumber">Nomor Telepon:</label>
                        <input type="tel" id="phoneNumber" name="phoneNumber" pattern="[0-9]{10,12}" required style="width: 95%; padding: 10px; margin-bottom: 10px; border: 1px solid #ccc; border-radius: 5px;">
                        
                        <label for="image_profil" style="margin-top: 10px;">Upload Gambar Profil:</label>
                        <input type="file" id="image_profil" name="image_profil" accept="image/*" required style="width: 95%; padding: 10px; margin-bottom: 10px; border: 1px solid #ccc; border-radius: 5px;">
                    </div>
                    <input type="submit" value="Simpan" style="background-color: #00A69C; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer;">
                </form>
            </div>
        </div>
    `;

  // Memasukkan modal ke dalam halaman
  document.body.insertAdjacentHTML("beforeend", modalHTML);

  // Mencegah scroll background saat modal ditampilkan
  document.body.style.overflow = "hidden";
}

function submitStoreForm(event) {
  event.preventDefault(); // Prevent default form submission

  // Collect form data
  const formData = new FormData(document.getElementById("addStoreForm"));

  fetch("../php/tambah_toko.php", {
    method: "POST",
    body: formData,
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        // Handle success case
        closeModal("modal2"); // Close modal after successful submission
        // Optionally, you can redirect or refresh the page here
      } else {
        // Handle error case
        console.error("Error adding store:", data.error);
        // Optionally, display an error message to the user
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      // Handle network errors or other exceptions
    });
}

function showHistori() {
  // Sembunyikan dan tampilkan elemen sesuai kebutuhan
  document.getElementById("product-container").style.display = "none";
  document.getElementById("toko-saya").style.display = "none";
  document.getElementById("histori-1").style.display = "block";
  document.getElementById("keranjang").style.display = "none";
  document.getElementById("detail-product").style.display = "none";

  // Lakukan fetch ke PHP untuk cek histori
  fetch("../php/cek_histori.php")
    .then((response) => response.json())
    .then((data) => {
      // Jika data berhasil diambil dan tidak ada error
      if (data.error) {
        console.error(data.error); // Tampilkan pesan error jika ada
      } else {
        // Kamu bisa melakukan logika tambahan di sini jika diperlukan
        console.log("Histori fetched:", data);
      }
      // Tetap jalankan loadHistori meskipun tidak ada update
      loadHistori("Dalam Antrian");
    })
    .catch((error) => {
      console.error("Error fetching histori:", error); // Handle error jika fetch gagal
      // Tetap jalankan loadHistori meskipun fetch error
      loadHistori("Dalam Antrian");
    });
}

function loadHistori(status) {
  const historiContainer = document.getElementById("histori");
  while (historiContainer.firstChild) {
    historiContainer.removeChild(historiContainer.firstChild);
  }
  // Fetch data dari PHP
  fetch(`../php/get_histori.php?status=${encodeURIComponent(status)}`)
    .then((response) => response.json()) // Mengubah data yang diterima menjadi JSON
    .then((data) => {
      const historiContainer = document.getElementById("histori");
      historiContainer.style.display = "block"; // Menampilkan container histori

      if (!data || data.length === 0) {
        console.log("histori kosong");
        const noDataFound = document.createElement("div");
        noDataFound.className = "histori-noDataFound";

        noDataFound.innerHTML = `
          <div style="display: flex; flex-flow: column; justify-content: center; align-items: center;">
          <img
          src="../images/no_data_found.jpeg"
          style="height: 300px; width: 300px; align-items: center;"
          />
          <h4>Data tidak ditemukan.</h4>
          </div>
        `;
        historiContainer.appendChild(noDataFound);
      } else {
        data.forEach((histori) => {
          // Membuat elemen histori-card baru
          console.log("Histori:", histori);
          const historiCard = document.createElement("div");
          historiCard.className = "histori-card";
          historiCard.id = `histori-card-${histori.id}`;
          tanggalBeli = formatTanggal(histori.created_at);
          const showCancelButton = status === "Dalam Antrian";
          const showUlasanButton = status === "Selesai";

          historiCard.innerHTML = `
                    <div class="tanggal-container">
                        <label style="font-weight: bold; color: #00a69c;">${tanggalBeli}</label>
                    </div>
                    <br>
                    <div style="display:flex; flex-flow:column;">
                      <div style="display: flex; flex-flow: row; width: 100%;">
                          <div style="width: 300px; height: 250px;">
                              <img src="http://localhost/web_apotech/apotech_images/${
                                histori.image_url
                              }">
                          </div>
                          <div class="details">
                              <div>
                                  <label class="sub-title">${
                                    histori.nama_produk
                                  }</label>
                                  <label>Rp${histori.harga_produk}</label>
                              </div>
                              <div>
                                  <label class="sub-title">Toko</label>
                                  <label>${histori.nama_vendor} (${
            histori.kota
          })</label>
                              </div>
                              <div>
                                  <label class="sub-title">Jumlah</label>
                                  <label>${histori.jumlah_beli}</label>
                              </div>
                              <div>
                                  <label class="sub-title">Total</label>
                                  <label>Rp${histori.total}</label>
                              </div>
                              <div>
                                  <label class="sub-title">Metode Pembayaran</label>
                                  <label>${histori.metode_pembayaran}</label>
                              </div>
                              <div>
                                  <label class="sub-title">Dikirim ke </label>
                                  <label>${histori.alamat_pengiriman}</label>
                              </div>
                              ${
                                showCancelButton
                                  ? `<button class="btn-batalkan" style="height:35px; border:none; border-radius:10px; background-color: rgb(221, 104, 104); color: #fff; cursor: pointer;" onclick="showModalConfirm2(${histori.id})">Batalkan</button>`
                                  : ""
                              }
                              ${
                                showUlasanButton && histori.ulasan == null
                                  ? `<button class="btn-ulasan" style="height:35px; border:none; border-radius:10px; background-color: #00a69c; color: #fff; cursor: pointer;" onclick="showAddUlasanForm(${histori.id})";>Beri Ulasan</button>`
                                  : ""
                              }
                          </div>
                      </div>
                      ${
                        histori.ulasan != null
                          ? `
                          <div style="margin-top:20px; margin-left:20px; margin-right:20px; display:flex; flex-flow:column; background-color: #fbffbf; padding: 15px 40px 15px 40px; border:none; border-radius:10px;">
                            <label class="sub-title">Ulasan :</label>
                            <label style="word-wrap: break-word;">${histori.ulasan}</label>
                          </div>
                        `
                          : ""
                      }
                    </div>
                `;

          // Menambahkan histori-card ke container histori
          historiContainer.appendChild(historiCard);
        });
      }
    })
    .catch((error) => console.error("Error fetching data:", error));
}

function showAddUlasanForm(id) {
  const historiId = id;
  var modalHTML = `
        <div id="modal-ulasan" class="modal-ulasan" style="display: flex; justify-content: center; align-items: center; position: fixed; left: 0; top: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.5); z-index: 1000;">
            <div class="modal-content" style="background-color: #fefefe; margin: 15% auto; padding: 20px; border: 1px solid #888; width: 80%; max-width: 600px; border-radius: 10px; position: relative; max-height: 80%; overflow-y: auto;">
                <span class="close" onclick="closeModal('modal-ulasan')" style="color: #aaa; float: right; font-size: 28px; font-weight: bold;">&times;</span>
                <h2 style="text-align: center;">Ulasan</h2>
                <form id="addUlasanForm" action="" method="post" onsubmit="return false;">
                    <div style="display:flex; flex-flow:column;">
                        <textarea id="ulasan" name="ulasan" style="height: 100px; width: 95%; padding: 10px; margin-bottom: 10px; border: 1px solid #ccc; border-radius: 5px;"></textarea>
                    </div>
                    <button style="background-color: #00A69C; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer;" onclick="kirimUlasan(${historiId})">Kirim</button>
                </form>
            </div>
        </div>
    `;
  document.body.insertAdjacentHTML("beforeend", modalHTML);
}

function kirimUlasan(id) {
  const ulasan = document.getElementById("ulasan").value;

  if (!ulasan.trim()) {
    alert("Ulasan tidak boleh kosong!");
    return; // Berhenti jika ulasan kosong
  }

  fetch("../php/tambah_ulasan.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ulasan: ulasan,
      id: id,
    }),
  })
    .then((response) => {
      console.log("Response received:", response);
      return response.json();
    })
    .then((data) => {
      console.log("Data received:", data);
      if (data.status === "success") {
        loadHistori("Selesai");
        closeModal("modal-ulasan");
        showModalSuccess("Ulasan berhasil dikirim.");
      } else {
        console.log("Update error:", data.message);
        showModalFail("Silahkan coba lagi!");
      }
    })
    .catch((error) => console.error("Error fetching data:", error));
}

function deleteHistori() {
  const historiContainer = document.getElementById("histori");
  closeModal("modal-confirm");
  if (pesananIdToDelete !== null) {
    fetch("../php/delete_detail_belanja.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: pesananIdToDelete }), // Kirim ID pesanan yang tersimpan
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.status === "success") {
          console.log(result.message);
          document.getElementById(`histori-card-${pesananIdToDelete}`).remove(); // Hapus kartu pesanan dari tampilan
          if (historiContainer.children.length === 0) {
            const noDataFound = document.createElement("div");
            noDataFound.className = "histori-noDataFound";

            noDataFound.innerHTML = `
              <div style="display: flex; flex-flow: column; justify-content: center; align-items: center;">
                <img
                  src="../images/no_data_found.jpeg"
                  style="height: 300px; width: 300px; align-items: center;"
                />
                <h4>Data tidak ditemukan.</h4>
              </div>
            `;
            // Menambahkan noDataFound ke historiContainer
            historiContainer.appendChild(noDataFound);
          }
          showModalSuccess("Pesanan telah dibatalkan.");
        } else {
          console.log(result.message);
          showModalFail("Silahkan coba lagi!");
        }
      })
      .catch((error) => console.error("Error deleting:", error));
  }
}

function formatTanggal(tanggal) {
  const optionsTanggal = { weekday: "long", day: "numeric", month: "long" };
  const optionsWaktu = { hour: "2-digit", minute: "2-digit" };

  // Mengubah string tanggal menjadi objek Date
  const date = new Date(tanggal);

  const formattedTanggal = date.toLocaleDateString("id-ID", optionsTanggal);
  const formattedWaktu = date.toLocaleTimeString("id-ID", optionsWaktu);

  return `${formattedTanggal} ${formattedWaktu} WIB`;
}

function showKeranjang() {
  document.getElementById("product-container").style.display = "none";
  document.getElementById("toko-saya").style.display = "none";
  document.getElementById("histori-1").style.display = "none";
  document.getElementById("keranjang").style.display = "block";
  document.getElementById("detail-product").style.display = "none";

  cekStokKeranjang();
  loadKeranjang();
}

function loadKeranjang2() {
  const keranjangContainer = document.getElementById("keranjang");
  while (keranjangContainer.firstChild) {
    keranjangContainer.removeChild(keranjangContainer.firstChild);
  }
  // Fetch data dari PHP
  fetch("../php/get_keranjang.php")
    .then((response) => response.json()) // Mengubah data yang diterima menjadi JSON
    .then((data) => {
      if (!data || data.length === 0) {
        const noDataFound = document.createElement("div");
        noDataFound.className = "histori-noDataFound";
        noDataFound.innerHTML = `
              <div style="display: flex; flex-flow: column; justify-content: center; align-items: center;">
                <img
                  src="../images/no_data_found.jpeg"
                  style="height: 300px; width: 300px; align-items: center;"
                />
                <h4>Belum ada produk dalam keranjang.</h4>
              </div>
            `;
        // Menambahkan noDataFound ke historiContainer
        keranjangContainer.appendChild(noDataFound);
      } else {
        data.forEach((keranjang) => {
          // Membuat elemen histori-card baru
          console.log("Keranjang:", keranjang);
          const keranjangCard = document.createElement("div");
          keranjangCard.className = "keranjang-card";
          tanggalAddKeranjang = formatTanggal(keranjang.created_at);

          keranjangCard.innerHTML = `
                    <div style="display: flex; flex-flow: row; width: 100%;">
                        <div style="width: 300px; height: 250px;">
                            <img src="http://localhost/web_apotech/apotech_images/${keranjang.image_url}">
                        </div>
                        <div class="details-krj">
                            <div>
                              <label style="font-weight: bold; color: #00a69c;">${tanggalAddKeranjang}</label>
                            </div>
                            <div>
                                <label id="sub-title-krj" class="sub-title-krj">${keranjang.nama_produk}</label>
                                <label class="harga-produk-label">Rp${keranjang.harga_produk}</label>
                            </div>
                            <div>
                                <label class="sub-title-krj">Toko</label>
                                <label>${keranjang.nama_vendor} (${keranjang.kota})</label>
                            </div>
                            <div>
                                <label class="sub-title-krj">Tersisa</label>
                                <label class="stok-tersisa">${keranjang.jumlah_stok}</label>
                            </div>
                            <div style="display: flex; gap: 10px; margin-top: 10px;">
                              <button class="btn-hps-krj">Hapus</button>
                              <button class="btn-beli-krj">Beli Sekarang</button>
                            </div>
                        </div>
                    </div>
                `;

          const produkIdInput = document.createElement("input");
          produkIdInput.type = "hidden";
          produkIdInput.name = "produk_id";
          produkIdInput.value = keranjang.produk_id;
          document
            .getElementById("addDetailBelanja")
            .appendChild(produkIdInput);

          keranjangCard
            .querySelector(".btn-beli-krj")
            .addEventListener("click", function () {
              const hargaLabel = keranjangCard.querySelector(
                ".harga-produk-label"
              ).textContent;
              hargaProdukKrj = hargaLabel.replace("Rp", "").trim();
              stokTersisa =
                keranjangCard.querySelector(".stok-tersisa").textContent;
              console.log("Harga Produk Krj:", hargaProdukKrj);

              // Panggil fungsi showAddDetailBelanja dan showAlamat
              showAddDetailBelanja();
              showAlamat();
            });

          const btnHapusKrj = keranjangCard.querySelector(".btn-hps-krj");
          btnHapusKrj.addEventListener("click", function () {
            // const keranjangId = keranjang.id;
            const keranjangId = parseInt(keranjang.id, 10);

            fetch("../php/delete_keranjang.php", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ id: keranjangId }),
            })
              .then((response) => response.text())
              .then((result) => {
                console.log(result); // Tampilkan hasil dari delete_keranjang.php
                // Hapus keranjangCard dari tampilan jika perlu
                keranjangCard.remove();
              })
              .catch((error) => console.error("Error deleting:", error));
          });

          // Menambahkan histori-card ke container histori
          keranjangContainer.appendChild(keranjangCard);
        });
      }
    })
    .catch((error) => console.error("Error fetching data:", error));
}

function cekStokKeranjang() {
  fetch("../php/cek_stok_keranjang.php")
    .then((response) => response.json())
    .catch((error) => console.error("Error cek stok keranjang :", error));
}

function loadKeranjang() {
  const keranjangContainer = document.getElementById("keranjang");
  while (keranjangContainer.firstChild) {
    keranjangContainer.removeChild(keranjangContainer.firstChild);
  }
  // Fetch data dari PHP
  fetch("../php/get_keranjang_vendor.php")
    .then((response) => response.json()) // Mengubah data yang diterima menjadi JSON
    .then((data) => {
      if (!data || data.length === 0) {
        const noDataFound = document.createElement("div");
        noDataFound.className = "histori-noDataFound";
        noDataFound.innerHTML = `
              <div style="display: flex; flex-flow: column; justify-content: center; align-items: center;">
                <img
                  src="../images/no_data_found.jpeg"
                  style="height: 300px; width: 300px; align-items: center;"
                />
                <h4>Belum ada produk dalam keranjang.</h4>
              </div>
            `;
        // Menambahkan noDataFound ke historiContainer
        keranjangContainer.appendChild(noDataFound);
      } else {
        data.forEach((vendor) => {
          let total = 0; // Variabel untuk menyimpan total harga
          let produkKeranjang = [];

          const keranjangCard = document.createElement("div");
          keranjangCard.className = "keranjang-card";

          const headerKeranjangCard = document.createElement("div");
          headerKeranjangCard.className = "header-keranjang-card";

          const footerKeranjangCard = document.createElement("div");
          footerKeranjangCard.className = "footer-keranjang-card";

          headerKeranjangCard.innerHTML = `
                    <div style="display: flex; flex-flow: row; align-items: center; gap: 5px; justify-content: flex-end;">
                          <label style="font-weight: bold; color: #00a69c;">${vendor.nama_vendor}</label>
                          <div class="circle-container" style="width: 30px; height: 30px; border-radius: 50%; overflow: hidden;">
                            <img id="image_profil" style="width: 100%; height: 100%" src="http://localhost/web_apotech/apotech_images/${vendor.image_profil}">
                          </div>
                    </div>
                `;
          keranjangCard.appendChild(headerKeranjangCard);

          fetch(
            `../php/get_keranjang_groupby_vendor.php?vendor_id=${vendor.id}`
          )
            .then((response) => response.json())
            .then((data) => {
              data.forEach((keranjang) => {
                const subtotal = keranjang.jumlah * keranjang.harga_produk;
                total += subtotal; // Menambahkan subtotal ke total

                produkKeranjang.push({
                  keranjang_id: keranjang.keranjang_id,
                  produk_id: keranjang.produk_id,
                  jumlah_beli: keranjang.jumlah,
                  total: subtotal,
                });

                const detailKeranjangCard = document.createElement("div");
                detailKeranjangCard.className = "detail-keranjang-card";
                detailKeranjangCard.innerHTML = `
                  <div style="display: flex; flex-flow: row; align-items: center; justify-content: space-between; margin-bottom: 10px;">
                    <div class="produk" style="display: flex; flex-flow: row; align-items: center; gap: 5px; width: 200px;  overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                      <div style="width: 50px; height: 50px; overflow: hidden;">
                        <img style="width: 100%; height: 100%" src="http://localhost/web_apotech/apotech_images/${keranjang.image_url}">
                      </div>
                      <label style="font-weight: bold; color: #00a69c;">${keranjang.nama_produk}</label>
                    </div>
                    <label class="jml_krj" style="font-weight: bold; color: #00a69c;">${keranjang.jumlah} x</label>
                    <label class="sub_total" style="width: 100px; font-weight: bold; color: #00a69c;">Rp${subtotal}</label>
                  </div>
                `;
                keranjangCard.appendChild(detailKeranjangCard);
              });

              // Menambahkan label total di atas tombol
              const totalLabel = document.createElement("div");
              totalLabel.className = "total-label";
              totalLabel.innerHTML = `
                <h4 style="text-align: left; color: #00a69c;">Total: Rp${total}</h4>
              `;
              keranjangCard.appendChild(totalLabel);

              footerKeranjangCard.innerHTML = `
              <div class="button" style="display: flex; gap: 10px; margin-top: 10px;">
                <button class="btn-beli-krj">Beli Sekarang</button>
                <button class="btn-hps-krj">Hapus</button>
              </div>
              `;
              keranjangCard.appendChild(footerKeranjangCard);

              const btnHapus =
                footerKeranjangCard.querySelector(".btn-hps-krj");
              btnHapus.addEventListener("click", () => {
                console.log("vendor_id", vendor.id);
                showModalConfirmDelKrj(vendor.id); // Memanggil modal konfirmasi penghapusan
              });

              const btnBeli =
                footerKeranjangCard.querySelector(".btn-beli-krj");
              btnBeli.addEventListener("click", () => {
                // console.log("vendor_id", keranjang.vendor_id);
                showAddAlamatKeranjang(produkKeranjang);
                showAlamat();
              });
            })
            .catch((error) =>
              console.error("Error fetching keranjang details:", error)
            );
          keranjangContainer.appendChild(keranjangCard);
          console.log("produk keranjang : ", produkKeranjang);
        });
      }
    })
    .catch((error) => console.error("Error fetching data:", error));
}

// function closeModal() {
//   var modal = document.getElementById("modal");
//   if (modal) {
//     modal.remove();
//     document.body.style.overflow = ""; // Mengembalikan scroll saat modal ditutup
//   }
// }

// function showAddAlamatKeranjang() {
//   // const historiId = id;
//   var modalHTML = `
//         <div id="modal-alamat-krj" class="modal-alamat-krj" style="display: flex; justify-content: center; align-items: center; position: fixed; left: 0; top: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.5); z-index: 1000;">
//             <div class="modal-content" style="background-color: #fefefe; margin: 15% auto; padding: 20px; border: 1px solid #888; width: 80%; max-width: 600px; border-radius: 10px; position: relative; max-height: 80%; overflow-y: auto;">
//                 <span class="close" onclick="closeModal('modal-alamat-krj')" style="color: #aaa; float: right; font-size: 28px; font-weight: bold;">&times;</span>
//                 <h2 style="text-align: center;">Alamat</h2>
//                 <form id="addAlamatKrjForm" action="" method="post" onsubmit="return false;">
//                     <div style="display:flex; flex-flow:column;">
//                         <textarea id="alamat-krj" name="alamat-krj" style="height: 100px; width: 95%; padding: 10px; margin-bottom: 10px; border: 1px solid #ccc; border-radius: 5px;"></textarea>
//                     </div>
//                     <button style="background-color: #00A69C; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer;">Kirim</button>
//                 </form>
//             </div>
//         </div>
//     `;
//   document.body.insertAdjacentHTML("beforeend", modalHTML);
// }

function showAddAlamatKeranjang(produkKeranjang) {
  showMetodePembayaranKrj();
  var modalHTML = `
    <div id="modal-alamat-krj" class="modal-alamat-krj" style="display: flex; justify-content: center; align-items: center; position: fixed; left: 0; top: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.5); z-index: 1000;">
        <div class="modal-content" style="background-color: #fefefe; margin: 15% auto; padding: 20px; border: 1px solid #888; width: 80%; max-width: 600px; border-radius: 10px; position: relative; max-height: 80%; overflow-y: auto;">
            <span class="close" onclick="closeModal('modal-alamat-krj')" style="color: #aaa; float: right; font-size: 28px; font-weight: bold;">&times;</span>
            <h2 style="text-align: center;">Alamat</h2>
            <form id="addAlamatKrjForm" method="post">
              <label for="metode_pembayaran_krj" style="margin-top: 10px">Metode Pembayaran:</label>
              <select required id="metode_pembayaran_krj" name="metode_pembayaran_krj" style="width: 98.5%; padding: 10px; margin-bottom: 10px; border: 1px solid #ccc; border-radius: 5px;">
                <option value="" disabled selected>Pilih metode pembayaran</option>
              </select>
              <label for="alamat-krj" style="margin-top: 10px">Alamat :</label>
              <textarea id="alamat-krj" name="alamat-krj" style="height: 100px; width: 95%; padding: 10px; margin-bottom: 10px; border: 1px solid #ccc; border-radius: 5px;"></textarea>
              <button type="button" id="submitAlamatKrj" style="background-color: #00A69C; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer;">Kirim</button>
            </form>
        </div>
    </div>
  `;
  document.body.insertAdjacentHTML("beforeend", modalHTML);

  // Tambahkan event listener untuk tombol "Kirim"
  document
    .getElementById("submitAlamatKrj")
    .addEventListener("click", function () {
      console.log("produk keranjang : ", produkKeranjang);
      const alamat = document.getElementById("alamat-krj").value;
      const metodePembayaranId = document.getElementById(
        "metode_pembayaran_krj"
      ).value;

      // Kirim produk keranjang dan alamat ke PHP
      fetch("../php/tambah_detail_belanja_krj.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          produk_keranjang: produkKeranjang, // Data keranjang yang diproses
          alamat: alamat,
          metode_pembayaran_id: metodePembayaranId, // Alamat yang diisi pada modal
        }),
      })
        .then((response) => response.text())
        .then((data) => {
          console.log("Response dari PHP:", data);
          if (data.includes("Insert successful")) {
            closeModal("modal-alamat-krj"); // Menutup modal
            showModalSuccess("Pembelian berhasil.");
          } else {
            alert("Gagal menambahkan produk ke detail belanja.");
          }
        })
        .catch((error) => console.error("Error:", error));
    });
}

function closeModal(modal_id) {
  if (modal_id === "modal") {
    document.getElementById("addProductStoreForm").reset();
  } else if (modal_id === "modal-ulasan") {
    document.getElementById("addUlasanForm").reset();
  } else if (modal_id === "modal2") {
    document.getElementById("addStoreForm").reset();
  } else if (modal_id === "modal-success") {
    loadKeranjang();
  }

  document.getElementById(modal_id).remove();
  document.body.style.overflow = "";
}

function closeModal2(modal_id) {
  document.getElementById(modal_id).style.display = "none";
  document.body.style.overflow = "";

  if (modal_id === "modal-beli") {
    document.getElementById("addDetailBelanja").reset();
  }
}

function showAlamat() {
  fetch("../php/get_user_info.php")
    .then((response) => response.json())
    .then((data) => {
      console.log("Data fetched:", data);

      if (data.error) {
        console.error("Error fetching user:", data.error);
      } else {
        console.log("User address:", data.alamat);
        document.getElementById("alamat").value = data.alamat;
        document.getElementById("alamat-krj").value = data.alamat;
      }
    })
    .catch((error) => {
      console.error("Error fetching user:", error);
    });
}

function showAddDetailBelanja() {
  document.getElementById("modal-beli").style.display = "flex";

  // Mencegah scroll background saat modal ditampilkan
  document.body.style.overflow = "hidden";
}

function cekJumlahBeli(event) {
  event.preventDefault(); // Mencegah pengiriman formulir secara default
  var jumlah_beli = parseInt(document.getElementById("jumlah_beli").value, 10);

  if (jumlah_beli > stokTersisa) {
    closeModal("modal");
    var modalHTML = `
                    <div id="modal-error" class="modal" style="display: flex; justify-content: center; align-items: center; position: fixed; left: 0; top: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.5); z-index: 1000;">
                        <div class="modal-content" style="background-color: #fefefe; margin: 15% auto; padding: 20px; border: 1px solid #888; width: 50%; max-width: 300px; border-radius: 10px; position: relative;">
                            <span class="close" onclick="closeModal('modal-error')" style="color: #aaa; float: right; font-size: 28px; font-weight: bold;">&times;</span>
                            <h2 style="text-align: center;">Maaf</h2>
                            <p>Jumlah beli melebihi jumlah ketersediaan produk</p>
                        </div>
                    </div>
                `;

    // Memasukkan modal ke dalam halaman
    document.body.insertAdjacentHTML("beforeend", modalHTML);

    // Mencegah scroll background saat modal ditampilkan
    document.body.style.overflow = "hidden";

    return false; // Mencegah pengiriman formulir
  } else {
    submitDetailBelanja();
    // Jika jumlah_beli valid, kembalikan true untuk melanjutkan pengiriman formulir
    return true;
  }
}

// function closeModalBeli() {
//   document.getElementById("modal-beli").style.display = "none";
//   document.body.style.overflow = "";
// }

function submitDetailBelanja() {
  const formData = new FormData(document.getElementById("addDetailBelanja"));

  fetch("../php/tambah_detail_belanja.php", {
    method: "POST",
    body: formData,
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.text(); // Ubah menjadi text jika PHP tidak mengembalikan JSON
    })
    .then((data) => {
      console.log("Response from server:", data);
      if (data.includes("Insert successful")) {
        closeModal("modal-beli"); // Tutup modal jika berhasil
        alert("Pembelian berhasil!"); // Tampilkan pesan sukses
        window.location.href = "../html/home.html"; // Redirect ke halaman utama
      } else {
        alert("Gagal melakukan pembelian, silakan coba lagi.");
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      alert("Terjadi kesalahan, silakan coba lagi.");
    });
}

fetch("../php/get_metode_pembayaran.php")
  .then((response) => {
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  })
  .then((data) => {
    const select = document.getElementById("metode_pembayaran");
    // Clear existing options
    select.innerHTML =
      '<option value="" disabled selected>Pilih metode pembayaran</option>';
    data.forEach((item) => {
      const option = document.createElement("option");
      option.value = item.id; // Gunakan ID sebagai value
      option.textContent = item.metode_pembayaran; // Tampilkan nama metode
      select.appendChild(option);
    });

    select.addEventListener("change", (event) => {
      const selectedId = event.target.value; // Ambil nilai ID dari option yang dipilih
      console.log("ID metode pembayaran yang dipilih:", selectedId);

      // Update hidden input field for metode_pembayaran_id
      const metodePembayaranIdInput = document.createElement("input");
      metodePembayaranIdInput.type = "hidden";
      metodePembayaranIdInput.name = "metode_pembayaran_id";
      metodePembayaranIdInput.value = selectedId;
      document
        .getElementById("addDetailBelanja")
        .appendChild(metodePembayaranIdInput);

      // document
      //   .getElementById("addAlamatKrjForm")
      //   .appendChild(metodePembayaranIdInput);
    });
  })
  .catch((error) => {
    console.error("Error:", error);
    alert("Gagal memuat metode pembayaran. Silakan coba lagi.");
  });

function showMetodePembayaranKrj() {
  fetch("../php/get_metode_pembayaran.php")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      const select = document.getElementById("metode_pembayaran_krj");
      // Clear existing options
      select.innerHTML =
        '<option value="" disabled selected>Pilih metode pembayaran</option>';
      data.forEach((item) => {
        const option = document.createElement("option");
        option.value = item.id; // Gunakan ID sebagai value
        option.textContent = item.metode_pembayaran; // Tampilkan nama metode
        select.appendChild(option);
      });

      select.addEventListener("change", (event) => {
        const selectedId = event.target.value; // Ambil nilai ID dari option yang dipilih
        console.log("ID metode pembayaran yang dipilih:", selectedId);

        // Update hidden input field for metode_pembayaran_id
        const metodePembayaranIdInput = document.createElement("input");
        metodePembayaranIdInput.type = "hidden";
        metodePembayaranIdInput.name = "metode_pembayaran_id";
        metodePembayaranIdInput.value = selectedId;

        document
          .getElementById("addAlamatKrjForm")
          .appendChild(metodePembayaranIdInput);
      });
    })
    .catch((error) => {
      console.error("Error:", error);
      alert("Gagal memuat metode pembayaran. Silakan coba lagi.");
    });
}

function initializeButtonToggle() {
  // Ambil semua tombol dengan class .btn
  const buttons = document.querySelectorAll(".btn-h");

  // Tambahkan event listener ke setiap tombol
  buttons.forEach((button) => {
    button.addEventListener("click", function () {
      // Hapus kelas 'active' dari semua tombol
      buttons.forEach((btn) => btn.classList.remove("active-h"));

      // Tambahkan kelas 'active' ke tombol yang diklik
      this.classList.add("active-h");
    });
  });
}

document
  .getElementById("btn-dalam-antrian")
  .addEventListener("click", function () {
    loadHistori("Dalam Antrian");
  });

document
  .getElementById("btn-sedang-diproses")
  .addEventListener("click", function () {
    loadHistori("Sedang Diproses");
  });

document.getElementById("btn-selesai").addEventListener("click", function () {
  loadHistori("Selesai");
});

function showModalSuccess(keterangan) {
  console.log("showModalSuccess called with:", keterangan);
  var modalHTML = `
                    <div id="modal-success" class="modal" style="display: flex; justify-content: center; align-items: center; position: fixed; left: 0; top: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.5); z-index: 1000;">
                        <div class="modal-content" style="background-color: #fefefe; margin: 15% auto; padding: 20px; border: 1px solid #888; width: 50%; max-width: 300px; border-radius: 10px; position: relative; text-align: center;">
                        <img src="../images/success-icon.png" alt="Success Image" style="max-width: 100px; margin-bottom: 10px;">    
                        <h2>Sukses</h2>
                            <p>${keterangan}</p>
                             <button onclick="closeModal('modal-success')" style="border: none; background: none; color: #007bff; font-size: 16px; margin-top: 10px; cursor: pointer; display: block; margin-left: auto; margin-right: auto;">OK</button>
                        </div>
                    </div>
                `;

  // Memasukkan modal ke dalam halaman
  document.body.insertAdjacentHTML("beforeend", modalHTML);

  // Mencegah scroll background saat modal ditampilkan
  document.body.style.overflow = "hidden";
}

function showModalFail(keterangan) {
  var modalHTML = `
                    <div id="modal-fail" class="modal" style="display: flex; justify-content: center; align-items: center; position: fixed; left: 0; top: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.5); z-index: 1000;">
                        <div class="modal-content" style="background-color: #fefefe; margin: 15% auto; padding: 20px; border: 1px solid #888; width: 50%; max-width: 300px; border-radius: 10px; position: relative; text-align: center;">
                          <img src="../images/fail-icon.png" alt="Fail Image" style="max-width: 100px; margin-bottom: 10px;">    
                          <h2>Gagal</h2>
                          <p>${keterangan}</p>
                          <button onclick="closeModal('modal-fail')" style="border: none; background: none; color: #007bff; font-size: 16px; margin-top: 10px; cursor: pointer; display: block; margin-left: auto; margin-right: auto;">OK</button>
                        </div>
                    </div>
                `;

  // Memasukkan modal ke dalam halaman
  document.body.insertAdjacentHTML("beforeend", modalHTML);

  // Mencegah scroll background saat modal ditampilkan
  document.body.style.overflow = "hidden";
}

let pesananIdToDelete = null;

function showModalConfirm2(pesananId) {
  pesananIdToDelete = pesananId;
  var modalHTML = `
                    <div id="modal-confirm" class="modal" style="display: flex; justify-content: center; align-items: center; position: fixed; left: 0; top: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.5); z-index: 1000;">
                        <div class="modal-content" style="background-color: #fefefe; margin: 15% auto; padding: 20px; border: 1px solid #888; width: 50%; max-width: 300px; border-radius: 10px; position: relative; text-align: center;">
                            <p>Apakah anda yakin untuk menghapus?</p>
                            <div style="display: flex; flex-flow: row;">
                              <button onclick="deleteHistori()" style="border: none; background: none; color: #007bff; font-size: 16px; margin-top: 10px; cursor: pointer; display: block; margin-left: auto; margin-right: auto;">Ya</button>
                              <button onclick="closeModal('modal-confirm')" style="border: none; background: none; color: #007bff; font-size: 16px; margin-top: 10px; cursor: pointer; display: block; margin-left: auto; margin-right: auto;">Tidak</button>
                            </div>
                        </div>
                    </div>
                `;

  // Memasukkan modal ke dalam halaman
  document.body.insertAdjacentHTML("beforeend", modalHTML);

  // Mencegah scroll background saat modal ditampilkan
  document.body.style.overflow = "hidden";
}

function showModalConfirm(keterangan, produkId, pesananId) {
  pesananIdToDelete = pesananId;
  var modalHTML = `
                    <div id="modal-confirm" class="modal" style="display: flex; justify-content: center; align-items: center; position: fixed; left: 0; top: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.5); z-index: 1000;">
                        <div class="modal-content" style="background-color: #fefefe; margin: 15% auto; padding: 20px; border: 1px solid #888; width: 50%; max-width: 300px; border-radius: 10px; position: relative; text-align: center;">
                            <p>Apakah anda yakin untuk menghapus?</p>
                            <div style="display: flex; flex-flow: row;">
                              <button onclick="deleteHistori()" style="border: none; background: none; color: #007bff; font-size: 16px; margin-top: 10px; cursor: pointer; display: block; margin-left: auto; margin-right: auto;">Ya</button>
                              <button onclick="closeModal('modal-confirm')" style="border: none; background: none; color: #007bff; font-size: 16px; margin-top: 10px; cursor: pointer; display: block; margin-left: auto; margin-right: auto;">Tidak</button>
                            </div>
                        </div>
                    </div>
                `;

  // Memasukkan modal ke dalam halaman
  document.body.insertAdjacentHTML("beforeend", modalHTML);

  // Mencegah scroll background saat modal ditampilkan
  document.body.style.overflow = "hidden";
}

function showModalConfirmDelKrj(vendorId) {
  var modalHTML = `
                    <div id="modal-confirm" class="modal" style="display: flex; justify-content: center; align-items: center; position: fixed; left: 0; top: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.5); z-index: 1000;">
                        <div class="modal-content" style="background-color: #fefefe; margin: 15% auto; padding: 20px; border: 1px solid #888; width: 50%; max-width: 300px; border-radius: 10px; position: relative; text-align: center;">
                            <p>Apakah anda yakin untuk menghapus?</p>
                            <div style="display: flex; flex-flow: row;">
                              <button onclick="deleteKeranjang(${vendorId})" style="border: none; background: none; color: #007bff; font-size: 16px; margin-top: 10px; cursor: pointer; display: block; margin-left: auto; margin-right: auto;">Ya</button>
                              <button onclick="closeModal('modal-confirm')" style="border: none; background: none; color: #007bff; font-size: 16px; margin-top: 10px; cursor: pointer; display: block; margin-left: auto; margin-right: auto;">Tidak</button>
                            </div>
                        </div>
                    </div>
                `;

  // Memasukkan modal ke dalam halaman
  document.body.insertAdjacentHTML("beforeend", modalHTML);

  // Mencegah scroll background saat modal ditampilkan
  document.body.style.overflow = "hidden";
}

function deleteKeranjang(vendorId) {
  fetch(`../php/delete_keranjang_by_vendor.php?vendor_id=${vendorId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.text())
    .then((data) => {
      if (data.includes("Delete successful")) {
        closeModal("modal-confirm"); // Menutup modal confirm
        showModalSuccess("Keranjang Berhasil Dihapus."); // Menampilkan modal sukses
        loadKeranjang(); // Memperbarui keranjang setelah penghapusan
      } else {
        alert("Gagal menghapus keranjang: " + data);
      }
    })
    .catch((error) => console.error("Error:", error));
}
