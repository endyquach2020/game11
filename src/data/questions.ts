import { Question, StageData } from '../types/game';

export const STAGES_CONFIG: StageData[] = [
  {
    id: 1,
    name: 'MÀN 1: RỪNG RẬM VEN BIỂN',
    subtitle: 'Khám Phá Khái Niệm Bản Quyền Nội Dung Thông Tin',
    themeColor: '#22c55e',
    bgGradTop: '#064e3b',
    bgGradBottom: '#022c22',
    groundColor: '#14532d',
    length: 3200,
    bossName: 'CỖ MÁY PHÒNG THỦ GÁC CỔNG BẢN QUYỀN (GATE DEFENSE CORE)',
    bossHp: 80,
    checkpoints: [550, 1100, 1650, 2200, 2750],
  },
  {
    id: 2,
    name: 'MÀN 2: THÁC NƯỚC & VÁCH NÚI ĐÁ',
    subtitle: 'Truy Cập Hợp Lệ & Bảo Mật Nội Dung Thông Tin',
    themeColor: '#38bdf8',
    bgGradTop: '#0c4a6e',
    bgGradBottom: '#082f49',
    groundColor: '#1e3a8a',
    length: 3400,
    bossName: 'CHIẾN HẠM ROBOT ĐA NÒNG PHÁO (TWIN-TURRET MECH)',
    bossHp: 130,
    checkpoints: [600, 1200, 1800, 2400, 2950],
  },
  {
    id: 3,
    name: 'MÀN 3: PHÁO ĐÀI NÚI LỬA & HÀNG RÀO AN NINH',
    subtitle: 'Tôn Trọng Tính Riêng Tư & Đạo Đức Môi Trường Số',
    themeColor: '#f97316',
    bgGradTop: '#450a0a',
    bgGradBottom: '#1c1917',
    groundColor: '#7f1d1d',
    length: 3600,
    bossName: 'ĐẦU NÃO DỮ LIỆU ĐIỆN TOÁN TỐI CAO (CYBER OVERLORD BRAIN)',
    bossHp: 190,
    checkpoints: [650, 1300, 1950, 2600, 3150],
  },
];

