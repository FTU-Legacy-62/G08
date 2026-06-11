# Individual Footprint

**Thành viên 2: Hoàng Bảo Như - 2313380025**

## 1. Vai trò trong dự án

Trong dự án Freefall: How crisis-ready are you?, em phụ trách chính phần Decision Logic & Scoring System.

Công việc của em tập trung vào việc xây dựng logic ra quyết định và hệ thống chấm điểm để chuyển các lựa chọn của người chơi thành điểm số, feedback và final tier. Cụ thể, em phụ trách xây dựng decision matrix, scoring rules cho Portfolio Value Score, Risk Control Score và Decision Quality Score, đồng thời thiết kế hidden risk variables và hard gates.

Ngoài ra, em cũng tham gia testing sản phẩm, đặc biệt là kiểm thử scoring logic thông qua các kịch bản người chơi khác nhau như conservative, balanced và reckless để đánh giá xem hệ thống điểm có phản ánh đúng chất lượng quyết định của người chơi hay không.

## 2. Dấu ấn cá nhân trong sản phẩm

Dấu ấn cá nhân rõ nhất của em là phần decision logic và scoring system. Đây là phần giúp game không chỉ dừng lại ở việc cho người chơi chọn phương án đầu tư, mà còn có thể đánh giá mức độ crisis-readiness của người chơi sau mỗi quyết định.

Em góp phần chuyển các lựa chọn trong game như mở tài liệu, phân bổ danh mục, lựa chọn mức độ chấp nhận rủi ro, giữ tài sản an toàn, phản ứng với tín hiệu khủng hoảng và cập nhật quyết định qua các phase thành các nhóm điểm cụ thể.

Nhờ đó, sản phẩm cuối cùng có thể đưa ra feedback và final tier dựa trên cả kết quả tài chính, mức độ kiểm soát rủi ro và chất lượng quá trình ra quyết định, thay vì chỉ đánh giá người chơi bằng việc lời hay lỗ.

## 3. Những việc đã thực sự làm

- Phân tích nội dung case MVP “FGC 2008-2009”, xác định các biến đầu và mối liên hệ giữa scenario content, player decision với scoring output.

- Xây dựng decision logic cho case MVP, bao gồm phân loại các lựa chọn của người chơi theo mức độ phòng thủ, cân bằng hoặc rủi ro cao.

- Xây dựng decision matrix để ánh xạ từng lựa chọn của người chơi với các biến và kết quả trong hệ thống chấm điểm.

- Thiết kế scoring framework tổng thể, bao gồm cấu trúc điểm số, trọng số giữa các nhóm điểm và nguyên tắc xác định final tier.

- Xây dựng Portfolio Value Score bằng cách xác định cách chuyển Final Portfolio Value thành điểm số và tìm cơ sở/benchmark tài chính thực tế để giải thích các mốc điểm PV.

- Xây dựng Risk Control Score thông qua ba biến nhỏ: Risky Exposure Structure, Leverage Control và Liquidity Control, đồng thời tìm cơ sở tài chính cho từng biến để giải thích vì sao các biến này phản ánh khả năng quản trị rủi ro.

- Xây dựng Decision Quality Score thông qua bốn biến nhỏ: Information Selection Quality, Evidence Use, Bias Control và Belief Updating, đồng thời rà soát để các biến không bị trùng ý nghĩa và chuẩn hóa scoring system theo thang điểm 20–40–60–80–100 để rubric rõ ràng, nhất quán, dễ triển khai vào code.

- Xây dựng hidden risk variables và hard gate logic như Bankruptcy/Game Over, Severe Capital Loss, Reckless Exposure, Leverage Abuse và No Research để giới hạn final tier trong các trường hợp đặc biệt.

- Xây dựng hệ thống feedback/nhận xét kết quả và đề xuất cấu trúc giao diện hiển thị màn hình kết quả cho người chơi.

- Tham gia testing MVP prototype để đánh giá tính hợp lý của gameplay flow, scoring system, feedback, final tier và trải nghiệm chơi tổng thể.

## 4. File, tính năng, dữ liệu, logic, giao diện, tài liệu hoặc phần demo đã đóng góp

