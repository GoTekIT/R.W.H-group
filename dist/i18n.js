(() => {
  'use strict';
  const messages = {
    en: {
      pageTitle: 'R.W.H Group | Shaping the Future of Healthcare', pageDescription: 'Japanese expertise for healthcare and hospitality projects in Vietnam: Wellness Resort, Onsen Luxury Villa, Onsen & Spa, premium senior care and international hospitals.',
      language: 'Language', home: 'R.W.H Group home', quickNavigation: 'Quick navigation', navigation: 'Main navigation', projectsLabel: 'R.W.H Group introduction, strengths and projects',
      brandSection: 'About R.W.H Group', strengthsSection: 'R.W.H Group healthcare expertise',
      brandEyebrow: 'ABOUT US', brandHeadline: 'Shaping the future of healthcare.',
      brandLead: 'Connecting Japanese excellence with healthcare developments of international standing.',
      brandDescription: 'With a foundation in Japanese architecture and an experienced network spanning design, operational consulting and medicine, R.W.H Group partners with pioneering investors in healthcare and hospitality in Vietnam.',
      brandPhoto: 'Neo Garden Onsen, Bac Giang', brandPhotoCaption: 'Bac Giang · 2023', exploreStrengths: 'Explore our strengths', exploreProjects: 'Explore projects',
      strengthsEyebrow: 'OUR EXPERTISE', strengthsHeadline: 'Our core consulting areas.', strengthsDescription: 'We connect architects, operations consultants and doctors from Japan to bring together design thinking, practical operating experience and medical expertise in comprehensive solutions.',
      strength1Title: 'Wellness Resort', strength1Description: 'Holistic wellness resorts that restore energy and enhance quality of life.',
      strength2Title: 'Onsen Luxury Villa', strength2Description: 'Distinctive luxury retreats, designed for an exclusive lifestyle.',
      strength3Title: 'Onsen & Spa', strength3Description: 'Hot spring, therapy and relaxation complexes inspired by Japanese traditions.',
      strength4Title: 'Premium senior care', strength4Description: 'Professional, compassionate and sustainable models of care for older adults.',
      strength5Title: 'International hospitals', strength5Description: 'Architectural solutions and specialist consulting oriented towards international quality standards.',
      strength6Title: 'Japanese expertise & technology', strength6Description: 'Connecting Japanese experts and advanced technology to integrate architecture, healthcare and operations around health and quality of life.',
      openMenu: 'Open menu', closeMenu: 'Close menu', contact: 'Contact', profile: 'Company profile', designOrder: 'Design Order',
      contactTitle: 'CONTACT', profileTitle: 'PROFILE', closeContact: 'Close contact form', closeProfile: 'Close company profile',
      name: 'Name', email: 'Email', questions: 'Questions', sendMessage: 'Send message',
      contactReady: 'Contact R.W.H Group for advice and connections with our Japanese experts.', sendingMessage: 'Sending…',
      contactSent: 'Thank you! Your enquiry has been sent to R.W.H Group.',
      contactError: 'Your enquiry could not be sent. Your details are still here; please try again.',
      contactInvalid: 'Please check your name, email and questions.',
      contactRateLimited: 'Please wait a few minutes before trying again.',
      contactUnavailable: 'The contact form is being set up. Please try again later.',
      contactLocal: 'Please open the published website to send an enquiry.',
      profileDescription: 'With a foundation in Japanese architectural expertise and an experienced network in design, operational consulting and medicine, R.W.H Group is pleased to partner with pioneering healthcare and hospitality investors in Vietnam. We connect architects, operations consultants and doctors from Japan, combining design thinking, practical operating experience and medical expertise.',
      profileApproach: 'Beyond architectural design, we develop models with practical value, where space, technology, medicine and operations come together to support human health and quality of life.',
      profileCover: 'R.W.H Group company profile 2025 cover', profileFile: 'Company Profile 2025 · VN / EN · 135 pages · 10.4 MB', viewProfile: 'View profile', downloadPdf: 'Download PDF',
      location: 'LOCATION', completion: 'COMPLETION', area: 'FLOOR AREA', structure: 'STRUCTURE',
      projectYear: 'PROJECT YEAR', siteArea: 'SITE AREA', client: 'CLIENT', imageSource: 'Image source: {name}',
      projectFilm: 'Project film', projectFilmTitle: 'PROJECT FILM', openFilm: 'OPEN FILM', watchFilm: 'WATCH FILM', projectSource: 'PROJECT SOURCE',
      detail: 'DETAIL', close: 'CLOSE', viewDetails: 'View {name} details', openDetails: 'Open details for {name}', closeDetails: 'Close project details',
      playFilm: 'Play {name} project film', filmPreview: '{name} film preview', filmTitle: '{name} — project film', architecturePhoto: '{name} — project image', photography: 'Photography: {name}', filmCredit: 'Film: {name}',
      profileFooter: 'COMPANY PROFILE', designOrderTitle: 'DESIGN ORDER', copyright: 'Copyright © 2026, R.W.H Group. All rights reserved.',
      instagramPending: 'Instagram (coming soon)',
      fastScroll: 'Drag to explore the page or reach the footer', skipFooter: 'Go to footer', footerPosition: 'END', scrollProject: '{number} of {total}: {name}', scrollFooter: 'Footer',
      footerInvitationTitle: 'Build pioneering projects together.', footerInvitation: 'R.W.H Group invites investors to connect with our team of Japanese experts to discuss, research and develop pioneering projects in Vietnam.', expertContact: 'Connect with our Japanese experts',
      footerTagline: 'Japanese Expertise, Better Living.', footerServices: 'Design & Build', footerNavigation: 'R.W.H Group links', socialNavigation: 'Social media and phone', phone: 'Phone', socialPending: 'Social media links will be added.'
    },
    vi: {
      pageTitle: 'R.W.H Group | Kiến tạo tương lai chăm sóc sức khỏe', pageDescription: 'Kết nối tinh hoa Nhật Bản cho dự án chăm sóc sức khỏe và nghỉ dưỡng tại Việt Nam: Wellness Resort, Onsen Luxury Villa, Onsen & Spa, viện dưỡng lão cao cấp và bệnh viện quốc tế.',
      language: 'Ngôn ngữ', home: 'Trang chủ R.W.H Group', quickNavigation: 'Điều hướng nhanh', navigation: 'Điều hướng chính', projectsLabel: 'Giới thiệu, thế mạnh và dự án R.W.H Group',
      brandSection: 'Giới thiệu R.W.H Group', strengthsSection: 'Thế mạnh chăm sóc sức khỏe của R.W.H Group',
      brandEyebrow: 'VỀ CHÚNG TÔI', brandHeadline: 'Kiến tạo tương lai chăm sóc sức khỏe.',
      brandLead: 'Kết nối tinh hoa Nhật Bản – Kiến tạo những công trình chăm sóc sức khỏe đẳng cấp quốc tế.',
      brandDescription: 'Với nền tảng chuyên môn kiến trúc Nhật Bản cùng mạng lưới chuyên gia giàu kinh nghiệm trong lĩnh vực thiết kế, tư vấn vận hành và y tế, R.W.H Group hân hạnh đồng hành cùng các chủ đầu tư tiên phong trong lĩnh vực chăm sóc sức khỏe và nghỉ dưỡng tại Việt Nam.',
      brandPhoto: 'Không gian Neo Garden Onsen, Bắc Giang', brandPhotoCaption: 'Bắc Giang · 2023', exploreStrengths: 'Khám phá thế mạnh', exploreProjects: 'Khám phá dự án',
      strengthsEyebrow: 'NĂNG LỰC CỦA CHÚNG TÔI', strengthsHeadline: 'Các lĩnh vực tư vấn trọng tâm.', strengthsDescription: 'Chúng tôi kết nối các chuyên gia kiến trúc sư, tư vấn vận hành và bác sĩ đến từ Nhật Bản, mang đến những giải pháp toàn diện, kết hợp giữa tư duy thiết kế, kinh nghiệm vận hành thực tiễn và kiến thức chuyên môn y tế.',
      strength1Title: 'Wellness Resort', strength1Description: 'Khu nghỉ dưỡng chăm sóc sức khỏe toàn diện, tái tạo năng lượng và nâng cao chất lượng sống.',
      strength2Title: 'Onsen Luxury Villa', strength2Description: 'Dinh thự nghỉ dưỡng độc bản, đẳng cấp thượng lưu.',
      strength3Title: 'Onsen & Spa', strength3Description: 'Tổ hợp suối khoáng nóng, trị liệu và thư giãn theo tinh thần Nhật Bản.',
      strength4Title: 'Viện dưỡng lão cao cấp', strength4Description: 'Mô hình chăm sóc người cao tuổi chuyên nghiệp, nhân văn và bền vững.',
      strength5Title: 'Bệnh viện quốc tế', strength5Description: 'Giải pháp kiến trúc và tư vấn chuyên môn hướng đến tiêu chuẩn chất lượng quốc tế.',
      strength6Title: 'Chuyên gia & công nghệ Nhật Bản', strength6Description: 'Kết nối chuyên gia Nhật Bản và công nghệ hiện đại, kết hợp kiến trúc, y tế và vận hành vì sức khỏe và chất lượng sống của con người.',
      openMenu: 'Mở menu', closeMenu: 'Đóng menu', contact: 'Liên hệ', profile: 'Hồ sơ năng lực', designOrder: 'Yêu cầu thiết kế',
      contactTitle: 'LIÊN HỆ', profileTitle: 'HỒ SƠ', closeContact: 'Đóng form liên hệ', closeProfile: 'Đóng hồ sơ năng lực',
      name: 'Họ và tên', email: 'Email', questions: 'Câu hỏi', sendMessage: 'Gửi liên hệ',
      contactReady: 'Liên hệ R.W.H Group để được tư vấn và kết nối với các chuyên gia Nhật Bản.', sendingMessage: 'Đang gửi…',
      contactSent: 'Cảm ơn bạn! Yêu cầu đã được gửi tới R.W.H Group.',
      contactError: 'Chưa gửi được yêu cầu. Nội dung vẫn được giữ lại, bạn vui lòng thử lại.',
      contactInvalid: 'Bạn vui lòng kiểm tra họ tên, email và câu hỏi.',
      contactRateLimited: 'Bạn vui lòng đợi vài phút trước khi gửi lại.',
      contactUnavailable: 'Chức năng gửi liên hệ đang được thiết lập. Bạn vui lòng quay lại sau.',
      contactLocal: 'Bạn vui lòng mở website đã xuất bản để gửi liên hệ.',
      profileDescription: 'Với nền tảng chuyên môn kiến trúc Nhật Bản cùng mạng lưới chuyên gia giàu kinh nghiệm trong lĩnh vực thiết kế, tư vấn vận hành và y tế, R.W.H Group hân hạnh đồng hành cùng các chủ đầu tư tiên phong trong lĩnh vực chăm sóc sức khỏe và nghỉ dưỡng tại Việt Nam. Chúng tôi kết nối các chuyên gia kiến trúc sư, tư vấn vận hành và bác sĩ đến từ Nhật Bản, kết hợp tư duy thiết kế, kinh nghiệm vận hành thực tiễn và kiến thức chuyên môn y tế.',
      profileApproach: 'Không chỉ dừng lại ở thiết kế kiến trúc, chúng tôi hướng đến việc xây dựng những mô hình có giá trị thực tiễn, nơi không gian, công nghệ, y tế và vận hành cùng hội tụ vì sức khỏe và chất lượng sống của con người.',
      profileCover: 'Bìa Hồ sơ năng lực R.W.H Group 2025', profileFile: 'Hồ sơ năng lực 2025 · VN / EN · 135 trang · 10,4 MB', viewProfile: 'Xem hồ sơ', downloadPdf: 'Tải PDF',
      location: 'ĐỊA ĐIỂM', completion: 'HOÀN THÀNH', area: 'DIỆN TÍCH SÀN', structure: 'KẾT CẤU',
      projectYear: 'NĂM DỰ ÁN', siteArea: 'DIỆN TÍCH KHU ĐẤT', client: 'KHÁCH HÀNG', imageSource: 'Nguồn ảnh: {name}',
      projectFilm: 'Video dự án', projectFilmTitle: 'VIDEO DỰ ÁN', openFilm: 'MỞ VIDEO', watchFilm: 'XEM VIDEO', projectSource: 'NGUỒN DỰ ÁN',
      detail: 'CHI TIẾT', close: 'ĐÓNG', viewDetails: 'Xem chi tiết {name}', openDetails: 'Mở chi tiết {name}', closeDetails: 'Đóng chi tiết dự án',
      playFilm: 'Phát video dự án {name}', filmPreview: 'Ảnh xem trước video {name}', filmTitle: '{name} — video dự án', architecturePhoto: '{name} — ảnh dự án', photography: 'Ảnh: {name}', filmCredit: 'Video: {name}',
      profileFooter: 'HỒ SƠ NĂNG LỰC', designOrderTitle: 'YÊU CẦU THIẾT KẾ', copyright: 'Bản quyền © 2026, R.W.H Group. Bảo lưu mọi quyền.',
      instagramPending: 'Instagram (chờ cập nhật)',
      fastScroll: 'Kéo để khám phá trang hoặc đến cuối trang', skipFooter: 'Đến cuối trang', footerPosition: 'CUỐI', scrollProject: '{number} trên {total}: {name}', scrollFooter: 'Cuối trang',
      footerInvitationTitle: 'Cùng kiến tạo những dự án tiên phong.', footerInvitation: 'R.W.H Group trân trọng mời Quý Chủ đầu tư kết nối với đội ngũ chuyên gia Nhật Bản của chúng tôi để cùng trao đổi, nghiên cứu và phát triển những dự án tiên phong tại Việt Nam.', expertContact: 'Kết nối chuyên gia Nhật Bản',
      footerTagline: 'Japanese Expertise, Better Living.', footerServices: 'Design & Build', footerNavigation: 'Liên kết R.W.H Group', socialNavigation: 'Mạng xã hội và điện thoại', phone: 'Điện thoại', socialPending: 'Liên kết mạng xã hội sẽ được bổ sung.'
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