export const QUESTIONS: Question[] = [
  // --- MÀN 1 (5 câu từ trang 24, 25 SGK) ---
  {
    id: 'stage1-q1',
    stageId: 1,
    questionNumber: 1,
    question: 'Theo bài học, "Bản quyền nội dung thông tin" được định nghĩa là gì?',
    options: [
      'Là quyền của tác giả cho phép hoặc không cho phép người khác sử dụng nội dung thông tin của mình.',
      'Là quyền tự ý sao chép, chỉnh sửa bất kì hình ảnh hay bài viết nào tìm được trên mạng Internet.',
      'Là quyền sở hữu tất cả các thiết bị máy tính, điện thoại trong trường học hoặc gia đình.',
      'Là quyền được tự do đăng tải thông tin cá nhân của bạn bè lên mạng xã hội.'
    ],
    correctAnswerIndex: 0,
    explanationTopic: 'Khái niệm Bản quyền nội dung thông tin (SGK Tin học 5 - Trang 25)'
  },
  {
    id: 'stage1-q2',
    stageId: 1,
    questionNumber: 2,
    question: 'Hãy chọn phát biểu SAI về nội dung thông tin trong các câu dưới đây (trang 25 SGK):',
    options: [
      'Tác giả có quyền cho phép người khác sử dụng nội dung thông tin của mình.',
      'Tác giả có quyền không cho phép người khác sử dụng nội dung thông tin của mình.',
      'Nội dung thông tin được thể hiện dưới dạng văn bản, hình ảnh, âm thanh hay đa phương tiện,...',
      'Nội dung thông tin phải gồm đầy đủ các dạng văn bản, hình ảnh, âm thanh.'
    ],
    correctAnswerIndex: 3,
    explanationTopic: 'Câu hỏi trắc nghiệm trang 25 SGK: Nội dung thông tin không bắt buộc phải gồm đầy đủ cả ba dạng'
  },
  {
    id: 'stage1-q3',
    stageId: 1,
    questionNumber: 3,
    question: 'Trong tờ báo tường của các bạn lớp 5A (Hình 24), bài thơ "Cô giáo của em" là tác phẩm của tác giả nào?',
    options: [
      'Bạn Ngô Hà Trang',
      'Nhà thơ Xuân Quỳnh',
      'Bạn Nguyễn A',
      'Nhà văn Tô Hoài'
    ],
    correctAnswerIndex: 1,
    explanationTopic: 'Khởi động trang 24, 25 SGK: Bài thơ Cô giáo của em của nhà thơ Xuân Quỳnh'
  },
  {
    id: 'stage1-q4',
    stageId: 1,
    questionNumber: 4,
    question: 'Nguyên tắc cơ bản nhất ghi trong khung ghi nhớ (trang 25) khi muốn sử dụng nội dung thông tin là gì?',
    options: [
      'Chỉ được sử dụng nội dung thông tin khi được phép.',
      'Được tự do sử dụng miễn là không đem đi bán lấy tiền.',
      'Cứ tải về máy tính sử dụng, khi nào bị nhắc nhở thì mới xin phép.',
      'Chỉ cần đổi tên bài viết thành tên mình là được phép sử dụng.'
    ],
    correctAnswerIndex: 0,
    explanationTopic: 'Ghi nhớ trang 25 SGK: Chỉ được sử dụng nội dung thông tin khi được phép'
  },
  {
    id: 'stage1-q5',
    stageId: 1,
    questionNumber: 5,
    question: 'Nội dung thông tin có thể được thể hiện dưới những dạng nào theo nội dung bài học?',
    options: [
      'Dưới dạng văn bản, hình ảnh, âm thanh hay đa phương tiện,...',
      'Chỉ tồn tại dưới dạng sách in giấy trong thư viện.',
      'Chỉ duy nhất dưới dạng các đoạn video phát trên tivi.',
      'Chỉ các tập tin phần mềm máy tính mới được gọi là nội dung thông tin.'
    ],
    correctAnswerIndex: 0,
    explanationTopic: 'Trang 25 SGK: Nội dung thông tin thể hiện dưới dạng văn bản, hình ảnh, âm thanh hay đa phương tiện'
  },

  // --- MÀN 2 (5 câu từ trang 26 SGK) ---
  {
    id: 'stage2-q1',
    stageId: 2,
    questionNumber: 1,
    question: 'Khi sử dụng nội dung thông tin của người khác, chúng ta cần phải thực hiện hai yêu cầu nào?',
    options: [
      'Cần được tác giả cho phép và phải ghi rõ nguồn tin.',
      'Chỉ cần tải về máy tính và không cần ghi tên tác giả.',
      'Cứ sao chép và nói với mọi người là do bản thân tự làm.',
      'Chỉ cần xóa thông tin bản quyền của tác giả gốc.'
    ],
    correctAnswerIndex: 0,
    explanationTopic: 'Mục 2 trang 26 SGK: Cần được tác giả cho phép và ghi rõ nguồn tin'
  },
  {
    id: 'stage2-q2',
    stageId: 2,
    questionNumber: 2,
    question: 'Trong bài tập ghép đôi (trang 26), khi sử dụng một bài thơ KHÔNG RÕ TÊN TÁC GIẢ, em phải ghi nguồn như thế nào?',
    options: [
      'Ghi nguồn là "Sưu tầm".',
      'Ghi tên tác giả là tên của chính em.',
      'Để trống hoàn toàn không cần ghi nguồn.',
      'Tự ý bịa ra một cái tên tác giả nổi tiếng khác.'
    ],
    correctAnswerIndex: 0,
    explanationTopic: 'Bài tập ghép đôi trang 26 SGK: Không rõ tên tác giả -> Ghi nguồn Sưu tầm'
  },
  {
    id: 'stage2-q3',
    stageId: 2,
    questionNumber: 3,
    question: 'Nếu em kể lại một câu chuyện dựa trên truyện cổ tích Cây khế bằng ngôn ngữ của mình, em cần ghi nguồn thế nào?',
    options: [
      'Ghi nguồn: "Phỏng theo truyện Cây khế".',
      'Ghi nguồn: "Tác phẩm hoàn toàn mới do tôi tự sáng tác 100%".',
      'Không cần ghi nguồn vì đã thay đổi câu từ diễn đạt.',
      'Ghi tên bạn cùng bàn của em là tác giả câu chuyện.'
    ],
    correctAnswerIndex: 0,
    explanationTopic: 'Trang 26 SGK: Diễn đạt lại nội dung thông tin bằng ngôn ngữ của mình cần ghi "phỏng theo"'
  },
  {
    id: 'stage2-q4',
    stageId: 2,
    questionNumber: 4,
    question: 'Theo bài học (trang 26), hành vi nào dưới đây được nêu rõ là "hành vi vi phạm đạo đức"?',
    options: [
      'Truy cập nội dung thông tin của người khác mà không được phép (ví dụ: sao chép bài của bạn trong giờ kiểm tra).',
      'Hỏi mượn sách vở của bạn trước khi xem.',
      'Ghi rõ tên tác giả và năm xuất bản vào cuối bài thuyết trình.',
      'Tự mình làm bài tập mà không cần nhìn tài liệu.'
    ],
    correctAnswerIndex: 0,
    explanationTopic: 'Trang 26 SGK: Truy cập nội dung của người khác không được phép là hành vi vi phạm đạo đức'
  },
  {
    id: 'stage2-q5',
    stageId: 2,
    questionNumber: 5,
    question: 'Để bảo vệ quyền tác giả và tránh bị đánh cắp sản phẩm do mình tạo ra, tác giả cần làm gì?',
    options: [
      'Có ý thức giữ bí mật, ghi tên tác giả lên sản phẩm hoặc đăng kí bản quyền bảo hộ.',
      'Xóa ngay tập tin đó đi để không ai có thể xem được.',
      'Chỉ đi sao chép của người khác thì sẽ không sợ bị mất cắp.',
      'Không ghi bất kì thông tin tác giả nào lên bìa sản phẩm.'
    ],
    correctAnswerIndex: 0,
    explanationTopic: 'Ghi nhớ trang 26 SGK: Giữ gìn bí mật thông tin và đăng kí bản quyền bảo hộ'
  },

  // --- MÀN 3 (5 câu từ trang 27, 28 SGK) ---
  {
    id: 'stage3-q1',
    stageId: 3,
    questionNumber: 1,
    question: 'Ở Hoạt động 2 (trang 27), An để quên nhật kí trong ngăn bàn, Bình đọc lén rồi kể cho các bạn khác nghe. Hành động của Bình là gì?',
    options: [
      'Vi phạm tính riêng tư của bạn An.',
      'Hành vi đúng đắn vì giúp mọi người hiểu nhau hơn.',
      'Hoạt động đọc sách bình thường không vi phạm gì.',
      'Hành động giúp bảo vệ nhật kí cho bạn An.'
    ],
    correctAnswerIndex: 0,
    explanationTopic: 'Hoạt động 2 trang 27 SGK: Đọc lén nhật kí của bạn là vi phạm tính riêng tư'
  },
  {
    id: 'stage3-q2',
    stageId: 3,
    questionNumber: 2,
    question: 'Những thông tin nào sau đây là "thông tin cá nhân, mang tính riêng tư của mỗi người" theo trang 27 SGK?',
    options: [
      'Nhật kí, họ tên, ngày sinh, địa chỉ,... của cá nhân.',
      'Nội dung các bài hát quốc ca được phát trên loa.',
      'Biển chỉ dẫn giao thông trên đường quốc lộ.',
      'Thời khóa biểu chung của cả trường dán trên bảng tin.'
    ],
    correctAnswerIndex: 0,
    explanationTopic: 'Trang 27 SGK: Cuốn nhật kí hay họ tên, ngày sinh, địa chỉ,... là thông tin cá nhân, mang tính riêng tư'
  },
  {
    id: 'stage3-q3',
    stageId: 3,
    questionNumber: 3,
    question: 'Khi gặp hiện tượng sai trái (như xem thư riêng, sao chép tệp của bạn chưa được sự đồng ý), em cần làm gì?',
    options: [
      'Thể hiện rõ thái độ không đồng tình, góp ý, nhắc nhở để hiện tượng đó không tiếp diễn.',
      'Đồng tình và cùng các bạn tham gia sao chép tệp đó.',
      'Giữ im lặng và bắt chước hành vi xem thư riêng của người khác.',
      'Khen ngợi bạn vì đã lấy trộm được tài liệu mật.'
    ],
    correctAnswerIndex: 0,
    explanationTopic: 'Trang 27 SGK: Thể hiện rõ thái độ không đồng tình, góp ý nhắc nhở'
  },
  {
    id: 'stage3-q4',
    stageId: 3,
    questionNumber: 4,
    question: 'Phần Vận dụng (trang 28): Khi sử dụng một số thông tin từ website thieunien.vn để làm bài trình chiếu, học sinh cần làm gì?',
    options: [
      'Cần xin phép tác giả/ban biên tập và ghi rõ nguồn: thieunien.vn.',
      'Tự do sao chép và xóa hết tên website thieunien.vn.',
      'Nói rằng toàn bộ bài viết đó là do chính mình tự nghĩ ra.',
      'Không cần ghi nguồn vì trang web trên mạng là của chung.'
    ],
    correctAnswerIndex: 0,
    explanationTopic: 'Vận dụng trang 28 SGK: Cần xin phép và ghi rõ nguồn từ thieunien.vn'
  },
  {
    id: 'stage3-q5',
    stageId: 3,
    questionNumber: 5,
    question: 'Trong các hành động sau (bài Luyện tập trang 28), hành động nào thể hiện sự ĐỒNG TÌNH và TÔN TRỌNG bản quyền?',
    options: [
      'Xin phép sử dụng hình ảnh, bài viết của người khác trong bài trình chiếu và ghi rõ nguồn tin.',
      'Đọc trộm tin nhắn riêng trên điện thoại của người khác khi chưa được phép.',
      'Chia sẻ nhật kí và hình ảnh riêng tư của người khác lên mạng Internet mà không xin phép.',
      'Sao chép bài vẽ của bạn trên máy tính nộp cho thầy cô mà không hỏi ý kiến.'
    ],
    correctAnswerIndex: 0,
    explanationTopic: 'Luyện tập trang 28 SGK: Đồng tình với việc xin phép sử dụng và ghi rõ nguồn tin'
  }
];

