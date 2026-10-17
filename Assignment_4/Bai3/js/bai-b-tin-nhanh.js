/* BÀI B — VIẾT CODE: Lọc tin và đăng tin nhanh (news.html)
   Viết code theo đặc tả.
   Không sửa news.html, không sửa css; chỉ viết JavaScript trong file này. */

// ---------- ĐÃ CHO SẴN (không sửa) ----------
// Chặn việc gửi form tìm kiếm khi nhấn Enter, để trang không bị tải lại.
document.querySelector("#searchbar form").addEventListener("submit", (e) => e.preventDefault());

// ---------- PHẦN BẠN VIẾT ----------
const oTimKiem = document.getElementById("o-tim-kiem");
const danhSach = document.getElementById("list");
const boDem = document.getElementById("bo-dem");
const khongThay = document.getElementById("khong-thay");
const oTieuDe = document.getElementById("tin-tieu-de");
const oNoiDung = document.getElementById("tin-noi-dung");
const nutDang = document.getElementById("nut-dang");
const baoLoi = document.getElementById("bao-loi");

// F1. Bộ đếm "Đang hiển thị x/y tin" trong #bo-dem.
function capNhatBoDem() {
    const cacTin = Array.from(danhSach.querySelectorAll("li"));
    const soTinDangHien = cacTin.filter(tin => !tin.classList.contains("an")).length;
    boDem.textContent = `Đang hiển thị ${soTinDangHien}/${cacTin.length} tin`;
}

// F2 + F3. Lọc tin khi gõ vào #o-tim-kiem (sự kiện keyup) và thông báo #khong-thay.
function locTin() {
    const tuKhoaGoc = oTimKiem.value;
    const tuKhoa = tuKhoaGoc.toLowerCase();
    const cacTin = Array.from(danhSach.querySelectorAll("li"));
    let soTinKhop = 0;

    for (const tin of cacTin) {
        const tieuDe = tin.querySelector("h3").textContent;
        const noiDung = tin.querySelector("p").textContent;
        const khop = (tieuDe + " " + noiDung).toLowerCase().includes(tuKhoa);

        if (khop) {
            tin.classList.remove("an");
            soTinKhop++;
        } else {
            tin.classList.add("an");
        }
    }

    if (soTinKhop === 0 && tuKhoaGoc !== "") {
        khongThay.classList.remove("an");
        // Dùng textContent để chuỗi như <b>x</b> chỉ hiện dưới dạng văn bản.
        khongThay.textContent = `Không tìm thấy tin nào cho "${tuKhoaGoc}"`;
    } else {
        khongThay.classList.add("an");
        khongThay.textContent = "";
    }

    capNhatBoDem();
}

oTimKiem.addEventListener("keyup", locTin);

// F4. Nút "Read more >>" / "Thu gọn <<" — MỘT trình lắng nghe đặt trên #list.
danhSach.addEventListener("click", (e) => {
    if (!(e.target instanceof HTMLButtonElement) || !e.target.classList.contains("more")) {
        return;
    }

    const nut = e.target;
    const tin = nut.closest("li");
    const doanVan = tin.querySelector("p");
    const dangMo = doanVan.classList.toggle("day-du");

    nut.textContent = dangMo ? "Thu gọn <<" : "Read more >>";
});

// F5. Nút #nut-dang: kiểm tra dữ liệu, tạo <li> mới, chèn vào đầu #list.
nutDang.addEventListener("click", () => {
    const tieuDe = oTieuDe.value;
    const noiDung = oNoiDung.value;

    if (tieuDe === "" || noiDung === "") {
        baoLoi.textContent = "Vui lòng nhập đủ tiêu đề và nội dung.";
        return;
    }

    const tinMoi = document.createElement("li");

    const thoiGian = document.createElement("span");
    thoiGian.className = "time";
    thoiGian.textContent = homNay();

    const tieuDeMoi = document.createElement("h3");
    // Không dùng innerHTML: dữ liệu người dùng phải được hiển thị nguyên văn.
    tieuDeMoi.textContent = tieuDe;

    const noiDungMoi = document.createElement("p");
    noiDungMoi.textContent = noiDung;

    const nutMoRong = document.createElement("button");
    nutMoRong.type = "button";
    nutMoRong.className = "more";
    nutMoRong.textContent = "Read more >>";

    tinMoi.append(thoiGian, tieuDeMoi, noiDungMoi, nutMoRong);
    danhSach.prepend(tinMoi);

    oTieuDe.value = "";
    oNoiDung.value = "";
    baoLoi.textContent = "";

    // Áp dụng ngay bộ lọc hiện tại cho tin vừa đăng và cập nhật bộ đếm.
    locTin();
});

// Trạng thái đúng ngay khi trang vừa tải.
locTin();
