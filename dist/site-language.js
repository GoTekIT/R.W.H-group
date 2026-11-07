(() => {
  'use strict';
  const copy = {
    vi: {
      officeDescription: 'Triết lý thiết kế của R.W.H Group: sự hài hòa giữa thiên nhiên, con người và xã hội.',
      phoneNumber: 'Số điện thoại', phoneInvalid: 'Vui lòng nhập số điện thoại hợp lệ (7–15 chữ số).',
      privacyAgree: 'Tôi đồng ý với việc xử lý thông tin liên hệ như mô tả ở trên.', contactRequired: '* Các trường bắt buộc',
      videos: 'VIDEO', watchVideos: 'Xem video ↗', playVideo: 'Phát video', closeVideos: 'Đóng video',
      videosIntro: 'Những thước phim về kiến trúc, Onsen và không gian chăm sóc sức khỏe.',
      clientFilm: 'Video do khách hàng lựa chọn.',
      brandFilm: 'Phim giới thiệu chung của R.W.H Group.', projectFilm: 'Phim giới thiệu dự án.',
      referenceFilm: 'Video tham khảo · withBanyan. Không thuộc danh mục dự án R.W.H Group.', openVideoSource: 'Mở video gốc ↗',
      language: 'Ngôn ngữ', backToTop: 'Lên đầu', privacyNotice: 'Thông tin bảo mật', contactNavigation: 'Điều hướng liên hệ', openMenu: 'Mở menu', closeMenu: 'Đóng menu', navigation: 'Điều hướng chính',
      navHome: 'Trang chủ', office: 'Giới thiệu', navProjects: 'Dự án', navNews: 'Tin tức', jobs: 'Tuyển dụng', navContact: 'Liên hệ',
      selectedWorks: 'Dự án chọn lọc', projectsJapan: 'Dự án Nhật Bản', planning: 'Quy hoạch', architecture: 'Kiến trúc',
      interior: 'Nội thất', landscape: 'Cảnh quan', allProjects: 'Tất cả dự án', companyProfile: 'Hồ sơ năng lực',
      works: 'CÔNG TRÌNH', projects: 'DỰ ÁN', movies: 'PHIM', news: 'TIN TỨC', profile: 'HỒ SƠ',
      message: 'THÔNG ĐIỆP', awards: 'GIẢI THƯỞNG', outline: 'TỔNG QUAN', books: 'ẤN PHẨM', flow: 'QUY TRÌNH',
      newsletter: 'BẢN TIN', recruit: 'TUYỂN DỤNG', designOrder: 'YÊU CẦU THIẾT KẾ', contact: 'LIÊN HỆ',
      published: 'Xuất bản bởi FRAME', release: 'Phát hành năm 2025', relatedSites: 'Website liên quan:',
      detail: 'CHI TIẾT', data: 'THÔNG TIN', otherWorks: 'CÔNG TRÌNH KHÁC', more: 'XEM THÊM', scroll: 'CUỘN',
      closeOffice: 'Đóng Giới thiệu', back: 'Quay lại', retry: 'Thử lại', viewOffice: 'Giới thiệu R.W.H Group', loadingOffice: 'Đang tải Giới thiệu…', officeLoadError: 'Chưa tải được Giới thiệu. Vui lòng thử lại.', closeProject: 'Đóng chi tiết dự án', loadingProject: 'Đang tải dự án…', projectLoadError: 'Chưa tải được dự án. Vui lòng thử mở lại.', openProjectPage: 'Mở trang dự án',
      selectedProjects: 'Các dự án kiến trúc chọn lọc', nextProject: 'Dự án tiếp theo', firstProject: 'Về dự án đầu tiên',
      projectTop: 'Về đầu dự án', home: 'R.W.H Group — Trang chủ', projectCounter: 'Dự án {number} trên {total}',
      contactRegion: 'Liên hệ R.W.H Group', call: 'Gọi R.W.H Group: 0982-132-489',
      footerInvite: 'Liên hệ R.W.H Group ngay hôm nay để được tư vấn và kết nối với các chuyên gia Nhật Bản.',
      tagline: 'RWH Group – Japanese Expertise, Better Living.', services: 'Thiết kế & Thi công',
      name: 'Họ tên', email: 'Email', questions: 'Câu hỏi', closeContact: 'Đóng form liên hệ',
      contactNote: 'Để lại câu hỏi, R.W.H Group sẽ liên hệ với bạn.', sendMessage: 'Gửi liên hệ', sendingMessage: 'Đang gửi…',
      contactSent: 'Cảm ơn bạn! Nội dung liên hệ đã được gửi đến R.W.H Group.',
      contactInvalid: 'Vui lòng kiểm tra họ tên, email, số điện thoại và câu hỏi.',
      contactError: 'Chưa gửi được liên hệ. Thông tin của bạn vẫn được giữ; vui lòng thử lại.',
      contactRateLimited: 'Vui lòng đợi vài phút trước khi thử lại.',
      contactUnavailable: 'Form liên hệ đang được thiết lập. Vui lòng thử lại sau.',
      contactLocal: 'Vui lòng mở website đã xuất bản để gửi liên hệ.',
      imageViewer: 'Xem ảnh dự án', closeImage: 'Đóng ảnh', previousImage: 'Ảnh trước', nextImage: 'Ảnh tiếp theo',
      zoomPhoto: 'Phóng to ảnh {number} của {title}', viewDetail: 'Xem chi tiết {title}',
      siteDescription: 'Các dự án R.W.H Group: nghỉ dưỡng, Onsen, chăm sóc sức khỏe, khách sạn và kiến trúc đô thị tại Việt Nam và Nhật Bản.'
    },
    en: {
      officeDescription: 'R.W.H Group’s design philosophy: harmony between nature, people and society.',
      phoneNumber: 'Phone number', phoneInvalid: 'Please enter a valid phone number (7–15 digits).',
      privacyAgree: 'I agree to the processing of my enquiry as described above.', contactRequired: '* Required fields',
      videos: 'VIDEO', watchVideos: 'Watch videos ↗', playVideo: 'Play video', closeVideos: 'Close videos',
      videosIntro: 'Films exploring architecture, Onsen and spaces for wellbeing.',
      clientFilm: 'Client-selected video.',
      brandFilm: 'A general introduction to R.W.H Group.', projectFilm: 'Project introduction film.',
      referenceFilm: 'Reference film · withBanyan. Not part of the R.W.H Group project portfolio.', openVideoSource: 'Open original video ↗',
      language: 'Language', backToTop: 'Back to top', privacyNotice: 'Privacy notice', contactNavigation: 'Contact navigation', openMenu: 'Open menu', closeMenu: 'Close menu', navigation: 'Main navigation',
      navHome: 'Home', office: 'About us', navProjects: 'Projects', navNews: 'News', jobs: 'Jobs', navContact: 'Contact',
      selectedWorks: 'Selected projects', projectsJapan: 'Projects in Japan', planning: 'Planning', architecture: 'Architecture',
      interior: 'Interior', landscape: 'Landscape', allProjects: 'All projects', companyProfile: 'Company profile',
      works: 'WORKS', projects: 'PROJECTS', movies: 'MOVIES', news: 'NEWS', profile: 'PROFILE',
      message: 'MESSAGE', awards: 'AWARDS', outline: 'OUTLINE', books: 'BOOKS', flow: 'FLOW',
      newsletter: 'NEWSLETTER', recruit: 'RECRUIT', designOrder: 'DESIGN ENQUIRY', contact: 'CONTACT',
      published: 'Published by FRAME', release: '2025 Release', relatedSites: 'Related websites',
      detail: 'DETAILS', data: 'DATA', otherWorks: 'OTHER WORKS', more: 'MORE', scroll: 'SCROLL',
      closeOffice: 'Close About', back: 'Back', retry: 'Try again', viewOffice: 'About R.W.H Group', loadingOffice: 'Loading About…', officeLoadError: 'The About page could not be loaded. Please try again.', closeProject: 'Close project details', loadingProject: 'Loading project…', projectLoadError: 'The project could not be loaded. Please try opening it again.', openProjectPage: 'Open project page',
      selectedProjects: 'Selected architecture projects', nextProject: 'Next project', firstProject: 'Back to first project',
      projectTop: 'Back to project top', home: 'R.W.H Group — Home', projectCounter: 'Project {number} of {total}',
      contactRegion: 'Contact R.W.H Group', call: 'Call R.W.H Group: 0982-132-489',
      footerInvite: 'Contact R.W.H Group today for advice and to connect with our Japanese experts.',
      tagline: 'RWH Group – Japanese Expertise, Better Living.', services: 'Design & Build',
      name: 'Name', email: 'Email', questions: 'Questions', closeContact: 'Close contact form',
      contactNote: 'Send us your enquiry and R.W.H Group will get in touch.', sendMessage: 'Send enquiry', sendingMessage: 'Sending…',
      contactSent: 'Thank you! Your enquiry has been sent to R.W.H Group.',
      contactInvalid: 'Please check your name, email, phone number and questions.',
      contactError: 'Your enquiry could not be sent. Your details are still here; please try again.',
      contactRateLimited: 'Please wait a few minutes before trying again.',
      contactUnavailable: 'The contact form is being set up. Please try again later.',
      contactLocal: 'Please open the published website to send an enquiry.',
      imageViewer: 'Project image viewer', closeImage: 'Close image', previousImage: 'Previous image', nextImage: 'Next image',
      zoomPhoto: 'Enlarge photo {number} of {title}', viewDetail: 'View details of {title}',
      siteDescription: 'R.W.H Group projects: resorts, Onsen, healthcare, hotels and urban architecture in Vietnam and Japan.'
    }
  };
  const projectCopy = window.RWHProjectCopy || { vi: {}, en: {} };
  const pageCopy = window.RWHPageCopy || { vi: {}, en: {} };
  let language = 'vi';
  const valid = value => value === 'vi' || value === 'en';
  function t(key, values = {}) {
    const value = copy[language][key] ?? projectCopy[language][key] ?? pageCopy[language][key] ?? key;
    return value.replace(/\{(\w+)\}/g, (match, name) => values[name] ?? match);
  }
  function message(element, key) {
    element.dataset.i18n = key;
    element.textContent = t(key);
  }
  function setLanguage(next, persist = true) {
    if (!valid(next)) return;
    language = next;
    document.documentElement.lang = language;
    document.querySelectorAll('[data-i18n]').forEach(element => {
      element.textContent = t(element.dataset.i18n);
      if (element.classList.contains('shuffle')) element.dataset.text = element.textContent;
    });
    for (const attribute of ['aria-label', 'content', 'alt']) {
      document.querySelectorAll(`[data-i18n-${attribute}]`).forEach(element => {
        element.setAttribute(attribute, t(element.getAttribute(`data-i18n-${attribute}`)));
      });
    }
    document.querySelectorAll('[data-project-title]').forEach(element => {
      const key = element.hasAttribute('data-photo-number') ? 'zoomPhoto' : 'viewDetail';
      element.setAttribute('aria-label', t(key, {title: element.dataset.projectTitle, number: element.dataset.photoNumber}));
    });
    const menu = document.querySelector('.menu');
    if (menu) menu.setAttribute('aria-label', t(menu.getAttribute('aria-expanded') === 'true' ? 'closeMenu' : 'openMenu'));
    document.querySelectorAll('[data-language]').forEach(button => {
      button.setAttribute('aria-pressed', String(button.dataset.language === language));
    });
    if (persist) {
      try { window.localStorage.setItem('rwh-language', language); } catch { /* The switch still works when storage is blocked. */ }
    }
    document.dispatchEvent(new CustomEvent('rwh:languagechange', {detail: {language}}));
  }
  window.RWHI18n = { t, message, setLanguage, get language() { return language; } };
  document.querySelectorAll('[data-language]').forEach(button => {
    button.addEventListener('click', () => setLanguage(button.dataset.language));
  });
  window.addEventListener('storage', event => {
    if (event.key !== 'rwh-language' && event.key !== null) return;
    const next = valid(event.newValue) ? event.newValue : 'vi';
    if (next !== language) setLanguage(next, false);
  });
  let saved;
  try { saved = window.localStorage.getItem('rwh-language'); } catch { /* Use Vietnamese when storage is unavailable. */ }
  setLanguage(valid(saved) ? saved : 'vi', false);
})();