export const INITIAL_LEADERBOARD: import('../types/game').LeaderboardEntry[] = [
  {
    id: 'lb-1',
    name: 'Bill Rizer (Đặc Nhiệm Contra)',
    score: 18500,
    stageReached: 3,
    firstTryAnswers: 15,
    timeElapsedSeconds: 310,
    date: '2026-10-25'
  },
  {
    id: 'lb-2',
    name: 'Lance Bean (Chiến Binh Đỏ)',
    score: 14200,
    stageReached: 3,
    firstTryAnswers: 14,
    timeElapsedSeconds: 345,
    date: '2026-10-26'
  },
  {
    id: 'lb-3',
    name: 'Sao Vàng Quyết Thắng',
    score: 11800,
    stageReached: 2,
    firstTryAnswers: 10,
    timeElapsedSeconds: 260,
    date: '2026-10-27'
  },
  {
    id: 'lb-4',
    name: 'Hiệp Sĩ Bản Quyền Lớp 5A',
    score: 9600,
    stageReached: 2,
    firstTryAnswers: 9,
    timeElapsedSeconds: 220,
    date: '2026-10-27'
  },
  {
    id: 'lb-5',
    name: 'Biệt Kích Cây Khế',
    score: 6400,
    stageReached: 1,
    firstTryAnswers: 5,
    timeElapsedSeconds: 150,
    date: '2026-10-27'
  }
];
