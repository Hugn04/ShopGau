// Lấy tất cả các ô input trong giỏ hàng
const quantityInputs = document.querySelectorAll('input[type="number"]');

// Hàm tính tiền và cập nhật tổng
function updateCart() {
    let total = 0;

    // Duyệt qua tất cả các sản phẩm trong giỏ hàng
    document.querySelectorAll('.cart-page tr').forEach((row, index) => {
        const quantityInput = row.querySelector('input[type="number"]');
        if (quantityInput) {
            const amount = parseInt(quantityInput.value ? quantityInput.value : 0, 10); // Số lượng sản phẩm
            const price = parseFloat(row.querySelector('.cart-info small').textContent.replace('Giá: $', '').trim()); // Lấy giá sản phẩm
            const totalPriceCell = row.querySelector('td:last-child');
            if (totalPriceCell) {
                totalPriceCell.textContent = `$${(price * amount).toLocaleString(2)}`; // Cập nhật giá tiền của sản phẩm
            }
            total += price * amount; // Cộng dồn vào tổng
        }
    });

    // Cập nhật thành tiền tổng
    const totalPriceElement = document.querySelector('.total-price td:last-child');
    if (totalPriceElement) {
        totalPriceElement.textContent = `$${total.toLocaleString(2)}`;
    }
}

// Lắng nghe sự kiện thay đổi số lượng
quantityInputs.forEach((input) => {
    input.addEventListener('change', updateCart);
    input.addEventListener('input', updateCart);
});

// Gọi updateCart lần đầu để tính toán giá trị ban đầu
updateCart();
const allCheckbox = document.getElementById('All');
const checkboxes = document.querySelectorAll('.checkbox-item');

const form = document.getElementById('buyForm');
const button = document.getElementById('buyButton');
const loadingOverlay = document.getElementById('loadingOverlay');
const spinner = document.getElementById('spinner');
const checkmark = document.getElementById('checkmark');
const successText = document.getElementById('successText');

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const checkedItems = Array.from(checkboxes).filter((checkbox) => checkbox.checked);
    if (checkedItems.length === 0) return;
    checkedItems.forEach((check) => {
        const root = check.parentElement.parentElement;
        console.log(root.querySelector('.slug').value);

        const content = document.createElement('div');
        content.innerHTML = `   <input type="text" name="amounts" value="${
            root.querySelector('.amount').value
        }" hidden />
                                <input type="text" name="slugs" value="${root.querySelector('.slug').value}" hidden />`;
        form.appendChild(content);
    });

    // Hiển thị overlay loading
    loadingOverlay.style.display = 'flex';
    spinner.style.display = 'block'; // Hiển thị spinner
    checkmark.style.display = 'none'; // Ẩn checkmark
    successText.style.display = 'none'; // Ẩn chữ "Mua thành công"

    // Chờ 2 giây
    setTimeout(() => {
        spinner.style.display = 'none'; // Ẩn spinner
        checkmark.style.display = 'block'; // Hiển thị checkmark
        successText.style.display = 'block'; // Hiển thị chữ "Mua thành công"

        // Chờ thêm 1 giây để form submit
        setTimeout(() => {
            loadingOverlay.style.display = 'none';
            form.submit(); // Submit form
        }, 1000);
    }, 2000);
});

// Lắng nghe sự kiện thay đổi trạng thái của checkbox "All"
allCheckbox.addEventListener('change', () => {
    checkboxes.forEach((checkbox) => {
        checkbox.checked = allCheckbox.checked;
    });
});
