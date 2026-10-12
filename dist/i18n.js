(() => {
  'use strict';
  const messages = {
    en: {
      pageTitle: 'R.W.H Group | Architecture', pageDescription: 'Discover R.W.H Group: Japanese and Vietnamese expertise in planning, architecture, interiors and landscape.',
      language: 'Language', home: 'R.W.H Group home', quickNavigation: 'Quick navigation', navigation: 'Main navigation', projectsLabel: 'R.W.H Group introduction, strengths and projects',
      brandSection: 'About R.W.H Group', strengthsSection: 'R.W.H Group healthcare expertise',
      brandEyebrow: 'ABOUT US', brandHeadline: 'Architecture in harmony with nature.',
      brandDescription: 'Bringing together Japanese expertise and an understanding of Vietnam, R.W.H Group provides planning, architecture, interior and landscape design. Simplicity, effectiveness and the relationship between people and nature are at the heart of our work.',
      brandPhoto: 'Neo Garden Onsen, Bac Giang', brandPhotoCaption: 'Bac Giang · 2023', exploreStrengths: 'Explore our strengths', exploreProjects: 'Explore projects',
      strengthsEyebrow: 'OUR EXPERTISE', strengthsHeadline: 'Specialists in healthcare design.', strengthsDescription: 'Pioneering healthcare projects in Vietnam: Onsen & Spa, wellness resorts, senior care facilities and international hospitals, supported by advanced Japanese technology.',
      strength1Title: 'Healthcare architecture', strength1Description: 'Designing healthcare projects through integrated planning, architecture, interiors and landscape, with attention to both users and operations.',
      strength2Title: 'Onsen & Spa', strength2Description: 'Pioneering Onsen and Spa design in Vietnam, bringing Japanese hot spring traditions into spaces for relaxation.',
      strength3Title: 'Wellness Resort', strength3Description: 'Designing wellness resorts that connect accommodation, relaxation and wellness experiences within a cohesive environment.',
      strength4Title: 'Senior care facilities', strength4Description: 'Creating spaces for older adults, with attention to safety, accessibility and everyday quality of life.',
      strength5Title: 'International hospitals', strength5Description: 'Designing international hospitals with attention to spatial organisation, care needs and operational efficiency.',
      strength6Title: 'Japanese technology', strength6Description: 'Providing and integrating advanced Japanese technology to optimise healthcare experiences and facility operations.',
      openMenu: 'Open menu', closeMenu: 'Close menu', contact: 'Contact', profile: 'Company profile', designOrder: 'Design Order',
      contactTitle: 'CONTACT', profileTitle: 'PROFILE', closeContact: 'Close contact form', closeProfile: 'Close company profile',
      name: 'Name', email: 'Email', questions: 'Questions', sendMessage: 'Send message',
      contactReady: 'Leave your questions and R.W.H Group will get in touch.', sendingMessage: 'Sending…',
      contactSent: 'Thank you! Your enquiry has been sent to R.W.H Group.',
      contactError: 'Your enquiry could not be sent. Your details are still here; please try again.',
      contactInvalid: 'Please check your name, email and questions.',
      contactRateLimited: 'Please wait a few minutes before trying again.',
      contactUnavailable: 'The contact form is being set up. Please try again later.',
      contactLocal: 'Please open the published website to send an enquiry.',
      profileDescription: 'Our Japanese and Vietnamese architects provide planning, architecture, interior and landscape design. Our design philosophy focuses on simplicity, effectiveness and harmony with nature.',
      profileCover: 'R.W.H Group company profile 2025 cover', profileFile: 'Company Profile 2025 · VN / EN · 135 pages · 10.4 MB', viewProfile: 'View profile', downloadPdf: 'Download PDF',
      location: 'LOCATION', completion: 'COMPLETION', area: 'FLOOR AREA', structure: 'STRUCTURE',
      projectYear: 'PROJECT YEAR', siteArea: 'SITE AREA', client: 'CLIENT', imageSource: 'Image source: {name}',
      projectFilm: 'Project film', projectFilmTitle: 'PROJECT FILM', openFilm: 'OPEN FILM', watchFilm: 'WATCH FILM', projectSource: 'PROJECT SOURCE',
      detail: 'DETAIL', close: 'CLOSE', viewDetails: 'View {name} details', openDetails: 'Open details for {name}', closeDetails: 'Close project details',
      playFilm: 'Play {name} project film', filmPreview: '{name} film preview', filmTitle: '{name} — project film', architecturePhoto: '{name} — project image', photography: 'Photography: {name}', filmCredit: 'Film: {name}',
      profileFooter: 'COMPANY PROFILE', designOrderTitle: 'DESIGN ORDER', copyright: 'Copyright © 2026, R.W.H Group. All rights reserved.',
      instagramPending: 'Instagram — coming soon',
      fastScroll: 'Drag to explore the page or reach the footer', skipFooter: 'Go to footer', footerPosition: 'END', scrollProject: '{number} of {total}: {name}', scrollFooter: 'Footer',
      footerServices: 'Planning · Architecture · Interiors · Landscape', footerNavigation: 'R.W.H Group links', socialNavigation: 'Social media and phone', phone: 'Phone', socialPending: 'Social media links will be added.'
    },
    vi: {
      pageTitle: 'R.W.H Group | Kiến trúc', pageDescription: 'Khám phá R.W.H Group: chuyên môn Nhật–Việt trong quy hoạch, kiến trúc, nội thất và cảnh quan.',
      language: 'Ngôn ngữ', home: 'Trang chủ R.W.H Group', quickNavigation: 'Điều hướng nhanh', navigation: 'Điều hướng chính', projectsLabel: 'Giới thiệu, thế mạnh và dự án R.W.H Group',
      brandSection: 'Giới thiệu R.W.H Group', strengthsSection: 'Thế mạnh chăm sóc sức khỏe của R.W.H Group',
      brandEyebrow: 'VỀ CHÚNG TÔI', brandHeadline: 'Kiến trúc hài hòa với thiên nhiên.',
      brandDescription: 'Kết nối chuyên môn Nhật Bản và sự am hiểu Việt Nam, R.W.H Group mang đến giải pháp quy hoạch, kiến trúc, nội thất và cảnh quan. Chúng tôi đặt sự đơn giản, hiệu quả và mối quan hệ giữa con người với thiên nhiên ở trung tâm mỗi thiết kế.',
      brandPhoto: 'Không gian Neo Garden Onsen, Bắc Giang', brandPhotoCaption: 'Bắc Giang · 2023', exploreStrengths: 'Khám phá thế mạnh', exploreProjects: 'Khám phá dự án',
      strengthsEyebrow: 'NĂNG LỰC CỦA CHÚNG TÔI', strengthsHeadline: 'Chuyên sâu về chăm sóc sức khỏe.', strengthsDescription: 'Tiên phong tại Việt Nam về các dự án Onsen & Spa, Wellness Resort, viện dưỡng lão và bệnh viện quốc tế, kết hợp công nghệ hiện đại của Nhật Bản.',
      strength1Title: 'Kiến trúc chăm sóc sức khỏe', strength1Description: 'Thiết kế các dự án chăm sóc sức khỏe, kết hợp quy hoạch, kiến trúc, nội thất và cảnh quan để phục vụ nhu cầu sử dụng và vận hành.',
      strength2Title: 'Onsen & Spa', strength2Description: 'Tiên phong tại Việt Nam trong thiết kế Onsen và Spa, kết hợp tinh thần tắm khoáng Nhật Bản với không gian thư giãn.',
      strength3Title: 'Wellness Resort', strength3Description: 'Thiết kế khu nghỉ dưỡng chăm sóc sức khỏe, kết nối lưu trú, thư giãn và trải nghiệm wellness trong một tổng thể hài hòa.',
      strength4Title: 'Viện dưỡng lão', strength4Description: 'Phát triển không gian chăm sóc người cao tuổi, chú trọng sự an toàn, thuận tiện và chất lượng sống hằng ngày.',
      strength5Title: 'Bệnh viện quốc tế', strength5Description: 'Thiết kế bệnh viện quốc tế, chú trọng tổ chức không gian, nhu cầu chăm sóc và hiệu quả vận hành.',
      strength6Title: 'Công nghệ Nhật Bản', strength6Description: 'Cung cấp và tích hợp công nghệ hiện đại của Nhật Bản nhằm tối ưu trải nghiệm chăm sóc sức khỏe và vận hành công trình.',
      openMenu: 'Mở menu', closeMenu: 'Đóng menu', contact: 'Liên hệ', profile: 'Hồ sơ năng lực', designOrder: 'Yêu cầu thiết kế',
      contactTitle: 'LIÊN HỆ', profileTitle: 'HỒ SƠ', closeContact: 'Đóng form liên hệ', closeProfile: 'Đóng hồ sơ năng lực',
      name: 'Họ và tên', email: 'Email', questions: 'Câu hỏi', sendMessage: 'Gửi liên hệ',
      contactReady: 'Để lại câu hỏi, R.W.H Group sẽ liên hệ với bạn.', sendingMessage: 'Đang gửi…',
      contactSent: 'Cảm ơn bạn! Yêu cầu đã được gửi tới R.W.H Group.',
      contactError: 'Chưa gửi được yêu cầu. Nội dung vẫn được giữ lại, bạn vui lòng thử lại.',
      contactInvalid: 'Bạn vui lòng kiểm tra họ tên, email và câu hỏi.',
      contactRateLimited: 'Bạn vui lòng đợi vài phút trước khi gửi lại.',
      contactUnavailable: 'Chức năng gửi liên hệ đang được thiết lập. Bạn vui lòng quay lại sau.',
      contactLocal: 'Bạn vui lòng mở website đã xuất bản để gửi liên hệ.',
      profileDescription: 'Đội ngũ kiến trúc sư Nhật Bản và Việt Nam cung cấp dịch vụ quy hoạch, kiến trúc, nội thất và cảnh quan. Triết lý thiết kế hướng đến sự đơn giản, hiệu quả và hài hòa với thiên nhiên.',
      profileCover: 'Bìa Hồ sơ năng lực R.W.H Group 2025', profileFile: 'Hồ sơ năng lực 2025 · VN / EN · 135 trang · 10,4 MB', viewProfile: 'Xem hồ sơ', downloadPdf: 'Tải PDF',
      location: 'ĐỊA ĐIỂM', completion: 'HOÀN THÀNH', area: 'DIỆN TÍCH SÀN', structure: 'KẾT CẤU',
      projectYear: 'NĂM DỰ ÁN', siteArea: 'DIỆN TÍCH KHU ĐẤT', client: 'KHÁCH HÀNG', imageSource: 'Nguồn ảnh: {name}',
      projectFilm: 'Video dự án', projectFilmTitle: 'VIDEO DỰ ÁN', openFilm: 'MỞ VIDEO', watchFilm: 'XEM VIDEO', projectSource: 'NGUỒN DỰ ÁN',
      detail: 'CHI TIẾT', close: 'ĐÓNG', viewDetails: 'Xem chi tiết {name}', openDetails: 'Mở chi tiết {name}', closeDetails: 'Đóng chi tiết dự án',
      playFilm: 'Phát video dự án {name}', filmPreview: 'Ảnh xem trước video {name}', filmTitle: '{name} — video dự án', architecturePhoto: '{name} — ảnh dự án', photography: 'Ảnh: {name}', filmCredit: 'Video: {name}',
      profileFooter: 'HỒ SƠ NĂNG LỰC', designOrderTitle: 'YÊU CẦU THIẾT KẾ', copyright: 'Bản quyền © 2026, R.W.H Group. Bảo lưu mọi quyền.',
      instagramPending: 'Instagram — chờ cập nhật',
      fastScroll: 'Kéo để khám phá trang hoặc đến cuối trang', skipFooter: 'Đến cuối trang', footerPosition: 'CUỐI', scrollProject: '{number} trên {total}: {name}', scrollFooter: 'Cuối trang',
      footerServices: 'Quy hoạch · Kiến trúc · Nội thất · Cảnh quan', footerNavigation: 'Liên kết R.W.H Group', socialNavigation: 'Mạng xã hội và điện thoại', phone: 'Điện thoại', socialPending: 'Liên kết mạng xã hội sẽ được bổ sung.'
    }
  };
  let language = 'vi';
  try {
    const saved = localStorage.getItem('rwh-language');
    if (Object.hasOwn(messages, saved)) language = saved;
  } catch { /* Language switching also works when browser storage is unavailable. */ }

  function t(key, values = {}) {
    return (messages[language][key] ?? messages.en[key] ?? key).replace(/\{(\w+)\}/g, (match, name) => values[name] ?? match);
  }

  function apply() {
    document.documentElement.lang = language;
    document.title = t('pageTitle');
    document.querySelector('meta[name="description"]').content = t('pageDescription');
    for (const element of document.querySelectorAll('[data-i18n]')) element.textContent = t(element.dataset.i18n);
    for (const attribute of ['aria-label', 'alt']) {
      for (const element of document.querySelectorAll(`[data-i18n-${attribute}]`)) element.setAttribute(attribute, t(element.getAttribute(`data-i18n-${attribute}`)));
    }
    for (const button of document.querySelectorAll('[data-language]')) button.setAttribute('aria-pressed', String(button.dataset.language === language));
  }

  function setLanguage(next) {
    if (!Object.hasOwn(messages, next) || next === language) return;
    language = next;
    try { localStorage.setItem('rwh-language', language); } catch { /* Session-only fallback. */ }
    apply();
    document.dispatchEvent(new CustomEvent('rwh:languagechange', { detail: { language } }));
  }

  window.RWHI18n = {
    t, setLanguage, get language() { return language; },
    project: project => ({ ...project, ...project.translations?.[language] }),
    message(element, key) { element.dataset.i18n = key; element.textContent = t(key); }
  };
  for (const button of document.querySelectorAll('[data-language]')) button.addEventListener('click', () => setLanguage(button.dataset.language));
  apply();
})();
