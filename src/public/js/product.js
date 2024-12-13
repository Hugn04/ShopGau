// Lấy các phần tử DOM
const categorySelect = document.getElementById('type');
const priceSelect = document.getElementById('sort');
const applyFiltersButton = document.getElementById('applyFilters');
const products = document.querySelectorAll('.product-item');

// Thêm sự kiện khi bấm nút "Áp dụng"
applyFiltersButton.addEventListener('click', () => {
    const selectedCategory = categorySelect.value;
    const selectedPrice = priceSelect.value;

    // Tạo URL mới với tham số query
    const queryParams = new URLSearchParams();
    if (selectedCategory !== 'all') queryParams.append('type', selectedCategory);
    if (selectedPrice !== 'all') queryParams.append('sort', selectedPrice);

    const newUrl = window.location.origin + window.location.pathname + '?' + queryParams.toString();

    // Điều hướng đến URL mới
    window.location.href = newUrl;
});

// Hàm lọc sản phẩm
function filterProducts(category, price) {
    products.forEach((product) => {
        const productCategory = product.getAttribute('data-category');
        const productPrice = product.getAttribute('data-price');

        let showCategory = category === 'all' || category === productCategory;
        let showPrice = price === 'all' || price === productPrice;

        product.style.display = showCategory && showPrice ? 'block' : 'none';
    });
}

// Kiểm tra và áp dụng bộ lọc từ URL khi tải trang
const params = new URLSearchParams(window.location.search);
if (params.has('type') || params.has('sort')) {
    categorySelect.value = params.get('type') || 'all';
    priceSelect.value = params.get('sort') || 'all';
    filterProducts(categorySelect.value, priceSelect.value);
}