<table>
<colgroup>
<col style="width: 17%" />
<col style="width: 51%" />
<col style="width: 30%" />
</colgroup>
<thead>
<tr class="header">
<th>Phần đóng góp</th>
<th>Nội dung em thực hiện</th>
<th>Vai trò trong sản phẩm</th>
</tr>
<tr class="odd">
<th>“CONTENT”</th>
<th><p>- Rà soát nội dung case để đảm bảo các quyết định trong game khớp với scoring logic.</p>
<p>- Kiểm tra mối liên hệ giữa scenario content, player choices và expected output.</p></th>
<th>Đảm bảo nội dung case, lựa chọn của người chơi và kết quả chấm điểm không bị lệch nhau.</th>
</tr>
<tr class="header">
<th>“LOGIC ALL”</th>
<th><p>- Góp phần xây dựng hệ thống scoring tổng quát có thể mở rộng cho nhiều case.</p>
<p>- Xác định cấu trúc scoring gồm PV, RC, DQ và hard gates.</p></th>
<th>Tạo nền tảng logic chung cho toàn bộ sản phẩm và các case có thể phát triển sau này.</th>
</tr>
<tr class="odd">
<th>“LOGIC MVP”</th>
<th><p>- Điều chỉnh scoring logic để phù hợp với phạm vi MVP và case mẫu.</p>
<p>- Rút gọn hoặc chuẩn hóa một số tiêu chí để dễ triển khai vào sản phẩm.</p></th>
<th>Giúp scoring system phù hợp với phiên bản MVP, tránh quá phức tạp nhưng vẫn giữ được ý nghĩa đánh giá.</th>
</tr>
<tr class="header">
<th>Decision Matrix</th>
<th>Liên kết lựa chọn của người chơi với tác động lên PV, RC, DQ, feedback và final tier.</th>
<th>Giúp hệ thống hiểu mỗi lựa chọn của người chơi sẽ ảnh hưởng như thế nào đến kết quả cuối cùng.</th>
</tr>
<tr class="odd">
<th>Portfolio Value Score Rules</th>
<th><p>- Xây dựng cách chuyển Final Portfolio Value thành điểm số.</p>
<p>- Tìm cơ sở tham chiếu để giải thích mốc điểm PV.</p></th>
<th>Đánh giá outcome tài chính cuối cùng của người chơi sau toàn bộ quá trình mô phỏng.</th>
</tr>
<tr class="header">
<th>Risk Control Score Rules</th>
<th><p>- Đánh giá tính khả dụng của các biến trước khi xây dựng rubric chấm điểm.</p>
<p>- Rà soát để đảm bảo các biến đo lường những khía cạnh khác nhau và không bị trùng lặp ý nghĩa.</p>
<p>- Xây dựng tiêu chí chấm Risky Exposure Structure, Leverage Control và Liquidity Control.</p></th>
<th>Đánh giá khả năng quản trị rủi ro của người chơi, không chỉ dựa vào việc danh mục lời hay lỗ.</th>
</tr>
<tr class="odd">
<th>Decision Quality Score Rules</th>
<th><p>- Đánh giá tính khả dụng của các biến trước khi xây dựng rubric chấm điểm.</p>
<p>- Rà soát để đảm bảo các biến đo lường những khía cạnh khác nhau và không bị chồng chéo.</p>
<p>- Xây dựng tiêu chí chấm Information Selection Quality, Evidence Use, Bias Control và Belief Updating.</p></th>
<th>Đánh giá chất lượng quá trình ra quyết định của người chơi, bao gồm cách chọn thông tin, sử dụng evidence, kiểm soát bias và cập nhật quan điểm.</th>
</tr>
<tr class="header">
<th>Hidden Risk Variables</th>
<th><p>- Xác định và xây dựng các biến rủi ro ẩn như mức độ tích lũy risky exposure, lạm dụng đòn bẩy, thiếu thanh khoản kéo dài, bỏ qua tín hiệu cảnh báo quan trọng hoặc không sử dụng research trong quá trình chơi.</p>
<p>- Sử dụng các biến này để theo dõi hành vi của người chơi xuyên suốt các phase và làm đầu vào cho hard gate logic.</p></th>
<th>Giúp hệ thống nhận diện các hành vi rủi ro không thể hiện đầy đủ qua Portfolio Value cuối cùng.</th>
</tr>
<tr class="odd">
<th>Hard Gate Logic</th>
<th>Xây dựng các điều kiện giới hạn final tier trong những trường hợp đặc biệt.</th>
<th>Tránh trường hợp người chơi đạt tier cao chỉ nhờ may mắn trong khi vẫn có hành vi quản trị rủi ro yếu hoặc thiếu research.</th>
</tr>
<tr class="header">
<th>Feedback and Result Logic</th>
<th><p>- Góp phần xây dựng logic nhận xét kết quả dựa trên PV, RC, DQ và hard gates.</p>
<p>- Đề xuất cách hiển thị feedback để người chơi hiểu điểm mạnh, điểm yếu và lý do đạt tier cuối cùng.</p></th>
<th>Biến kết quả cuối game thành phản hồi có ý nghĩa giáo dục, không chỉ là một con số hoặc tier.</th>
</tr>
<tr class="odd">
<th>MVP Prototype Testing</th>
<th><p>- Chơi thử và kiểm tra tính hợp lý của gameplay flow, scoring system, feedback, final tier và trải nghiệm chơi tổng thể.</p>
<p>- Ghi nhận các điểm chưa hợp lý trong quá trình chơi để đề xuất điều chỉnh.</p></th>
<th>Giúp kiểm tra sản phẩm từ góc nhìn người chơi và đảm bảo logic hoạt động hợp lý trong trải nghiệm thực tế.</th>
</tr>
</thead>
<tbody>
</tbody>
</table>

