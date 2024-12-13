const toast = document.querySelector('.toast-message');

if (toast) {
    // Đặt thời gian hiển thị toast
    setTimeout(() => {
        // Làm toast mờ dần (opacity -> 0) và ẩn đi sau khi mờ
        toast.style.opacity = 0;
        toast.style.visibility = 'hidden';
    }, 3000); // Toast sẽ xuất hiện trong 3 giây rồi bắt đầu mờ dần

    // Nếu bạn muốn làm cho toast biến mất hoàn toàn sau khi mờ
    setTimeout(() => {
        toast.remove(); // Xóa toast khỏi DOM
    }, 4000); // Xóa sau 4 giây (khi đã hoàn thành hiệu ứng mờ)
}
