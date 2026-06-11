## 5. Logic hoặc quy tắc xử lý

FREE FALL xử lý input theo một vòng lặp qua từng phase. Ở mỗi phase, người chơi đọc thông tin, cân nhắc có sử dụng Research Budget hay không, đưa ra quyết định danh mục, sau đó hệ thống cập nhật trạng thái danh mục và ghi nhận quá trình ra quyết định. Sau phase cuối, các dữ liệu này được tổng hợp để tính điểm và xếp hạng kết quả.

Có thể hiểu logic xử lý của sản phẩm qua bốn bước chính:

### (1) Từ quyết định của người chơi đến trạng thái danh mục

Ở mỗi phase, người chơi chọn một trong các quyết định A/B/C/D. Mỗi lựa chọn tương ứng với một cách điều chỉnh tỷ trọng danh mục giữa các nhóm tài sản như Broad Equity Index, Financial Sector Basket, Structured Credit Basket, Investment-Grade Bond Basket và Cash/Treasury Bills.

Sau khi danh mục được điều chỉnh, hệ thống kết hợp tỷ trọng của từng nhóm tài sản với mức sinh lời/lỗ của nhóm tài sản đó trong phase để cập nhật giá trị danh mục thực tế.

**Công thức cập nhật danh mục:**

```text
Phase Portfolio Return
= tổng của từng tỷ trọng tài sản × mức sinh lời/lỗ của tài sản trong phase

Giá trị danh mục mới
= Giá trị danh mục cũ × (1 + Phase Portfolio Return)
```

Giá trị danh mục thực tế được cập nhật sau từng phase và trở thành trạng thái đầu vào cho phase tiếp theo. Điều này khiến kết quả của game có tính tích lũy: một khoản lỗ lớn ở phase trước sẽ làm giảm quy mô vốn cho các phase sau, khiến việc phục hồi khó hơn.

Cuối game, giá trị danh mục cuối cùng được quy đổi thành **Portfolio Value Score (PV Score)** trên thang điểm 100. Trước hết, hệ thống tính **Final Return**:

```text
Final Return
= (Final PV / Initial PV) - 1
```

Sau đó, **PV Score** được quy đổi theo hai trường hợp:

```text
Nếu Final Return < 0:

PV Score
= 70 + (70 / 0.57) × Final Return
```

```text
Nếu Final Return ≥ 0:

PV Score
= 70 + (30 / 0.07) × Final Return
```

Cách quy đổi này phản ánh hai mốc tham chiếu khác nhau. Ở chiều giảm, mức thua lỗ nặng được neo theo benchmark drawdown khủng hoảng. Ở chiều tăng, mức lợi suất dương được neo theo benchmark thận trọng dựa trên yield của Baa corporate bonds. Sau khi tính, PV Score được giới hạn trong khoảng từ 0 đến 100 để tránh điểm vượt ngoài thang đánh giá.

### (2) Từ cấu trúc danh mục đến Risk Control

Ngoài việc tính danh mục lãi hay lỗ, hệ thống còn đánh giá mức độ kiểm soát rủi ro của người chơi thông qua **Risk Control (RC)**. Chỉ số này xem danh mục có đang quá tập trung vào các tài sản rủi ro hay không, đặc biệt là Financial Sector Basket và Structured Credit Basket.

Đồng thời, game cũng xem người chơi có duy trì đủ tài sản phòng thủ hoặc có tính thanh khoản cao một cách hợp lý hay không. Vì vậy, một danh mục có Portfolio Value tốt nhưng phụ thuộc quá nhiều vào tài sản rủi ro vẫn có thể bị đánh giá Risk Control thấp hơn.

**Công thức tổng quát:**

```text
RC
= 60% Risky Exposure Structure + 40% Liquidity Control
```

Trong đó, **Risky Exposure Structure** phản ánh mức độ tập trung vào các nhóm tài sản rủi ro, còn **Liquidity Control** phản ánh khả năng duy trì vùng đệm thanh khoản và tài sản phòng thủ trong quá trình khủng hoảng.

### (3) Từ hành vi đọc thông tin đến Decision Quality

Trong quá trình chơi, hệ thống ghi nhận cách người chơi tiếp cận thông tin, gồm việc có mở nguồn tin hay không, thời gian ở lại nguồn tin, mức độ đọc nội dung và việc có sử dụng Research Budget để mở Files quan trọng hay không.

Các dấu hiệu này được dùng để hỗ trợ tính **Decision Quality (DQ)**. Decision Quality không chỉ xem người chơi chọn phương án nào, mà còn xem quá trình ra quyết định có dựa trên thông tin và bằng chứng hợp lý hay không.

Decision Quality gồm bốn phần chính:

* **Information Selection Quality:** người chơi có mở và đọc các nguồn thông tin quan trọng hay không.
* **Evidence Use:** quyết định cuối phase có phù hợp với bằng chứng chính của phase đó hay không.
* **Bias Control:** người chơi có tránh được các thiên lệch như FOMO, herd behavior, overconfidence, confirmation bias hoặc panic selling hay không.
* **Belief Updating:** người chơi có điều chỉnh quan điểm khi thông tin mới hoặc tín hiệu khủng hoảng rõ hơn xuất hiện hay không.

Research Budget cũng nằm trong logic này. Vì Files là nguồn thông tin chuyên sâu hơn và có chi phí mở, người chơi phải cân nhắc tài liệu nào đáng xem trước khi quyết định. Cơ chế này tạo ra sự đánh đổi trong quá trình tìm kiếm và sử dụng thông tin.

**Công thức tổng quát:**

```text
DQ
= 30% ISQ + 35% Evidence Use + 20% Bias Control + 15% Belief Updating
```

### (4) Từ các chỉ số thành kết quả cuối cùng

Sau khi hoàn thành tất cả các phase, game tổng hợp ba nhóm điểm chính để tính Final Score:

```text
Final Score
= 40% PV Score + 40% RC Score + 20% DQ Score
```

Trong đó:

* **Portfolio Value Score** phản ánh kết quả tài chính cuối cùng của danh mục.
* **Risk Control Score** phản ánh mức độ kiểm soát rủi ro, thanh khoản và mức độ tập trung vào tài sản rủi ro.
* **Decision Quality Score** phản ánh chất lượng quá trình đọc thông tin, sử dụng bằng chứng, kiểm soát thiên lệch và cập nhật quan điểm.

Ngoài điểm số, game còn sử dụng **Hard Gates** để giới hạn xếp hạng kết quả trong một số trường hợp nghiêm trọng. Ví dụ, nếu danh mục mất vốn quá lớn, người chơi giữ exposure nguy hiểm trong các phase khủng hoảng, hoặc không mở bất kỳ tài liệu nghiên cứu quan trọng nào, hệ thống sẽ giới hạn mức kết quả tối đa mà người chơi có thể đạt được.

Nhờ cách xử lý này, FREE FALL không chỉ đánh giá người chơi chọn phương án nào, mà còn đánh giá họ đã xử lý thông tin, kiểm soát rủi ro và điều chỉnh quyết định như thế nào trong quá trình khủng hoảng.