## 5. Bằng chứng đã đóng góp

- Google sheet “\[GROUP 8\] LOGIC”: [<u>https://bit.ly/4urVKdI</u>](https://bit.ly/4urVKdI)

  - Sheet “CONTENT”: Nội dung MVP để lên hệ thống logic cho game

  - Sheet “LOGIC ALL (cũ)”: Logic ban đầu lên để áp dụng cho cả game

  - Sheet “LOGIC MVP (mới)”: Logic được điều chỉnh từ “LOGIC ALL” để phù hợp với MVP

  - Sheet “Cơ sở của LOGIC”: Các cơ sở tài chính thực tế cho LOGIC dựa vào

- Google doc “LOGIC FEEDBACK”: [<u>https://bit.ly/4xjxE7E</u>](https://bit.ly/4xjxE7E)  
  (chỉnh sửa ban đầu của “LOGIC ALL”)

- Google doc “LOGIC FINAL”: [<u>https://bit.ly/43x1QyC</u>](https://bit.ly/43x1QyC)  
  (trình bày chi tiết về LOGIC để gửi cho thành viên phụ trách code)

- Google doc “OUTPUT FEEDBACK”: [<u>http://bit.ly/4eAGFBV</u>](http://bit.ly/4eAGFBV)  
  (nội dung phần feedback kết quả cuối game)

## 6. Phần đóng góp đó kết nối thế nào với sản phẩm cuối cùng

Phần decision logic và scoring system là lớp xử lý trung tâm giúp FREE FALL kết nối giữa nội dung case, lựa chọn của người chơi và kết quả cuối game. Khi người chơi đọc thông tin và đưa ra quyết định ở từng phase, hệ thống cần xác định lựa chọn đó ảnh hưởng như thế nào đến danh mục, mức độ rủi ro, chất lượng quyết định, feedback và final tier.

Nếu không có phần logic này, sản phẩm chỉ dừng lại ở việc mô phỏng một chuỗi lựa chọn đầu tư. Nhờ scoring system, game có thể đánh giá người chơi theo ba khía cạnh chính.

- **Portfolio Value Score** giúp đo kết quả tài chính cuối cùng của danh mục. Đây là phần phản ánh người chơi đã bảo toàn hoặc gia tăng giá trị danh mục tốt đến đâu sau toàn bộ quá trình khủng hoảng.

- **Risk Control Score** giúp đánh giá cách người chơi quản trị rủi ro. Hai người chơi có thể có kết quả tài chính tương tự nhau, nhưng nếu một người đạt được kết quả bằng cách chấp nhận risky exposure quá cao, còn người còn lại duy trì danh mục an toàn và có thanh khoản tốt hơn, thì điểm Risk Control cần phản ánh sự khác biệt đó.

- **Decision Quality Score** giúp đánh giá quá trình ra quyết định. Phần này xem xét việc người chơi có chọn thông tin quan trọng không, có sử dụng bằng chứng trong quyết định không, có tránh các thiên kiến hành vi không và có cập nhật quan điểm khi thông tin mới xuất hiện không.

Ngoài ra, hard gates giúp final tier hợp lý hơn trong các trường hợp đặc biệt. Ví dụ, nếu người chơi đạt Portfolio Value cao nhưng không đọc tài liệu quan trọng hoặc duy trì mức rủi ro quá lớn, hệ thống vẫn có thể giới hạn tier tối đa. Điều này giúp sản phẩm tránh việc thưởng quá cao cho các kết quả đến từ may mắn hoặc hành vi rủi ro.

Phần testing MVP prototype em tham gia cũng giúp kiểm tra xem toàn bộ logic này có vận hành hợp lý trong trải nghiệm chơi thực tế hay không. Thông qua quá trình chơi thử, nhóm có thể đánh giá gameplay flow, cách hiển thị quyết định, scoring output, feedback, final tier và mức độ dễ hiểu của sản phẩm trước khi hoàn thiện.

## 7. Điều cá nhân học được

**(1) Scoring system không chỉ là công thức tính điểm**

Qua phần việc của mình, em học được rằng xây dựng scoring system cho một game giáo dục không đơn thuần là tạo ra một công thức để cộng điểm. Một hệ thống điểm tốt cần trả lời được câu hỏi: sản phẩm đang muốn đánh giá điều gì ở người chơi và điểm số đó có phản ánh đúng hành vi của họ hay không.

Với FREE FALL, nếu chỉ dùng Portfolio Value để đánh giá, người chơi có thể đạt kết quả cao do may mắn hoặc do chấp nhận rủi ro quá mức. Vì vậy, scoring system cần kết hợp nhiều lớp đánh giá, bao gồm kết quả tài chính, mức độ kiểm soát rủi ro và chất lượng quá trình ra quyết định.

**(2) Outcome và quá trình ra quyết định cần được đánh giá riêng**

Em học được rằng trong một crisis simulation, kết quả cuối cùng không phải lúc nào cũng phản ánh đầy đủ chất lượng quyết định. Hai người chơi có thể có Final Portfolio Value tương tự nhau, nhưng một người có thể đạt được kết quả đó bằng cách quản trị rủi ro tốt, còn người khác có thể đạt được nhờ chọn rủi ro cao và gặp may.

Vì vậy, việc tách Portfolio Value Score, Risk Control Score và Decision Quality Score là cần thiết. Portfolio Value đo kết quả tài chính, Risk Control đo cách người chơi kiểm soát danh mục trong khủng hoảng, còn Decision Quality đo quá trình người chơi đọc thông tin, sử dụng bằng chứng, kiểm soát bias và cập nhật quan điểm.

**(3) Các biến trong scoring phải có vai trò riêng và tránh chồng chéo  
**Trong quá trình xây dựng rubric, em học được rằng nếu các biến không được định nghĩa rõ, hệ thống điểm rất dễ bị trùng ý nghĩa. Ví dụ, Evidence Use và Belief Updating đều liên quan đến việc phản ứng với thông tin, nhưng không nên chấm cùng một hành vi hai lần.

Để xử lý điều này, em phải làm rõ vai trò của từng biến. Evidence Use đánh giá việc người chơi có đưa ra quyết định phù hợp với bằng chứng đã đọc trong một phase hay không. Belief Updating đánh giá việc người chơi có điều chỉnh quan điểm qua các phase khi tín hiệu mới xuất hiện hay không. Việc tách rõ như vậy giúp scoring system công bằng và dễ giải thích hơn.

**(4) Logic phải khớp với nội dung, giao diện và trải nghiệm chơi**

Em nhận ra rằng scoring logic không thể đứng riêng như một bảng công thức độc lập. Logic cần khớp với nội dung case, các nguồn thông tin, cách người chơi tiếp cận dữ liệu, decision flow, feedback và result page.

Nếu nội dung trong một phase thay đổi, scoring logic cũng có thể phải điều chỉnh theo. Nếu giao diện hiển thị thông tin chưa rõ, người chơi có thể ra quyết định sai không phải vì họ không hiểu tài chính, mà vì trải nghiệm chơi chưa đủ rõ ràng. Vì vậy, khi làm sản phẩm, các phần content, logic, UI và testing cần được kiểm tra cùng nhau.

**(5) Một logic hợp lý trên giấy chưa chắc tạo ra trải nghiệm chơi tốt**

Thông qua quá trình testing MVP prototype, em học được rằng có những phần nhìn hợp lý khi viết trong sheet hoặc proposal, nhưng khi đưa vào game thật lại có thể chưa rõ ràng với người chơi. Ví dụ, feedback có thể đúng về mặt logic nhưng chưa đủ dễ hiểu, hoặc final tier có thể đúng theo công thức nhưng chưa tạo cảm giác thuyết phục.

Vì vậy, testing không chỉ là kiểm tra công thức có chạy đúng hay không. Testing còn cần đánh giá gameplay flow, cách hiển thị quyết định, feedback, final tier và cảm nhận tổng thể của người chơi. Điều này giúp sản phẩm không chỉ đúng về mặt logic mà còn dễ chơi, dễ hiểu và có giá trị học tập hơn.

**(6) Làm MVP cần biết cân bằng giữa độ sâu và tính khả thi**

Em học được rằng một sản phẩm như FREE FALL có thể mở rộng theo rất nhiều hướng, ví dụ thêm case mới, thêm nhiều nhánh quyết định, thêm biến chấm điểm hoặc làm feedback chi tiết hơn. Tuy nhiên, nếu cố làm quá nhiều trong phạm vi MVP, sản phẩm sẽ dễ bị phức tạp và khó hoàn thiện.

Vì vậy, khi thiết kế scoring system, em cần cân bằng giữa độ sâu về tài chính và khả năng triển khai thực tế. Các biến được chọn phải đủ ý nghĩa để đánh giá người chơi, nhưng cũng phải đủ rõ ràng để nhóm có thể code, test và giải thích được trong demo.

## 8. Khó khăn đã gặp và cách xử lý

**(1) Khó khăn trong việc cân bằng giữa độ sâu tài chính và phạm vi MVP**

Khó khăn lớn nhất của em là làm sao để scoring system đủ có ý nghĩa về mặt tài chính nhưng không quá phức tạp so với phạm vi MVP. Nếu hệ thống quá đơn giản, kết quả sẽ dễ bị phiến diện vì chỉ phản ánh một phần hành vi của người chơi. Nhưng nếu hệ thống quá phức tạp, nhóm sẽ khó triển khai vào code, khó test và người chơi cũng khó hiểu feedback cuối cùng.

Để xử lý, em tách scoring system thành ba nhóm điểm chính: Portfolio Value Score, Risk Control Score và Decision Quality Score. Cách tách này giúp mỗi nhóm điểm có vai trò riêng: PV đo outcome tài chính, RC đo kiểm soát rủi ro và DQ đo chất lượng quá trình ra quyết định. Nhờ đó, hệ thống vẫn đủ sâu nhưng có cấu trúc rõ ràng hơn để triển khai.

**(2) Khó khăn trong việc tránh chồng chéo giữa các biến scoring**

Trong quá trình xây dựng scoring system, một số biến ban đầu có khả năng bị trùng ý nghĩa. Ví dụ, trong Decision Quality Score, Evidence Use và Belief Updating đều liên quan đến việc người chơi phản ứng với thông tin. Trong Risk Control Score, Risky Exposure Structure và Liquidity Control cũng đều liên quan đến mức độ an toàn của danh mục.

Để xử lý, em phải làm rõ vai trò riêng của từng biến. Evidence Use được dùng để đánh giá việc người chơi có đưa ra quyết định phù hợp với bằng chứng đã đọc trong một phase hay không, còn Belief Updating đánh giá việc người chơi có điều chỉnh quan điểm qua các phase khi tín hiệu mới xuất hiện hay không. Tương tự, Risky Exposure Structure tập trung vào mức độ tiếp xúc với tài sản rủi ro, còn Liquidity Control tập trung vào mức độ duy trì tài sản an toàn hoặc thanh khoản cao.

(**3) Khó khăn trong việc tìm cơ sở cho các mốc điểm và biến nhỏ**

Một khó khăn khác là cần tìm cơ sở để giải thích vì sao hệ thống lại chọn các mốc điểm và biến đo lường như vậy. Với Portfolio Value Score, em cần xác định cách chuyển Final Portfolio Value thành điểm số sao cho không bị cảm giác tùy ý. Với Risk Control Score, em cần giải thích vì sao risky exposure, leverage và liquidity là các biến phù hợp để đo khả năng quản trị rủi ro. Với Decision Quality Score, em cần làm rõ vì sao các biến như Information Selection Quality, Evidence Use, Bias Control và Belief Updating phù hợp để đánh giá chất lượng ra quyết định.

Để xử lý, em rà soát lại mục đích của từng nhóm điểm và từng biến nhỏ. Với Portfolio Value Score, em phải tìm các benchmark value dựa trên dữ liệu và diễn biến thị trường trong giai đoạn lịch sử mà game mô phỏng, sau đó cân chỉnh các mốc điểm để vừa phản ánh kết quả đầu tư thực tế vừa phù hợp với nội dung và mục tiêu học tập của game.

Đối với Risk Control Score và Decision Quality Score, em điều chỉnh rubric theo hướng mỗi biến phải đo một khía cạnh cụ thể trong hành vi của người chơi và chuẩn hóa thang điểm 20-40-60-80-100 để hệ thống dễ hiểu, dễ code và dễ giải thích hơn trong demo.

Ngoài ra, đối với biến Information Selection Quality, em xây dựng một công thức tính điểm riêng dựa trên hành vi tương tác của người chơi với các tài liệu trong game. Điểm số được xác định từ việc người chơi có mở đúng các nguồn thông tin quan trọng hay không, thời gian dành để đọc từng tài liệu và mức độ bao phủ thông tin trước khi đưa ra quyết định. Cách tiếp cận này giúp biến Information Selection phản ánh rõ hơn quá trình thu thập và lựa chọn thông tin thay vì chỉ đánh giá kết quả cuối cùng.

**(4) Khó khăn trong việc kết nối logic với content và giao diện**

Một khó khăn nữa là scoring logic không thể đứng riêng mà phải khớp với nội dung case, nguồn tin, decision flow và màn hình kết quả. Nếu content trong một phase đưa ra tín hiệu cảnh báo nhưng decision logic không phản ánh tín hiệu đó, người chơi sẽ không thấy kết quả hợp lý. Ngược lại, nếu scoring logic quá phức tạp nhưng giao diện không giải thích rõ, người chơi có thể không hiểu vì sao mình đạt điểm hoặc tier đó.

Để xử lý, em rà soát mối liên hệ giữa scenario content, player choices và expected output. Khi xây dựng feedback/result logic, em cũng chú ý để kết quả cuối cùng giải thích được người chơi mạnh hoặc yếu ở phần nào: Portfolio Value, Risk Control hay Decision Quality.

**(5) Khó khăn trong quá trình testing MVP prototype**

Trong quá trình testing, có những phần hợp lý trên sheet nhưng khi đưa vào prototype lại chưa thật sự rõ ràng trong trải nghiệm chơi. Ví dụ, gameplay flow có thể khiến người chơi chưa hiểu mình cần làm gì tiếp theo, hoặc feedback đúng về mặt logic nhưng chưa đủ dễ hiểu.

Để xử lý, em tham gia testing MVP prototype từ góc nhìn người chơi, không chỉ từ góc nhìn người làm scoring. Em kiểm tra gameplay flow, scoring output, feedback, final tier và trải nghiệm chơi tổng thể, sau đó ghi nhận các điểm chưa hợp lý để đề xuất điều chỉnh. Việc này giúp scoring system không chỉ đúng về mặt công thức mà còn phù hợp hơn với trải nghiệm học tập của người chơi.

## 9. Lời nhắn cho sinh viên khóa sau

**(1) Nên giữ scoring system theo hướng module hóa**

Nếu các bạn khóa sau tiếp tục phát triển FREE FALL, em nghĩ nên giữ scoring system theo hướng module hóa. Mỗi case mới có thể thay đổi nội dung tài sản, tài liệu, phase và quyết định, nhưng nên giữ cấu trúc chấm điểm chung gồm Portfolio Value Score, Risk Control Score và Decision Quality Score.

Cách làm này giúp sản phẩm dễ mở rộng hơn. Khi thêm case mới, nhóm không cần xây lại toàn bộ hệ thống từ đầu mà có thể điều chỉnh từng module điểm cho phù hợp với bối cảnh mới.

**(2) Không nên đánh giá người chơi chỉ bằng Portfolio Value**

Khi phát triển thêm case hoặc chỉnh scoring logic, các bạn không nên chỉ tập trung vào kết quả danh mục cuối cùng. Portfolio Value là quan trọng, nhưng không đủ để phản ánh toàn bộ chất lượng ra quyết định.

Một người chơi có thể đạt kết quả tốt do may mắn hoặc do chấp nhận rủi ro quá mức. Vì vậy, nên tiếp tục kết hợp Portfolio Value với Risk Control và Decision Quality để đánh giá cả outcome, mức độ kiểm soát rủi ro và quá trình ra quyết định.

**(3) Cần kiểm tra kỹ để các biến scoring không bị trùng ý nghĩa**

Khi thêm biến mới hoặc chỉnh rubric, các bạn nên kiểm tra xem biến đó đang đo điều gì và có bị trùng với biến khác không. Ví dụ, nếu một biến đã đo việc người chơi sử dụng bằng chứng trong quyết định, thì một biến khác không nên chấm lại đúng hành vi đó theo cách tương tự.

Việc tách rõ vai trò của từng biến sẽ giúp hệ thống điểm công bằng hơn, dễ giải thích hơn và tránh tình trạng một hành vi bị cộng hoặc trừ điểm nhiều lần.

**(4) Scoring logic phải khớp với nội dung từng phase**

Các bạn không nên chỉ thêm công thức điểm mà cần kiểm tra xem scoring system có khớp với nội dung từng phase, nguồn tin, decision flow và feedback cuối game hay không. Nếu một phase có tín hiệu cảnh báo mạnh nhưng scoring logic không phản ánh điều đó, người chơi sẽ khó hiểu vì sao quyết định của mình được chấm như vậy.

Vì vậy, khi chỉnh nội dung case, nên rà soát lại decision matrix, scoring rules và feedback tương ứng. Content, logic và result screen cần được cập nhật cùng nhau.

**(5) Nên tìm cơ sở thực tế cho cả nội dung và scoring logic**

Vì FREE FALL được xây dựng dựa trên một sự kiện tài chính lịch sử, các bạn khóa sau không nên chỉ viết nội dung case theo cảm tính hoặc thiết kế scoring logic hoàn toàn dựa trên giả định nội bộ. Dù sản phẩm là game mô phỏng, cả nội dung và logic chấm điểm vẫn nên có cơ sở từ dữ liệu thực tế, ít nhất ở các điểm quan trọng.

Ví dụ, nếu một phase mô phỏng giai đoạn thị trường bắt đầu xuất hiện tín hiệu rủi ro, nội dung nguồn tin nên phản ánh đúng loại tín hiệu đã từng xuất hiện trong lịch sử như áp lực thanh khoản, bán tháo tài sản, giảm niềm tin thị trường hoặc rủi ro từ các tài sản tài chính phức tạp. Tương tự, scoring logic cũng nên có cơ sở để giải thích vì sao một mức risky exposure, leverage, liquidity hoặc final portfolio value được xem là tốt, trung bình hoặc rủi ro.

Điều này không có nghĩa là mọi con số trong game đều phải sao chép hoàn toàn từ dữ liệu lịch sử. Tuy nhiên, các mốc quan trọng nên được neo vào dữ liệu hoặc benchmark thực tế ở mức hợp lý. Khi nội dung case và scoring logic cùng dựa trên cơ sở thực tế, sản phẩm sẽ thuyết phục hơn, dễ giải thích hơn khi demo và tránh cảm giác điểm số được đặt ra một cách tùy ý.

**(6) Nên test sản phẩm từ góc nhìn người chơi**

Một scoring system hợp lý vẫn cần được kiểm tra cùng gameplay flow, feedback, final tier và trải nghiệm chơi tổng thể. Các bạn nên tự chơi thử nhiều kịch bản khác nhau, ví dụ người chơi thận trọng, người chơi cân bằng, người chơi quá rủi ro hoặc người chơi không dùng research.

Ngoài ra, nên cho người ngoài nhóm chơi thử sớm. Khi tự làm sản phẩm, nhóm thường đã quen với logic của mình nên có thể không nhận ra những điểm gây khó hiểu. Feedback từ người chơi thật sẽ giúp kiểm tra xem luật chơi, nguồn tin, quyết định và kết quả cuối cùng có đủ rõ ràng không.

**(7) Nên giữ phạm vi phát triển thực tế**

FREE FALL có thể mở rộng theo nhiều hướng như thêm case mới, thêm nhánh quyết định, thêm nguồn tin hoặc làm feedback chi tiết hơn. Tuy nhiên, nếu mở rộng quá nhanh, sản phẩm dễ bị phức tạp và khó hoàn thiện.

Vì vậy, các bạn nên bắt đầu từ một case hoặc một tính năng rõ logic, làm cho phần đó chạy ổn và dễ hiểu trước, sau đó mới mở rộng thêm. Một sản phẩm nhỏ hơn nhưng hoàn thiện, có logic rõ và demo được sẽ hiệu quả hơn một sản phẩm quá rộng nhưng khó kiểm soát.
