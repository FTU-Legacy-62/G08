# FREE FALL

## Mã nhóm

G08

## Thành viên

| Họ tên            | Mã sinh viên | Vai trò chính                     |
| ----------------- | ------------ | --------------------------------- |
| Lê Khánh Linh     | 2312380017   | Project Lead; UX/UI & Product Integration         |
| Nguyễn Châu Anh   | 2313380003   | Gameplay Flow & Player Experience |
| Vũ Lam Duy        | 2312380807   | Scenario Data & Case Content      |
| Hoàng Bảo Như     | 2313380025   | Decision Logic & Scoring System   |
| Nguyễn Quang Kiệt | 2313380012   | Coding, Integration & Testing     |

## Mô tả ngắn về sản phẩm

FREE FALL là một web game mô phỏng quá trình ra quyết định danh mục trong một cuộc khủng hoảng tài chính đang hình thành. Người chơi đọc các tín hiệu thị trường, lọc thông tin nhiễu, phân bổ nguồn lực nghiên cứu hữu hạn và đưa ra quyết định qua từng phase trước khi case thật được tiết lộ ở cuối game. Sản phẩm giúp người học không chỉ biết khủng hoảng đã xảy ra như thế nào, mà còn hiểu áp lực, sự bất định và tư duy quản trị rủi ro phía sau mỗi quyết định tài chính.

## Vấn đề sản phẩm giải quyết

Sinh viên học tài chính, đầu tư hoặc fintech thường tiếp cận các case khủng hoảng tài chính theo cách khá tĩnh: đọc lại sự kiện sau khi mọi chuyện đã rõ. Cách học này giúp người học nắm được diễn biến tổng quát, nhưng khó cảm nhận được áp lực ra quyết định tại thời điểm thông tin còn thiếu, nhiễu và thay đổi liên tục.

Trong thực tế, người ra quyết định tài chính phải xử lý nhiều tín hiệu cùng lúc: dữ liệu thị trường, tin tức, áp lực từ khách hàng hoặc tổ chức, trao đổi nội bộ, thông tin nhiễu và bằng chứng nghiên cứu sâu hơn. FREE FALL được xây dựng để bổ sung một cách học tương tác hơn, giúp người chơi trải nghiệm quá trình đọc thông tin, đánh giá rủi ro và ra quyết định danh mục trong điều kiện bất định.

## Người dùng mục tiêu

Người dùng chính của sản phẩm là:

* Sinh viên học các môn liên quan đến tài chính, đầu tư, thị trường tài chính hoặc fintech.
* Giảng viên cần một sản phẩm mô phỏng tương tác để minh họa case study tài chính.
* Nhà đầu tư mới muốn hiểu khủng hoảng tài chính theo cách dễ tiếp cận hơn.

Sản phẩm có thể được dùng trong lớp học, hoạt động nhóm, buổi demo case study, hoặc để người dùng tự trải nghiệm một mô phỏng ngắn về khủng hoảng tài chính.

## Tính năng chính

* Mô phỏng khủng hoảng tài chính theo 6 phase, với diễn biến thị trường thay đổi dần theo thời gian.
* Cung cấp nhiều nguồn thông tin như News, Gmail, Chat, Social/Internet và Files.
* Cho phép người chơi sử dụng Research Budget để mở tài liệu chuyên sâu trong mục Files.
* Cho phép người chơi đưa ra quyết định danh mục ở từng phase.
* Theo dõi Portfolio Value, Research Budget, Market Data, Current Allocation, Task List và trạng thái nguồn tin.
* Tính kết quả cuối game dựa trên Portfolio Value, Risk Control, Decision Quality và Hard Gates (nếu có).
* Hiển thị result page và reveal case page để người chơi xem kết quả, nhìn lại quyết định và biết case thật phía sau mô phỏng.

## Cách mở hoặc chạy sản phẩm

Cách nhanh nhất để xem sản phẩm:

```text
1. Mở link demo của sản phẩm.
2. Đọc phần giới thiệu và luật chơi.
3. Bắt đầu case mô phỏng.
4. Ở mỗi phase, đọc các nguồn tin như News, Gmail, Chat, Social/Internet và Files.
5. Sử dụng Research Budget để mở Files nếu muốn đọc tài liệu chuyên sâu.
6. Đưa ra quyết định danh mục ở cuối mỗi phase.
7. Sau phase cuối, xem result page để biết kết quả.
8. Xem reveal case page để biết case thật phía sau mô phỏng.
```

Nếu chạy từ repo:

```text
1. Clone repo về máy.
2. Mở thư mục dự án.
3. Mở file index.html bằng trình duyệt.
4. Nếu repo có cấu trúc chạy bằng local server, có thể dùng Live Server trong VS Code để mở sản phẩm.
```

Sản phẩm hiện là web game chạy trên trình duyệt. Không cần đăng nhập tài khoản để chơi bản demo.

## Link demo nếu có

* Link demo: https://financialcrisisftu.netlify.app/
* Tài khoản demo (nếu có): Không cần tài khoản demo.

## Ghi chú về dữ liệu

Dữ liệu trong FREE FALL là dữ liệu mô phỏng và nội dung tự xây dựng cho mục đích học tập. Tuy nhiên, các tình tiết chính, diễn biến thị trường, logic rủi ro và bối cảnh thông tin trong game đều được thiết kế dựa trên cơ sở thực tế của một cuộc khủng hoảng tài chính đã xảy ra.

Các nguồn thông tin trong game như News, Gmail, Chat, Social/Internet và Files là nội dung giả lập do nhóm xây dựng để phục vụ trải nghiệm mô phỏng. Market data, asset returns, logic điểm số và outcome tiers được hiệu chỉnh để phục vụ gameplay và mục tiêu học tập, không phải dữ liệu đầu tư thực tế hoặc khuyến nghị đầu tư.

## Ghi chú thêm

FREE FALL là sản phẩm MVP cho môn học, tập trung vào một case khủng hoảng tài chính đã xảy ra. Sản phẩm ưu tiên mô phỏng trải nghiệm đọc thông tin, đánh giá rủi ro và ra quyết định danh mục trong khủng hoảng, thay vì xây dựng một hệ thống đầu tư thực tế.

Nếu phát triển tiếp, nhóm có thể mở rộng thêm case mới, bổ sung nhánh quyết định phức tạp hơn, cải thiện logic đo hành vi đọc thông tin và kiểm thử với nhiều người dùng mục tiêu hơn.
